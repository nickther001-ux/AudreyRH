import { Link } from "wouter";
import { Palette, Lightbulb, Building2, Briefcase, ArrowRight, CheckCircle, DollarSign, Users, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import { CountUp } from "@/components/CountUp";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";

const grantCategories = [
  {
    key: "artists",
    icon: Palette,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    hoverBorder: "hover:border-accent/50",
  },
  {
    key: "entrepreneurs",
    icon: Lightbulb,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    hoverBorder: "hover:border-primary/50",
  },
  {
    key: "sme",
    icon: Building2,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
    hoverBorder: "hover:border-secondary/50",
  },
  {
    key: "corporate",
    icon: Briefcase,
    color: "text-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    hoverBorder: "hover:border-foreground/30",
  },
];

const stats = [
  { icon: DollarSign, from: 0, to: 4.5, duration: 2,   suffix: "B$", labelKey: "grants.stat1Label" },
  { icon: Users,     from: 0, to: 500,  duration: 2.5, suffix: "+",  labelKey: "grants.stat2Label" },
  { icon: TrendingUp,from: 0, to: 92,   duration: 2.2, suffix: "%",  labelKey: "grants.stat4Label" },
];

export default function Grants() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${montrealSkyline})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/70 to-primary/50" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <DollarSign className="w-4 h-4" />
            {t("grants.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t("grants.hero.title")}
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            {t("grants.hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="link-grants-apply-hero">
              <Button
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/30 px-8 py-6 text-base font-semibold"
              >
                {t("grants.hero.cta")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#categories" data-testid="link-grants-explore">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base"
              >
                {t("grants.hero.explore")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  <CountUp from={stat.from} to={stat.to} duration={stat.duration} />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-background/60 text-sm">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("grants.intro.title")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {t("grants.intro.text")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {["grants.intro.point1", "grants.intro.point2", "grants.intro.point3"].map((key) => (
              <div key={key} className="flex items-start gap-3 text-left bg-background rounded-xl p-5 shadow-sm border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grant Categories */}
      <section id="categories" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              {t("grants.categories.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("grants.categories.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("grants.categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {grantCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.key}
                  className={`p-8 border-2 ${category.borderColor} ${category.hoverBorder} transition-all duration-300 hover:shadow-lg group`}
                  data-testid={`card-grant-${category.key}`}
                >
                  <div className={`w-14 h-14 ${category.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t(`grants.${category.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {t(`grants.${category.key}.description`)}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle className={`w-4 h-4 ${category.color} flex-shrink-0 mt-0.5`} />
                        {t(`grants.${category.key}.feature${i}`)}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3">
                    <Link href="/contact" data-testid={`link-apply-${category.key}`}>
                      <Button className="bg-foreground text-background hover:bg-foreground/90">
                        {t("grants.cta.apply")}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/contact" data-testid={`link-eligibility-${category.key}`}>
                      <Button variant="outline">
                        {t("grants.cta.eligibility")}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("grants.process.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("grants.process.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center" data-testid={`step-process-${step}`}>
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`grants.process.step${step}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`grants.process.step${step}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("grants.finalCta.title")}
          </h2>
          <p className="text-background/70 text-lg mb-10 leading-relaxed">
            {t("grants.finalCta.text")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="link-grants-final-apply">
              <Button
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/30 px-8 py-6 text-base font-semibold"
              >
                {t("grants.finalCta.apply")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/book" data-testid="link-grants-final-consult">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base"
              >
                {t("grants.finalCta.consult")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
