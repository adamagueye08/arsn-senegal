import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/l-arsn")({
  head: () => ({
    meta: [
      { title: "L'ARSN — Missions et Organisation" },
      {
        name: "description",
        content:
          "Missions, organisation et textes constitutifs de l'Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires.",
      },
      { property: "og:title", content: "L'ARSN — Missions et Organisation" },
      {
        property: "og:description",
        content: "Autorité indépendante rattachée à la Présidence de la République du Sénégal.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        eyebrow="INSTITUTION"
        title={t("page.arsn.title")}
        subtitle={t("page.arsn.subtitle")}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">{t("page.arsn.mission.title")}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("page.arsn.mission.body")}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">{t("page.arsn.org.title")}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("page.arsn.org.body")}
            </p>
          </div>
        </section>
        <aside className="bg-foreground text-white p-8 rounded-sm h-fit">
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] border-b border-white/10 pb-4 mb-6">
            {t("page.arsn.texts.title")}
          </h3>
          <ul className="space-y-4 text-sm">
            {["page.arsn.texts.1", "page.arsn.texts.2", "page.arsn.texts.3"].map((k) => (
              <li key={k} className="flex gap-3 items-start">
                <FileText className="w-4 h-4 shrink-0 text-arsn-yellow mt-0.5" />
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
