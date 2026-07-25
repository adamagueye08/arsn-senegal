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
      {
        property: "og:description",
        content: "Contrôle sur site des installations nucléaires et radiologiques.",
      },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "CONTRÔLE",
  title: "Inspection",
  subtitle:
    "Vérifier que chaque utilisateur assume ses responsabilités en radioprotection et en sûreté nucléaire.",
  intro:
    "Le contrôle par l'ARSN des pratiques et activités mettant en jeu des rayonnements ionisants vise à vérifier que tous les utilisateurs exercent pleinement leurs responsabilités et leurs obligations au point de vue de la radioprotection et de la sûreté. Ce contrôle se fait en partie par le biais des inspections sur le site des installations et aussi par l'étude des dossiers, documents et informations fournis par les déclarants et demandeurs d'autorisation.",
  scope:
    "Au cours des inspections, l'ARSN s'intéresse aussi bien aux sources qu'aux équipements matériels associés, à l'aménagement des locaux, aux travailleurs, aux méthodes de travail et à l'organisation. Le contrôle s'applique à toutes les étapes du cycle de vie des installations, depuis la conception, la création, la mise en service, l'exploitation, la mise à l'arrêt définitif et jusqu'au démantèlement. Il s'applique également au cycle de vie des sources, depuis l'importation, le transport, la détention, l'utilisation, la cession à titre onéreux ou gratuit, l'entreposage, le stockage et jusqu'au retour au fournisseur.",
  domains: [
    {
      t: "Domaine médical",
      d: "Les techniques nucléaires contribuent à la prévention, au diagnostic et au traitement, notamment des maladies non transmissibles telles que le cancer et les maladies cardiovasculaires. L'utilisation de sources de rayonnements ionisants entraîne une exposition du personnel et du patient par irradiation externe et parfois par contamination interne. Les contrôles menés par l'ARSN vérifient que l'exposition du personnel est maintenue au niveau le plus faible possible : équipements de protection, organisation du travail, formation. Pour les patients, la vigilance porte sur l'administration de la bonne dose, au bon patient, pour le bon examen ou le bon traitement.",
    },
    {
      t: "Domaine industriel",
      d: "Le contrôle des activités industrielles telles que les jauges nucléaires, la radiographie industrielle, les installations de production d'électricité ou de recherche est une mission fondamentale de l'ARSN. L'inspection vérifie que l'exploitant assume pleinement sa responsabilité et respecte les exigences de la réglementation. Elle est proportionnée au niveau de risque et à la manière dont l'exploitant assume ses responsabilités. Elle peut être annoncée par lettre ou se dérouler de façon inopinée.",
    },
    {
      t: "Transport de matières radioactives",
      d: "L'utilisation accrue des substances radioactives dans l'industrie, la médecine et l'agriculture augmente la fréquence des expéditions et les volumes transportés. L'ARSN supervise la sûreté et la sécurité du transport en combinant exigences réglementaires, certification des colis, inspections et système de contrôle.",
    },
  ],
  sanction:
    "Les non-conformités relevées en inspection peuvent faire l'objet de sanctions administratives ou pénales.",
  faqTitle: "Infos pratiques",
  faq: [
    "Que se passe-t-il en cas de non-conformité ?",
    "Comment se déroule une inspection ?",
    "Quels types d'inspections sont réalisées ?",
  ],
};

const EN: typeof FR = {
  hero: "CONTROL",
  title: "Inspection",
  subtitle:
    "Verifying that every user meets their radiation protection and nuclear safety responsibilities.",
  intro:
    "ARSN's oversight of practices and activities involving ionising radiation aims to verify that all users fully assume their responsibilities and obligations regarding radiation protection and safety. This control is carried out partly through on-site inspections and partly through the review of files, documents and information provided by notifiers and licence applicants.",
  scope:
    "During inspections, ARSN examines sources, associated equipment, facility layout, workers, work methods and organisation. Control applies to every stage of the facility life-cycle — from design, construction, commissioning, operation, permanent shutdown to decommissioning — and to the life-cycle of sources, from import, transport, holding, use, transfer, storage to return to the supplier.",
  domains: [
    {
      t: "Medical field",
      d: "Nuclear techniques contribute to prevention, diagnosis and treatment, particularly of non-communicable diseases such as cancer and cardiovascular diseases. The use of ionising radiation sources exposes staff and patients through external irradiation and sometimes internal contamination. ARSN checks that staff exposure is kept as low as possible: protective equipment, work organisation and training. For patients, vigilance focuses on delivering the right dose, to the right patient, for the right examination or treatment.",
    },
    {
      t: "Industrial field",
      d: "Oversight of industrial activities such as nuclear gauges, industrial radiography, power generation or research facilities is a core ARSN mission. Inspection verifies that the operator fully assumes their responsibility and complies with regulatory requirements. It is proportionate to the level of risk and to how the operator meets its responsibilities. It may be pre-announced by letter or unannounced.",
    },
    {
      t: "Transport of radioactive materials",
      d: "Increased use of radioactive substances in industry, medicine and agriculture drives more frequent shipments and larger volumes. ARSN oversees transport safety and security by combining regulatory requirements, package certification, inspections and a control system.",
    },
  ],
  sanction:
    "Non-conformities identified during inspection may lead to administrative or criminal sanctions.",
  faqTitle: "Quick facts",
  faq: [
    "What happens in case of non-conformity?",
    "How does an inspection unfold?",
    "What types of inspections are carried out?",
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
          <p className="text-lg text-muted-foreground leading-relaxed">{c.intro}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{c.scope}</p>
        </section>

        <section className="space-y-6">
          {c.domains.map((d) => (
            <article key={d.t} className="p-8 bg-white ring-1 ring-black/5 flex gap-4 items-start">
              <ShieldCheck className="w-5 h-5 text-arsn-green shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-serif font-bold mb-3">{d.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.d}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="p-6 border-l-4 border-arsn-yellow bg-white ring-1 ring-black/5">
          <p className="text-sm font-medium">{c.sanction}</p>
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
      </div>
    </>
  );
}
