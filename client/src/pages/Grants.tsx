import { useState, useRef } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Lightbulb, Building2, Briefcase, ArrowRight, CheckCircle, DollarSign, Users, TrendingUp, X, Calendar, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp, Stagger, StaggerItem } from "@/lib/animations";
import { CountUp } from "@/components/CountUp";

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

const GRANT_CARDS = [
  {
    key: "artists",
    icon: Palette,
    photo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    hasDiagnostic: true,
  },
  {
    key: "entrepreneurs",
    icon: Lightbulb,
    photo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    hasDiagnostic: true,
  },
  {
    key: "sme",
    icon: Building2,
    photo: "https://images.unsplash.com/photo-1664575599736-c5197c684128?w=800&q=80",
    hasDiagnostic: true,
  },
  {
    key: "corporate",
    icon: Briefcase,
    photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    hasDiagnostic: false,
  },
];

const TESTIMONIALS = [
  { initials: "Y.K.", name: "Youssouf K.", role: "Directeur de banque, Montréal", quote: "Grâce à AudreyRH, j'ai accédé à un financement que je ne savais même pas qu'il existait. Le dossier a été préparé en 3 semaines." },
  { initials: "A.S.", name: "Aïssatou S.", role: "Entrepreneur, Laval",           quote: "Le diagnostic d'admissibilité m'a évité de perdre des mois sur les mauvaises subventions. Très efficace." },
  { initials: "F.D.", name: "Fatou D.", role: "Fondatrice OBNL, Montréal",        quote: "Audrey m'a aidée à structurer la demande. Nous avons obtenu 45 000 $ pour notre organisme communautaire." },
  { initials: "J.N.", name: "Jean-Baptiste N.", role: "PME, Québec",               quote: "Sans cet accompagnement, on n'aurait jamais su qu'on était admissibles. Résultat : 80 000 $ de subvention obtenu." },
];

const STATS = [
  { from: 0, to: 4.5,  duration: 2,   suffix: "B$",  labelFr: "Financements disponibles/an",  labelEn: "Available funding / year" },
  { from: 0, to: 500,  duration: 2.5, suffix: "+",   labelFr: "Programmes identifiés",         labelEn: "Programs identified" },
  { from: 0, to: 92,   duration: 2.2, suffix: "%",   labelFr: "Taux de succès clients",        labelEn: "Client success rate" },
  { from: 0, to: 16,   duration: 1.8, suffix: " ans",labelFr: "D'expérience terrain",          labelEn: "Years of field expertise" },
];

export default function Grants() {
  const { t, language } = useLanguage();
  const isFr = language === "fr";

  const [diagnosticCategory, setDiagnosticCategory] = useState<DiagnosticCategory>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const openDiagnostic = (category: DiagnosticCategory) => { setDiagnosticCategory(category); setStep(0); setAnswers([]); };
  const closeDiagnostic = () => setDiagnosticCategory(null);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    const questions = diagnosticCategory ? diagnosticQuestions[diagnosticCategory] : [];
    if (newAnswers.length >= questions.length) setStep(questions.length);
    else setStep(newAnswers.length);
  };

  const questions = diagnosticCategory ? diagnosticQuestions[diagnosticCategory] : [];
  const totalSteps = questions.length;
  const isResult = step === totalSteps && totalSteps > 0;
  const result: ResultType | null = isResult && diagnosticCategory ? getResult(diagnosticCategory, answers) : null;

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Navbar />

      {/* ── Eligibility Diagnostic Modal ── */}
      <AnimatePresence>
        {diagnosticCategory && (
          <motion.div
            key={diagnosticCategory}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeDiagnostic}
          >
            <motion.div
              initial={{ scale: 0.95, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 16, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="bg-white max-w-lg w-full overflow-hidden flex flex-col shadow-2xl rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#1e3a5f] px-7 py-5 flex items-start justify-between">
                <div>
                  <p className="text-[#93c5fd] text-[11px] font-semibold uppercase tracking-[0.2em] mb-1">
                    {isFr ? "Diagnostic d'admissibilité" : "Admissibility Diagnostic"}
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    {diagnosticCategory ? (isFr ? categoryLabels[diagnosticCategory].fr : categoryLabels[diagnosticCategory].en) : ""}
                  </h2>
                </div>
                <button onClick={closeDiagnostic} className="text-white/50 hover:text-white transition-colors p-1 mt-0.5 flex-shrink-0" data-testid="button-close-diagnostic" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isResult && (
                <div className="px-7 pt-5 pb-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    {questions.map((_, i) => (
                      <div key={i} className="flex-1">
                        <div className={`h-1 flex-1 transition-all duration-300 ${i < step ? "bg-[#1e3a5f]" : i === step ? "bg-[#1e3a5f]/40" : "bg-slate-200"}`} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 text-right">
                    {isFr ? `Question ${step + 1} sur ${totalSteps}` : `Question ${step + 1} of ${totalSteps}`}
                  </p>
                </div>
              )}

              <div className="px-7 py-6">
                <AnimatePresence mode="wait">
                  {!isResult ? (
                    <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                      <p className="text-foreground font-semibold text-lg leading-snug mb-6">
                        {isFr ? questions[step]?.fr : questions[step]?.en}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] font-semibold hover:bg-[#1e3a5f] hover:text-white transition-all duration-200" onClick={() => handleAnswer(true)} data-testid={`button-yes-${step}`}>
                          <CheckCircle className="w-4 h-4" />{isFr ? "Oui" : "Yes"}
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 text-slate-500 font-semibold hover:bg-slate-100 transition-all duration-200" onClick={() => handleAnswer(false)} data-testid={`button-no-${step}`}>
                          <X className="w-4 h-4" />{isFr ? "Non" : "No"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }}>
                      {result === "high" && (
                        <div className="text-center">
                          <div className="w-14 h-14 bg-[#1e3a5f]/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-7 h-7 text-[#1e3a5f]" />
                          </div>
                          <div className="inline-block bg-[#1e3a5f] text-white text-[11px] font-bold px-3 py-1 uppercase tracking-widest mb-3">
                            {isFr ? "Correspondance élevée" : "High Match"}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{isFr ? "Vous êtes admissible !" : "You're eligible!"}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {isFr ? "Votre profil correspond aux critères. Réservez une consultation pour commencer votre demande avec un expert CRIA." : "Your profile meets the criteria. Book a consultation to start your application with a CRIA expert."}
                          </p>
                          <Link href="/book"><Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12 mb-3" size="lg" onClick={closeDiagnostic} data-testid="button-result-book"><Calendar className="mr-2 w-4 h-4" />{isFr ? "Réserver une consultation" : "Book a Consultation"}</Button></Link>
                        </div>
                      )}
                      {result === "early" && (
                        <div className="text-center">
                          <div className="w-14 h-14 bg-amber-50 flex items-center justify-center mx-auto mb-4"><Lightbulb className="w-7 h-7 text-amber-500" /></div>
                          <div className="inline-block bg-amber-100 text-amber-700 text-[11px] font-bold px-3 py-1 uppercase tracking-widest mb-3">{isFr ? "Phase de démarrage" : "Early Stage"}</div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{isFr ? "Conseils prioritaires requis" : "Priority Advice Needed"}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6">{isFr ? "Formalisez d'abord votre structure. Envoyez-nous vos coordonnées pour un accompagnement personnalisé." : "Formalize your structure first. Send us your details for personalized guidance."}</p>
                          <Link href="/contact"><Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12 mb-3" size="lg" onClick={closeDiagnostic} data-testid="button-result-contact-early"><Send className="mr-2 w-4 h-4" />{isFr ? "Envoyer mes coordonnées" : "Send My Details"}</Button></Link>
                        </div>
                      )}
                      {result === "review" && (
                        <div className="text-center">
                          <div className="w-14 h-14 bg-slate-100 flex items-center justify-center mx-auto mb-4"><Users className="w-7 h-7 text-slate-500" /></div>
                          <div className="inline-block bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 uppercase tracking-widest mb-3">{isFr ? "Révision requise" : "Review Required"}</div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{isFr ? "Analyse individuelle nécessaire" : "Individual Review Needed"}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6">{isFr ? "Votre profil mérite une analyse approfondie. Envoyez-nous vos détails pour qu'un expert évalue votre dossier." : "Your profile merits deeper analysis. Send details for an expert review."}</p>
                          <Link href="/contact"><Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12 mb-3" size="lg" onClick={closeDiagnostic} data-testid="button-result-contact-review"><Send className="mr-2 w-4 h-4" />{isFr ? "Envoyer mes détails" : "Send My Details"}</Button></Link>
                        </div>
                      )}
                      <button className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors" onClick={() => { setStep(0); setAnswers([]); }} data-testid="button-restart-diagnostic">
                        {isFr ? "↺ Recommencer le diagnostic" : "↺ Restart diagnostic"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-7 pb-5 flex justify-end border-t border-slate-100 pt-4">
                <button onClick={closeDiagnostic} className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1" data-testid="button-close-diagnostic-footer">
                  <X className="w-3.5 h-3.5" />{isFr ? "Fermer" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">

        {/* ── 1. HERO — full-height dark editorial ── */}
        <section className="bg-foreground min-h-screen flex flex-col justify-end pb-24 pt-40 overflow-hidden relative" data-testid="section-grants-hero">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-12"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=1600&q=80)" }} />
          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } }}
          >
            <motion.p className="text-[11px] text-white/40 uppercase tracking-[0.22em] mb-8" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              {isFr ? "Subventions & Financement" : "Grants & Funding"}
            </motion.p>
            <motion.h1
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95] tracking-tighter text-white mb-8 max-w-4xl"
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25,0.1,0.25,1] } } }}
              data-testid="text-grants-hero-title"
            >
              {isFr ? <>Le financement qui <em className="not-italic text-[#93c5fd]">propulse</em><br />votre projet.</> : <>The funding that <em className="not-italic text-[#93c5fd]">powers</em><br />your project.</>}
            </motion.h1>
            <motion.p className="text-white/60 text-lg max-w-xl leading-relaxed mb-12" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}>
              {isFr ? "AudreyRH identifie les subventions auxquelles vous êtes admissible et vous accompagne jusqu'à l'obtention du financement." : "AudreyRH identifies the grants you qualify for and guides you all the way to securing the funding."}
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              <Link href="/contact" data-testid="link-grants-hero-apply">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {isFr ? "Soumettre une demande" : "Submit an Application"} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="#categories" data-testid="link-grants-hero-explore">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {isFr ? "Voir les catégories" : "Explore Categories"}
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Stat strip */}
          <Stagger className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <StaggerItem key={i} variant="fadeUp">
                <p className="text-2xl font-bold text-white">
                  <CountUp from={s.from} to={s.to} duration={s.duration} /><span>{s.suffix}</span>
                </p>
                <p className="text-[11px] text-white/40 uppercase tracking-widest mt-1">{isFr ? s.labelFr : s.labelEn}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ── 2. GRANT CATEGORIES — editorial photo-card grid ── */}
        <section id="categories" className="py-28 bg-white" data-testid="section-grant-categories">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{isFr ? "Programmes disponibles" : "Available Programs"}</p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-sm" data-testid="text-grants-categories-title">
                  {isFr ? <>Notre <em className="not-italic text-primary">expertise</em></> : <>Our <em className="not-italic text-primary">expertise</ em></>}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">
                  {isFr ? "Des opportunités ciblées pour chaque type d'entrepreneur, créateur et organisation au Canada." : "Targeted opportunities for every type of entrepreneur, creator and organization in Canada."}
                </p>
              </div>
            </FadeUp>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {GRANT_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <StaggerItem key={card.key} variant="fadeUp" className="bg-white group" data-testid={`card-grant-${card.key}`}>
                    <div className="overflow-hidden h-[220px] relative">
                      <img src={card.photo} alt={t(`grants.${card.key}.title` as any)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-8">
                      <div className="w-10 h-10 bg-[#1e3a5f]/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <h3 className="font-bold text-foreground text-[17px] mb-2">{t(`grants.${card.key}.title` as any)}</h3>
                      <p className="text-muted-foreground text-[13px] leading-relaxed mb-5">{t(`grants.${card.key}.description` as any)}</p>
                      <ul className="space-y-2 mb-7">
                        {[1, 2, 3].map((i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/70">
                            <CheckCircle className="w-4 h-4 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                            {t(`grants.${card.key}.feature${i}` as any)}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-3">
                        <Link href="/contact" data-testid={`link-apply-${card.key}`}>
                          <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-none text-[13px] h-10">
                            {isFr ? "Soumettre une demande" : "Apply"} <ArrowRight className="ml-2 w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {card.hasDiagnostic && (
                          <Button variant="outline" className="rounded-none text-[13px] h-10 border-[#1e3a5f]/30 text-[#1e3a5f] hover:bg-[#1e3a5f]/5"
                            onClick={() => openDiagnostic(card.key as DiagnosticCategory)} data-testid={`button-eligibility-${card.key}`}>
                            {isFr ? "Vérifier l'admissibilité" : "Check Eligibility"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ── 3. HOW IT WORKS — dark editorial numbered ── */}
        <section className="bg-[#1e3a5f] py-28" data-testid="section-grants-process">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-4">{isFr ? "Notre approche" : "Our Approach"}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
                {isFr ? "Comment ça fonctionne" : "How It Works"}
              </h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10">
              {[
                { num: "01", titleFr: "Évaluation initiale", textFr: "Analyse de votre profil, statut et projet pour identifier les subventions auxquelles vous êtes admissible.", titleEn: "Initial Assessment", textEn: "Analysis of your profile, status and project to identify eligible grants." },
                { num: "02", titleFr: "Identification des opportunités", textFr: "Sélection des programmes les mieux adaptés parmi des centaines d'options fédérales et provinciales.", titleEn: "Identify Opportunities", textEn: "Selection of the best-fit programs from hundreds of federal and provincial options." },
                { num: "03", titleFr: "Préparation du dossier", textFr: "Accompagnement dans la rédaction d'un dossier de demande solide, maximisant vos chances.", titleEn: "Application Prep", textEn: "Guided preparation of a strong application file, maximizing your approval odds." },
                { num: "04", titleFr: "Soumission & Suivi", textFr: "Soumission du dossier et suivi stratégique jusqu'à l'obtention de votre financement.", titleEn: "Submit & Follow-up", textEn: "Filing and strategic follow-up until your funding is secured." },
              ].map((step, i) => (
                <StaggerItem key={i} variant="fadeUp" className="bg-[#1e3a5f] p-8" data-testid={`step-process-${i + 1}`}>
                  <p className="text-[3.5rem] font-black text-white/8 leading-none mb-5">{step.num}</p>
                  <h3 className="font-bold text-white text-[16px] mb-3">{isFr ? step.titleFr : step.titleEn}</h3>
                  <p className="text-white/45 text-[13px] leading-relaxed">{isFr ? step.textFr : step.textEn}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── 4. TESTIMONIALS — white with horizontal carousel ── */}
        <section className="py-28 bg-white overflow-hidden" data-testid="section-grants-testimonials">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{isFr ? "Témoignages" : "Testimonials"}</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-lg">
                  {isFr ? <>Ce que disent <em className="not-italic text-primary">nos clients</em></> : <>What our <em className="not-italic text-primary">clients say</em></>}
                </h2>
              </div>
              <div className="hidden md:flex gap-2 flex-shrink-0">
                <button onClick={() => scrollCarousel("left")} className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted/40 transition-colors" data-testid="button-carousel-prev"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => scrollCarousel("right")} className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted/40 transition-colors" data-testid="button-carousel-next"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </FadeUp>
          </div>

          {/* Scrollable strip — bleeds to edges */}
          <div ref={carouselRef} className="flex gap-px overflow-x-auto scroll-smooth scrollbar-hide pl-6 md:pl-[max(24px,calc((100vw-72rem)/2+24px))]" style={{ scrollbarWidth: "none" }}>
            {TESTIMONIALS.map((t2, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex-shrink-0 w-[320px] md:w-[360px] bg-white border border-border p-8 group hover:bg-muted/20 transition-colors"
                data-testid={`card-grant-testimonial-${i}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {t2.initials}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-[15px]">{t2.name}</p>
                    <p className="text-[12px] text-muted-foreground">{t2.role}</p>
                  </div>
                </div>
                <p className="text-foreground/70 text-[14px] leading-relaxed italic">"{t2.quote}"</p>
              </motion.div>
            ))}
            {/* spacer */}
            <div className="flex-shrink-0 w-6 md:w-[max(24px,calc((100vw-72rem)/2+24px))]" />
          </div>
        </section>

        {/* ── 5. FINAL CTA — midnight blue ── */}
        <section className="bg-[#1e3a5f] py-28" data-testid="section-grants-cta">
          <FadeUp className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <div className="max-w-xl">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-5">{isFr ? "Passez à l'action" : "Take Action"}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {isFr ? "Prêt à accéder au financement que vous méritez ?" : "Ready to access the funding you deserve?"}
              </h2>
              <p className="text-white/50 text-[14px] leading-relaxed mt-5 max-w-md">
                {isFr ? "Ne laissez pas les subventions disponibles passer inaperçues. Notre équipe vous contactera sous 48 heures." : "Don't let available grants go unnoticed. Our team will contact you within 48 hours."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/contact" data-testid="link-grants-final-apply">
                <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {isFr ? "Soumettre une demande" : "Submit Application"} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/book" data-testid="link-grants-final-consult">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {isFr ? "Réserver une consultation" : "Book a Consultation"}
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
