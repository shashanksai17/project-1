"""Load the three trained classifiers and run their soft-voting ensemble."""
from contextlib import nullcontext
import hashlib
import json
import os
from pathlib import Path
from threading import Lock

import torch
from huggingface_hub import hf_hub_download
from PIL import Image, ImageOps
from torch import nn
from torchvision import models, transforms


ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
MODEL_REPOSITORY = "shanthan5589/pneumoscan-ai"
SIZES = {"densenet121": 224, "efficientnet_b3": 300, "swin_tiny": 224}
DISPLAY_LABELS = {
    "Normal": "Normal",
    "Bacterial": "Bacterial Pneumonia",
    "Viral": "Viral Pneumonia",
}


def ensure_checkpoints() -> None:
    """Download the public trained checkpoints once and verify their checksums."""
    checksums = json.loads(
        (MODELS_DIR / "weights_checksums.json").read_text(encoding="utf-8")
    )
    for relative_path, expected_digest in checksums.items():
        checkpoint = MODELS_DIR / relative_path
        if not checkpoint.exists():
            checkpoint.parent.mkdir(parents=True, exist_ok=True)
            hf_hub_download(
                repo_id=MODEL_REPOSITORY,
                repo_type="space",
                filename=f"models/{relative_path}",
                local_dir=ROOT,
            )

        hasher = hashlib.sha256()
        with checkpoint.open("rb") as checkpoint_file:
            for chunk in iter(lambda: checkpoint_file.read(1024 * 1024), b""):
                hasher.update(chunk)
        digest = hasher.hexdigest()
        if digest != expected_digest:
            raise RuntimeError(f"Checksum verification failed for {relative_path}")


def build_model(name: str) -> nn.Module:
    if name == "densenet121":
        import torchxrayvision as xrv

        model = xrv.models.DenseNet(weights=None)
        model.classifier = nn.Linear(model.classifier.in_features, 3)
        model.op_threshs = None
        model.apply_sigmoid = False
        return model

    if name == "efficientnet_b3":
        model = models.efficientnet_b3(weights=None)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, 3)
        return model

    if name == "swin_tiny":
        import timm

        return timm.create_model(
            "swin_tiny_patch4_window7_224.ms_in22k_ft_in1k",
            pretrained=False,
            num_classes=3,
        )

    raise ValueError(f"Unknown model: {name}")


def prepare_image(image: Image.Image, model_name: str) -> torch.Tensor:
    image = ImageOps.exif_transpose(image).convert("L")
    image = ImageOps.pad(
        image,
        (SIZES[model_name], SIZES[model_name]),
        method=Image.Resampling.BILINEAR,
        color=0,
    )
    tensor = transforms.functional.to_tensor(image)
    if model_name == "densenet121":
        return tensor * 2048 - 1024
    return transforms.functional.normalize(
        tensor.repeat(3, 1, 1),
        (0.485, 0.456, 0.406),
        (0.229, 0.224, 0.225),
    )


def temperature_scale(probabilities: torch.Tensor, temperature: float) -> torch.Tensor:
    if temperature == 1.0:
        return probabilities
    return torch.softmax(torch.log(probabilities.clamp_min(1e-12)) / temperature, dim=0)


class EnsemblePredictor:
    """Keep checkpoints in RAM and serialize inference for predictable memory use."""

    def __init__(self) -> None:
        ensure_checkpoints()
        self.config = json.loads((MODELS_DIR / "ensemble.json").read_text(encoding="utf-8"))
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        torch.set_num_threads(min(4, os.cpu_count() or 1))
        self.lock = Lock()
        self.models: dict[str, nn.Module] = {}

        for name in self.config["models"]:
            model = build_model(name)
            checkpoint = torch.load(
                MODELS_DIR / name / "best.pt",
                map_location="cpu",
                weights_only=True,
            )
            model.load_state_dict(checkpoint["state_dict"])
            model.eval()
            self.models[name] = model

    def predict(self, image: Image.Image) -> dict:
        with self.lock, torch.inference_mode():
            combined = torch.zeros(len(self.config["classes"]), dtype=torch.float32)
            model_probabilities = {}

            for name, weight, temperature in zip(
                self.config["models"],
                self.config["weights"],
                self.config["temperatures"],
            ):
                model = self.models[name]
                tensor = prepare_image(image, name).unsqueeze(0)
                if self.device.type == "cuda":
                    model.to(self.device)
                    tensor = tensor.to(self.device)
                    autocast = torch.autocast("cuda", dtype=torch.float16)
                else:
                    autocast = nullcontext()

                try:
                    with autocast:
                        probabilities = model(tensor).float().softmax(dim=1)[0].cpu()
                finally:
                    if self.device.type == "cuda":
                        model.to("cpu")
                        torch.cuda.empty_cache()

                probabilities = temperature_scale(probabilities, float(temperature))
                combined += float(weight) * probabilities
                model_probabilities[name] = self._display_probabilities(probabilities)

            predicted_index = int(combined.argmax())
            predicted_label = DISPLAY_LABELS[self.config["classes"][predicted_index]]
            displayed = self._display_probabilities(combined)
            return {
                "prediction": predicted_label,
                "confidence": displayed[predicted_label],
                "probabilities": displayed,
                "modelProbabilities": model_probabilities,
                "ensembleWeights": dict(zip(self.config["models"], self.config["weights"])),
                "device": self.device.type,
            }

    def _display_probabilities(self, probabilities: torch.Tensor) -> dict[str, float]:
        return {
            DISPLAY_LABELS[label]: round(float(probability) * 100, 2)
            for label, probability in zip(self.config["classes"], probabilities)
        }
