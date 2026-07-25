import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { Play, Youtube } from "lucide-react";

export const Route = createFileRoute("/videotheque")({
  head: () => ({
    meta: [
      { title: "Vidéothèque — ARSN Sénégal" },
      {
        name: "description",
        content: "Ressources vidéo institutionnelles et pédagogiques de l'ARSN.",
      },
      { property: "og:title", content: "Vidéothèque — ARSN" },
      { property: "og:description", content: "Vidéos institutionnelles et pédagogiques." },
    ],
  }),
  component: Page,
});

const VIDEOS = [
  {
    id: "2sPfKpLnwmw",
    t: { fr: "Atelier régional ARSN-AIEA — 16 octobre 2023", en: "Regional ARSN-IAEA workshop — 16 October 2023" },
    date: "2023",
  },
  {
    id: "R0Rng4qZVko",
    t: {
      fr: "8 mars 2023 : témoignage de l'animatrice Awa Gaï (TFM) sur la Directrice générale de l'ARSN",
      en: "8 March 2023: testimony from TV host Awa Gaï (TFM) about ARSN's Director General",
    },
    date: "2023",
  },
  {
    id: "x3WYvMkfnP4",
    t: {
      fr: "Reportage TFM pour le 8 mars 2023 avec la Directrice générale de l'ARSN (version française)",
      en: "TFM report for 8 March 2023 with ARSN's Director General (French version)",
    },
    date: "2023",
  },
];

const FR = {
  hero: "MÉDIA",
  title: "Vidéothèque",
  subtitle: "Ressources vidéo institutionnelles et pédagogiques de l'ARSN.",
  channel: "Chaîne YouTube officielle",
  subs: "211,1K abonnés",
  visit: "Voir la chaîne",
};

const EN: typeof FR = {
  hero: "MEDIA",
  title: "Video library",
  subtitle: "ARSN institutional and educational video resources.",
  channel: "Official YouTube channel",
  subs: "211.1K subscribers",
  visit: "Visit the channel",
};

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-foreground text-white rounded-sm">
          <div className="flex items-center gap-4">
            <Youtube className="w-8 h-8 text-arsn-yellow" />
            <div>
              <p className="text-sm font-bold">ARSN — {c.channel}</p>
              <p className="text-xs text-white/60">{c.subs}</p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/channel/UC0yEwdv3hUQ32dG5359D5rA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 border border-white/20 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-foreground transition-all"
          >
            {c.visit}
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="aspect-video bg-foreground rounded-sm relative overflow-hidden ring-1 ring-black/5">
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-16 h-16 rounded-full bg-black/40 border border-white/30 grid place-items-center backdrop-blur-md group-hover:bg-arsn-green/80 transition-colors">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold leading-tight group-hover:text-arsn-green transition-colors">
                {v.t[lang]}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                {v.date}
              </p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
