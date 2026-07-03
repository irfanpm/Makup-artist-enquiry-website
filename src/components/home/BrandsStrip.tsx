const brands = [
  "MAC",
  "HUDA BEAUTY",
  "NARS",
  "BOBBI BROWN",
  "CHARLOTTE TILBURY",
  "FOREVER52",
  "TEMPTU",
  "KRYOLAN",
];

/** Scrolling strip of premium brands used — builds instant trust. */
export default function BrandsStrip() {
  const row = (
    <>
      {brands.map((brand) => (
        <span key={brand} className="flex items-center gap-10 px-10">
          <span className="whitespace-nowrap font-serif text-2xl font-semibold tracking-wide text-secondary/35 transition-colors hover:text-primary">
            {brand}
          </span>
          <span className="text-primary/30">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <section className="border-y border-primary/10 bg-white py-8">
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.3em] text-foreground/45">
        Only Premium Products Touch Your Skin
      </p>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max [animation-duration:36s]">
          <div className="flex">{row}</div>
          <div className="flex" aria-hidden="true">{row}</div>
        </div>
      </div>
    </section>
  );
}
