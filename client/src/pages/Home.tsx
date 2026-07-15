import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Building2, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

const SOLUTIONS_BG = "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=1600&q=80";
const BUSINESS_PHOTO = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80";

const panelContent = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

export default function Home() {
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const [, navigate] = useLocation();

  const rotatingWords = isFr
    ? ["accélère", "propulse", "transforme"]
    : ["accelerates", "catapults", "transforms"];

  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [rotatingWords.length]);

  return (
    <div className="min-h-screen flex flex-col bg-foreground">
      <Navbar />

      {/* ── Portal: two full-height panels ── */}
      <div className="flex-1 flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 60px)" }}>

        {/* ── ENTREPRISES panel — LEFT ── */}
        <Link
          href="/business"
          className="group relative flex-1 flex flex-col justify-end p-10 lg:p-16 overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-business"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${BUSINESS_PHOTO})` }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            whileHover={{ scale: 1.04 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500" />

          <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-white/10 z-10" />

          <motion.div
            className="relative z-10"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={panelContent} className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8">
              <Building2 className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">{t("portal.business.label")}</span>
            </motion.div>
            <motion.h2 variants={panelContent} className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold text-white leading-[1] tracking-tighter mb-5">
              {t("portal.business.title")}
            </motion.h2>
            <motion.p variants={panelContent} className="text-white/75 text-[15px] leading-relaxed max-w-xs mb-10">
              {t("portal.business.desc")}
            </motion.p>
            <motion.div variants={panelContent} className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300">
              {t("portal.business.cta")}
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </Link>

        {/* ── SOLUTIONS POUR CANDIDATS RH panel — RIGHT ── */}
        <div
          onClick={() => navigate("/solutions-rh")}
          className="group relative flex-1 flex flex-col justify-end p-10 lg:p-16 overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-individuals"
        >
          <motion.div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${SOLUTIONS_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.03 }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 100%)",
            }}
          />

          <motion.div
            className="relative z-10"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={panelContent} className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8">
              <Banknote className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">
                {isFr ? "Financement et Subvention" : "Funding & Grants"}
              </span>
            </motion.div>

            <motion.h2
              variants={panelContent}
              className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold text-white leading-[1] tracking-tighter mb-5"
            >
              {isFr ? "Le financement qui" : "The funding that"}{" "}
              <span
                key={wordIndex}
                className="inline-block text-[#93c5fd] animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {rotatingWords[wordIndex]}
              </span>
              <br />
              {isFr ? "votre projet" : "your project"}<span className="text-orange-400">.</span>
            </motion.h2>

            <motion.p variants={panelContent} className="text-white/75 text-[15px] leading-relaxed max-w-xs mb-10">
              {isFr
                ? "Ingénierie Financière"
                : "Financial Engineering"}
            </motion.p>

            <motion.div variants={panelContent} className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300">
              {isFr ? "Accéder aux subventions" : "Explore Funding"}
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Footer strip ── */}
      <motion.div
        className="bg-foreground border-t border-white/10 px-8 py-4 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <p className="text-[11px] text-white/30 uppercase tracking-widest">
          AudreyRH · CRIA · Montréal
        </p>
        <p className="text-[11px] text-white/20">
          © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
