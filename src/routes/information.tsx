import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import newsConference from "@/assets/news-conference.jpg";
import newsVisit from "@/assets/news-visit.jpg";
import newsRadiology from "@/assets/news-radiology.jpg";

export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Information — Actualités ARSN" },
      {
        name: "description",
        content: "Actualités, communiqués officiels et événements de l'ARSN Sénégal.",
      },
      { property: "og:title", content: "Actualités — ARSN" },
      { property: "og:description", content: "Suivez l'activité de l'ARSN Sénégal." },
    ],
  }),
  component: Page,
});

const ITEMS = [
  { n: 1, img: newsConference },
  { n: 2, img: newsVisit },
  { n: 3, img: newsRadiology },
  { n: 4, img: newsConference },
] as const;

function Page() {
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow="ACTUALITÉS" title={t("page.info.title")} subtitle={t("page.info.subtitle")} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ITEMS.map((item) => (
          <article key={item.n} className="space-y-4 group cursor-pointer">
            <div className="w-full aspect-video overflow-hidden rounded-sm bg-slate-100">
              <img
                src={item.img}
                alt=""
                loading="lazy"
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="block font-mono text-[10px] text-muted-foreground">
              {t(`news.${item.n}.date`)}
            </span>
            <h5 className="text-lg font-bold leading-tight group-hover:text-arsn-green transition-colors">
              {t(`news.${item.n}.title`)}
            </h5>
            <p className="text-sm text-muted-foreground">{t(`news.${item.n}.excerpt`)}</p>
          </article>
        ))}
      </div>
    </>
  );
}
