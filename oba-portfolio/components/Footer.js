export default function Footer({ footer, contact }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/5 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <p className="font-serif text-xl">{footer?.text || "Oba Jafojo"}</p>

        {Array.isArray(contact?.socials) && contact.socials.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs uppercase tracking-widest2 text-ink/50">
            {contact.socials.map((s, i) => (
              <a
                key={s.id || i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}

        <p className="text-[0.7rem] uppercase tracking-widest2 text-ink/30">
          © {year} · All rights reserved
        </p>
      </div>
    </footer>
  );
}
