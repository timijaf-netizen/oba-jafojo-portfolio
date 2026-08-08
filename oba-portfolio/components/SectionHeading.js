export default function SectionHeading({ eyebrow, title }) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <p className="mb-3 text-[0.7rem] uppercase tracking-widest2 text-ink/40">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl font-medium sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <div className="mx-auto mt-6 h-px w-12 bg-ink/20" />
    </div>
  );
}
