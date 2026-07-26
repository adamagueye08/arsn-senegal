import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { Activity, Download } from "lucide-react";
import { toast } from "sonner";

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
      {
        property: "og:description",
        content: "Suivi dosimétrique des travailleurs exposés au Sénégal.",
      },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "SURVEILLANCE",
  title: "Dosimétrie",
  subtitle:
    "Mesurer et surveiller l'exposition des travailleurs et du public aux rayonnements ionisants.",
  intro:
    "La dosimétrie est un élément clé de la radioprotection, permettant de mesurer et de surveiller l'exposition des travailleurs et du public aux rayonnements ionisants. Elle est encadrée par la loi n° 2021-44 du 31 décembre 2021, qui fixe des limites de dose et des obligations de surveillance.",
  faqTitle: "Infos pratiques",
  faq: [
    "Qui doit porter un dosimètre ?",
    "Pourquoi la dosimétrie est-elle essentielle ?",
    "Que faire en cas de dépassement de dose ?",
    "Comment fonctionne la dosimétrie ?",
  ],
  regTitle: "Cadre réglementaire",
  regBody:
    "Selon l'article 48, l'Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires (ARSN) fixe des limites de dose pour le public et les travailleurs. Ces valeurs sont conformes aux recommandations de l'Agence Internationale de l'Énergie Atomique (AIEA) et d'autres organismes internationaux.",
  exposureTitle: "Types d'exposition contrôlés",
  exposure: [
    "Exposition externe (rayonnements gamma, rayons X)",
    "Exposition interne (inhalation de radon, ingestion de radionucléides)",
  ],
  limitsTitle: "Limites de dose autorisées",
  limits: [
    {
      t: "Travailleurs exposés",
      d: "Personnel médical, industriel, chercheurs : dose efficace annuelle maximale de 20 mSv sur 5 ans, avec une limite de 50 mSv pour une année donnée.",
    },
    {
      t: "Grand public",
      d: "Dose efficace annuelle maximale : 1 mSv/an, sauf situations exceptionnelles.",
    },
    {
      t: "Femmes enceintes",
      d: "Travaillant sous rayonnements : exposition limitée à 1 mSv sur la durée de la grossesse.",
    },
  ],
  surveyTitle: "Surveillance et contrôle de l'exposition",
  surveySub: "Suivi dosimétrique obligatoire (article 45)",
  survey: [
    "Dosimètres individuels (film, badge thermoluminescent, dosimètre électronique)",
    "Enregistrement des doses reçues et conservation des données",
    "Évaluation des risques en cas de dépassement des limites",
  ],
  radonTitle: "Cartographie du radon et exposition naturelle (article 47)",
  radon: [
    "Surveillance des bâtiments publics et des lieux de travail",
    "Fixation de niveaux de référence pour la concentration de radon",
    "Mesures correctives en cas de dépassement des seuils",
  ],
  services: {
    t: "Services",
    a: "Formulaires d'abonnement au service national de dosimétrie",
    b: "Guides d'utilisation des dosimètres",
    cta: "Télécharger",
  },
};

const EN: typeof FR = {
  hero: "MONITORING",
  title: "Dosimetry",
  subtitle: "Measuring and monitoring worker and public exposure to ionising radiation.",
  intro:
    "Dosimetry is a key element of radiation protection, allowing the measurement and monitoring of worker and public exposure to ionising radiation. It is governed by law 2021-44 of 31 December 2021, which sets dose limits and monitoring obligations.",
  faqTitle: "Quick facts",
  faq: [
    "Who must wear a dosimeter?",
    "Why is dosimetry essential?",
    "What to do if a dose is exceeded?",
    "How does dosimetry work?",
  ],
  regTitle: "Regulatory framework",
  regBody:
    "Under article 48, ARSN sets dose limits for the public and for workers. These values comply with the recommendations of the International Atomic Energy Agency (IAEA) and other international bodies.",
  exposureTitle: "Controlled exposure types",
  exposure: [
    "External exposure (gamma rays, X-rays)",
    "Internal exposure (radon inhalation, radionuclide ingestion)",
  ],
  limitsTitle: "Authorised dose limits",
  limits: [
    {
      t: "Exposed workers",
      d: "Medical, industrial staff and researchers: maximum annual effective dose of 20 mSv over 5 years, with a 50 mSv limit for any single year.",
    },
    {
      t: "General public",
      d: "Maximum annual effective dose: 1 mSv/year, except in exceptional situations.",
    },
    {
      t: "Pregnant women",
      d: "Working under radiation: exposure limited to 1 mSv over the duration of pregnancy.",
    },
  ],
  surveyTitle: "Exposure monitoring and control",
  surveySub: "Mandatory dosimetric monitoring (article 45)",
  survey: [
    "Individual dosimeters (film, thermoluminescent badge, electronic dosimeter)",
    "Recording of received doses and data retention",
    "Risk assessment in case of exceeded limits",
  ],
  radonTitle: "Radon mapping and natural exposure (article 47)",
  radon: [
    "Monitoring of public buildings and workplaces",
    "Setting of reference levels for radon concentration",
    "Corrective measures when thresholds are exceeded",
  ],
  services: {
    t: "Services",
    a: "Subscription forms for the national dosimetry service",
    b: "Dosimeter user guides",
    cta: "Download",
  },
};

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-16">
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{c.intro}</p>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-6">{c.faqTitle}</h2>
          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.faq.map((q) => (
              <li key={q} className="p-6 bg-white ring-1 ring-black/5 text-sm font-medium">
                {q}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-8 bg-white ring-1 ring-black/5 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold mb-4">{c.regTitle}</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">{c.regBody}</p>
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] mb-3">{c.exposureTitle}</h3>
          <ul className="space-y-2">
            {c.exposure.map((e) => (
              <li key={e} className="flex gap-3 items-start text-sm">
                <Activity className="w-4 h-4 text-arsn-green shrink-0 mt-0.5" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
            {c.limitsTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {c.limits.map((l) => (
              <div key={l.t} className="p-8 bg-foreground text-white rounded-sm">
                <h3 className="text-lg font-bold mb-3">{l.t}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{l.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-white ring-1 ring-black/5">
            <span className="block font-mono text-[10px] text-muted-foreground mb-3">
              {c.surveyTitle}
            </span>
            <h3 className="text-lg font-bold mb-4">{c.surveySub}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.survey.map((s) => (
                <li key={s} className="flex gap-2 items-start">
                  <span className="text-arsn-green">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-white ring-1 ring-black/5">
            <h3 className="text-lg font-bold mb-4">{c.radonTitle}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.radon.map((s) => (
                <li key={s} className="flex gap-2 items-start">
                  <span className="text-arsn-green">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          {[c.services.a, c.services.b].map((label) => (
            <div key={label} className="p-8 bg-foreground text-white flex items-center justify-between gap-6 rounded-sm">
              <span className="text-sm font-medium">{label}</span>
              <button
                onClick={() =>
                  toast.info(label, {
                    description:
                      "Ce document sera bientôt disponible. Veuillez contacter le service dosimétrie de l'ARSN.",
                  })
                }
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-arsn-yellow hover:underline shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> {c.services.cta}
              </button>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
