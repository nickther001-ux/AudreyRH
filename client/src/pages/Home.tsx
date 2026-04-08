import { Link } from "wouter";
import { ArrowRight, Users, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

import photo1 from "@assets/stock_images/latina_woman_portrait_2.jpg";
import photo2 from "@assets/stock_images/diverse_newcomers_1.jpg";
import photo3 from "@assets/stock_images/african_man_portrait_1.jpg";
import photo4 from "@assets/stock_images/immigrant_woman_hijab_1.jpg";

const BUSINESS_PHOTO = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80";

const MOSAIC = [photo1, photo2, photo3, photo4];

const panelContent = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-foreground">
      <Navbar />

      {/* ── Portal: two full-height panels ── */}
      <div className="flex-1 flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 60px)" }}>

        {/* ── PARTICULIERS panel — photo mosaic ── */}
        <Link
          href="/individuals"
          className="group relative flex-1 flex flex-col overflow-hidden cursor-pointer min-h-[50vh] lg:min-h-0"
          data-testid="link-portal-individuals"
        >
          {/* Top: 2×2 photo mosaic (fills ~60% of panel height) */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {MOSAIC.map((src, i) => (
              <motion.div
                key={i}
                className="overflow-hidden"
                initial={{ scale: 1.12, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.3, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: i === 2 ? "center 20%" : "center top" }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Thin gap lines between mosaic cells */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(to right, transparent calc(50% - 1px), rgba(0,0,0,0.6) calc(50% - 1px), rgba(0,0,0,0.6) calc(50% + 1px), transparent calc(50% + 1px)), linear-gradient(to bottom, transparent calc(50% - 1px), rgba(0,0,0,0.6) calc(50% - 1px), rgba(0,0,0,0.6) calc(50% + 1px), transparent calc(50% + 1px))" }}
          />

          {/* Light scrim — just enough to read text, not black out photos */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/20 transition-all duration-500" />

          <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-white/10 z-10" />

          {/* Text content — pinned to bottom */}
          <motion.div
            className="relative z-10 mt-auto p-10 lg:p-16"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={panelContent} className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 mb-8">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">{t("portal.individuals.label")}</span>
            </motion.div>
            <motion.h2 variants={panelContent} className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold text-white leading-[1] tracking-tighter mb-5">
              {t("portal.individuals.title")}
            </motion.h2>
            <motion.p variants={panelContent} className="text-white/80 text-[15px] leading-relaxed max-w-xs mb-10">
              {t("portal.individuals.desc")}
            </motion.p>
            <motion.div variants={panelContent} className="inline-flex items-center gap-3 text-white font-semibold text-[13px] uppercase tracking-wider border-b border-white/40 pb-1 group-hover:gap-5 group-hover:border-white transition-all duration-300">
              {t("portal.individuals.cta")}
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </Link>

        {/* ── ENTREPRISES panel ── */}
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
