import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";

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
      {
        property: "og:description",
        content: "Textes réglementaires régissant les activités nucléaires au Sénégal.",
      },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "CADRE JURIDIQUE",
  title: "Réglementation",
  subtitle:
    "Loi n° 2021-44 du 31 décembre 2021 relative à la radioprotection, à la sûreté et à la sécurité nucléaires et aux garanties.",
  intro1:
    "Le cadre réglementaire et législatif est régi par la loi n° 2021-44 du 31 décembre 2021 relative à la radioprotection, la sûreté et la sécurité nucléaires et aux garanties.",
  intro2:
    "Cette loi a pour objet de mettre en place un cadre juridique permettant de mener des activités ayant trait à l'énergie nucléaire et aux rayonnements ionisants d'une manière qui protège convenablement les individus, les biens et l'environnement, maintenant et dans le futur (art. 1).",
  practical: "Infos pratiques",
  pillars: [
    {
      t: "Sûreté nucléaire",
      d: "Ensemble des dispositions techniques et des mesures d'organisation prises pour assurer le fonctionnement normal des installations nucléaires, prévenir les accidents et en limiter les conséquences.",
    },
    {
      t: "Sécurité nucléaire",
      d: "Prévention, détection et réaction concernant les actes malveillants, le vol, le sabotage, l'accès non autorisé ou le transfert illégal de matières nucléaires et radioactives.",
    },
    {
      t: "Radioprotection",
      d: "Protection des personnes et de l'environnement contre les effets nocifs des rayonnements ionisants, sur la base des principes de justification, d'optimisation et de limitation des doses.",
    },
  ],
  instTitle: "Cadre institutionnel",
  instBody:
    "Le cadre institutionnel de la radioprotection, de la sûreté et de la sécurité nucléaires repose sur plusieurs acteurs clés qui veillent au respect des normes nationales et internationales : autorité de réglementation (ARSN), ministères techniques concernés, exploitants et titulaires d'autorisation, organismes de contrôle et laboratoires, et partenaires internationaux dont l'AIEA.",
  guarTitle: "Garanties et non-prolifération",
  guarBody:
    "Les accords de garanties sont des mécanismes mis en place par l'AIEA pour vérifier que les matières nucléaires utilisées à des fins civiles ne sont pas détournées à des fins militaires. Le Sénégal est partie au TNP et met en œuvre l'accord de garanties généralisées ainsi que le protocole additionnel.",
  actTitle: "Activités soumises à réglementation",
  actBody:
    "Les activités impliquant des matières nucléaires, des sources de rayonnements ionisants et d'autres pratiques associées sont soumises à un contrôle réglementaire strict pour garantir la protection des personnes, des biens et de l'environnement. Elles couvrent notamment l'importation, l'exportation, la détention, l'utilisation, le transport, l'entreposage, le stockage et la cession des sources radioactives.",
  frameworkTitle: "Cadre légal et réglementaire",
  categories: [
    { t: "Lois et règlements", d: "Loi 2021-44 et textes d'application nationaux." },
    { t: "Traités et conventions", d: "Instruments internationaux ratifiés par le Sénégal." },
    { t: "Avis et décisions", d: "Décisions de l'ARSN opposables aux exploitants." },
    { t: "Guides", d: "Guides de sûreté et de bonnes pratiques." },
  ],
  featured: "Décisions marquantes",
  decisions: [
    "Décision 2023-001-ARSN du 22 août 2023 relative à la protection des patients",
    "Décision 2024-001-ARSN du 07 mars 2024 relative à la protection des travailleurs",
  ],
};

const EN: typeof FR = {
  hero: "LEGAL FRAMEWORK",
  title: "Regulation",
  subtitle:
    "Law 2021-44 of 31 December 2021 on radiation protection, nuclear safety and security and safeguards.",
  intro1:
    "The regulatory and legislative framework is governed by law 2021-44 of 31 December 2021 on radiation protection, nuclear safety and security and safeguards.",
  intro2:
    "This law aims to establish a legal framework to conduct activities relating to nuclear energy and ionising radiation in a manner that properly protects individuals, property and the environment, now and in the future (art. 1).",
  practical: "Quick facts",
  pillars: [
    {
      t: "Nuclear safety",
      d: "The set of technical provisions and organisational measures taken to ensure the normal operation of nuclear facilities, prevent accidents and limit their consequences.",
    },
    {
      t: "Nuclear security",
      d: "Prevention, detection and response to malicious acts, theft, sabotage, unauthorised access or illicit transfer of nuclear and radioactive materials.",
    },
    {
      t: "Radiation protection",
      d: "Protection of people and the environment from the harmful effects of ionising radiation, based on the principles of justification, optimisation and dose limitation.",
    },
  ],
  instTitle: "Institutional framework",
  instBody:
    "The institutional framework for radiation protection, nuclear safety and security relies on several key actors ensuring compliance with national and international standards: the regulator (ARSN), relevant line ministries, operators and licence holders, control bodies and laboratories, and international partners including the IAEA.",
  guarTitle: "Safeguards and non-proliferation",
  guarBody:
    "Safeguards agreements are IAEA mechanisms to verify that nuclear material used for civilian purposes is not diverted to military purposes. Senegal is party to the NPT and implements the comprehensive safeguards agreement and the additional protocol.",
  actTitle: "Regulated activities",
  actBody:
    "Activities involving nuclear material, sources of ionising radiation and other related practices are subject to strict regulatory control to ensure protection of people, property and the environment. They cover in particular the import, export, holding, use, transport, storage and transfer of radioactive sources.",
  frameworkTitle: "Legal and regulatory framework",
  categories: [
    { t: "Laws and regulations", d: "Law 2021-44 and national implementing texts." },
    { t: "Treaties and conventions", d: "International instruments ratified by Senegal." },
    { t: "Notices and decisions", d: "ARSN decisions enforceable against operators." },
    { t: "Guides", d: "Safety guides and best practices." },
  ],
  featured: "Notable decisions",
  decisions: [
    "Decision 2023-001-ARSN of 22 August 2023 on patient protection",
    "Decision 2024-001-ARSN of 07 March 2024 on worker protection",
  ],
};

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-16">
        <section className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">{c.intro1}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{c.intro2}</p>
        </section>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-6">{c.practical}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {c.pillars.map((p) => (
              <div key={p.t} className="p-8 bg-white ring-1 ring-black/5">
                <h3 className="text-lg font-bold mb-3">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-white ring-1 ring-black/5">
            <h3 className="text-xl font-serif font-bold mb-3">{c.instTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.instBody}</p>
          </div>
          <div className="p-8 bg-white ring-1 ring-black/5">
            <h3 className="text-xl font-serif font-bold mb-3">{c.guarTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.guarBody}</p>
          </div>
          <div className="p-8 bg-white ring-1 ring-black/5 md:col-span-2">
            <h3 className="text-xl font-serif font-bold mb-3">{c.actTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.actBody}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
            {c.frameworkTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.categories.map((cat, i) => (
              <div
                key={cat.t}
                className="p-8 bg-white ring-1 ring-black/5 hover:ring-arsn-green/40 transition-all"
              >
                <span className="block font-mono text-[10px] text-muted-foreground mb-6">
                  {String(i + 1).padStart(2, "0")} // {lang === "fr" ? "CATÉGORIE" : "CATEGORY"}
                </span>
                <h3 className="text-lg font-bold mb-2">{cat.t}</h3>
                <p className="text-xs text-muted-foreground">{cat.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-foreground text-white p-10 rounded-sm">
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">
            {c.featured}
          </h3>
          <ul className="space-y-4">
            {c.decisions.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm">
                <ArrowRight className="w-4 h-4 mt-1 text-arsn-yellow shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
