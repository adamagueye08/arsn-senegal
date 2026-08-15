import { useLang } from "@/lib/i18n";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="bg-white border-t border-border mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src="/LOGO-ARSN-1-2048x645.png"
                alt="Logo ARSN"
                width={220}
                height={72}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
              {t("footer.about")}
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 bg-slate-100 rounded-full grid place-items-center hover:bg-foreground hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 bg-slate-100 rounded-full grid place-items-center hover:bg-foreground hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 bg-slate-100 rounded-full grid place-items-center hover:bg-foreground hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              {t("footer.partners")}
            </h5>
            <ul className="space-y-4 text-xs font-medium text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">IAEA (AIEA) — Vienne</li>
              <li className="hover:text-foreground cursor-pointer">ASN — France</li>
              <li className="hover:text-foreground cursor-pointer">NRC — USA</li>
              <li className="hover:text-foreground cursor-pointer">FNRBA — Afrique</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              {t("footer.contact")}
            </h5>
            <div className="text-xs text-muted-foreground leading-relaxed">
              L/14 Scat Urbam Mariste
              <br />
              Espace Résidence Hann, Dakar
              <br />
              +221 33 832 55 50
              <br />
              info@arsn.gouv.sn
              <span className="block mt-4 font-bold text-foreground">{t("footer.hours.days")}</span>
              {t("footer.hours.time")}
            </div>
          </div>
        </div>

        <div className="mb-16 ring-1 ring-black/5 overflow-hidden rounded-sm h-56">
          <iframe
            title="Localisation du siège de l'ARSN"
            src="https://www.google.com/maps?q=Espace+R%C3%A9sidence+Hann,+Scat+Urbam+Maristes,+Dakar,+S%C3%A9n%C3%A9gal&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <span>{t("footer.rights")}</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground">
              {t("footer.legal")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("footer.sitemap")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("footer.a11y")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
