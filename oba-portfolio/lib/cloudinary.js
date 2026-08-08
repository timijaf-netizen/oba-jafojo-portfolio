/**
 * Direct, unsigned browser uploads to Cloudinary.
 * No server round-trip and no secret key in the browser — it uses a public
 * "unsigned upload preset" you create once in the Cloudinary dashboard.
 */

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
}

/**
 * Upload a File to Cloudinary.
 * @param {File} file
 * @param {"image"|"video"} resourceType
 * @param {(pct:number)=>void} [onProgress] 0-100
 * @returns {Promise<{url:string, publicId:string, width:number, height:number}>}
 */
export function uploadToCloudinary(file, resourceType = "image", onProgress) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloud || !preset) {
    return Promise.reject(
      new Error(
        "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      )
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            url: res.secure_url,
            publicId: res.public_id,
            width: res.width,
            height: res.height,
          });
        } catch (err) {
          reject(new Error("Could not parse Cloudinary response."));
        }
      } else {
        let msg = `Upload failed (${xhr.status}).`;
        try {
          const res = JSON.parse(xhr.responseText);
          if (res?.error?.message) msg = res.error.message;
        } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(form);
  });
}
