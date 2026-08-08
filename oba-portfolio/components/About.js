import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About({ about }) {
  const paragraphs = (about?.bio || "").split(/\n{2,}/).filter(Boolean);
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading eyebrow="Introduction" title={about?.heading || "About"} />

      <div className="grid items-start gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal className="md:sticky md:top-28">
          {about?.headshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={about.headshot}
              alt="Oba Jafojo headshot"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-sm object-cover shadow-sm"
            />
          )}
        </Reveal>

        <Reveal delay={80}>
          <div className="space-y-5 text-[1.02rem] leading-relaxed text-ink/80">
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{about?.bio}</p>
            )}
          </div>

          {Array.isArray(about?.specs) && about.specs.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-black/10 pt-8 sm:grid-cols-3">
              {about.specs.map((s, i) => (
                <div key={i}>
                  <dt className="text-[0.65rem] uppercase tracking-widest2 text-ink/40">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-sm text-ink/90">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
      </div>
    </section>
  );
}
