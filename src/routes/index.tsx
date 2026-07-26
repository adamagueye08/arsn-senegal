import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { ArrowRight, FileText } from "lucide-react";
import heroLab from "@/assets/hero-lab.jpg";
import newsConference from "@/assets/news-conference.jpg";
import newsVisit from "@/assets/news-visit.jpg";
import newsRadiology from "@/assets/news-radiology.jpg";

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
        {/* Editorial Hero */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-20 animate-reveal">
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 bg-arsn-green/10 text-arsn-green text-[10px] font-bold tracking-widest uppercase rounded">
                {t("home.hero.tag")}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-balance">
                {t("home.hero.title.1")}{" "}
                <span className="italic">{t("home.hero.title.emph")}</span>{" "}
                {t("home.hero.title.2")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                {t("home.hero.desc")}
              </p>
              <div className="pt-4">
                <Link
                  to="/information"
                  className="inline-flex px-8 py-4 bg-foreground text-white font-semibold text-sm hover:bg-foreground/90 transition-all rounded-sm items-center gap-3 group"
                >
                  {t("home.hero.cta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <img
              src={heroLab}
              alt="Laboratoire scientifique ARSN"
              width={800}
              height={1000}
              className="w-full aspect-[4/5] object-cover ring-1 ring-black/5 rounded-sm"
            />
          </div>
        </section>

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
              {["rep.1", "rep.2"].map((k) => (
                <Link
                  to="/information"
                  key={k}
                  className="flex items-start gap-4 p-4 border border-border hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold">{t(`${k}.title`)}</h6>
                    <p className="text-[10px] text-muted-foreground">{t(`${k}.meta`)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
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
