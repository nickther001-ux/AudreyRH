import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Award, CheckCircle, Briefcase, Target, Building2, DollarSign, ShieldCheck, Rocket, Heart, Factory } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp, FadeIn, Stagger, StaggerItem } from "@/lib/animations";

const SERVICE_PHOTOS: Record<string, string> = {
  talent:     "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
  strategy:   "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  grants:     "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
  compliance: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
};

const services = [
  { icon: Users,       key: "talent",     color: "text-primary" },
  { icon: TrendingUp,  key: "strategy",   color: "text-accent" },
  { icon: DollarSign,  key: "grants",     color: "text-emerald-600" },
  { icon: ShieldCheck, key: "compliance", color: "text-slate-600" },
];

const WHO_CARDS = [
  { type: "sme",       Icon: Factory,   num: "01" },
  { type: "startup",   Icon: Rocket,    num: "02" },
  { type: "corporate", Icon: Building2, num: "03" },
  { type: "nonprofit", Icon: Heart,     num: "04" },
];

const reasons = [
  { icon: Award,    key: "cria" },
  { icon: Briefcase,key: "experience" },
  { icon: Target,   key: "results" },
];

export default function Business() {
  const { t } = useLanguage();

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
              {t("business.hero.title")}
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
                  <StaggerItem key={svc.key} variant="fadeUp" className="bg-white group" data-testid={`card-business-service-${svc.key}`}>
                    <div className="overflow-hidden h-[240px]">
                      <img
                        src={SERVICE_PHOTOS[svc.key]}
                        alt={t(`business.service.${svc.key}.title` as any)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="p-8">
                      <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center mb-4">
                        <Icon className={`w-5 h-5 ${svc.color}`} />
                      </div>
                      <h3 className="font-bold text-foreground text-xl mb-3">{t(`business.service.${svc.key}.title` as any)}</h3>
                      <p className="text-muted-foreground text-[14px] leading-relaxed mb-5">{t(`business.service.${svc.key}.desc` as any)}</p>
                      <ul className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/70">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
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

        {/* ── 3. WHO WE SERVE — midnight blue ── */}
        <section className="bg-[#1e3a5f] py-28" data-testid="section-business-who">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-4">{t("business.who.badge")}</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-sm">
                  {t("business.who.title")}
                </h2>
                <p className="text-white/50 text-[14px] leading-relaxed max-w-sm">{t("business.who.subtitle")}</p>
              </div>
            </FadeUp>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {WHO_CARDS.map(({ type, Icon, num }) => (
                <StaggerItem key={type} variant="fadeUp" className="bg-[#1e3a5f] p-10 group hover:bg-white/5 transition-colors relative" data-testid={`card-business-who-${type}`}>
                  <span className="absolute top-6 right-8 text-6xl font-black text-white/5 leading-none select-none">{num}</span>
                  <div className="w-12 h-12 bg-white/8 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white/60" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3">{t(`business.who.${type}.title` as any)}</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed">{t(`business.who.${type}.desc` as any)}</p>
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

        {/* ── 5. PROCESS — light gray, numbered ── */}
        <section className="py-28 bg-muted/30" data-testid="section-business-process">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("home.process.label")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-xl">
                {t("home.process.title")}
              </h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", titleKey: "home.process.1.title", textKey: "home.process.1.text" },
                { num: "02", titleKey: "home.process.2.title", textKey: "home.process.2.text" },
                { num: "03", titleKey: "home.process.3.title", textKey: "home.process.3.text" },
              ].map((step) => (
                <StaggerItem key={step.num} variant="fadeUp">
                  <p className="text-[4rem] font-black text-foreground/8 leading-none mb-4">{step.num}</p>
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
