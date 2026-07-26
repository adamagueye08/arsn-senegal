import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { Download } from "lucide-react";
import { toast } from "sonner";

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
      {
        property: "og:description",
        content: "Demande d'autorisation nucléaire ou radiologique au Sénégal.",
      },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "LICENCE",
  title: "Autorisation",
  subtitle:
    "Permission écrite délivrée par l'ARSN pour exécuter des activités non exemptées mettant en jeu des rayonnements ionisants.",
  intro:
    "Une « autorisation » est une permission accordée par écrit à un exploitant par l'ARSN pour exécuter des activités non exemptées et mettant en jeu des rayonnements ionisants. L'autorisation est délivrée sur la base d'une évaluation de la sûreté et de la sécurité et assortie de conditions et prescriptions particulières que l'exploitant doit respecter.",
  processTitle: "Processus de demande d'autorisation",
  processBody:
    "Toute personne physique ou morale souhaitant exercer une activité impliquant des matières nucléaires, des sources de rayonnements ionisants ou toute autre installation nécessitant un contrôle réglementaire doit obtenir une autorisation préalable de l'Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires (ARSN).",
  stepsTitle: "Étapes de la procédure",
  steps: [
    {
      t: "Constitution du dossier",
      d: "Le demandeur télécharge le formulaire correspondant à son activité (importation, exportation, détention et utilisation, transport) et rassemble les pièces justificatives requises.",
    },
    {
      t: "Dépôt de la demande",
      d: "Le dossier complet est adressé à l'ARSN. Un accusé de réception est transmis au demandeur.",
    },
    {
      t: "Instruction technique",
      d: "L'ARSN vérifie la conformité du dossier, évalue la sûreté et la sécurité de l'activité proposée et peut demander des compléments.",
    },
    {
      t: "Décision",
      d: "Une décision motivée est rendue : délivrance de l'autorisation assortie de prescriptions, refus, ou demande de mise en conformité préalable.",
    },
    {
      t: "Suivi et renouvellement",
      d: "L'exploitant doit respecter les prescriptions imposées, déclarer toute modification substantielle et solliciter le renouvellement avant l'échéance de l'autorisation.",
    },
  ],
  faqTitle: "Infos pratiques",
  faq: [
    "Que faire en cas de modification ou de cessation d'activité ?",
    "Combien de temps prend le traitement d'une demande ?",
    "Quelles activités nécessitent une autorisation ?",
  ],
  formsTitle: "Formulaires de demande",
  forms: [
    {
      t: "Importation",
      d: "L'importation des sources radioactives est une activité hautement encadrée, nécessitant une préparation minutieuse et une conformité stricte aux réglementations en vigueur.",
    },
    {
      t: "Exportation",
      d: "L'exportation des sources radioactives est une opération sensible, nécessitant une préparation minutieuse et une conformité stricte aux réglementations nationales et internationales.",
    },
    {
      t: "Détention et utilisation",
      d: "La détention et l'utilisation des sources radioactives sont strictement encadrées pour assurer la protection des travailleurs, du public et de l'environnement.",
    },
    {
      t: "Transport",
      d: "Le transport des matières radioactives est une activité hautement réglementée, nécessitant des mesures strictes pour assurer la sécurité des personnes, des biens et de l'environnement.",
    },
  ],
  download: "Télécharger",
};

const EN: typeof FR = {
  hero: "LICENCE",
  title: "Authorisation",
  subtitle:
    "Written permission issued by ARSN to carry out non-exempt activities involving ionising radiation.",
  intro:
    "An 'authorisation' is a written permission granted by ARSN to an operator to carry out non-exempt activities involving ionising radiation. The authorisation is issued on the basis of a safety and security assessment and comes with specific conditions and prescriptions the operator must comply with.",
  processTitle: "Application process",
  processBody:
    "Any natural or legal person wishing to carry out an activity involving nuclear material, sources of ionising radiation or any other facility subject to regulatory control must obtain prior authorisation from the Senegalese Authority for Radiation Protection, Nuclear Safety and Security (ARSN).",
  stepsTitle: "Procedure steps",
  steps: [
    {
      t: "Prepare the file",
      d: "The applicant downloads the form matching their activity (import, export, holding and use, transport) and gathers the required supporting documents.",
    },
    {
      t: "Submit the application",
      d: "The complete file is sent to ARSN. An acknowledgement of receipt is provided.",
    },
    {
      t: "Technical review",
      d: "ARSN checks the completeness of the file, assesses the safety and security of the proposed activity and may request additional information.",
    },
    {
      t: "Decision",
      d: "A reasoned decision is issued: authorisation with prescriptions, refusal, or a prior compliance request.",
    },
    {
      t: "Monitoring and renewal",
      d: "The operator must comply with the prescriptions, declare any substantial modification and request renewal before the authorisation expires.",
    },
  ],
  faqTitle: "Quick facts",
  faq: [
    "What to do in case of modification or cessation of activity?",
    "How long does the processing of a request take?",
    "Which activities require authorisation?",
  ],
  formsTitle: "Application forms",
  forms: [
    {
      t: "Import",
      d: "Importing radioactive sources is a highly regulated activity requiring careful preparation and strict compliance with regulations in force.",
    },
    {
      t: "Export",
      d: "Exporting radioactive sources is a sensitive operation requiring careful preparation and strict compliance with national and international regulations.",
    },
    {
      t: "Holding and use",
      d: "Holding and using radioactive sources is strictly regulated to ensure the protection of workers, the public and the environment.",
    },
    {
      t: "Transport",
      d: "The transport of radioactive materials is a highly regulated activity, requiring strict measures to ensure the safety of people, property and the environment.",
    },
  ],
  download: "Download",
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
          <h2 className="text-2xl font-serif font-bold mb-4">{c.processTitle}</h2>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
            {c.processBody}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
            {c.stepsTitle}
          </h2>
          <ol className="space-y-6 max-w-3xl">
            {c.steps.map((s, i) => (
              <li key={s.t} className="flex gap-6 p-6 bg-white ring-1 ring-black/5">
                <span className="font-mono text-2xl font-bold text-arsn-green shrink-0 w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-bold mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-6">{c.faqTitle}</h2>
          <ul className="grid md:grid-cols-3 gap-4">
            {c.faq.map((q) => (
              <li key={q} className="p-6 bg-white ring-1 ring-black/5 text-sm font-medium">
                {q}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-8 border-b border-border pb-4">
            {c.formsTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {c.forms.map((f) => (
              <div key={f.t} className="p-8 bg-white ring-1 ring-black/5">
                <h3 className="text-lg font-bold mb-3">{f.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{f.d}</p>
                <button
                  onClick={() =>
                    toast.info(f.t, {
                      description:
                        "Le formulaire officiel sera bientôt disponible en téléchargement. Contactez l'ARSN pour l'obtenir dès à présent.",
                    })
                  }
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-arsn-green hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> {c.download}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
