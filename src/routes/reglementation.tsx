import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/reglementation")({
  head: () => ({
    meta: [
      { title: "Réglementation — ARSN Sénégal" },
      {
        name: "description",
        content:
          "Cadre juridique national de la radioprotection et de la sûreté nucléaire : lois, décrets, arrêtés et décisions.",
      },
      { property: "og:title", content: "Réglementation — ARSN" },
      { property: "og:description", content: "Textes réglementaires régissant les activités nucléaires au Sénégal." },
    ],
  }),
  component: Page,
});

const CATEGORIES = [
  { n: "01", key: "page.reg.cat.laws" },
  { n: "02", key: "page.reg.cat.decrees" },
  { n: "03", key: "page.reg.cat.orders" },
  { n: "04", key: "page.reg.cat.decisions" },
] as const;

function Page() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        eyebrow="CADRE JURIDIQUE"
        title={t("page.reg.title")}
        subtitle={t("page.reg.subtitle")}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <p className="text-lg text-muted-foreground max-w-3xl mb-12 leading-relaxed">
          {t("page.reg.intro")}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <div key={c.n} className="p-8 bg-white ring-1 ring-black/5 hover:ring-arsn-green/40 transition-all">
              <span className="block font-mono text-[10px] text-muted-foreground mb-6">
                {c.n} // CATÉGORIE
              </span>
              <h3 className="text-lg font-bold">{t(c.key)}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
