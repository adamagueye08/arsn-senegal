import { Link, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

type NavLeaf = { to: string; key: string };
type NavItem = NavLeaf | { label: string; children: NavLeaf[] };

function useNavItems(): NavItem[] {
  const { t } = useLang();
  return [
    { to: "/l-arsn", key: "nav.arsn" },
    { to: "/reglementation", key: "nav.regulation" },
    { to: "/autorisation", key: "nav.authorization" },
    { to: "/inspection", key: "nav.inspection" },
    {
      label: t("nav.services"),
      children: [
        { to: "/espace-demandeur", key: "nav.account" },
        { to: "/dosimetrie", key: "nav.dosimetry" },
      ],
    },
    {
      label: t("nav.publications"),
      children: [
        { to: "/information", key: "nav.articles" },
        { to: "/videotheque", key: "nav.videotheque" },
      ],
    },
    { to: "/contact", key: "nav.contact" },
  ];
}

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const NAV = useNavItems();

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
              src="/LOGO-ARSN-1-2048x645.png"
              alt="Logo ARSN"
              width={160}
              height={56}
              className="h-12 md:h-14 w-auto object-contain"
            />
            <span className="sr-only">ARSN — Autorité Sénégalaise de Radioprotection et de Sûreté Nucléaire</span>
          </Link>

          <div className="hidden xl:flex items-center gap-6">
            {NAV.map((item) => {
              if ("children" in item) {
                const active = item.children.some((c) => pathname.startsWith(c.to));
                return (
                  <div key={item.label} className="relative group">
                    <button
                      className={
                        "flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wide transition-colors " +
                        (active ? "border-b-2 border-foreground pb-1" : "hover:text-arsn-green")
                      }
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                      <div className="bg-white ring-1 ring-black/5 shadow-lg rounded-lg py-2 min-w-[200px]">
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            className={
                              "block px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition-colors " +
                              (pathname.startsWith(c.to)
                                ? "text-arsn-green bg-arsn-green/5"
                                : "hover:bg-secondary/60 hover:text-arsn-green")
                            }
                          >
                            {t(c.key)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "text-[12px] font-semibold uppercase tracking-wide transition-colors " +
                    (active ? "border-b-2 border-foreground pb-1" : "hover:text-arsn-green")
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
                if ("children" in item) {
                  const subOpen = mobileSubOpen === item.label;
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => setMobileSubOpen(subOpen ? null : item.label)}
                        className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold uppercase tracking-wide rounded hover:bg-black/5"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {subOpen && (
                        <div className="pl-4 flex flex-col gap-1 animate-reveal">
                          {item.children.map((c) => {
                            const active = pathname.startsWith(c.to);
                            return (
                              <Link
                                key={c.to}
                                to={c.to}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileSubOpen(null);
                                }}
                                className={
                                  "px-3 py-2.5 text-sm font-medium rounded " +
                                  (active ? "bg-foreground text-white" : "hover:bg-black/5")
                                }
                              >
                                {t(c.key)}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                const active = pathname.startsWith(item.to);
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
