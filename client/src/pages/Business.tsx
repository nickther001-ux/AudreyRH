import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Award, CheckCircle, Briefcase, Target, Building2, DollarSign, ShieldCheck, Rocket, Heart, Factory } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp, FadeIn, Stagger, StaggerItem } from "@/lib/animations";
import whoSmeBg       from "@assets/Gemini_Generated_Image_rn7mwxrn7mwxrn7m_1775523007407.png";
import whoStartupBg   from "@assets/generated_images/who_startup.png";
import whoCorporateBg from "@assets/generated_images/who_corporate.png";
import whoNonprofitBg from "@assets/generated_images/who_nonprofit.png";
import processStepsBg from "@assets/generated_images/process_steps_bg.png";
import svcTalentImg    from "@assets/stock_images/talent_acquisition.jpg";
import svcStrategyImg  from "@assets/stock_images/hr_strategy.jpg";
import svcGrantsImg    from "@assets/stock_images/grants_funding.jpg";
import svcComplianceImg from "@assets/stock_images/compliance_labour.jpg";


const services = [
  { icon: Users,       key: "talent",     photo: svcTalentImg,     points: 4 },
  { icon: TrendingUp,  key: "strategy",   photo: svcStrategyImg,   points: 3 },
  { icon: DollarSign,  key: "grants",     photo: svcGrantsImg,     points: 3 },
  { icon: ShieldCheck, key: "compliance", photo: svcComplianceImg, points: 3 },
];

const WHO_CARDS = [
  { type: "sme",       Icon: Factory,   image: whoSmeBg },
  { type: "startup",   Icon: Rocket,    image: whoStartupBg },
  { type: "corporate", Icon: Building2, image: whoCorporateBg },
  { type: "nonprofit", Icon: Heart,     image: whoNonprofitBg },
];

const reasons = [
  { icon: Award,    key: "cria" },
  { icon: Briefcase,key: "experience" },
  { icon: Target,   key: "results" },
];

export default function Business() {
  const { t, language } = useLanguage();
  const [wordIndex, setWordIndex] = useState(0);
  const rotatingWords = [
    t("business.hero.rotating.1" as any),
    t("business.hero.rotating.2" as any),
    t("business.hero.rotating.3" as any),
    t("business.hero.rotating.4" as any),
  ];

  useEffect(() => {
    const id = setInterval(() => setWordIndex(i => (i + 1) % rotatingWords.length), 900);
    return () => clearInterval(id);
  }, [rotatingWords.length]);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow">

        {/* ── 1. HERO — dark full-height editorial ── */}
        <section className="bg-foreground min-h-screen flex flex-col justify-end pb-24 pt-40 overflow-hidden relative" data-testid="section-hero">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80)" }}
          />
          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } }}
          >
            <motion.p
              className="text-[11px] text-white/40 uppercase tracking-[0.22em] mb-8"
              data-testid="text-business-badge"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {t("business.badge")}
            </motion.p>
            <motion.h1
              className="text-[clamp(3.2rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tighter text-white mb-8 max-w-4xl"
              data-testid="text-business-title"
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25,0.1,0.25,1] } } }}
            >
              <span className="block">{t("business.hero.title.line1" as any)}</span>
              {language === "fr" ? (
                <>
                  <span className="block">{t("business.hero.title.line2" as any)}</span>
                  <span className="block">
                    <span key={wordIndex} className="inline-block text-[#93c5fd] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {rotatingWords[wordIndex]}
                    </span>
                    <span className="text-orange-400">.</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="block">
                    <span key={wordIndex} className="inline-block text-[#93c5fd] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {rotatingWords[wordIndex]}
                    </span>
                  </span>
                  <span className="block">{t("business.hero.title.line2" as any)}<span className="text-orange-400">.</span></span>
                </>
              )}
            </motion.h1>
            <motion.p
              className="text-white/60 text-lg max-w-xl leading-relaxed mb-12"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}
            >
              {t("business.hero.description")}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <Link href="/contact" data-testid="link-business-hero-contact">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {t("business.hero.cta")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/book" data-testid="link-business-hero-book">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {t("business.hero.book")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stat strip */}
          <Stagger className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: t("home.stats.clients") },
              { value: "CRIA", label: t("home.stats.certified") },
              { value: "4",    label: t("business.stats.services") },
              { value: "MTL",  label: t("home.stats.location") },
            ].map((s) => (
              <StaggerItem key={s.label} variant="fadeUp">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ── 2. SERVICES — editorial photo-card grid ── */}
        <section className="py-28 bg-white" data-testid="section-business-services">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("business.services.badge")}</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-sm">
                  {t("business.services.title")}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">{t("business.services.subtitle")}</p>
              </div>
            </FadeUp>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <StaggerItem key={svc.key} variant="fadeUp" className="relative overflow-hidden group min-h-[420px] flex flex-col" data-testid={`card-business-service-${svc.key}`}>
                    {/* Photo */}
                    <img
                      src={svc.photo}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Gradient — transparent top → dark navy bottom */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,20,50,0.25) 0%, rgba(10,20,50,0.70) 50%, rgba(10,20,50,0.92) 100%)" }} />
                    {/* Content pinned to bottom */}
                    <div className="relative z-10 flex flex-col justify-end h-full p-10">
                      <div className="w-9 h-9 bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-xl mb-2">
                        {t(`business.service.${svc.key}.title` as any)}
                      </h3>
                      <p className="text-white/80 text-[14px] leading-relaxed mb-5">
                        {t(`business.service.${svc.key}.desc` as any)}
                      </p>
                      <ul className="space-y-2 border-t border-white/20 pt-4">
                        {Array.from({ length: svc.points }, (_, idx) => idx + 1).map((i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-white/75">
                            <CheckCircle className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5" />
                            {t(`business.service.${svc.key}.point${i}` as any)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ── 3. WHO WE SERVE — white ── */}
        <section className="bg-white py-28" data-testid="section-business-who">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-black/40 uppercase tracking-[0.2em] mb-4">{t("business.who.badge")}</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                  {t("business.who.title")}
                </h2>
                <p className="text-black/55 text-[14px] leading-relaxed max-w-sm">{t("business.who.subtitle")}</p>
              </div>
            </FadeUp>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8">
              {WHO_CARDS.map(({ type, Icon, image }) => (
                <StaggerItem key={type} variant="fadeUp" className="relative overflow-hidden group" data-testid={`card-business-who-${type}`}>
                  {/* Background photo */}
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient — clear at top, very dark at bottom for text */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,10,25,0.3) 0%, rgba(5,10,25,0.75) 45%, rgba(5,10,25,0.97) 100%)" }} />
                  {/* Content pinned to bottom */}
                  <div className="relative z-10 p-10 flex flex-col justify-end h-full min-h-[380px]">
                    <div className="w-10 h-10 bg-white/15 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-xl mb-3">{t(`business.who.${type}.title` as any)}</h3>
                    <p className="text-white/85 text-[14px] leading-relaxed mb-5">{t(`business.who.${type}.desc` as any)}</p>
                    <ul className="space-y-2.5 border-t border-white/20 pt-4">
                      {[1, 2, 3].map((i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/80">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#93c5fd] mt-1.5" />
                          {t(`business.who.${type}.point${i}` as any)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── 4. WHY CHOOSE — white, 3-column ── */}
        <section className="py-28 bg-white" data-testid="section-business-why">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("business.why.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{t("business.why.title")}</h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
              {reasons.map((r) => {
                const Icon = r.icon;
                return (
                  <StaggerItem key={r.key} variant="fadeUp" className="bg-white p-10" data-testid={`card-business-why-${r.key}`}>
                    <div className="w-12 h-12 bg-foreground flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground text-xl mb-3">{t(`business.why.${r.key}.title` as any)}</h3>
                    <p className="text-muted-foreground text-[14px] leading-relaxed">{t(`business.why.${r.key}.text` as any)}</p>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ── 5. PROCESS — light gray ── */}
        <section className="py-28 relative overflow-hidden bg-muted/30" data-testid="section-business-process">
          <img src={processStepsBg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none" />
          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("home.process.label")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-xl">
                {t("home.process.title")}
              </h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { titleKey: "home.process.1.title", textKey: "home.process.1.text" },
                { titleKey: "home.process.2.title", textKey: "home.process.2.text" },
                { titleKey: "home.process.3.title", textKey: "home.process.3.text" },
              ].map((step) => (
                <StaggerItem key={step.titleKey} variant="fadeUp">
                  <h3 className="font-bold text-foreground text-xl mb-3">{t(step.titleKey as any)}</h3>
                  <p className="text-muted-foreground text-[14px] leading-relaxed">{t(step.textKey as any)}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── 6. GRANTS CTA — white, highlighted ── */}
        <section className="py-20 bg-white border-y border-border" data-testid="section-business-grants">
          <FadeUp className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-lg">
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center mb-5">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{t("business.grants.title")}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{t("business.grants.text")}</p>
              </div>
              <Link href="/grants" data-testid="link-business-grants">
                <Button className="whitespace-nowrap px-8 h-12 bg-foreground text-white hover:bg-foreground/90 rounded-none text-[13px] font-semibold">
                  {t("business.grants.cta")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeUp>
        </section>

        {/* ── 7. FINAL CTA — midnight blue ── */}
        <section className="bg-[#1e3a5f] py-28" data-testid="section-business-cta">
          <FadeUp className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <div className="max-w-xl">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-5">{t("business.cta.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">{t("business.cta.title")}</h2>
              <p className="text-white/50 text-[14px] leading-relaxed mt-5 max-w-md">{t("business.cta.text")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/contact" data-testid="link-business-cta-contact">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {t("business.cta.contact")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/book" data-testid="link-business-cta-book">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {t("business.cta.book")}
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
