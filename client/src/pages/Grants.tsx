import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Lightbulb, Building2, Briefcase, ArrowRight, CheckCircle, DollarSign, Users, TrendingUp, X, Calendar, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StarBorder from "@/components/StarBorder";
import { useLanguage } from "@/lib/i18n";
import { CountUp } from "@/components/CountUp";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";

type DiagnosticCategory = "artists" | "entrepreneurs" | "sme" | null;
type ResultType = "high" | "review" | "early";

interface Question { fr: string; en: string; }

const diagnosticQuestions: Record<string, Question[]> = {
  artists: [
    { fr: "Êtes-vous incorporé(e) ou avez-vous un statut légal d'entreprise ?", en: "Are you incorporated or do you have a legal business status?" },
    { fr: "Avez-vous 2 ans ou plus d'expérience professionnelle dans votre domaine artistique ?", en: "Do you have 2+ years of professional experience in your artistic field?" },
    { fr: "Avez-vous réalisé 3 projets artistiques complétés ou plus ?", en: "Have you completed 3 or more artistic projects?" },
  ],
  entrepreneurs: [
    { fr: "Votre entreprise est-elle officiellement enregistrée (Registraire des entreprises du Québec) ?", en: "Is your business officially registered (Quebec business registry)?" },
    { fr: "Avez-vous un produit ou service minimum viable (MVP) en place ?", en: "Do you have a minimum viable product or service (MVP) in place?" },
    { fr: "Recherchez-vous un financement de démarrage de moins de 50 000 $ ?", en: "Are you seeking startup funding of less than $50,000?" },
  ],
  sme: [
    { fr: "Votre entreprise compte-t-elle 5 employés ou plus ?", en: "Does your business have 5 or more employees?" },
    { fr: "Votre chiffre d'affaires annuel dépasse-t-il 100 000 $ ?", en: "Does your annual revenue exceed $100,000?" },
    { fr: "Avez-vous un objectif d'expansion ou d'optimisation pour les 12 prochains mois ?", en: "Do you have an expansion or optimization goal for the next 12 months?" },
  ],
};

const categoryLabels: Record<string, { fr: string; en: string }> = {
  artists:      { fr: "Artistes & Créateurs", en: "Artists & Creators" },
  entrepreneurs:{ fr: "Entrepreneurs",        en: "Entrepreneurs" },
  sme:          { fr: "PMEs",                 en: "SMEs" },
};

function getResult(category: string, answers: boolean[]): ResultType {
  if (category === "entrepreneurs" && !answers[0]) return "early";
  return answers.every(Boolean) ? "high" : "review";
}

const grantCategories = [
  { key: "artists",       icon: Palette,   color: "text-accent",    bgColor: "bg-accent/10",   borderColor: "border-accent/20",   hoverBorder: "hover:border-accent/50",     hasDiagnostic: true },
  { key: "entrepreneurs", icon: Lightbulb, color: "text-primary",   bgColor: "bg-primary/10",  borderColor: "border-primary/20",  hoverBorder: "hover:border-primary/50",    hasDiagnostic: true },
  { key: "sme",           icon: Building2, color: "text-violet-500", bgColor: "bg-violet-50",  borderColor: "border-violet-200",  hoverBorder: "hover:border-violet-400",    hasDiagnostic: true },
  { key: "corporate",     icon: Briefcase, color: "text-foreground", bgColor: "bg-muted",       borderColor: "border-border",      hoverBorder: "hover:border-foreground/30", hasDiagnostic: false },
];

const stats = [
  { icon: DollarSign,  from: 0, to: 4.5, duration: 2,   suffix: "B$", labelKey: "grants.stat1Label" },
  { icon: Users,       from: 0, to: 500, duration: 2.5, suffix: "+",  labelKey: "grants.stat2Label" },
  { icon: TrendingUp,  from: 0, to: 92,  duration: 2.2, suffix: "%",  labelKey: "grants.stat4Label" },
];

export default function Grants() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();

  const [diagnosticCategory, setDiagnosticCategory] = useState<DiagnosticCategory>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const openDiagnostic = (category: DiagnosticCategory) => {
    setDiagnosticCategory(category);
    setStep(0);
    setAnswers([]);
  };

  const closeDiagnostic = () => setDiagnosticCategory(null);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    const questions = diagnosticCategory ? diagnosticQuestions[diagnosticCategory] : [];
    if (newAnswers.length >= questions.length) {
      setStep(questions.length); // result step
    } else {
      setStep(newAnswers.length);
    }
  };

  const questions = diagnosticCategory ? diagnosticQuestions[diagnosticCategory] : [];
  const totalSteps = questions.length;
  const isResult = step === totalSteps && totalSteps > 0;
  const result: ResultType | null = isResult && diagnosticCategory ? getResult(diagnosticCategory, answers) : null;
  const isFr = language === "fr";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Eligibility Diagnostic Modal ── */}
      <AnimatePresence>
        {diagnosticCategory && (
          <motion.div
            key={diagnosticCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeDiagnostic}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 12, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Deep-violet header */}
              <div className="bg-foreground px-7 py-5 flex items-start justify-between">
                <div>
                  <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
                    {isFr ? "Diagnostic d'admissibilité" : "Admissibility Diagnostic"}
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    {diagnosticCategory ? (isFr ? categoryLabels[diagnosticCategory].fr : categoryLabels[diagnosticCategory].en) : ""}
                  </h2>
                </div>
                <button
                  onClick={closeDiagnostic}
                  className="text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1 mt-0.5 flex-shrink-0"
                  data-testid="button-close-diagnostic"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step progress bar */}
              {!isResult && (
                <div className="px-7 pt-5 pb-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    {questions.map((_, i) => (
                      <div key={i} className="flex-1 flex items-center gap-1.5">
                        <div
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < step ? "bg-primary" : i === step ? "bg-primary/50" : "bg-slate-200"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 text-right">
                    {isFr ? `Question ${step + 1} sur ${totalSteps}` : `Question ${step + 1} of ${totalSteps}`}
                  </p>
                </div>
              )}

              {/* Question or Result */}
              <div className="px-7 py-6">
                <AnimatePresence mode="wait">
                  {!isResult ? (
                    <motion.div
                      key={`q-${step}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                    >
                      <p className="text-foreground font-semibold text-lg leading-snug mb-6">
                        {isFr ? questions[step]?.fr : questions[step]?.en}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                          onClick={() => handleAnswer(true)}
                          data-testid={`button-yes-${step}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {isFr ? "Oui" : "Yes"}
                        </button>
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold hover:bg-slate-100 transition-all duration-200"
                          onClick={() => handleAnswer(false)}
                          data-testid={`button-no-${step}`}
                        >
                          <X className="w-4 h-4" />
                          {isFr ? "Non" : "No"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.22 }}
                    >
                      {result === "high" && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-primary" />
                          </div>
                          <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                            {isFr ? "Correspondance élevée" : "High Match"}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {isFr ? "Vous êtes admissible !" : "You're eligible!"}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {isFr
                              ? "Votre profil correspond aux critères d'admissibilité. Réservez une consultation pour commencer votre demande de subvention avec l'aide d'un expert CRIA."
                              : "Your profile meets the eligibility criteria. Book a consultation to start your grant application with a certified CRIA expert."}
                          </p>
                          <Link href="/book">
                            <Button
                              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/25 mb-3"
                              size="lg"
                              onClick={closeDiagnostic}
                              data-testid="button-result-book"
                            >
                              <Calendar className="mr-2 w-4 h-4" />
                              {isFr ? "Réserver une consultation" : "Book a Consultation"}
                            </Button>
                          </Link>
                        </div>
                      )}

                      {result === "early" && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="w-8 h-8 text-amber-500" />
                          </div>
                          <div className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                            {isFr ? "Phase de démarrage" : "Early Stage"}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {isFr ? "Conseils prioritaires requis" : "Priority Advice Needed"}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {isFr
                              ? "Avant d'accéder aux subventions, il faut formaliser votre structure. Envoyez-nous vos coordonnées pour un accompagnement personnalisé."
                              : "Before accessing grants, your business structure needs to be formalized. Send us your details for personalized guidance."}
                          </p>
                          <Link href="/contact">
                            <Button
                              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/25 mb-3"
                              size="lg"
                              onClick={closeDiagnostic}
                              data-testid="button-result-contact-early"
                            >
                              <Send className="mr-2 w-4 h-4" />
                              {isFr ? "Envoyer mes coordonnées" : "Send My Details"}
                            </Button>
                          </Link>
                        </div>
                      )}

                      {result === "review" && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-slate-500" />
                          </div>
                          <div className="inline-block bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                            {isFr ? "Révision personnalisée requise" : "Personal Review Required"}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {isFr ? "Un examen individuel est nécessaire" : "An Individual Review is Needed"}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {isFr
                              ? "Votre profil présente des particularités qui méritent une analyse approfondie. Envoyez-nous vos détails pour qu'un expert évalue votre dossier."
                              : "Your profile has specific characteristics that merit a deeper analysis. Send us your details so an expert can evaluate your file."}
                          </p>
                          <Link href="/contact">
                            <Button
                              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/25 mb-3"
                              size="lg"
                              onClick={closeDiagnostic}
                              data-testid="button-result-contact-review"
                            >
                              <Send className="mr-2 w-4 h-4" />
                              {isFr ? "Envoyer mes détails pour révision" : "Send Details for Review"}
                            </Button>
                          </Link>
                        </div>
                      )}

                      <button
                        className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => { setStep(0); setAnswers([]); }}
                        data-testid="button-restart-diagnostic"
                      >
                        {isFr ? "↺ Recommencer le diagnostic" : "↺ Restart diagnostic"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-7 pb-5 flex justify-end border-t border-slate-100 pt-4">
                <button
                  onClick={closeDiagnostic}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                  data-testid="button-close-diagnostic-footer"
                >
                  <X className="w-3.5 h-3.5" />
                  {isFr ? "Fermer" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <section className="bg-white border-b border-border py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  <CountUp from={stat.from} to={stat.to} duration={stat.duration} />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-muted-foreground text-sm">{t(stat.labelKey)}</div>
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
              const useGlow = category.key === "entrepreneurs" || category.key === "sme";

              const cardInner = (
                <div className={`${useGlow ? "p-8" : ""}`}>
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
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/contact" data-testid={`link-apply-${category.key}`}>
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        {t("grants.cta.apply")}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    {category.hasDiagnostic ? (
                      <Button
                        variant="outline"
                        className="border-primary/40 text-primary hover:bg-primary/5 font-medium"
                        onClick={() => openDiagnostic(category.key as DiagnosticCategory)}
                        data-testid={`button-eligibility-${category.key}`}
                      >
                        {t("grants.cta.eligibility")}
                      </Button>
                    ) : (
                      <Link href="/contact" data-testid={`link-contact-${category.key}`}>
                        <Button variant="outline">
                          {isFr ? "Nous contacter" : "Contact Us"}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );

              if (useGlow) {
                return (
                  <StarBorder
                    key={category.key}
                    as="div"
                    color="#239b56"
                    speed="8s"
                    thickness={1.5}
                    data-testid={`card-grant-${category.key}`}
                    className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    {cardInner}
                  </StarBorder>
                );
              }

              return (
                <Card
                  key={category.key}
                  className={`p-8 border-2 ${category.borderColor} ${category.hoverBorder} transition-all duration-300 hover:shadow-lg`}
                  data-testid={`card-grant-${category.key}`}
                >
                  {cardInner}
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
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("grants.finalCta.title")}
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            {t("grants.finalCta.text")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="link-grants-final-apply">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl px-8 py-6 text-base font-semibold"
              >
                {t("grants.finalCta.apply")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/book" data-testid="link-grants-final-consult">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-6 text-base"
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
