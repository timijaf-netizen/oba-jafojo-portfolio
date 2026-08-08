import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function groupByCategory(credits = []) {
  const order = [];
  const map = {};
  for (const c of credits) {
    const cat = c.category || "Other";
    if (!map[cat]) {
      map[cat] = [];
      order.push(cat);
    }
    map[cat].push(c);
  }
  return order.map((cat) => ({ category: cat, items: map[cat] }));
}

export default function Resume({ resume }) {
  const groups = groupByCategory(resume?.credits);

  return (
    <section id="resume" className="border-y border-black/5 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Experience" title={resume?.heading || "Resume"} />

        {resume?.resumeFileUrl && (
          <div className="mb-14 text-center">
            <a
              href={resume.resumeFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-medium uppercase tracking-widest2 text-ink transition-colors hover:bg-ink hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download PDF Resume
            </a>
          </div>
        )}

        {/* Credits */}
        <div className="space-y-12">
          {groups.map((g) => (
            <Reveal key={g.category}>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest2 text-ink/40">
                {g.category}
              </h3>
              <ul className="divide-y divide-black/5">
                {g.items.map((c, i) => (
                  <li
                    key={c.id || i}
                    className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <span className="font-serif text-lg text-ink">{c.title}</span>
                    <span className="text-sm text-ink/70">
                      {c.role}
                      {c.company ? <span className="text-ink/40"> · {c.company}</span> : null}
                    </span>
                    <span className="text-sm tabular-nums text-ink/40 sm:text-right">
                      {c.year}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Training + Skills */}
        <div className="mt-16 grid gap-12 border-t border-black/10 pt-14 md:grid-cols-2">
          {Array.isArray(resume?.training) && resume.training.length > 0 && (
            <Reveal>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest2 text-ink/40">
                Training
              </h3>
              <ul className="space-y-5">
                {resume.training.map((t, i) => (
                  <li key={t.id || i}>
                    <p className="text-base text-ink">{t.program}</p>
                    <p className="text-sm text-ink/60">
                      {t.institution}
                      {t.detail ? <span className="text-ink/40"> — {t.detail}</span> : null}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {Array.isArray(resume?.skills) && resume.skills.length > 0 && (
            <Reveal delay={80}>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest2 text-ink/40">
                Special Skills
              </h3>
              <ul className="flex flex-wrap gap-2">
                {resume.skills.map((s, i) => (
                  <li
                    key={i}
                    className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/75"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
