import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import newsConference from "@/assets/news-conference.jpg";
import newsVisit from "@/assets/news-visit.jpg";
import newsRadiology from "@/assets/news-radiology.jpg";

const SLIDES = [
  { image: newsConference, n: 1 },
  { image: newsVisit, n: 2 },
  { image: newsRadiology, n: 3 },
  { image: newsConference, n: 4 },
] as const;

export function NewsSlider() {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (delta: number) =>
    setIdx((i) => (i + delta + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative overflow-hidden rounded-sm ring-1 ring-black/5 bg-foreground text-white mb-16 md:mb-20 animate-reveal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={lang === "fr" ? "Actualités défilantes" : "Featured news carousel"}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="relative shrink-0 w-full min-h-[420px] md:min-h-[520px]"
            aria-hidden={i !== idx}
          >
            <img
              src={s.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-arsn-blue/90 via-arsn-blue/70 to-transparent" />
            <div className="relative z-10 max-w-3xl px-6 md:px-12 py-16 md:py-24">
              <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur text-white text-[10px] font-bold tracking-widest uppercase rounded mb-6">
                {t("home.news.title")} · {String(i + 1).padStart(2, "0")}/
                {String(SLIDES.length).padStart(2, "0")}
              </span>
              <p className="font-mono text-[11px] tracking-widest text-white/70 mb-4">
                {t(`news.${s.n}.date`)}
              </p>
              <h3 className="text-3xl md:text-5xl font-serif leading-tight text-balance">
                {t(`news.${s.n}.title`)}
              </h3>
              <p className="mt-5 text-white/80 max-w-2xl leading-relaxed">
                {t(`news.${s.n}.excerpt`)}
              </p>
              <Link
                to="/information"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-arsn-blue font-semibold text-sm rounded-sm hover:bg-arsn-yellow transition-colors"
              >
                {lang === "fr" ? "Lire l'article" : "Read article"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={() => go(-1)}
        aria-label={lang === "fr" ? "Précédent" : "Previous"}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center bg-white/10 hover:bg-white/25 backdrop-blur rounded-full transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label={lang === "fr" ? "Suivant" : "Next"}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center bg-white/10 hover:bg-white/25 backdrop-blur rounded-full transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`${lang === "fr" ? "Aller à" : "Go to"} ${i + 1}`}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === idx ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70")
            }
          />
        ))}
      </div>
    </section>
  );
}
