const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESSION_BELOW_BYTES = 500_000;

/** Downscales large photos client-side before upload so a multi-MB camera photo doesn't take forever to send. */
async function prepareForUpload(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  if (file.size < SKIP_COMPRESSION_BELOW_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, JPEG_QUALITY));
    return blob ?? file;
  } catch {
    return file;
  }
}

interface UploadImageOptions {
  /** Firebase Auth ID token — required for member-only folders (e.g. "members"), omitted for admin folders which rely on the admin session cookie instead. */
  idToken?: string;
  /** Called with 0-100 as the upload progresses. */
  onProgress?: (percent: number) => void;
}

/** Uploads a file to Firebase Storage under `folder/` (via /api/upload, using the Admin SDK server-side) and returns its public download URL. */
export async function uploadImage(file: File, folder: string, options?: UploadImageOptions): Promise<string> {
  const blob = await prepareForUpload(file);

  const formData = new FormData();
  formData.set("file", blob, file.name);
  formData.set("folder", folder);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.timeout = 30_000;
    if (options?.idToken) xhr.setRequestHeader("Authorization", `Bearer ${options.idToken}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) options?.onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve((JSON.parse(xhr.responseText) as { url: string }).url);
        } catch {
          reject(new Error("Invalid upload response."));
        }
      } else {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Check your connection and try again."));
    xhr.send(formData);
  });
}
