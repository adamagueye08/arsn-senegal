import { Link, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import arsnLogo from "@/assets/arsn-logo.png.asset.json";


const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/l-arsn", key: "nav.arsn" },
  { to: "/reglementation", key: "nav.regulation" },
  { to: "/autorisation", key: "nav.authorization" },
  { to: "/inspection", key: "nav.inspection" },
  { to: "/dosimetrie", key: "nav.dosimetry" },
  { to: "/information", key: "nav.information" },
  { to: "/videotheque", key: "nav.videotheque" },
  { to: "/contact", key: "nav.contact" },
] as const;

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Institutional top bar */}
      <div className="bg-foreground text-white/90 py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center text-[11px] font-mono tracking-wider">
          <div className="hidden md:flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 bg-arsn-green rounded-full" /> {t("topbar.location")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 bg-arsn-yellow rounded-full" /> {t("topbar.phone")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 bg-arsn-red rounded-full" /> {t("topbar.email")}
            </span>
          </div>
          <span className="md:hidden flex items-center gap-2">
            <span className="w-1 h-1 bg-arsn-green rounded-full" /> ARSN — DAKAR
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setLang("fr")}
              className={
                lang === "fr" ? "text-white" : "text-white/40 hover:text-white transition-colors"
              }
            >
              FRANÇAIS
            </button>
            <span className="text-white/20">/</span>
            <button
              onClick={() => setLang("en")}
              className={
                lang === "en" ? "text-white" : "text-white/40 hover:text-white transition-colors"
              }
            >
              ENGLISH
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={arsnLogo.url}
              alt="Logo ARSN"
              width={160}
              height={56}
              className="h-12 md:h-14 w-auto object-contain"
            />
            <span className="sr-only">ARSN — Autorité Sénégalaise de Radioprotection et de Sûreté Nucléaire</span>
          </Link>


          <div className="hidden xl:flex items-center gap-6">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "text-[12px] font-semibold uppercase tracking-wide transition-colors " +
                    (active
                      ? "border-b-2 border-foreground pb-1"
                      : "hover:text-arsn-green")
                  }
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>

          <button
            className="xl:hidden p-2 hover:bg-black/5 rounded"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="xl:hidden border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV.map((item) => {
                const active =
                  item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={
                      "px-3 py-3 text-sm font-semibold uppercase tracking-wide rounded " +
                      (active ? "bg-foreground text-white" : "hover:bg-black/5")
                    }
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
