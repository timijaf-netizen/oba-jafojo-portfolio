export default function Hero({ hero }) {
  const bg = hero?.backgroundImage;
  return (
    <section id="top" className="relative flex h-screen min-h-[560px] items-center justify-center overflow-hidden">
      {bg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      )}
      {/* darkening gradient so white text stays readable over any image */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />

      <div className="relative z-10 px-6 text-center text-white">
        <p className="mb-5 text-[0.7rem] uppercase tracking-widest2 text-white/70">
          {hero?.location || "Actor · Performer"}
        </p>
        <h1 className="font-serif text-5xl font-medium leading-none sm:text-6xl md:text-8xl">
          {hero?.name || "Oba Jafojo"}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm uppercase tracking-widest2 text-white/85 sm:text-base">
          {hero?.tagline || "Actor · Performer · Storyteller"}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#reel"
            className="rounded-full bg-white px-7 py-3 text-xs font-medium uppercase tracking-widest2 text-ink transition-transform hover:-translate-y-0.5"
          >
            Watch Reel
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/70 px-7 py-3 text-xs font-medium uppercase tracking-widest2 text-white transition-colors hover:bg-white hover:text-ink"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="animate-bounce">
          <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
