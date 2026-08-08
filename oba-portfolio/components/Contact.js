import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Contact({ contact }) {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
      <SectionHeading eyebrow="Say Hello" title={contact?.heading || "Contact"} />

      {contact?.intro && (
        <Reveal>
          <p className="mx-auto mb-10 max-w-xl text-[1.02rem] leading-relaxed text-ink/70">
            {contact.intro}
          </p>
        </Reveal>
      )}

      <Reveal delay={60}>
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            className="font-serif text-2xl text-ink underline decoration-ink/20 underline-offset-8 transition-colors hover:decoration-ink sm:text-3xl"
          >
            {contact.email}
          </a>
        )}

        {contact?.phone && (
          <p className="mt-4 text-sm text-ink/60">{contact.phone}</p>
        )}
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {contact?.actorsAccessUrl && (
            <a
              href={contact.actorsAccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-widest2 text-white transition-transform hover:-translate-y-0.5"
            >
              Actors Access
            </a>
          )}
          {Array.isArray(contact?.socials) &&
            contact.socials.map((s, i) => (
              <a
                key={s.id || i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/20 px-6 py-3 text-xs font-medium uppercase tracking-widest2 text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {s.label}
              </a>
            ))}
        </div>
      </Reveal>
    </section>
  );
}
