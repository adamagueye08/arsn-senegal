import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ARSN Sénégal" },
      {
        name: "description",
        content: "Coordonnées, adresse et horaires de l'Autorité Sénégalaise de Radioprotection.",
      },
      { property: "og:title", content: "Contact — ARSN" },
      { property: "og:description", content: "Nous joindre — siège de l'ARSN à Dakar." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  const CARDS = [
    { icon: MapPin, title: t("page.contact.address.title"), body: t("page.contact.address.body") },
    { icon: Phone, title: t("page.contact.phone.title"), body: "+221 33 832 55 50" },
    { icon: Mail, title: t("page.contact.email.title"), body: "info@arsn.gouv.sn" },
    { icon: Clock, title: t("page.contact.hours.title"), body: t("page.contact.hours.body") },
  ];
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title={t("page.contact.title")}
        subtitle={t("page.contact.subtitle")}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-6">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="p-8 bg-white ring-1 ring-black/5">
              <div className="w-10 h-10 bg-foreground text-white rounded-sm grid place-items-center mb-6">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] mb-3">{c.title}</h3>
              <p className="text-base leading-relaxed whitespace-pre-line">{c.body}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
