"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { Button, IconTrash, IconUp, IconDown, moveItem } from "./fields";

export default function PhotoManager({ photos = [], onChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState([]); // {name, pct, error}
  const inputRef = useRef(null);
  const cloudReady = isCloudinaryConfigured();

  const addPhoto = (photo) => onChange([...(photos || []), photo]);
  const removeAt = (i) => onChange(photos.filter((_, idx) => idx !== i));
  const move = (i, dir) => onChange(moveItem(photos, i, dir));
  const setAlt = (i, alt) =>
    onChange(photos.map((p, idx) => (idx === i ? { ...p, alt } : p)));

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    if (!cloudReady) {
      setUploads((u) => [
        ...u,
        { name: files[0].name, pct: 0, error: "Cloudinary not configured yet." },
      ]);
      return;
    }

    for (const file of files) {
      const entry = { name: file.name, pct: 0, error: null };
      setUploads((u) => [...u, entry]);
      try {
        const res = await uploadToCloudinary(file, "image", (pct) => {
          setUploads((u) =>
            u.map((x) => (x === entry ? { ...x, pct } : x))
          );
        });
        addPhoto({
          id: res.publicId || `p_${Date.now()}`,
          url: res.url,
          alt: file.name.replace(/\.[^.]+$/, ""),
        });
        setUploads((u) => u.filter((x) => x !== entry));
      } catch (err) {
        setUploads((u) =>
          u.map((x) => (x === entry ? { ...x, error: err.message } : x))
        );
      }
    }
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-neutral-400">
          <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm text-neutral-600">
          Drag &amp; drop headshots here, or click to choose files
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          JPG or PNG · uploads straight to Cloudinary
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {!cloudReady && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Cloudinary isn&apos;t connected yet, so new uploads won&apos;t work. You can still
          reorder, remove, or edit the placeholder photos below. Add
          NEXT_PUBLIC_CLOUDINARY_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable uploads.
        </p>
      )}

      {/* In-flight uploads */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploads.map((u, i) => (
            <div key={i} className="text-xs">
              <div className="flex justify-between text-neutral-500">
                <span className="truncate">{u.name}</span>
                <span>{u.error ? "Failed" : `${u.pct}%`}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded bg-neutral-200">
                <div
                  className={`h-full ${u.error ? "bg-red-400" : "bg-neutral-900"}`}
                  style={{ width: `${u.error ? 100 : u.pct}%` }}
                />
              </div>
              {u.error && <p className="mt-1 text-red-600">{u.error}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Existing photos */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(photos || []).map((p, i) => (
          <div key={p.id || p.url || i} className="rounded-lg border border-neutral-200 p-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.alt || ""} className="h-full w-full object-cover" />
            </div>
            <input
              value={p.alt || ""}
              onChange={(e) => setAlt(i, e.target.value)}
              placeholder="Caption / alt text"
              className="mt-2 w-full rounded border border-neutral-200 px-2 py-1 text-xs outline-none focus:border-neutral-900"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
                <Button variant="ghost" onClick={() => move(i, -1)} disabled={i === 0} className="!px-2 !py-1">
                  <IconUp />
                </Button>
                <Button variant="ghost" onClick={() => move(i, 1)} disabled={i === photos.length - 1} className="!px-2 !py-1">
                  <IconDown />
                </Button>
              </div>
              <Button variant="danger" onClick={() => removeAt(i)} className="!px-2 !py-1">
                <IconTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
