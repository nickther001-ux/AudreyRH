import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Building2, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

const BUSINESS_PHOTO  = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80";
const FINANCIAL_PHOTO = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80";

const item = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11, delayChildren: 0.3 } },
};

const badgeAnim = {
  hidden: { opacity: 0, y: -14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: 0.25 } },
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

      {/* ── Portal ── */}
      <div
        className="flex-1 flex flex-col lg:flex-row"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >

        {/* ── LEFT — Entreprises ── */}
        <Link
          href="/business"
          className="group relative flex-1 flex flex-col justify-center p-10 lg:p-16 overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-business"
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${BUSINESS_PHOTO})` }}
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.03 }}
          />
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Divider */}
          <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-white/15 z-10" />

          {/* Content — badge + heading + desc + CTA centered */}
          <motion.div
            className="relative z-10"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={badgeAnim}
              className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">
                {t("portal.business.label")}
              </span>
            </motion.div>
            <motion.h2
              variants={item}
              className="text-[clamp(2.2rem,4.5vw,4rem)] font-bold text-white leading-[1.05] tracking-tighter mb-5"
            >
              {t("portal.business.title")}
            </motion.h2>
            <motion.p
              variants={item}
              className="text-white/75 text-[15px] leading-relaxed max-w-sm mb-10"
            >
              {t("portal.business.desc")}
            </motion.p>
            <motion.div
              variants={item}
              className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300"
            >
              {t("portal.business.cta")}
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </Link>

        {/* ── RIGHT — Financement & Subvention ── */}
        <div
          onClick={() => navigate("/solutions-rh")}
          className="group relative flex-1 flex flex-col justify-center p-10 lg:p-16 overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-individuals"
        >
          {/* Distinct financial/corporate background */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${FINANCIAL_PHOTO})` }}
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.03 }}
          />
          <div className="absolute inset-0 bg-[#0a1628]/70 group-hover:bg-[#0a1628]/60 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          {/* Content — badge + heading + desc + CTA centered */}
          <motion.div
            className="relative z-10"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={badgeAnim}
              className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8"
            >
              <Banknote className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">
                {isFr ? "Financement et Subvention" : "Funding & Grants"}
              </span>
            </motion.div>
            <motion.h2
              variants={item}
              className="text-[clamp(2.2rem,4.5vw,4rem)] font-bold text-white leading-[1.05] tracking-tighter mb-5"
            >
              {isFr ? "Ingénierie" : "Financial"}
              <br />
              {isFr ? "Financière" : "Engineering"}
            </motion.h2>

            <motion.p
              variants={item}
              className="text-white/75 text-[15px] leading-relaxed max-w-sm mb-10"
            >
              {isFr
                ? "Identification et rédaction de subventions, structuration du financement et accompagnement jusqu'à la réception des fonds. Service de reddition de compte offert."
                : "Grant identification and drafting, funding structuring, and full support until funds are received. Accountability reporting service included."}
            </motion.p>

            <motion.div
              variants={item}
              className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300"
            >
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
