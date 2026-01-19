import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users, CheckCircle, Target, Award, X, Quote, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n";
import audreyPhoto from "@assets/FB_IMG_1767723555659_(1)_1767841722642.jpg";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";
import bokehBg from "@assets/IMM_1768534974735.png";

type ServiceKey = "strategy" | "credentials" | "employability" | "integration" | null;

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState<ServiceKey>(null);
  const { t } = useLanguage();

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

  const renderServiceDialog = (key: ServiceKey) => {
    if (!key) return null;
    
    const stats = getDialogStats(key);
    
    return (
      <Dialog open={openDialog === key} onOpenChange={(open) => setOpenDialog(open ? key : null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t(`dialog.${key}.title`)}</DialogTitle>
            <DialogDescription className="text-base">
              {t(`dialog.${key}.desc`)}
            </DialogDescription>
          </DialogHeader>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground leading-tight">{t(`dialog.${key}.stat${idx + 1}`)}</div>
                <div className="text-xs text-muted-foreground/70 mt-2 italic">Source: {stat.source}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-6 mt-6">
            {/* Section 1 - Points */}
            <div>
              <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h1`)}</h4>
              <ul className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{t(`dialog.${key}.p1.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Section 2 - Points */}
            <div>
              <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h2`)}</h4>
              <ul className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{t(`dialog.${key}.p2.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Section 3 - Text */}
            <div>
              <h4 className="font-bold text-lg mb-3 text-foreground">{t(`dialog.${key}.h3`)}</h4>
              <p className="text-muted-foreground leading-relaxed">{t(`dialog.${key}.text`)}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/book">
              <Button className="w-full" size="lg">
                {t("services.bookConsultation")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Service Dialogs */}
      {renderServiceDialog("strategy")}
      {renderServiceDialog("credentials")}
      {renderServiceDialog("employability")}
      {renderServiceDialog("integration")}

      <main className="flex-grow">
        {/* Hero Section - Montreal skyline background */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden" data-testid="section-hero">
          {/* Montreal skyline background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${montrealSkyline})` }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                <Award className="w-4 h-4" />
                {t("hero.badge")}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white" data-testid="text-hero-title">
                {t("hero.title1")}
                <br />
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent relative inline-block min-w-[280px] md:min-w-[400px]">
                  <span 
                    key={wordIndex}
                    className="inline-block animate-in fade-in slide-in-from-bottom-2 duration-200"
                  >
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
                <Link href="#services">
                  <Button variant="outline" size="lg" className="px-8 h-14 text-base border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm" data-testid="button-hero-services">
                    {t("hero.services")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Question Section - Modern glass style with bokeh background */}
        <section 
          className="py-24 relative overflow-hidden" 
          data-testid="section-question"
          style={{
            backgroundImage: `url(${bokehBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <Card className="p-10 md:p-14 text-center bg-card/80 backdrop-blur-sm shadow-xl border-primary/10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-question-title">
                  {t("question.title")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {t("question.text")}
                </p>
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

        {/* Services Section - Modern cards */}
        <section id="services" className="py-24 bg-muted/30" data-testid="section-services">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                {t("services.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                {t("services.title")}
              </h2>
              <div className="accent-line" />
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t("services.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Analyse stratégique - Has dialog */}
              <Card className="p-8 card-hover-lift gradient-border border-border bg-card" data-testid="card-service-strategy">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("services.strategy.title")}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("services.strategy.desc")}
                </p>
                <button 
                  onClick={() => setOpenDialog("strategy")}
                  className="text-primary font-medium inline-flex items-center gap-1"
                  data-testid="button-learn-more-strategy"
                >
                  {t("services.strategy.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              {/* Reconnaissance des acquis - Has dialog */}
              <Card className="p-8 card-hover-lift gradient-border border-border bg-card" data-testid="card-service-credentials">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("services.credentials.title")}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("services.credentials.desc")}
                </p>
                <button 
                  onClick={() => setOpenDialog("credentials")}
                  className="text-primary font-medium inline-flex items-center gap-1"
                  data-testid="button-learn-more-credentials"
                >
                  {t("services.credentials.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              {/* Stratégie d'employabilité - Has dialog */}
              <Card className="p-8 card-hover-lift gradient-border border-border bg-card" data-testid="card-service-employability">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("services.employability.title")}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("services.employability.desc")}
                </p>
                <button 
                  onClick={() => setOpenDialog("employability")}
                  className="text-primary font-medium inline-flex items-center gap-1"
                  data-testid="button-learn-more-employability"
                >
                  {t("services.employability.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>

              {/* Coaching de carrière - Links to booking (no dialog) */}
              <Card className="p-8 card-hover-lift gradient-border border-border bg-card" data-testid="card-service-coaching">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("services.coaching.title")}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("services.coaching.desc")}
                </p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1">
                  {t("services.coaching.book")} <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Orientation professionnelle - Links to booking (no dialog) */}
              <Card className="p-8 card-hover-lift gradient-border border-border bg-card" data-testid="card-service-orientation">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("services.orientation.title")}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("services.orientation.desc")}
                </p>
                <Link href="/book" className="text-primary font-medium inline-flex items-center gap-1">
                  {t("services.orientation.book")} <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>

              {/* Intégration au marché - Has dialog */}
              <Card className="p-8 card-hover-lift gradient-border border-border bg-card" data-testid="card-service-integration">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("services.integration.title")}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("services.integration.desc")}
                </p>
                <button 
                  onClick={() => setOpenDialog("integration")}
                  className="text-primary font-medium inline-flex items-center gap-1"
                  data-testid="button-learn-more-integration"
                >
                  {t("services.integration.more")} <ArrowRight className="w-4 h-4" />
                </button>
              </Card>
            </div>
          </div>
        </section>

        {/* Packages Section - Candidate Services */}
        <section id="packages" className="py-24 bg-background" data-testid="section-packages">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                {t("packages.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                {t("packages.title")}
              </h2>
              <div className="accent-line" />
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t("packages.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Package 0: Discovery */}
              <Card className="p-6 card-hover-lift border-2 border-primary/20 bg-card relative overflow-hidden" data-testid="card-package-discovery">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                <div className="text-center mb-6">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">0</span>
                  <h3 className="text-xl font-bold mt-3">{t("packages.discovery.name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("packages.discovery.subtitle")}</p>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary">{t("packages.discovery.price")}</div>
                  <p className="text-sm text-muted-foreground">{t("packages.discovery.currency")}</p>
                  <p className="text-xs text-accent font-medium mt-1">{t("packages.discovery.noFees")}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-foreground">{t("packages.discovery.for")}</p>
                  <p className="text-xs text-muted-foreground">{t("packages.discovery.forDetail")}</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">{t("packages.discovery.feature1")}</span>
                      <p className="text-xs text-muted-foreground">{t("packages.discovery.feature1Detail")}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{t("packages.discovery.feature2")}</span>
                  </li>
                </ul>
                
                <div className="bg-accent/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-accent font-medium">{t("packages.discovery.note")}</p>
                </div>
              </Card>

              {/* Package A: Essential */}
              <Card className="p-6 card-hover-lift border-2 border-accent/30 bg-card relative overflow-hidden" data-testid="card-package-essential">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50" />
                <div className="text-center mb-6">
                  <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">A</span>
                  <h3 className="text-xl font-bold mt-3">{t("packages.essential.name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("packages.essential.subtitle")}</p>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-accent">{t("packages.essential.price")}</div>
                  <p className="text-xs text-muted-foreground">{t("packages.essential.openingFee")}</p>
                  <p className="text-xs text-muted-foreground">{t("packages.essential.proxyFee")}</p>
                  <p className="text-sm font-bold text-foreground mt-2">{t("packages.essential.total")}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-foreground">{t("packages.essential.for")}</p>
                  <p className="text-xs text-muted-foreground">{t("packages.essential.forDetail")}</p>
                </div>
                
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{t("packages.essential.feature1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{t("packages.essential.feature2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{t("packages.essential.feature3")}</span>
                  </li>
                </ul>
              </Card>

              {/* Package B: Plan */}
              <Card className="p-6 card-hover-lift border-2 border-primary bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden shadow-lg" data-testid="card-package-plan">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="absolute -top-1 right-4">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-b-md">Populaire</span>
                </div>
                <div className="text-center mb-6 pt-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">B</span>
                  <h3 className="text-xl font-bold mt-3">{t("packages.plan.name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("packages.plan.subtitle")}</p>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary">{t("packages.plan.price")}</div>
                  <p className="text-xs text-muted-foreground">{t("packages.plan.openingFee")}</p>
                  <p className="text-sm font-bold text-foreground mt-2">{t("packages.plan.total")}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-foreground">{t("packages.plan.for")}</p>
                  <p className="text-xs text-muted-foreground">{t("packages.plan.forDetail")}</p>
                </div>
                
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{t("packages.plan.feature1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm">{t("packages.plan.feature2")}</span>
                      <p className="text-xs text-muted-foreground">{t("packages.plan.feature2Detail")}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{t("packages.plan.feature3")}</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="text-center mt-10">
              <p className="text-sm text-muted-foreground mb-6">{t("packages.note")}</p>
              <Link href="/book">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
                  {t("packages.cta")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section - Professional like gorh.co with bokeh background */}
        <section 
          id="expertise" 
          className="py-20 border-y border-border relative overflow-hidden" 
          data-testid="section-about"
          style={{
            backgroundImage: `url(${bokehBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-card/90 dark:bg-card/95" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  {t("about.badge")}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-about-title">
                  {t("about.title")}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("about.text1")}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("about.text2")}
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{t("about.point1")}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{t("about.point2")}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{t("about.point3")}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl shadow-2xl overflow-hidden">
                  <img 
                    src={audreyPhoto} 
                    alt="Audrey Mondesir - CRIA" 
                    className="w-full object-cover object-top"
                    style={{ marginBottom: '-15%' }}
                    data-testid="img-about"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/20 rounded-xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section with bokeh background */}
        <section 
          className="py-20 relative overflow-hidden" 
          data-testid="section-testimonials"
          style={{
            backgroundImage: `url(${bokehBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                {t("testimonials.badge")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-testimonials-title">
                {t("testimonials.title")}
              </h2>
              <div className="accent-line mt-4" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Testimonial 1 - Prestigious */}
              <Card className="p-6 bg-card border-border relative card-hover-lift" data-testid="card-testimonial-1">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {t("testimonial.1.text")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">Y.K.</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("testimonial.1.name")}</p>
                    <p className="text-xs text-muted-foreground">{t("testimonial.1.job")}</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 2 - Modest */}
              <Card className="p-6 bg-card border-border relative card-hover-lift" data-testid="card-testimonial-2">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {t("testimonial.2.text")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">J.N.</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("testimonial.2.name")}</p>
                    <p className="text-xs text-muted-foreground">{t("testimonial.2.job")}</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 3 - Prestigious */}
              <Card className="p-6 bg-card border-border relative card-hover-lift" data-testid="card-testimonial-3">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {t("testimonial.3.text")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">A.S.</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("testimonial.3.name")}</p>
                    <p className="text-xs text-muted-foreground">{t("testimonial.3.job")}</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 4 - Modest */}
              <Card className="p-6 bg-card border-border relative card-hover-lift" data-testid="card-testimonial-4">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {t("testimonial.4.text")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">F.D.</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("testimonial.4.name")}</p>
                    <p className="text-xs text-muted-foreground">{t("testimonial.4.job")}</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 5 - Modest */}
              <Card className="p-6 bg-card border-border relative card-hover-lift" data-testid="card-testimonial-5">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {t("testimonial.5.text")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">M.S.</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("testimonial.5.name")}</p>
                    <p className="text-xs text-muted-foreground">{t("testimonial.5.job")}</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 6 - Modest */}
              <Card className="p-6 bg-card border-border relative card-hover-lift" data-testid="card-testimonial-6">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {t("testimonial.6.text")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">K.B.</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("testimonial.6.name")}</p>
                    <p className="text-xs text-muted-foreground">{t("testimonial.6.job")}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 bg-card border-y border-border" data-testid="section-quote">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-6" data-testid="text-quote">
                {t("quote.text")}
              </blockquote>
              <p className="text-muted-foreground">{t("quote.author")}</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary" data-testid="section-cta">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white" data-testid="text-cta-title">
                {t("cta.title")}
              </h2>
              <p className="text-xl text-primary-foreground/80">
                {t("cta.text")}
              </p>
              
              <div className="pt-4">
                <Link href="/book">
                  <Button size="lg" className="bg-accent text-primary font-bold px-10 h-14 text-lg shadow-xl" data-testid="button-cta-book">
                    {t("cta.button")}
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-primary-foreground/60">
                  {t("cta.secure")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
