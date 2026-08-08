/**
 * Turn a pasted video URL into something playable.
 * Supports YouTube and Vimeo (returns an embed URL) and treats everything
 * else (e.g. a Cloudinary .mp4) as a direct file for the native <video> tag.
 */
export function parseVideoUrl(url) {
  if (!url) return { kind: "none" };

  const yt =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) {
    return { kind: "embed", src: `https://www.youtube.com/embed/${yt[1]}` };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  return { kind: "file", src: url };
}
