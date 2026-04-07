import { Link } from "wouter";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award, X, Plus, Minus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp, FadeIn, Stagger, StaggerItem } from "@/lib/animations";
import audreyGuide from "@assets/FB_IMG_1767723555659_(1)_1767841722642.jpg";
import guideCvImg from "@assets/generated_images/guide_cv_resume.png";
import guideChecklistImg from "@assets/generated_images/guide_checklist.png";
import guideInterviewImg from "@assets/generated_images/guide_interview.png";

type ServiceKey = "strategy" | "credentials" | "employability" | "integration" | null;

const SERVICE_CARDS = [
  {
    key: "strategy" as const,
    icon: TrendingUp,
    // Confident Black professional man reviewing career documents
    photo: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&q=80",
    dialog: true,
  },
  {
    key: "credentials" as const,
    icon: GraduationCap,
    // South Asian woman studying / holding diploma
    photo: "https://images.unsplash.com/photo-1529220502050-f15e570c634e?w=800&q=80",
    dialog: true,
  },
  {
    key: "employability" as const,
    icon: Briefcase,
    // Black woman in professional interview setting
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    dialog: true,
  },
  {
    key: "integration" as const,
    icon: Users,
    // Diverse group networking / collaborating in office
    photo: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
    dialog: true,
  },
  {
    key: "coaching" as const,
    icon: Target,
    // Latin / Hispanic man smiling confidently
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
    dialog: false,
  },
  {
    key: "orientation" as const,
    icon: Award,
    // Middle Eastern / Arab woman professional portrait
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    dialog: false,
  },
];

const PROCESS_STEPS = [
  { num: "01", key: "process.step1" },
  { num: "02", key: "process.step2" },
  { num: "03", key: "process.step3" },
];

const TESTIMONIALS = [
  { initials: "Y.K.", name: "Youssouf K.", role: "Directeur de banque, Montréal", quote: "testimonial.1.text" },
  { initials: "J.N.", name: "Jean-Baptiste N.", role: "Soudeur, Québec",           quote: "testimonial.2.text" },
  { initials: "A.S.", name: "Aïssatou S.", role: "Analyste financière, Laval",    quote: "testimonial.3.text" },
  { initials: "F.D.", name: "Fatou D.", role: "Réceptionniste, MTL",              quote: "testimonial.4.text" },
];

const NAVY = "[#1e3a5f]";

export default function Individuals() {
  const [openDialog, setOpenDialog] = useState<ServiceKey>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const { t } = useLanguage();

  const rotatingWords = [t("hero.rotating.1"), t("hero.rotating.2"), t("hero.rotating.3")];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % 3);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const getDialogStats = (key: "strategy" | "credentials" | "employability" | "integration") => {
    const stats: Record<string, { value: string; source: string }[]> = {
      strategy:      [{ value: "42,6%", source: "MIFI 2020" },          { value: "2x",    source: "Institut du Québec 2024" }],
      credentials:   [{ value: "10%",   source: "Statistique Canada" },  { value: "14%",   source: "StatCan 2016-2021" }],
      employability: [{ value: "68%",   source: "Institut du Québec" },  { value: "3x",    source: "StatCan 2024" }],
      integration:   [{ value: "+3 pts",source: "Institut du Québec" },  { value: "4M$",   source: "Radio-Canada 2021" }],
    };
    return stats[key];
  };

  const hasInsight = (key: ServiceKey): key is "strategy" | "credentials" | "employability" =>
    key === "strategy" || key === "credentials" || key === "employability";

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Navbar />

      {/* ── Dialog Modal ── */}
      <AnimatePresence>
        {openDialog && (
          <motion.div
            key={openDialog}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenDialog(null)}
          >
            {(() => {
              const key = openDialog;
              const stats = getDialogStats(key);
              return (
                <motion.div
                  initial={{ scale: 0.95, y: 24, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.96, y: 16, opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 340 }}
                  className="bg-white max-w-2xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-foreground px-8 py-6 flex items-start justify-between flex-shrink-0">
                    <div className="pr-4">
                      <h2 className="text-2xl font-bold text-white leading-tight">{t(`dialog.${key}.title`)}</h2>
                      <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{t(`dialog.${key}.desc`)}</p>
                    </div>
                    <button
                      onClick={() => setOpenDialog(null)}
                      className="text-white/50 hover:text-white transition-colors flex-shrink-0 mt-0.5 p-1"
                      data-testid="button-close-modal"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
                    {hasInsight(key) && (
                      <div className="border-l-4 border-[#1e3a5f] bg-[#1e3a5f]/5 p-5">
                        <p className="text-slate-700 leading-relaxed text-[15px] italic">"{t(`dialog.${key}.insight`)}"</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="border border-[#1e3a5f]/10 bg-[#1e3a5f]/5 p-4 text-center">
                          <div className="text-3xl font-bold text-[#1e3a5f] mb-1">{stat.value}</div>
                          <div className="text-sm text-slate-500">{t(`dialog.${key}.stat${idx + 1}`)}</div>
                          <div className="text-xs text-slate-400 mt-2 italic">Source: {stat.source}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h1`)}</h4>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <li key={i} className="flex items-start gap-2.5 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{t(`dialog.${key}.p1.${i}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h2`)}</h4>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <li key={i} className="flex items-start gap-2.5 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{t(`dialog.${key}.p2.${i}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/60 p-5">
                      <h4 className="font-bold text-base mb-2 text-foreground">{t(`dialog.${key}.h3`)}</h4>
                      <p className="text-slate-600 leading-relaxed text-sm">{t(`dialog.${key}.text`)}</p>
                    </div>
                  </div>
                  <div className="px-8 py-5 border-t border-slate-200 bg-white flex-shrink-0 flex flex-col sm:flex-row gap-3">
                    <Link href="/book" className="flex-1">
                      <Button
                        className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12"
                        onClick={() => setOpenDialog(null)}
                        data-testid="button-modal-book"
                      >
                        {t("services.bookConsultation")}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50 rounded-none h-12"
                      onClick={() => setOpenDialog(null)}
                      data-testid="button-modal-close"
                    >
                      <X className="mr-2 w-4 h-4" />
                      Fermer / Close
                    </Button>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">

        {/* ── 1. HERO — dark, full-height, left-aligned editorial ── */}
        <section className="bg-foreground min-h-screen flex flex-col justify-end pb-24 pt-40 overflow-hidden relative" data-testid="section-hero">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1400&q=80)" }}
          />
          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } }}
          >
            <motion.p
              className="text-[11px] text-white/40 uppercase tracking-[0.22em] mb-8"
              data-testid="text-hero-badge"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {t("hero.badge")}
            </motion.p>
            <motion.h1
              className="text-[clamp(3.2rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tighter text-white mb-8 max-w-4xl"
              data-testid="text-hero-title"
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25,0.1,0.25,1] } } }}
            >
              {t("hero.title1")}<br />
              <span key={wordIndex} className="inline-block text-[#93c5fd] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {rotatingWords[wordIndex]}
              </span><span className="text-orange-400">.</span>
            </motion.h1>
            <motion.p
              className="text-white/60 text-lg max-w-xl leading-relaxed mb-12"
              data-testid="text-hero-description"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}
            >
              {t("hero.description")}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <Link href="/book" data-testid="button-hero-book">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-13 text-[13px] font-semibold tracking-wide h-12">
                  {t("hero.cta")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="#services" data-testid="button-hero-services">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {t("hero.services")}
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Stat strip */}
          <Stagger className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: t("home.stats.clients") },
              { value: "+95%", label: t("home.stats.satisfaction") },
              { value: "CRIA", label: t("home.stats.certified") },
              { value: "MTL", label: t("home.stats.location") },
            ].map((s) => (
              <StaggerItem key={s.label} variant="fadeUp">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ── 2. SERVICES — editorial photo-card grid ── */}
        <section id="services" className="py-28 bg-white" data-testid="section-services">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("services.badge")}</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-sm" data-testid="text-services-title">
                  {t("services.title")}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">{t("services.description")}</p>
              </div>
            </FadeUp>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {SERVICE_CARDS.map((svc) => {
                const Icon = svc.icon;
                return (
                  <StaggerItem key={svc.key} variant="fadeUp" className="bg-white group" data-testid={`card-service-${svc.key}`}>
                    <div className="overflow-hidden h-[220px]">
                      <img
                        src={svc.photo}
                        alt={t(`services.${svc.key}.title`)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="p-6">
                      <div className="w-10 h-10 bg-[#1e3a5f]/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <h3 className="font-bold text-foreground text-[17px] mb-2">{t(`services.${svc.key}.title`)}</h3>
                      <p className="text-muted-foreground text-[13px] leading-relaxed mb-4">{t(`services.${svc.key}.desc`)}</p>
                      {svc.dialog ? (
                        <button
                          onClick={() => setOpenDialog(svc.key as ServiceKey)}
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground uppercase tracking-wider hover:text-[#1e3a5f] transition-colors"
                          data-testid={`button-learn-more-${svc.key}`}
                        >
                          {t(`services.${svc.key}.more`)} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <Link
                          href="/book"
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground uppercase tracking-wider hover:text-[#1e3a5f] transition-colors"
                        >
                          {t(`services.${svc.key}.book` as any) || t("services.bookConsultation")} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ── 3. GUIDE — accordion on white ── */}
        <section className="bg-white py-28" data-testid="section-guide">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">

            {/* Header — two columns: text left, photo right */}
            <FadeUp className="mb-16">
              <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-black/40 uppercase tracking-[0.2em] mb-4">{t("individuals.guide.badge" as any)}</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-5">
                    {t("individuals.guide.title" as any)}<span className="text-orange-400">.</span>
                  </h2>
                  <p className="text-black/60 text-[15px] leading-relaxed max-w-md">{t("individuals.guide.subtitle" as any)}</p>
                </div>
                {/* Photo */}
                <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                  <div className="relative">
                    <img
                      src={audreyGuide}
                      alt="Audrey Mondesir, CRIA"
                      className="w-full h-72 md:h-80 object-cover object-top"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a5f] px-4 py-3">
                      <p className="text-white text-[13px] font-bold leading-tight">Audrey Mondesir</p>
                      <p className="text-white/55 text-[11px] uppercase tracking-[0.1em]">CRIA · Conseillère agréée</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Accordion items */}
            <div className="border-t border-black/10">

              {([
                {
                  idx: 1,
                  image: guideCvImg,
                  badgeKey: "individuals.guide.resume.badge",
                  titleKey: "individuals.guide.resume.title",
                  subtitleKey: "individuals.guide.resume.subtitle",
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8 mt-8">
                      {([1,2,3,4,5,6,7] as const).map((n) => (
                        <div key={n} className="bg-white p-7 hover:bg-black/3 transition-colors">
                          <p className="text-[2.2rem] font-black text-black/8 leading-none mb-3 select-none">0{n}</p>
                          <h4 className="font-bold text-black text-[14px] mb-2">{t(`individuals.guide.resume.s${n}.title` as any)}</h4>
                          <p className="text-black/55 text-[13px] leading-relaxed">{t(`individuals.guide.resume.s${n}.desc` as any)}</p>
                        </div>
                      ))}
                      <div className="bg-[#1e3a5f] p-7 flex flex-col justify-center">
                        <p className="text-white/60 text-[11px] uppercase tracking-[0.15em] mb-3 font-semibold">Conseil AudreyRH</p>
                        <p className="text-white text-[14px] leading-relaxed italic">"{t("individuals.guide.resume.tip" as any)}"</p>
                      </div>
                    </div>
                  ),
                },
                {
                  idx: 2,
                  image: guideChecklistImg,
                  badgeKey: "individuals.guide.dos.badge",
                  titleKey: "individuals.guide.dos.title",
                  subtitleKey: "individuals.guide.dos.subtitle",
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8 mt-8">
                      {/* DO */}
                      <div className="bg-white p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/10">
                          <span className="w-6 h-6 flex items-center justify-center border border-black flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <span className="font-bold text-black text-[13px] uppercase tracking-[0.15em]">{t("individuals.guide.dos.do.label" as any)}</span>
                        </div>
                        <ul className="space-y-3.5">
                          {([1,2,3,4,5,6,7,8] as const).map((n) => (
                            <li key={n} className="flex items-start gap-3 text-[13px] text-black/70 leading-relaxed" data-testid={`guide-do-${n}`}>
                              <span className="flex-shrink-0 w-1 h-1 rounded-full bg-black mt-2" />
                              {t(`individuals.guide.dos.do.${n}` as any)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* DON'T */}
                      <div className="bg-white p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/10">
                          <span className="w-6 h-6 flex items-center justify-center border border-black/30 flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-black/40" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <span className="font-bold text-black/50 text-[13px] uppercase tracking-[0.15em]">{t("individuals.guide.dos.dont.label" as any)}</span>
                        </div>
                        <ul className="space-y-3.5">
                          {([1,2,3,4,5,6,7,8] as const).map((n) => (
                            <li key={n} className="flex items-start gap-3 text-[13px] text-black/45 leading-relaxed" data-testid={`guide-dont-${n}`}>
                              <span className="flex-shrink-0 w-1 h-1 rounded-full bg-black/30 mt-2" />
                              {t(`individuals.guide.dos.dont.${n}` as any)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
                {
                  idx: 3,
                  image: guideInterviewImg,
                  badgeKey: "individuals.guide.interview.badge",
                  titleKey: "individuals.guide.interview.title",
                  subtitleKey: "individuals.guide.interview.subtitle",
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8 mt-8">
                      {([1,2,3,4,5,6] as const).map((n) => (
                        <div key={n} className="bg-white p-7 hover:bg-black/3 transition-colors" data-testid={`guide-interview-${n}`}>
                          <p className="text-[2.2rem] font-black text-black/8 leading-none mb-3 select-none">0{n}</p>
                          <h4 className="font-bold text-black text-[14px] mb-2">{t(`individuals.guide.interview.s${n}.title` as any)}</h4>
                          <p className="text-black/55 text-[13px] leading-relaxed">{t(`individuals.guide.interview.s${n}.desc` as any)}</p>
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]).map(({ idx, badgeKey, titleKey, subtitleKey, content, image }) => {
                const isOpen = openGuide === idx;
                return (
                  <div key={idx} className="border-b border-black/8" data-testid={`guide-accordion-${idx}`}>
                    <button
                      onClick={() => setOpenGuide(isOpen ? null : idx)}
                      className="w-full relative overflow-hidden flex items-center justify-between gap-6 px-0 text-left group"
                      style={{ minHeight: "120px" }}
                      data-testid={`guide-toggle-${idx}`}
                    >
                      {/* Background photo */}
                      <img
                        src={image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay — dark enough for light-toned photos */}
                      <div className={`absolute inset-0 transition-colors duration-300 ${isOpen ? "bg-[#1e3a5f]/88" : "bg-[#1e3a5f]/80 group-hover:bg-[#1e3a5f]/84"}`} />
                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-between w-full py-8 gap-6">
                        <div className="flex items-start gap-6">
                          <span className="text-[11px] font-black text-white/40 mt-0.5 select-none w-6 flex-shrink-0">{idx + 1}</span>
                          <div>
                            <p className="text-[10px] text-white/80 uppercase tracking-[0.2em] mb-1">{t(badgeKey as any)}</p>
                            <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{t(titleKey as any)}</h3>
                            {!isOpen && <p className="text-white/80 text-[13px] mt-1 leading-relaxed max-w-lg">{t(subtitleKey as any)}</p>}
                          </div>
                        </div>
                        <span className="flex-shrink-0 mr-0">
                          {isOpen
                            ? <Minus className="w-4 h-4 text-white/70" />
                            : <Plus className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                          }
                        </span>
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-10">{content}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

            </div>
          </div>
        </section>

        {/* ── 4. PROCESS — dark, numbered steps ── */}
        <section className="bg-foreground py-28" data-testid="section-process">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-4">{t("home.process.label")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
                {t("home.process.title")}
              </h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
              {[
                { num: "01", titleKey: "home.process.1.title", textKey: "home.process.1.text" },
                { num: "02", titleKey: "home.process.2.title", textKey: "home.process.2.text" },
                { num: "03", titleKey: "home.process.3.title", textKey: "home.process.3.text" },
              ].map((step) => (
                <StaggerItem key={step.num} variant="fadeUp" className="bg-foreground p-10">
                  <p className="text-[4rem] font-black text-white/10 leading-none mb-6">{step.num}</p>
                  <h3 className="font-bold text-white text-xl mb-3">{t(step.titleKey as any)}</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed">{t(step.textKey as any)}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── 4. PACKAGES — white ── */}
        <section id="packages" className="py-28 bg-white" data-testid="section-packages">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("packages.badge")}</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-sm">
                  {t("packages.title")}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">{t("packages.subtitle")}</p>
              </div>
            </FadeUp>

            <Stagger className="grid md:grid-cols-3 gap-px bg-border border border-border">
              {/* Discovery */}
              <StaggerItem variant="fadeUp" className="bg-white p-8 relative" data-testid="card-package-discovery">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-1">{t("packages.discovery.name")}</h3>
                  <p className="text-[12px] text-muted-foreground uppercase tracking-wider">{t("packages.discovery.subtitle")}</p>
                </div>
                <div className="mb-8">
                  <div className="text-[3.5rem] font-black text-foreground leading-none">{t("packages.discovery.price")}</div>
                  <p className="text-[12px] text-muted-foreground mt-1">{t("packages.discovery.currency")}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-foreground">{t("packages.discovery.feature1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-foreground">{t("packages.discovery.feature2")}</span>
                  </li>
                </ul>
                <Link href="/book">
                  <Button variant="outline" className="w-full rounded-none border-foreground/20 text-foreground h-11 text-[13px]">
                    {t("nav.book")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </StaggerItem>

              {/* Essential – Popular */}
              <StaggerItem variant="fadeUp" className="bg-foreground p-8 relative" data-testid="card-package-essential">
                <div className="absolute top-4 right-4">
                  <span className="bg-[#1e3a5f] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">Populaire</span>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-1">{t("packages.essential.name")}</h3>
                  <p className="text-[12px] text-white/40 uppercase tracking-wider">{t("packages.essential.subtitle")}</p>
                </div>
                <div className="mb-8">
                  <div className="text-[3.5rem] font-black text-white leading-none">{t("packages.essential.price")}</div>
                  <p className="text-[12px] text-white/50 mt-1">{t("packages.essential.consultation")}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#93c5fd] flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-white/80">{t(`packages.essential.feature${i}` as any)}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/book">
                  <Button className="w-full rounded-none bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white h-11 text-[13px]">
                    {t("nav.book")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </StaggerItem>

              {/* Plan */}
              <StaggerItem variant="fadeUp" className="bg-white p-8 relative" data-testid="card-package-plan">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-1">{t("packages.plan.name")}</h3>
                  <p className="text-[12px] text-muted-foreground uppercase tracking-wider">{t("packages.plan.subtitle")}</p>
                </div>
                <div className="mb-8">
                  <div className="text-[3.5rem] font-black text-foreground leading-none">{t("packages.plan.price")}</div>
                  <p className="text-[12px] text-muted-foreground mt-1">{t("packages.plan.currency")}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-foreground">{t(`packages.plan.feature${i}` as any)}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/book">
                  <Button variant="outline" className="w-full rounded-none border-foreground/20 text-foreground h-11 text-[13px]">
                    {t("nav.book")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* ── 5. POURQUOI UNE EXPERTE — full-bleed photo background ── */}
        <section className="relative overflow-hidden min-h-[640px]" data-testid="section-about">
          {/* Background photo */}
          <img
            src="/audrey.png"
            alt="Audrey Mondesir, CRIA"
            className="absolute inset-0 w-full h-full object-cover object-right"
            data-testid="img-audrey"
          />
          {/* Gradient overlay — stronger on left where text sits, lighter on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

          {/* Content — pinned to left edge */}
          <motion.div
            className="relative z-10 px-8 md:px-16 py-20 md:py-28 w-full md:max-w-[52%]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } } }}
          >
            <motion.p
              className="text-[11px] text-[#93c5fd] uppercase tracking-[0.22em] mb-6"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
            >
              {t("about.expertLabel")}
            </motion.p>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}
            >
              Audrey Mondesir
            </motion.h2>
            <motion.p
              className="text-[12px] text-white/45 uppercase tracking-widest mb-8"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              CRIA · Conseillère en Relations Industrielles Agréée
            </motion.p>
            <motion.p
              className="text-white/80 text-[15px] leading-relaxed mb-5"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {t("about.text1")}
            </motion.p>
            <motion.p
              className="text-white/60 text-[14px] leading-relaxed mb-10 italic border-l-2 border-[#93c5fd]/50 pl-4"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
            >
              {t("about.mission")}
            </motion.p>

            {/* 3 credential cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4, delay: 0.3 } } }}
            >
              {[
                { title: t("about.reason1Title"), text: t("about.reason1Text") },
                { title: t("about.reason2Title"), text: t("about.reason2Text") },
                { title: t("about.reason3Title"), text: t("about.reason3Text") },
              ].map((r, i) => (
                <div key={i} className="bg-black/30 backdrop-blur-sm px-5 py-4" data-testid={`card-reason-${i}`}>
                  <p className="text-white text-[13px] font-semibold mb-1">{r.title}</p>
                  <p className="text-white/50 text-[12px] leading-relaxed">{r.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── 6. COMPARISON — light gray ── */}
        <section className="py-28 bg-muted/30" data-testid="section-comparison">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("comparison.label")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{t("comparison.title")}</h2>
            </FadeUp>

            <Stagger className="grid md:grid-cols-2 gap-px bg-border border border-border">
              {/* Without */}
              <StaggerItem variant="fadeLeft" className="bg-white p-10">
                <h3 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-8">{t("comparison.without.title")}</h3>
                <ul className="space-y-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-[14px]">
                      <span className="w-5 h-5 rounded-full border border-muted-foreground/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3" />
                      </span>
                      {t(`comparison.without.${i}` as any)}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
              {/* With AudreyRH */}
              <StaggerItem variant="fadeRight" className="bg-foreground p-10">
                <h3 className="text-[13px] font-semibold uppercase tracking-widest text-white/40 mb-8">{t("comparison.with.title")}</h3>
                <ul className="space-y-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80 text-[14px]">
                      <CheckCircle className="w-5 h-5 text-[#93c5fd] flex-shrink-0 mt-0.5" />
                      {t(`comparison.with.${i}` as any)}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* ── 6. TESTIMONIALS — white ── */}
        <section className="py-28 bg-white" data-testid="section-testimonials">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("home.testimonials.label")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-lg">
                {t("home.testimonials.title")}
              </h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {TESTIMONIALS.map((t2, i) => (
                <StaggerItem key={i} variant="fadeUp" className="bg-white p-8 group hover:bg-muted/20 transition-colors" data-testid={`card-testimonial-${i}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-foreground text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {t2.initials}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-[15px]">{t2.name}</p>
                      <p className="text-[12px] text-muted-foreground">{t2.role}</p>
                    </div>
                  </div>
                  <p className="text-foreground/70 text-[14px] leading-relaxed italic">
                    "{t(t2.quote as any)}"
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── 7. FINAL CTA — dark ── */}
        <section className="bg-foreground py-28" data-testid="section-cta">
          <FadeUp className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <div className="max-w-xl">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-5">{t("cta.label")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">{t("cta.title")}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/book" data-testid="link-cta-book">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {t("nav.book")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact" data-testid="link-cta-contact">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {t("nav.contact")}
                </Button>
              </Link>
            </div>
          </FadeUp>
        </section>

      </main>
      <Footer />
    </div>
  );
}
