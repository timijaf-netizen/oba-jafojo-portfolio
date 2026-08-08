"use client";

import SectionHeading from "./SectionHeading";
import { parseVideoUrl } from "@/lib/video";

export default function Reel({ reel }) {
  const video = parseVideoUrl(reel?.videoUrl);

  return (
    <section id="reel" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading eyebrow="On Screen" title={reel?.heading || "Demo Reel"} />

      <div className="mx-auto max-w-4xl">
        <div className="relative aspect-video overflow-hidden rounded-md bg-black shadow-lg">
          {video.kind === "embed" && (
            <iframe
              src={video.src}
              title="Demo reel"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {video.kind === "file" && (
            <video
              className="absolute inset-0 h-full w-full"
              controls
              preload="metadata"
              poster={reel?.poster || undefined}
              playsInline
            >
              <source src={video.src} />
              Your browser does not support the video tag.
            </video>
          )}

          {video.kind === "none" && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
              Reel coming soon.
            </div>
          )}
        </div>

        {reel?.caption && (
          <p className="mt-4 text-center text-xs uppercase tracking-widest2 text-ink/40">
            {reel.caption}
          </p>
        )}
      </div>
    </section>
  );
}
