interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
  image: string;
}

export function PageHero({ label, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[520px] overflow-hidden text-white">
      <img
        src={image}
        alt=""
        className="img-warm absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,26,24,0.45) 0%, rgba(26,26,24,0.25) 40%, rgba(26,26,24,0.85) 100%)",
        }}
      />
      <div className="relative z-10 container-edge flex h-full flex-col justify-end pb-16 pt-32">
        <p className="label-tag fade-in text-[var(--brass)]">{label}</p>
        <h1 className="reveal-up font-display mt-5 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="reveal-up mt-6 max-w-xl text-base text-white/75 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
