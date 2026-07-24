import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/inspection")({
  head: () => ({
    meta: [
      { title: "Inspection — ARSN Sénégal" },
      {
        name: "description",
        content:
          "Contrôle sur site des installations autorisées et surveillance de la conformité par les inspecteurs de l'ARSN.",
      },
      { property: "og:title", content: "Inspection — ARSN" },
      { property: "og:description", content: "Contrôle sur site des installations nucléaires et radiologiques." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  const types = [1, 2, 3, 4] as const;
  return (
    <>
      <PageHero eyebrow="CONTRÔLE" title={t("page.insp.title")} subtitle={t("page.insp.subtitle")} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <p className="text-lg text-muted-foreground max-w-3xl mb-16 leading-relaxed">
          {t("page.insp.intro")}
        </p>
        <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
          {t("page.insp.types.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {types.map((n) => (
            <div key={n} className="p-8 bg-white ring-1 ring-black/5 flex gap-4 items-start">
              <ShieldCheck className="w-5 h-5 text-arsn-green shrink-0 mt-0.5" />
              <p className="text-base leading-relaxed">{t(`page.insp.type.${n}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
