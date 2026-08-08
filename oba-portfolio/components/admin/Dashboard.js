"use client";

import { useState } from "react";
import { defaultContent } from "@/lib/defaultContent";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import PhotoManager from "./PhotoManager";
import {
  Field, Text, TextArea, Button, Card,
  IconTrash, IconUp, IconDown, moveItem,
} from "./fields";

const TABS = [
  { id: "general", label: "General" },
  { id: "about", label: "About" },
  { id: "photos", label: "Photos" },
  { id: "reel", label: "Reel" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export default function Dashboard({ supabase, user, initialContent, onSignOut }) {
  const [content, setContent] = useState(initialContent || defaultContent);
  const [tab, setTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // {type, msg}

  // ---- generic updaters -------------------------------------------------
  const setSection = (key, patch) =>
    setContent((c) => ({ ...c, [key]: { ...c[key], ...patch } }));
  const setList = (key, list) => setContent((c) => ({ ...c, [key]: list }));

  // ---- save -------------------------------------------------------------
  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });
      if (error) throw error;
      setStatus({ type: "ok", msg: "Saved. Your live site updates within ~30 seconds." });
    } catch (err) {
      setStatus({ type: "err", msg: err.message || "Could not save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-serif text-lg leading-none">Portfolio Admin</p>
            <p className="text-xs text-neutral-400">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden text-sm text-neutral-500 hover:text-neutral-900 sm:inline"
            >
              View site ↗
            </a>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button variant="outline" onClick={onSignOut}>Sign out</Button>
          </div>
        </div>

        {/* tabs */}
        <div className="mx-auto max-w-5xl overflow-x-auto px-4">
          <div className="flex gap-1 pb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                  tab === t.id
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {status && (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <div
            className={`rounded-md px-4 py-2 text-sm ${
              status.type === "ok"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {tab === "general" && <GeneralTab content={content} setSection={setSection} />}
        {tab === "about" && <AboutTab content={content} setSection={setSection} />}
        {tab === "photos" && (
          <Card title="Photo Gallery">
            <PhotoManager
              photos={content.photos}
              onChange={(list) => setList("photos", list)}
            />
          </Card>
        )}
        {tab === "reel" && <ReelTab content={content} setSection={setSection} />}
        {tab === "resume" && <ResumeTab content={content} setContent={setContent} />}
        {tab === "contact" && <ContactTab content={content} setSection={setSection} setContent={setContent} />}
      </div>

      {/* sticky save on mobile */}
      <div className="sticky bottom-0 z-20 border-t border-neutral-200 bg-white p-3 sm:hidden">
        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

function GeneralTab({ content, setSection }) {
  const h = content.hero || {};
  return (
    <Card title="Hero / Header">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <Text value={h.name} onChange={(v) => setSection("hero", { name: v })} />
        </Field>
        <Field label="Location">
          <Text value={h.location} onChange={(v) => setSection("hero", { location: v })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Tagline">
            <Text value={h.tagline} onChange={(v) => setSection("hero", { tagline: v })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Hero background image URL" hint="A wide, cinematic photo works best. Upload it in the Photos tab, then paste the Cloudinary URL here.">
            <Text value={h.backgroundImage} onChange={(v) => setSection("hero", { backgroundImage: v })} />
          </Field>
        </div>
      </div>
      {h.backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={h.backgroundImage} alt="" className="mt-4 h-40 w-full rounded-md object-cover" />
      )}
    </Card>
  );
}

function AboutTab({ content, setSection }) {
  const a = content.about || {};
  const specs = a.specs || [];
  const setSpecs = (list) => setSection("about", { specs: list });

  return (
    <>
      <Card title="About">
        <div className="space-y-5">
          <Field label="Section heading">
            <Text value={a.heading} onChange={(v) => setSection("about", { heading: v })} />
          </Field>
          <Field label="Bio" hint="Leave a blank line between paragraphs.">
            <TextArea rows={8} value={a.bio} onChange={(v) => setSection("about", { bio: v })} />
          </Field>
          <Field label="Headshot image URL" hint="Upload in Photos tab, then paste the URL here.">
            <Text value={a.headshot} onChange={(v) => setSection("about", { headshot: v })} />
          </Field>
        </div>
      </Card>

      <Card
        title="Stats / Specs"
        right={
          <Button variant="outline" onClick={() => setSpecs([...specs, { label: "", value: "" }])}>
            + Add
          </Button>
        }
      >
        <div className="space-y-3">
          {specs.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={s.label}
                placeholder="Label (e.g. Height)"
                onChange={(e) => setSpecs(specs.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                className="w-1/2 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <input
                value={s.value}
                placeholder="Value"
                onChange={(e) => setSpecs(specs.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))}
                className="w-1/2 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <Button variant="danger" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="!px-2 !py-2">
                <IconTrash />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function ReelTab({ content, setSection }) {
  const r = content.reel || {};
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState(null);
  const cloudReady = isCloudinaryConfigured();

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    if (!cloudReady) {
      setErr("Cloudinary not configured. Add the two NEXT_PUBLIC_CLOUDINARY_* env vars to upload video.");
      return;
    }
    setUploading(true);
    setPct(0);
    try {
      const res = await uploadToCloudinary(file, "video", setPct);
      setSection("reel", { videoUrl: res.url });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card title="Demo Reel">
      <div className="space-y-5">
        <Field label="Section heading">
          <Text value={r.heading} onChange={(v) => setSection("reel", { heading: v })} />
        </Field>

        <Field label="Video URL" hint="Paste a YouTube or Vimeo link, or a Cloudinary .mp4 URL. Or upload a file below.">
          <Text value={r.videoUrl} onChange={(v) => setSection("reel", { videoUrl: v })} />
        </Field>

        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
            <input type="file" accept="video/*" hidden onChange={onFile} />
            {uploading ? `Uploading… ${pct}%` : "Upload video file"}
          </label>
          {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
        </div>

        <Field label="Poster image URL" hint="Shown before the video plays (only used for uploaded/Cloudinary videos).">
          <Text value={r.poster} onChange={(v) => setSection("reel", { poster: v })} />
        </Field>
        <Field label="Caption">
          <Text value={r.caption} onChange={(v) => setSection("reel", { caption: v })} />
        </Field>
      </div>
    </Card>
  );
}

function ResumeTab({ content, setContent }) {
  const r = content.resume || {};
  const set = (patch) => setContent((c) => ({ ...c, resume: { ...c.resume, ...patch } }));

  const credits = r.credits || [];
  const training = r.training || [];
  const skills = r.skills || [];

  const newId = () => `x_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return (
    <>
      <Card title="Resume Header">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Section heading">
            <Text value={r.heading} onChange={(v) => set({ heading: v })} />
          </Field>
          <Field label="PDF resume URL (optional)" hint="A downloadable PDF link.">
            <Text value={r.resumeFileUrl} onChange={(v) => set({ resumeFileUrl: v })} />
          </Field>
        </div>
      </Card>

      <Card
        title="Credits"
        right={
          <Button
            variant="outline"
            onClick={() => set({ credits: [...credits, { id: newId(), category: "Film", title: "", role: "", company: "", year: "" }] })}
          >
            + Add credit
          </Button>
        }
      >
        <div className="space-y-4">
          {credits.map((c, i) => (
            <div key={c.id || i} className="rounded-md border border-neutral-200 p-3">
              <div className="grid gap-2 sm:grid-cols-5">
                <input value={c.category} placeholder="Category" onChange={(e) => set({ credits: credits.map((x, idx) => idx === i ? { ...x, category: e.target.value } : x) })} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
                <input value={c.title} placeholder="Title" onChange={(e) => set({ credits: credits.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) })} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900 sm:col-span-2" />
                <input value={c.role} placeholder="Role" onChange={(e) => set({ credits: credits.map((x, idx) => idx === i ? { ...x, role: e.target.value } : x) })} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
                <input value={c.year} placeholder="Year" onChange={(e) => set({ credits: credits.map((x, idx) => idx === i ? { ...x, year: e.target.value } : x) })} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input value={c.company} placeholder="Company / production" onChange={(e) => set({ credits: credits.map((x, idx) => idx === i ? { ...x, company: e.target.value } : x) })} className="flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
                <Button variant="ghost" onClick={() => set({ credits: moveItem(credits, i, -1) })} disabled={i === 0} className="!px-2 !py-1.5"><IconUp /></Button>
                <Button variant="ghost" onClick={() => set({ credits: moveItem(credits, i, 1) })} disabled={i === credits.length - 1} className="!px-2 !py-1.5"><IconDown /></Button>
                <Button variant="danger" onClick={() => set({ credits: credits.filter((_, idx) => idx !== i) })} className="!px-2 !py-1.5"><IconTrash /></Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Training"
        right={
          <Button variant="outline" onClick={() => set({ training: [...training, { id: newId(), program: "", institution: "", detail: "" }] })}>
            + Add
          </Button>
        }
      >
        <div className="space-y-3">
          {training.map((t, i) => (
            <div key={t.id || i} className="flex flex-wrap items-center gap-2">
              <input value={t.program} placeholder="Program" onChange={(e) => set({ training: training.map((x, idx) => idx === i ? { ...x, program: e.target.value } : x) })} className="min-w-[8rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
              <input value={t.institution} placeholder="Institution" onChange={(e) => set({ training: training.map((x, idx) => idx === i ? { ...x, institution: e.target.value } : x) })} className="min-w-[8rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
              <input value={t.detail} placeholder="Detail" onChange={(e) => set({ training: training.map((x, idx) => idx === i ? { ...x, detail: e.target.value } : x) })} className="min-w-[8rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900" />
              <Button variant="danger" onClick={() => set({ training: training.filter((_, idx) => idx !== i) })} className="!px-2 !py-1.5"><IconTrash /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Special Skills"
        right={
          <Button variant="outline" onClick={() => set({ skills: [...skills, ""] })}>+ Add</Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <div key={i} className="flex items-center gap-1 rounded-full border border-neutral-300 pl-3 pr-1">
              <input value={s} placeholder="Skill" onChange={(e) => set({ skills: skills.map((x, idx) => idx === i ? e.target.value : x) })} className="w-32 bg-transparent py-1.5 text-sm outline-none" />
              <button onClick={() => set({ skills: skills.filter((_, idx) => idx !== i) })} className="text-neutral-400 hover:text-red-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function ContactTab({ content, setSection, setContent }) {
  const c = content.contact || {};
  const socials = c.socials || [];
  const setSocials = (list) => setSection("contact", { socials: list });
  const newId = () => `s_${Date.now()}`;

  return (
    <>
      <Card title="Contact">
        <div className="space-y-5">
          <Field label="Section heading">
            <Text value={c.heading} onChange={(v) => setSection("contact", { heading: v })} />
          </Field>
          <Field label="Intro text">
            <TextArea rows={3} value={c.intro} onChange={(v) => setSection("contact", { intro: v })} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email">
              <Text type="email" value={c.email} onChange={(v) => setSection("contact", { email: v })} />
            </Field>
            <Field label="Phone (optional)">
              <Text value={c.phone} onChange={(v) => setSection("contact", { phone: v })} />
            </Field>
          </div>
          <Field label="Actors Access URL">
            <Text value={c.actorsAccessUrl} onChange={(v) => setSection("contact", { actorsAccessUrl: v })} />
          </Field>
        </div>
      </Card>

      <Card
        title="Social links"
        right={
          <Button variant="outline" onClick={() => setSocials([...socials, { id: newId(), label: "", url: "" }])}>+ Add</Button>
        }
      >
        <div className="space-y-3">
          {socials.map((s, i) => (
            <div key={s.id || i} className="flex items-center gap-2">
              <input value={s.label} placeholder="Label (e.g. Instagram)" onChange={(e) => setSocials(socials.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} className="w-1/3 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900" />
              <input value={s.url} placeholder="https://…" onChange={(e) => setSocials(socials.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))} className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900" />
              <Button variant="danger" onClick={() => setSocials(socials.filter((_, idx) => idx !== i))} className="!px-2 !py-2"><IconTrash /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Footer">
        <Field label="Footer name / text">
          <Text value={content.footer?.text} onChange={(v) => setContent((cc) => ({ ...cc, footer: { ...cc.footer, text: v } }))} />
        </Field>
      </Card>
    </>
  );
}
