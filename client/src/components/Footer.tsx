import { Link } from "wouter";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#1e3a5f] text-white pt-20 pb-10" data-testid="footer">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <h3 className="text-3xl font-bold tracking-tight">
              <span className="text-white">Audrey</span>
              <span style={{ color: "#2563eb" }}>RH</span>
              <span className="text-accent">.</span>
            </h3>
            <p className="text-white/55 max-w-sm leading-relaxed text-base">
              Conseillère en relations industrielles agréée (CRIA). Experte en stratégie d'employabilité pour les nouveaux arrivants au Canada.
            </p>
            <div className="flex gap-3 pt-2 flex-wrap">
              <a
                href="https://www.linkedin.com/in/audrey-mondesir-cria-49a8b31bb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-200"
                data-testid="link-linkedin"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@tacoach.rh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-200"
                data-testid="link-tiktok"
              >
                <SiTiktok size={18} />
              </a>
              <a
                href="mailto:info@audreyRH.com"
                className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center hover:bg-primary hover:scale-105 transition-all duration-200"
                data-testid="link-email-icon"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-widest">{t("footer.navigation")}</h4>
            <ul className="space-y-3">
              {[
                { href: "/",            label: t("nav.home"),        testid: "link-footer-home" },
                { href: "/individuals", label: t("nav.individuals"), testid: "link-footer-individuals" },
                { href: "/business",    label: t("nav.business"),    testid: "link-footer-business" },
                { href: "/grants",      label: t("nav.grants"),      testid: "link-footer-grants" },
                { href: "/contact",     label: t("nav.contact"),     testid: "link-footer-contact" },
                { href: "/book",        label: t("nav.book"),        testid: "link-footer-book" },
                { href: "/terms",       label: t("footer.terms"),    testid: "link-footer-terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 hover:text-primary transition-colors text-sm" data-testid={l.testid}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-widest">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="flex-shrink-0 text-primary" />
                Montréal, Québec
              </li>
              <li>
                <a
                  href="mailto:info@audreyRH.com"
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-email"
                >
                  info@audreyRH.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col items-center gap-2 text-xs text-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <p data-testid="text-copyright">
              &copy; {new Date().getFullYear()} AudreyRH<span className="text-accent">.</span> {t("footer.rights")}
            </p>
            <p>Consultation en relations industrielles</p>
          </div>
          <p>
            Website built by{" "}
            <a href="https://ntwebux.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors underline underline-offset-2">
              ntwebux.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
