import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { DownloadButton } from "@/components/site/DownloadButton";
import { DOCS } from "@/lib/documents";
import { FileText } from "lucide-react";
import newsConference from "@/assets/news-conference.jpg";
import newsVisit from "@/assets/news-visit.jpg";
import newsRadiology from "@/assets/news-radiology.jpg";


export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Information — Actualités ARSN" },
      {
        name: "description",
        content: "Actualités, communiqués officiels et événements de l'ARSN Sénégal.",
      },
      { property: "og:title", content: "Actualités — ARSN" },
      { property: "og:description", content: "Suivez l'activité de l'ARSN Sénégal." },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "ACTUALITÉS",
  title: "Information",
  subtitle: "Actualités, communiqués et événements de l'ARSN.",
  items: [
    {
      cat: "Conférence internationale",
      date: "Juillet 2026",
      img: newsConference,
      t: "La conférence internationale sur les systèmes de réglementation nucléaire et radiologique",
      d: "Retour sur la participation de l'ARSN à la conférence internationale rassemblant les autorités de réglementation nucléaire et radiologique.",
    },
    {
      cat: "Coopération",
      date: "Juillet 2026",
      img: newsVisit,
      t: "Visite du CICO à l'ARSN : vers une coopération renforcée en matière de sûreté, de sécurité nucléaire et de protection nationale",
      d: "Rencontre stratégique visant à renforcer la coopération entre l'ARSN et le CICO sur la sûreté, la sécurité nucléaire et la protection nationale.",
    },
    {
      cat: "AIEA",
      date: "Avril 2026",
      img: newsRadiology,
      t: "Mission ORPAS de l'AIEA au Sénégal : évaluation indépendante de la radioprotection des travailleurs",
      d: "Une mission d'experts de l'AIEA a mené au Sénégal une évaluation indépendante du programme de radioprotection des travailleurs.",
    },
    {
      cat: "Rencontre",
      date: "Avril 2026",
      img: newsConference,
      t: "Rencontre avec l'Association Sénégalaise des Professionnels de l'Équipement (ASPEM)",
      d: "L'ARSN a échangé avec l'ASPEM sur la conformité réglementaire des équipements et les responsabilités des professionnels du secteur.",
    },
    {
      cat: "Environnement",
      date: "Avril 2026",
      img: newsRadiology,
      t: "Le défi radiologique au Sénégal entre exploitation minière et protection sanitaire",
      d: "Analyse des enjeux radiologiques liés à l'exploitation minière et des mesures nécessaires à la protection sanitaire des populations.",
    },
    {
      cat: "Stratégie",
      date: "Avril 2026",
      img: newsVisit,
      t: "Le nucléaire civil : un levier discret mais stratégique pour le Sénégal",
      d: "Contribution soulignant le rôle stratégique du nucléaire civil dans la santé, l'énergie, l'agriculture et l'industrie au Sénégal.",
    },
    {
      cat: "Coopération",
      date: "Mars 2025",
      img: newsConference,
      t: "Renforcement des capacités en médecine nucléaire : un atelier clé pour l'ARSN",
      d: "Atelier consacré au renforcement des capacités nationales dans le domaine de la médecine nucléaire.",
    },
    {
      cat: "International",
      date: "Mars 2025",
      img: newsVisit,
      t: "Atelier national sur la réglementation de l'exploitation de l'Uranium, Dakar — Sénégal",
      d: "Atelier national réunissant les parties prenantes autour de la réglementation de l'exploitation de l'uranium.",
    },
  ],
};

const EN: typeof FR = {
  hero: "NEWS",
  title: "Information",
  subtitle: "News, announcements and events from ARSN.",
  items: [
    {
      cat: "International conference",
      date: "July 2026",
      img: newsConference,
      t: "International conference on nuclear and radiological regulatory systems",
      d: "ARSN's participation in the international conference bringing together nuclear and radiological regulators.",
    },
    {
      cat: "Cooperation",
      date: "July 2026",
      img: newsVisit,
      t: "CICO visit to ARSN: towards strengthened cooperation on safety, nuclear security and national protection",
      d: "Strategic meeting to strengthen cooperation between ARSN and CICO on safety, nuclear security and national protection.",
    },
    {
      cat: "IAEA",
      date: "April 2026",
      img: newsRadiology,
      t: "IAEA ORPAS mission to Senegal: independent evaluation of worker radiation protection",
      d: "An IAEA expert mission conducted an independent evaluation of the worker radiation protection programme in Senegal.",
    },
    {
      cat: "Meeting",
      date: "April 2026",
      img: newsConference,
      t: "Meeting with the Senegalese Association of Equipment Professionals (ASPEM)",
      d: "ARSN discussed with ASPEM the regulatory compliance of equipment and the responsibilities of sector professionals.",
    },
    {
      cat: "Environment",
      date: "April 2026",
      img: newsRadiology,
      t: "The radiological challenge in Senegal between mining and health protection",
      d: "Analysis of radiological challenges linked to mining and the measures needed to protect public health.",
    },
    {
      cat: "Strategy",
      date: "April 2026",
      img: newsVisit,
      t: "Civil nuclear: a discreet but strategic lever for Senegal",
      d: "Contribution highlighting the strategic role of civil nuclear in health, energy, agriculture and industry in Senegal.",
    },
    {
      cat: "Cooperation",
      date: "March 2025",
      img: newsConference,
      t: "Capacity building in nuclear medicine: a key workshop for ARSN",
      d: "Workshop dedicated to strengthening national capacities in the field of nuclear medicine.",
    },
    {
      cat: "International",
      date: "March 2025",
      img: newsVisit,
      t: "National workshop on uranium mining regulation, Dakar — Senegal",
      d: "National workshop bringing together stakeholders around the regulation of uranium mining.",
    },
  ],
};

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {c.items.map((item) => (
          <article key={item.t} className="space-y-4 group cursor-pointer">
            <div className="w-full aspect-video overflow-hidden rounded-sm bg-slate-100">
              <img
                src={item.img}
                alt=""
                loading="lazy"
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              <span className="text-arsn-green">{item.cat}</span>
              <span>·</span>
              <span>{item.date}</span>
            </div>
            <h5 className="text-lg font-bold leading-tight group-hover:text-arsn-green transition-colors">
              {item.t}
            </h5>
            <p className="text-sm text-muted-foreground">{item.d}</p>
          </article>
        ))}
      </div>

      {/* Publications & documents officiels */}
      <div className="border-t border-border bg-white/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <h2 className="text-2xl font-serif font-bold mb-2">
            {lang === "fr" ? "Publications & documents officiels" : "Publications & official documents"}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {lang === "fr"
              ? "Rapports, guides et formulaires téléchargeables au format PDF."
              : "Reports, guides and forms available as PDF downloads."}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              DOCS.rapportAnnuel,
              DOCS.rapportInspection,
              DOCS.guideDosimetrie,
              DOCS.formImport,
              DOCS.formExport,
              DOCS.formTransport,
            ].map((doc) => (
              <div key={doc.filename} className="p-6 bg-white ring-1 ring-black/5 hover:ring-arsn-blue/40 transition-all flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-arsn-blue/10 text-arsn-blue grid place-items-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold leading-snug">{doc.label}</h3>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">
                      PDF · {(doc.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <DownloadButton doc={doc}>
                  {lang === "fr" ? "Télécharger" : "Download"}
                </DownloadButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

