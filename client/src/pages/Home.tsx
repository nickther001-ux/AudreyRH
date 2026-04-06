import { Link } from "wouter";
import { ArrowRight, Users, Building2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

const INDIVIDUAL_PHOTO = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80";
const BUSINESS_PHOTO   = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-foreground">
      <Navbar />

      {/* ── Portal: two full-height panels ── */}
      <div className="flex-1 flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 60px)" }}>

        {/* ── PARTICULIERS panel ── */}
        <Link
          href="/individuals"
          className="group relative flex-1 flex flex-col justify-end p-10 lg:p-16 overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-individuals"
        >
          {/* Photo background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${INDIVIDUAL_PHOTO})` }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500" />
          {/* Thin right divider on desktop */}
          <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-white/10 z-10" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">{t("portal.individuals.label")}</span>
            </div>
            <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold text-white leading-[1] tracking-tighter mb-5">
              {t("portal.individuals.title")}
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed max-w-xs mb-10">
              {t("portal.individuals.desc")}
            </p>
            <div className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300">
              {t("portal.individuals.cta")}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* ── ENTREPRISES panel ── */}
        <Link
          href="/business"
          className="group relative flex-1 flex flex-col justify-end p-10 lg:p-16 overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-business"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${BUSINESS_PHOTO})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8">
              <Building2 className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">{t("portal.business.label")}</span>
            </div>
            <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold text-white leading-[1] tracking-tighter mb-5">
              {t("portal.business.title")}
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed max-w-xs mb-10">
              {t("portal.business.desc")}
            </p>
            <div className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300">
              {t("portal.business.cta")}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* ── Footer strip ── */}
      <div className="bg-foreground border-t border-white/10 px-8 py-4 flex items-center justify-between">
        <p className="text-[11px] text-white/30 uppercase tracking-widest">
          AudreyRH · CRIA · Montréal
        </p>
        <p className="text-[11px] text-white/20">
          © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
