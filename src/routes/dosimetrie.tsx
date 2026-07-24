import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/dosimetrie")({
  head: () => ({
    meta: [
      { title: "Dosimétrie — ARSN Sénégal" },
      {
        name: "description",
        content:
          "Service national de dosimétrie individuelle des travailleurs exposés aux rayonnements ionisants.",
      },
      { property: "og:title", content: "Dosimétrie — ARSN" },
      { property: "og:description", content: "Suivi dosimétrique des travailleurs exposés au Sénégal." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  const services = [1, 2, 3, 4] as const;
  return (
    <>
      <PageHero
        eyebrow="SURVEILLANCE"
        title={t("page.dosi.title")}
        subtitle={t("page.dosi.subtitle")}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <p className="text-lg text-muted-foreground max-w-3xl mb-16 leading-relaxed">
          {t("page.dosi.intro")}
        </p>
        <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
          {t("page.dosi.services.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((n) => (
            <div key={n} className="p-8 bg-white ring-1 ring-black/5 flex gap-4 items-start">
              <Activity className="w-5 h-5 text-arsn-green shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">{t(`page.dosi.svc.${n}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
