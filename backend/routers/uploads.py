import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from helper import require_admin

UPLOAD_ROOT = Path(__file__).resolve().parent.parent / "uploads"
PRODUCT_DIR = UPLOAD_ROOT / "products"
PRODUCT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_BYTES = 5 * 1024 * 1024
CHUNK = 1024 * 1024


router = APIRouter(
    prefix="/api/v1",
    tags=["uploads"],
    dependencies=[Depends(require_admin)],
)


@router.post("/upload/product-image", status_code=status.HTTP_201_CREATED)
async def upload_product_image(file: UploadFile = File(...)):
    extension = ALLOWED_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(
            status_code=415,
            detail="Only JPEG, PNG and WebP  images are allowed.",
        )

    filename = f"{uuid.uuid4().hex}{extension}"
    destination = PRODUCT_DIR / filename

    written = 0
    try:
        with destination.open("wb") as target:
            while chunk := await file.read(CHUNK):
                written += len(chunk)
                if written > MAX_BYTES:
                    raise HTTPException(
                        status_code=413,
                        detail="The image must be 5 MB or smaller.",
                    )
                target.write(chunk)
    except HTTPException:
        destination.unlink(missing_ok=True)
        raise
    except Exception:
        destination.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="Failed to save the image.")
    finally:
        await file.close()

    return {"image_path": f"/uploads/products/{filename}"}