import { Link } from "wouter";
import { ArrowRight, Users, TrendingUp, Award, CheckCircle, Briefcase, Target, Building2, DollarSign, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";

const services = [
  { icon: Users, key: "talent", color: "text-primary", bg: "bg-primary/10" },
  { icon: TrendingUp, key: "strategy", color: "text-accent", bg: "bg-accent/10" },
  { icon: DollarSign, key: "grants", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: ShieldCheck, key: "compliance", color: "text-foreground", bg: "bg-muted" },
];

const reasons = [
  { icon: Award, key: "cria" },
  { icon: Briefcase, key: "experience" },
  { icon: Target, key: "results" },
];

export default function Business() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center justify-center pt-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${montrealSkyline})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/88 via-foreground/78 to-accent/40" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-24">
          <div className="inline-flex items-center gap-2 bg-accent/25 border border-accent/50 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            {t("business.badge")}
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            data-testid="text-business-title"
          >
            {t("business.hero.title")}
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            {t("business.hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="link-business-hero-contact">
              <Button
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/30 px-8 py-6 text-base font-semibold"
              >
                {t("business.hero.cta")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/book" data-testid="link-business-hero-book">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base"
              >
                {t("business.hero.book")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Services */}
      <section className="py-24 bg-muted/30" data-testid="section-business-services">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              {t("business.services.badge")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              {t("business.services.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("business.services.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <Card
                  key={svc.key}
                  className="p-8 card-hover-lift border-border bg-card"
                  data-testid={`card-business-service-${svc.key}`}
                >
                  <div className={`w-14 h-14 ${svc.bg} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${svc.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {t(`business.service.${svc.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    {t(`business.service.${svc.key}.desc`)}
                  </p>
                  <ul className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle className={`w-4 h-4 ${svc.color} flex-shrink-0 mt-0.5`} />
                        {t(`business.service.${svc.key}.point${i}`)}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-primary to-primary" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t("business.who.title")}</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("business.who.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["sme", "startup", "corporate", "nonprofit"].map((type) => (
              <div
                key={type}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 flex items-start gap-4 backdrop-blur-sm"
                data-testid={`card-business-who-${type}`}
              >
                <div className="w-10 h-10 bg-accent/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t(`business.who.${type}.title`)}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{t(`business.who.${type}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose AudreyRH */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("business.why.title")}</h2>
            <p className="text-muted-foreground text-lg">{t("business.why.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.key} className="text-center" data-testid={`card-business-why-${r.key}`}>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{t(`business.why.${r.key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(`business.why.${r.key}.text`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grants CTA Banner */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t("business.grants.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("business.grants.text")}</p>
              </div>
            </div>
            <Link href="/grants" data-testid="link-business-grants">
              <Button className="bg-accent text-white hover:bg-accent/90 whitespace-nowrap px-6">
                {t("business.grants.cta")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("business.cta.title")}</h2>
          <p className="text-background/70 text-lg mb-10 leading-relaxed">{t("business.cta.text")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="link-business-cta-contact">
              <Button
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/30 px-8 py-6 text-base font-semibold"
              >
                {t("business.cta.contact")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/book" data-testid="link-business-cta-book">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base"
              >
                {t("business.cta.book")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
