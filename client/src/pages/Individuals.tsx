import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award, X, Quote, Star, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DarkVeil } from "@/components/DarkVeil";
import { useLanguage } from "@/lib/i18n";
import ShinyText from "@/components/ShinyText";
import StarBorder from "@/components/StarBorder";
import audreyPhoto from "@assets/FB_IMG_1767723555659_(1)_1767841722642.jpg";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";
import bokehBg from "@assets/IMM_1768534974735.png";

type ServiceKey = "strategy" | "credentials" | "employability" | "integration" | null;

export default function Individuals() {
  const [wordIndex, setWordIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState<ServiceKey>(null);
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  const rotatingWords = [t("hero.rotating.1"), t("hero.rotating.2"), t("hero.rotating.3")];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const getDialogStats = (key: "strategy" | "credentials" | "employability" | "integration") => {
    const stats: Record<string, { value: string; source: string }[]> = {
      strategy: [
        { value: "42,6%", source: "MIFI 2020" },
        { value: "2x", source: "Institut du Québec 2024" },
      ],
      credentials: [
        { value: "10%", source: "Statistique Canada" },
        { value: "14%", source: "StatCan 2016-2021" },
      ],
      employability: [
        { value: "68%", source: "Institut du Québec" },
        { value: "3x", source: "StatCan 2024" },
      ],
      integration: [
        { value: "+3 pts", source: "Institut du Québec" },
        { value: "4M$", source: "Radio-Canada 2021" },
      ],
    };
    return stats[key];
  };

  const hasInsight = (key: ServiceKey): key is "strategy" | "credentials" | "employability" =>
    key === "strategy" || key === "credentials" || key === "employability";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* ── Animated Service Modal ── */}
      <AnimatePresence>
        {openDialog && (
          <motion.div
            key={openDialog}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
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
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Deep-violet header */}
                  <div className="bg-foreground px-8 py-6 flex items-start justify-between flex-shrink-0">
                    <div className="pr-4">
                      <h2 className="text-2xl font-bold text-white leading-tight">{t(`dialog.${key}.title`)}</h2>
                      <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{t(`dialog.${key}.desc`)}</p>
                    </div>
                    <button
                      onClick={() => setOpenDialog(null)}
                      className="text-white/50 hover:text-white transition-colors flex-shrink-0 mt-0.5 rounded-full hover:bg-white/10 p-1"
                      data-testid="button-close-modal"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
                    {/* Premium insight */}
                    {hasInsight(key) && (
                      <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-5">
                        <p className="text-slate-700 leading-relaxed text-[15px] italic">
                          "{t(`dialog.${key}.insight`)}"
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                          <div className="text-sm text-slate-500 leading-tight">{t(`dialog.${key}.stat${idx + 1}`)}</div>
                          <div className="text-xs text-slate-400 mt-2 italic">Source: {stat.source}</div>
                        </div>
                      ))}
                    </div>

                    {/* Section h1 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h1`)}</h4>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <li key={i} className="flex items-start gap-2.5 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{t(`dialog.${key}.p1.${i}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Section h2 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h2`)}</h4>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <li key={i} className="flex items-start gap-2.5 text-slate-600">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{t(`dialog.${key}.p2.${i}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Section h3 */}
                    <div className="bg-muted/60 rounded-xl p-5">
                      <h4 className="font-bold text-base mb-2 text-foreground">{t(`dialog.${key}.h3`)}</h4>
                      <p className="text-slate-600 leading-relaxed text-sm">{t(`dialog.${key}.text`)}</p>
                    </div>
                  </div>

                  {/* Footer CTAs */}
                  <div className="px-8 py-5 border-t border-slate-200 bg-white flex-shrink-0 flex flex-col sm:flex-row gap-3">
                    <Link href="/book" className="flex-1">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/20"
                        size="lg"
                        onClick={() => setOpenDialog(null)}
                        data-testid="button-modal-book"
                      >
                        {t("services.bookConsultation")}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
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

        {/* ── Section 1: Hero (Dark/Skyline) ── keep as-is */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden" data-testid="section-hero">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${montrealSkyline})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                <Award className="w-4 h-4" />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight" data-testid="text-hero-title">
                <ShinyText
                  text={t("hero.title1")}
                  speed={3}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold"
                  color="white"
                  shineColor="#f97316"
                  spread={220}
                />
                <br />
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent relative inline-block min-w-[280px] md:min-w-[400px]">
                  <span key={wordIndex} className="inline-block animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {rotatingWords[wordIndex]}
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 flex-wrap">
                <Link href="/book">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 h-14 text-base shadow-xl" data-testid="button-hero-book">
                    {t("hero.cta")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="#services">
                  <Button variant="outline" size="lg" className="px-8 h-14 text-base border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm" data-testid="button-hero-services">
                    {t("hero.services")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Question (White) ── */}
        <section className="py-24 bg-white" data-testid="section-question">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <Card className="p-10 md:p-14 text-center bg-white shadow-xl border-slate-200">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900" data-testid="text-question-title">
                  {t("question.title")}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed mb-8">{t("question.text")}</p>
                <Link href="/book">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20" data-testid="button-discover-services">
                    {t("question.cta")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Section 3: Services (White) ── */}
        <section id="services" className="py-24 bg-white" data-testid="section-services">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                {t("services.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">{t("services.title")}</h2>
              <div className="accent-line" />
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("services.description")}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 card-hover-lift gradient-border border-slate-200 bg-white shadow-sm" data-testid="card-service-strategy">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{t("services.strategy.title")}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{t("services.strategy.desc")}</p>
                <button onClick={() => setOpenDialog("strategy")} className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-strategy">
                  {t("services.strategy.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              <Card className="p-8 card-hover-lift gradient-border border-slate-200 bg-white shadow-sm" data-testid="card-service-credentials">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{t("services.credentials.title")}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{t("services.credentials.desc")}</p>
                <button onClick={() => setOpenDialog("credentials")} className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-credentials">
                  {t("services.credentials.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              <Card className="p-8 card-hover-lift gradient-border border-slate-200 bg-white shadow-sm" data-testid="card-service-employability">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{t("services.employability.title")}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{t("services.employability.desc")}</p>
                <button onClick={() => setOpenDialog("employability")} className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-employability">
                  {t("services.employability.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              <Card className="p-8 card-hover-lift gradient-border border-slate-200 bg-white shadow-sm" data-testid="card-service-coaching">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{t("services.coaching.title")}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{t("services.coaching.desc")}</p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1">
                  {t("services.coaching.book")} <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              <Card className="p-8 card-hover-lift gradient-border border-slate-200 bg-white shadow-sm" data-testid="card-service-orientation">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{t("services.orientation.title")}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{t("services.orientation.desc")}</p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1">
                  {t("services.orientation.book")} <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              <Card className="p-8 card-hover-lift gradient-border border-slate-200 bg-white shadow-sm" data-testid="card-service-integration">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{t("services.integration.title")}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{t("services.integration.desc")}</p>
                <button onClick={() => setOpenDialog("integration")} className="text-primary font-medium inline-flex items-center gap-1" data-testid="button-learn-more-integration">
                  {t("services.integration.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Section 4: Packages (DarkVeil) ── */}
        <section id="packages" className="py-24 relative overflow-hidden" data-testid="section-packages">
          <DarkVeil zIndex={0} speed={0.5} noiseIntensity={0} warpIntensity={0} />

          <div className="container mx-auto px-4 md:px-6 relative" style={{ zIndex: 1 }}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                {t("packages.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">{t("packages.title")}</h2>
              <div className="accent-line" />
              <p className="text-white/65 text-lg max-w-2xl mx-auto">{t("packages.subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Discovery */}
              <StarBorder
                as="div"
                color="#6B2ED8"
                speed="8s"
                thickness={1.5}
                innerBg="rgba(255,255,255,0.07)"
                data-testid="card-package-discovery"
                className="card-hover-lift"
              >
                <div className="relative p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl" />
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">{t("packages.discovery.name")}</h3>
                  <p className="text-sm text-white/60">{t("packages.discovery.subtitle")}</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white">{t("packages.discovery.price")}</div>
                  <p className="text-sm text-white/60">{t("packages.discovery.currency")}</p>
                  <p className="text-xs text-accent font-medium mt-1">{t("packages.discovery.noFees")}</p>
                </div>
                <div className="bg-white/[0.08] rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-white">{t("packages.discovery.for")}</p>
                  <p className="text-xs text-white/60">{t("packages.discovery.forDetail")}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-white">{t("packages.discovery.feature1")}</span>
                      <p className="text-xs text-white/60">{t("packages.discovery.feature1Detail")}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white">{t("packages.discovery.feature2")}</span>
                  </li>
                </ul>
                <div className="bg-accent/15 rounded-lg p-3 text-center border border-accent/30">
                  <p className="text-xs text-accent font-medium">{t("packages.discovery.note")}</p>
                </div>
                </div>
              </StarBorder>

              {/* Essential – Popular */}
              <div className="relative overflow-hidden rounded-xl bg-accent/[0.15] border-2 border-accent/60 p-6 card-hover-lift backdrop-blur-sm shadow-lg shadow-accent/10" data-testid="card-package-essential">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
                <div className="absolute -top-1 right-4">
                  <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-b-md">Populaire</span>
                </div>
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-xl font-bold text-white">{t("packages.essential.name")}</h3>
                  <p className="text-sm text-white/60">{t("packages.essential.subtitle")}</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-accent">{t("packages.essential.price")}</div>
                  <p className="text-xs text-white/60">{t("packages.essential.consultation")}</p>
                  <p className="text-xs text-white/60">{t("packages.essential.openingFee")}</p>
                  <p className="text-sm font-bold text-white mt-2">{t("packages.essential.total")}</p>
                </div>
                <div className="bg-white/[0.08] rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-white">{t("packages.essential.for")}</p>
                  <p className="text-xs text-white/60">{t("packages.essential.forDetail")}</p>
                </div>
                <ul className="space-y-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-white">{t(`packages.essential.feature${i}`)}</span>
                        <p className="text-xs text-white/60">{t(`packages.essential.feature${i}Detail`)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan */}
              <div className="relative overflow-hidden rounded-xl bg-white/[0.07] border border-white/20 p-6 card-hover-lift backdrop-blur-sm" data-testid="card-package-plan">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">{t("packages.plan.name")}</h3>
                  <p className="text-sm text-white/60">{t("packages.plan.subtitle")}</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white">{t("packages.plan.price")}</div>
                  <p className="text-xs text-white/60">{t("packages.plan.consultation")}</p>
                  <p className="text-xs text-white/60">{t("packages.plan.openingFee")}</p>
                  <p className="text-sm font-bold text-white mt-2">{t("packages.plan.total")}</p>
                </div>
                <div className="bg-white/[0.08] rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-white">{t("packages.plan.for")}</p>
                  <p className="text-xs text-white/60">{t("packages.plan.forDetail")}</p>
                </div>
                <ul className="space-y-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-white">{t(`packages.plan.feature${i}`)}</span>
                        <p className="text-xs text-white/60">{t(`packages.plan.feature${i}Detail`)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center mt-10" style={{ position: "relative", zIndex: 1 }}>
              <p className="text-sm text-white/60 mb-6">{t("packages.note")}</p>
              <Link href="/book">
                <Button
                  size="lg"
                  className="border border-accent/50 text-white px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "rgba(249,115,22,0.22)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(249,115,22,0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(249,115,22,0.22)")}
                >
                  {t("packages.cta")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 5: About (White/Slate-50) ── */}
        <section
          id="expertise"
          className="py-20 bg-slate-50"
          data-testid="section-about"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  {t("about.badge")}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900" data-testid="text-about-title">{t("about.title")}</h2>
                <p className="text-slate-500 text-lg leading-relaxed">{t("about.text1")}</p>
                <p className="text-slate-500 text-lg leading-relaxed">{t("about.text2")}</p>
                <div className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">{t("about.whyTitle")}</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900">{t(`about.reason${i}Title`)} : </span>
                          <span className="text-slate-500">{t(`about.reason${i}Text`)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl shadow-2xl overflow-hidden">
                  <img src={audreyPhoto} alt="AudreyRH - CRIA" className="w-full object-cover object-top" style={{ marginBottom: "-15%" }} data-testid="img-about" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/20 rounded-xl -z-10" />
              </div>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-primary">{t("about.complianceTitle")}</h3>
                <p className="text-slate-500 mb-4">{t("about.complianceText")}</p>
                <p className="text-sm font-semibold text-slate-900 mb-3">{t("about.complianceSubtitle")}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-2">
                      <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-500">{t(`about.compliance${i}`)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center font-medium text-accent italic">{t("about.mission")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6: Testimonials (White) ── */}
        <section className="py-20 bg-white" data-testid="section-testimonials">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                {t("testimonials.badge")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900" data-testid="text-testimonials-title">{t("testimonials.title")}</h2>
              <div className="accent-line mt-4" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { id: 1, initials: "Y.K." },
                { id: 2, initials: "J.N." },
                { id: 3, initials: "A.S." },
                { id: 4, initials: "F.D." },
                { id: 5, initials: "M.S." },
                { id: 6, initials: "K.B." },
              ].map(({ id, initials }) => (
                <Card key={id} className="p-6 bg-white border-slate-200 shadow-sm relative card-hover-lift" data-testid={`card-testimonial-${id}`}>
                  <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-slate-500 leading-relaxed mb-5 text-sm">{t(`testimonial.${id}.text`)}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t(`testimonial.${id}.name`)}</p>
                      <p className="text-xs text-slate-400">{t(`testimonial.${id}.job`)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 7: Quote (DarkVeil) ── */}
        <section className="py-20 relative overflow-hidden" data-testid="section-quote">
          <DarkVeil zIndex={0} speed={0.4} noiseIntensity={0} warpIntensity={0} />
          <div className="container mx-auto px-4 md:px-6 relative" style={{ zIndex: 1 }}>
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl text-white/20 font-serif mb-4">"</div>
              <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-6" data-testid="text-quote">
                {t("quote.text")}
              </blockquote>
              <p className="text-white/60">{t("quote.author")}</p>
            </div>
          </div>
        </section>

        {/* ── Section 8: CTA (DarkVeil) ── */}
        <section className="py-24 relative overflow-hidden" data-testid="section-cta">
          <DarkVeil zIndex={0} speed={0.5} noiseIntensity={0} warpIntensity={0} />
          <div className="container mx-auto px-4 md:px-6 relative" style={{ zIndex: 1 }}>
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white" data-testid="text-cta-title">{t("cta.title")}</h2>
              <p className="text-xl text-white/70">{t("cta.text")}</p>
              <div className="pt-4">
                <Link href="/book">
                  <Button
                    size="lg"
                    className="border border-accent/50 text-white px-10 h-14 text-lg font-bold backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: "rgba(249,115,22,0.22)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(249,115,22,0.35)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(249,115,22,0.22)")}
                    data-testid="button-cta-book"
                  >
                    {t("cta.button")}
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-white/50">{t("cta.secure")}</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
