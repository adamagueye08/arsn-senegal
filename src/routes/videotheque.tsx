import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { Play } from "lucide-react";

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

function Page() {
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow="MÉDIA" title={t("page.video.title")} subtitle={t("page.video.subtitle")} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-video bg-foreground rounded-sm relative overflow-hidden group cursor-pointer ring-1 ring-black/5"
            >
              <div className="absolute inset-0 grid place-items-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 grid place-items-center backdrop-blur-md group-hover:bg-arsn-green/80 transition-colors">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                  Vidéo {String(i).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted-foreground max-w-2xl">{t("page.video.empty")}</p>
      </div>
    </>
  );
}
