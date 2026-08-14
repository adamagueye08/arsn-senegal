import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { ArrowRight, FileText, Download, ShieldAlert, ClipboardList, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import heroLab from "@/assets/hero-lab.jpg";
import newsConference from "@/assets/news-conference.jpg";
import newsVisit from "@/assets/news-visit.jpg";
import newsRadiology from "@/assets/news-radiology.jpg";
import { NewsSlider } from "@/components/site/NewsSlider";
import { DOCS, formatSize, type DocMeta } from "@/lib/documents";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — ARSN Sénégal" },
      {
        name: "description",
        content:
          "Portail officiel de l'Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires : actualités, avis, décisions et rapports.",
      },
      { property: "og:title", content: "Accueil — ARSN Sénégal" },
      {
        property: "og:description",
        content:
          "Portail officiel de l'Autorité Sénégalaise de Radioprotection, de Sûreté et de Sécurité Nucléaires : actualités, avis, décisions et rapports.",
      },
    ],
  }),
  component: Home,
});

const TAXONOMY = [
  { n: "01", to: "/reglementation", key: "nav.regulation", descKey: "tax.regulation.desc" },
  { n: "02", to: "/inspection", key: "nav.inspection", descKey: "tax.inspection.desc" },
  { n: "03", to: "/dosimetrie", key: "nav.dosimetry", descKey: "tax.dosimetry.desc" },
  { n: "04", to: "/videotheque", key: "nav.videotheque", descKey: "tax.videotheque.desc" },
] as const;

function Home() {
  const { t } = useLang();

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Hero */}
        <section className="relative grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24 pt-4 md:pt-8">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-7">
              <span
                className="animate-reveal inline-block px-3 py-1 bg-arsn-green/10 text-arsn-green text-[10px] font-bold tracking-widest uppercase rounded"
                style={{ animationDelay: "0ms" }}
              >
                {t("home.hero.tag")}
              </span>
              <h2
                className="animate-reveal text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] text-balance"
                style={{ animationDelay: "80ms" }}
              >
                {t("home.hero.title.1")}{" "}
                <span className="italic text-arsn-blue">{t("home.hero.title.emph")}</span>{" "}
                {t("home.hero.title.2")}
              </h2>
              <p
                className="animate-reveal text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty"
                style={{ animationDelay: "160ms" }}
              >
                {t("home.hero.desc")}
              </p>

              {/* 3 boutons principaux */}
              <div
                className="animate-reveal flex flex-wrap gap-3 pt-2"
                style={{ animationDelay: "260ms" }}
              >
                <Link
                  to="/espace-demandeur"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-arsn-blue text-white font-semibold text-sm rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-arsn-blue/20 transition-all duration-200 active:scale-[0.98]"
                >
                  <ClipboardList className="w-4 h-4" />
                  {t("nav.hero.reqAuth")}
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white ring-1 ring-arsn-red/30 text-arsn-red font-semibold text-sm rounded-lg hover:bg-arsn-red/5 transition-all duration-200 active:scale-[0.98]"
                >
                  <ShieldAlert className="w-4 h-4" />
                  {t("nav.hero.reportIncident")}
                </Link>
                <FormsDownloadButton />
              </div>
            </div>
          </div>
          <div
            className="animate-reveal lg:col-span-5"
            style={{ animationDelay: "120ms" }}
          >
            <img
              src={heroLab}
              alt="Laboratoire scientifique ARSN"
              width={800}
              height={1000}
              className="w-full aspect-[4/5] object-cover ring-1 ring-black/5 rounded-lg shadow-xl"
            />
          </div>
        </section>
        {/* Actualités défilantes */}
        <NewsSlider />


        {/* Quick Access */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 md:mb-20 animate-reveal">
          {TAXONOMY.map((item) => (
            <Link
              key={item.n}
              to={item.to}
              className="p-8 bg-white ring-1 ring-black/5 hover:ring-arsn-green/40 transition-all group block"
            >
              <span className="block font-mono text-[10px] text-muted-foreground mb-6">
                {item.n} // {t("home.taxonomy.section")}
              </span>
              <h3 className="text-lg font-bold mb-2">{t(item.key)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
              <ArrowRight className="w-4 h-4 mt-6 text-muted-foreground group-hover:text-arsn-green group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </section>

        {/* News + Sidebar */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 animate-reveal">
          {/* News */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
              <h4 className="text-xl font-serif font-bold">{t("home.news.title")}</h4>
              <Link
                to="/information"
                className="text-[11px] font-bold uppercase tracking-widest text-arsn-green hover:underline"
              >
                {t("home.news.viewAll")}
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <NewsCard image={newsConference} n={1} />
              <NewsCard image={newsVisit} n={2} />
              <NewsCard image={newsRadiology} n={3} />
              <NewsCard image={newsConference} n={4} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-foreground text-white p-8 rounded-sm">
              <h4 className="text-sm font-mono uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">
                {t("home.decisions.title")}
              </h4>
              <div className="space-y-6">
                {["dec.1", "dec.2"].map((k) => (
                  <Link
                    to="/information"
                    key={k}
                    className="group cursor-pointer block"
                  >
                    <span className="text-[10px] text-white/40 block mb-1 font-mono">
                      {t(`${k}.ref`)}
                    </span>
                    <p className="text-sm font-medium group-hover:text-arsn-yellow transition-colors">
                      {t(`${k}.text`)}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                to="/information"
                className="w-full mt-8 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-foreground transition-all inline-flex items-center justify-center"
              >
                {t("home.decisions.cta")}
              </Link>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-mono uppercase tracking-[0.2em] border-b border-border pb-4">
                {t("home.downloads.title")}
              </h4>
              {(
                [
                  { k: "rep.1", doc: DOCS.rapportAnnuel },
                  { k: "rep.2", doc: DOCS.rapportInspection },
                ] as { k: string; doc: DocMeta }[]
              ).map(({ k, doc }) => (
                <a
                  key={k}
                  href={doc.url}
                  download={doc.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    toast.success("Téléchargement lancé", {
                      description: `${doc.label} · ${formatSize(doc.size)}`,
                    })
                  }
                  className="flex items-start gap-4 p-4 border border-border hover:bg-white hover:border-arsn-blue/40 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-arsn-blue/10 text-arsn-blue flex items-center justify-center shrink-0 group-hover:bg-arsn-blue group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h6 className="text-xs font-bold">{t(`${k}.title`)}</h6>
                    <p className="text-[10px] text-muted-foreground">
                      {t(`${k}.meta`)} · PDF · {formatSize(doc.size)}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-arsn-blue shrink-0" />
                </a>
              ))}

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FormsDownloadButton() {
  const [open, setOpen] = useState(false);
  const forms: { key: string; doc: DocMeta }[] = [
    { key: "Transport", doc: DOCS.formTransport },
    { key: "Détention", doc: DOCS.formDetention },
    { key: "Exportation", doc: DOCS.formExport },
    { key: "Importation", doc: DOCS.formImport },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white ring-1 ring-border text-foreground font-semibold text-sm rounded-lg hover:bg-secondary/50 transition-all duration-200 active:scale-[0.98]"
      >
        <Download className="w-4 h-4" />
        Télécharger un formulaire
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 bg-white ring-1 ring-black/5 shadow-lg rounded-lg py-2 min-w-[260px] animate-reveal">
            {forms.map(({ key, doc }) => (
              <a
                key={key}
                href={doc.url}
                download={doc.filename}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setOpen(false);
                  toast.success("Téléchargement lancé", { description: `${doc.label} · ${formatSize(doc.size)}` });
                }}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors duration-150"
              >
                <span>{key}</span>
                <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NewsCard({ image, n }: { image: string; n: 1 | 2 | 3 | 4 }) {
  const { t } = useLang();
  return (
    <Link to="/information" className="block">
      <article className="space-y-4 group cursor-pointer">
        <div className="w-full aspect-video overflow-hidden rounded-sm bg-slate-100">
          <img
            src={image}
            alt=""
            loading="lazy"
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <span className="block font-mono text-[10px] text-muted-foreground">{t(`news.${n}.date`)}</span>
        <h5 className="text-lg font-bold leading-tight group-hover:text-arsn-green transition-colors">
          {t(`news.${n}.title`)}
        </h5>
        <p className="text-sm text-muted-foreground">{t(`news.${n}.excerpt`)}</p>
      </article>
    </Link>
  );
}
