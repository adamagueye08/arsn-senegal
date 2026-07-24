import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/autorisation")({
  head: () => ({
    meta: [
      { title: "Autorisation — ARSN Sénégal" },
      {
        name: "description",
        content:
          "Régime d'autorisation des activités impliquant des rayonnements ionisants : étapes, formulaires et instruction des dossiers.",
      },
      { property: "og:title", content: "Autorisation — ARSN" },
      { property: "og:description", content: "Demande d'autorisation nucléaire ou radiologique au Sénégal." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4, 5] as const;
  return (
    <>
      <PageHero
        eyebrow="LICENCE"
        title={t("page.auth.title")}
        subtitle={t("page.auth.subtitle")}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <p className="text-lg text-muted-foreground max-w-3xl mb-16 leading-relaxed">
          {t("page.auth.intro")}
        </p>
        <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
          {t("page.auth.steps.title")}
        </h2>
        <ol className="space-y-6 max-w-3xl">
          {steps.map((n) => (
            <li key={n} className="flex gap-6 p-6 bg-white ring-1 ring-black/5">
              <span className="font-mono text-2xl font-bold text-arsn-green shrink-0 w-10">
                {String(n).padStart(2, "0")}
              </span>
              <p className="text-base leading-relaxed pt-1">{t(`page.auth.step.${n}`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
