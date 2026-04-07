import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Lightbulb, Building2, Briefcase, ArrowRight, CheckCircle, DollarSign, Users, X, Calendar, Send, Plus, Minus } from "lucide-react";
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
    photo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    hasDiagnostic: true,
  },
  {
    key: "corporate",
    icon: Briefcase,
    photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    hasDiagnostic: false,
  },
];

const FAQS = [
  {
    qFr: "Qui peut faire une demande de subvention ?",
    qEn: "Who can apply for a grant?",
    aFr: "Les artistes, entrepreneurs, PMEs, OBNL et OBE établis au Québec peuvent faire une demande. Certains programmes s'adressent spécifiquement aux nouvelles arrivantes et nouveaux arrivants, aux minorités visibles ou aux femmes entrepreneures.",
    aEn: "Artists, entrepreneurs, SMEs, nonprofits (OBNL) and volunteer organizations (OBE) based in Quebec can apply. Some programs specifically target newcomers, visible minorities, or women entrepreneurs.",
  },
  {
    qFr: "Est-ce que je dois rembourser la subvention ?",
    qEn: "Do I have to repay the grant?",
    aFr: "Non — les subventions sont des financements non remboursables. Contrairement à un prêt, vous n'avez pas à rembourser les montants obtenus, à condition de respecter les conditions du programme.",
    aEn: "No — grants are non-repayable funding. Unlike a loan, you do not have to repay the amounts received, as long as you meet the program conditions.",
  },
  {
    qFr: "Combien de temps prend le processus de demande ?",
    qEn: "How long does the application process take?",
    aFr: "En général, de 4 à 12 semaines selon le programme. AudreyRH prépare votre dossier en 2 à 3 semaines, puis les délais de traitement varient selon l'organisme financeur.",
    aEn: "Generally 4 to 12 weeks depending on the program. AudreyRH prepares your file within 2 to 3 weeks; processing times then vary by funding body.",
  },
  {
    qFr: "Quels documents sont nécessaires pour une demande ?",
    qEn: "What documents are required for an application?",
    aFr: "Les exigences varient, mais on demande généralement : un plan d'affaires ou de projet, des états financiers récents, une preuve de statut légal et une description détaillée du projet. AudreyRH vous guide étape par étape.",
    aEn: "Requirements vary, but typically include: a business or project plan, recent financial statements, proof of legal status, and a detailed project description. AudreyRH guides you step by step.",
  },
  {
    qFr: "Puis-je faire plusieurs demandes en même temps ?",
    qEn: "Can I apply for multiple grants at once?",
    aFr: "Oui, c'est même recommandé. AudreyRH identifie tous les programmes auxquels vous êtes admissible et peut gérer plusieurs demandes simultanément pour maximiser votre financement total.",
    aEn: "Yes, and it's actually recommended. AudreyRH identifies all programs you qualify for and can manage multiple simultaneous applications to maximize your total funding.",
  },
  {
    qFr: "Quel est le coût de l'accompagnement AudreyRH ?",
    qEn: "What is the cost of AudreyRH's support?",
    aFr: "Une consultation initiale de 80 $ permet de faire le point sur votre situation et d'identifier vos opportunités. Les frais d'accompagnement pour la préparation de dossier sont discutés lors de cette consultation.",
    aEn: "An initial $80 consultation allows us to assess your situation and identify your opportunities. Coaching fees for application preparation are discussed during this consultation.",
  },
];

const STATS = [
  { from: 0, to: 4.5,  duration: 2,   suffix: "B$",  labelFr: "Financements disponibles/an",  labelEn: "Available funding / year" },
  { from: 0, to: 500,  duration: 2.5, suffix: "+",   labelFr: "Programmes identifiés",         labelEn: "Programs identified" },
  { from: 0, to: 92,   duration: 2.2, suffix: "%",   labelFr: "Taux de succès clients",        labelEn: "Client success rate" },
  { from: 0, to: 16,   duration: 1.8, suffix: " ans",labelFr: "D'expérience terrain",          labelEn: "Years of field expertise" },
];

const GRANT_EMPTY = {
  name: "", email: "", companyName: "", registrationInfo: "",
  cities: "", activities: "", fundingNeeds: "", dreams: "",
  pastGrants: "", employees: "", planToHire: "", openToInterns: "", desjardins: "",
};
type GrantForm = typeof GRANT_EMPTY;

export default function Grants() {
  const { t, language } = useLanguage();
  const isFr = language === "fr";

  const [diagnosticCategory, setDiagnosticCategory] = useState<DiagnosticCategory>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [grantForm, setGrantForm] = useState<GrantForm>(GRANT_EMPTY);
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantSubmitted, setGrantSubmitted] = useState(false);

  const setGF = (key: keyof GrantForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setGrantForm((f) => ({ ...f, [key]: e.target.value }));
  const setYN = (key: keyof GrantForm) => (val: string) =>
    setGrantForm((f) => ({ ...f, [key]: val }));

  const grantValid =
    grantForm.name && grantForm.email && grantForm.companyName && grantForm.registrationInfo &&
    grantForm.cities && grantForm.activities && grantForm.fundingNeeds && grantForm.dreams &&
    grantForm.pastGrants && grantForm.employees && grantForm.planToHire &&
    grantForm.openToInterns && grantForm.desjardins;

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantValid) return;
    setGrantLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grantForm),
      });
      if (!res.ok) throw new Error("failed");
      setGrantSubmitted(true);
    } catch {
      alert(isFr ? "Une erreur s'est produite. Veuillez réessayer." : "An error occurred. Please try again.");
    } finally {
      setGrantLoading(false);
    }
  };

  const rotatingWords = [t("grants.hero.rotating.1" as any), t("grants.hero.rotating.2" as any), t("grants.hero.rotating.3" as any)];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % 3);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const openDiagnostic = (category: DiagnosticCategory) => {
    setDiagnosticCategory(category); setStep(0); setAnswers([]);
    setShowQuestionnaire(false); setGrantForm(GRANT_EMPTY); setGrantSubmitted(false);
  };
  const closeDiagnostic = () => {
    setDiagnosticCategory(null);
    setShowQuestionnaire(false); setGrantForm(GRANT_EMPTY); setGrantSubmitted(false);
  };

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
              className={`bg-white w-full overflow-hidden flex flex-col shadow-2xl rounded-none transition-all duration-300 ${showQuestionnaire ? "max-w-2xl" : "max-w-lg"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#1e3a5f] px-7 py-5 flex items-start justify-between">
                <div>
                  <p className="text-[#93c5fd] text-[11px] font-semibold uppercase tracking-[0.2em] mb-1">
                    {showQuestionnaire
                      ? (isFr ? "Questionnaire de subventions" : "Grant questionnaire")
                      : (isFr ? "Diagnostic d'admissibilité" : "Admissibility Diagnostic")}
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    {showQuestionnaire
                      ? (isFr ? "Parlez-nous de votre organisation" : "Tell us about your organization")
                      : (diagnosticCategory ? (isFr ? categoryLabels[diagnosticCategory].fr : categoryLabels[diagnosticCategory].en) : "")}
                  </h2>
                </div>
                <button onClick={closeDiagnostic} className="text-white/50 hover:text-white transition-colors p-1 mt-0.5 flex-shrink-0" data-testid="button-close-diagnostic" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!showQuestionnaire && !isResult && (
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

              {/* Questionnaire view */}
              {showQuestionnaire ? (
                <div className="flex flex-col" style={{ maxHeight: "75vh" }}>
                  <div className="overflow-y-auto flex-1 px-7 py-6">
                    <AnimatePresence mode="wait">
                      {grantSubmitted ? (
                        <motion.div key="q-success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                          <div className="w-14 h-14 bg-[#1e3a5f] flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                            {isFr ? "Questionnaire envoyé !" : "Questionnaire submitted!"}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                            {isFr
                              ? "Merci pour vos réponses. Audrey communiquera avec vous dans les 24 à 48 heures."
                              : "Thank you for your answers. Audrey will get back to you within 24 to 48 hours."}
                          </p>
                          <button onClick={closeDiagnostic} className="text-[12px] text-[#1e3a5f] uppercase tracking-[0.15em] font-semibold underline underline-offset-4">
                            {isFr ? "Fermer" : "Close"}
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div key="q-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <p className="text-slate-400 text-[12px] leading-relaxed mb-6">
                            {isFr
                              ? "Remplissez ce questionnaire pour qu'Audrey identifie les meilleures subventions pour votre organisation."
                              : "Fill out this questionnaire so Audrey can identify the best grants for your organization."}
                          </p>
                          <form id="grant-q-form" onSubmit={handleGrantSubmit} className="space-y-5">
                            {/* Coordonnées */}
                            <p className="text-[10px] text-[#1e3a5f] font-bold uppercase tracking-[0.2em] border-b border-slate-100 pb-2">
                              {isFr ? "Vos coordonnées" : "Contact info"}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                  {isFr ? "Prénom et nom" : "Full name"} <span className="text-red-400">*</span>
                                </label>
                                <input value={grantForm.name} onChange={setGF("name")} required data-testid="input-grant-name"
                                  placeholder={isFr ? "Marie Dupont" : "Jane Smith"}
                                  className="w-full border-0 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[14px] h-10 text-slate-800 placeholder:text-slate-300 transition-colors" />
                              </div>
                              <div>
                                <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                  {isFr ? "Courriel" : "Email"} <span className="text-red-400">*</span>
                                </label>
                                <input type="email" value={grantForm.email} onChange={setGF("email")} required data-testid="input-grant-email"
                                  placeholder="exemple@organisation.com"
                                  className="w-full border-0 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[14px] h-10 text-slate-800 placeholder:text-slate-300 transition-colors" />
                              </div>
                            </div>
                            {/* Organisation */}
                            <p className="text-[10px] text-[#1e3a5f] font-bold uppercase tracking-[0.2em] border-b border-slate-100 pb-2 pt-2">
                              {isFr ? "Votre organisation" : "Your organization"}
                            </p>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr ? "Nom de l'entreprise" : "Company name"} <span className="text-red-400">*</span>
                              </label>
                              <input value={grantForm.companyName} onChange={setGF("companyName")} required data-testid="input-grant-company"
                                className="w-full border-0 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[14px] h-10 text-slate-800 transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr
                                  ? "Depuis quand et sous quelle forme êtes-vous enregistré(e) ?"
                                  : "Since when and in what form are you registered?"} <span className="text-red-400">*</span>
                              </label>
                              <textarea value={grantForm.registrationInfo} onChange={setGF("registrationInfo")} required rows={2} data-testid="textarea-grant-registration"
                                placeholder={isFr ? "Ex : depuis mars 2015, incorporé" : "e.g. Since March 2015, incorporated"}
                                className="w-full border border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[13px] text-slate-800 placeholder:text-slate-300 p-2.5 resize-none transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr ? "Ville(s) d'opération" : "City/cities of operation"} <span className="text-red-400">*</span>
                              </label>
                              <textarea value={grantForm.cities} onChange={setGF("cities")} required rows={2} data-testid="textarea-grant-cities"
                                placeholder={isFr ? "Ex : Montréal (siège social), Laval (évènements)" : "e.g. Montréal (head office), Laval (events)"}
                                className="w-full border border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[13px] text-slate-800 placeholder:text-slate-300 p-2.5 resize-none transition-colors" />
                            </div>
                            {/* Activités */}
                            <p className="text-[10px] text-[#1e3a5f] font-bold uppercase tracking-[0.2em] border-b border-slate-100 pb-2 pt-2">
                              {isFr ? "Activités & besoins" : "Activities & needs"}
                            </p>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr ? "Décrivez les activités de votre organisation" : "Describe your organization's activities"} <span className="text-red-400">*</span>
                              </label>
                              <textarea value={grantForm.activities} onChange={setGF("activities")} required rows={3} data-testid="textarea-grant-activities"
                                className="w-full border border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[13px] text-slate-800 p-2.5 resize-none transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr ? "Quels sont vos besoins de financement actuels ?" : "What are your current funding needs?"} <span className="text-red-400">*</span>
                              </label>
                              <textarea value={grantForm.fundingNeeds} onChange={setGF("fundingNeeds")} required rows={3} data-testid="textarea-grant-funding"
                                className="w-full border border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[13px] text-slate-800 p-2.5 resize-none transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr
                                  ? "Avez-vous des projets ou rêves non réalisés par manque de ressources ?"
                                  : "Are there projects or dreams you haven't pursued due to lack of resources?"} <span className="text-red-400">*</span>
                              </label>
                              <textarea value={grantForm.dreams} onChange={setGF("dreams")} required rows={3} data-testid="textarea-grant-dreams"
                                className="w-full border border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[13px] text-slate-800 p-2.5 resize-none transition-colors" />
                            </div>
                            {/* Historique */}
                            <p className="text-[10px] text-[#1e3a5f] font-bold uppercase tracking-[0.2em] border-b border-slate-100 pb-2 pt-2">
                              {isFr ? "Historique & ressources humaines" : "History & HR"}
                            </p>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr
                                  ? "Avez-vous déjà fait des demandes de subventions ? Si oui, lesquelles ?"
                                  : "Have you already applied for grants? If yes, which ones?"} <span className="text-red-400">*</span>
                              </label>
                              <textarea value={grantForm.pastGrants} onChange={setGF("pastGrants")} required rows={3} data-testid="textarea-grant-past"
                                placeholder={isFr ? "Ex : PSOC pour le financement à la mission, ou Aucune" : "e.g. PSOC for mission funding, or None"}
                                className="w-full border border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[13px] text-slate-800 placeholder:text-slate-300 p-2.5 resize-none transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1.5">
                                {isFr ? "Avez-vous des employés ? Si oui, combien ?" : "Do you have employees? If yes, how many?"} <span className="text-red-400">*</span>
                              </label>
                              <input value={grantForm.employees} onChange={setGF("employees")} required data-testid="input-grant-employees"
                                placeholder={isFr ? "Ex : Oui, 5 employés à temps plein" : "e.g. Yes, 5 full-time employees"}
                                className="w-full border-0 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[14px] h-10 text-slate-800 placeholder:text-slate-300 transition-colors" />
                            </div>
                            {/* Finances / Yes-No */}
                            <p className="text-[10px] text-[#1e3a5f] font-bold uppercase tracking-[0.2em] border-b border-slate-100 pb-2 pt-2">
                              {isFr ? "Finances" : "Finances"}
                            </p>
                            {[
                              {
                                key: "planToHire" as const,
                                label: isFr
                                  ? "Planifiez-vous embaucher des ressources humaines d'ici la prochaine année ?"
                                  : "Are you planning to hire human resources in the next year?",
                                testId: "yn-hire",
                              },
                              {
                                key: "openToInterns" as const,
                                label: isFr
                                  ? "Seriez-vous ouvert(e) à accueillir un(e) stagiaire subventionné(e) ?"
                                  : "Would you be open to hosting a subsidized intern?",
                                testId: "yn-interns",
                              },
                              {
                                key: "desjardins" as const,
                                label: isFr
                                  ? "Êtes-vous membre de la Caisse Desjardins ?"
                                  : "Are you a Caisse Desjardins member?",
                                testId: "yn-desjardins",
                              },
                            ].map(({ key, label, testId }) => (
                              <div key={key}>
                                <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-[0.14em] mb-2">
                                  {label} <span className="text-red-400">*</span>
                                </label>
                                <div className="flex gap-3">
                                  {(isFr ? ["Oui", "Non"] : ["Yes", "No"]).map((opt) => {
                                    const val = opt === "Oui" || opt === "Yes" ? "oui" : "non";
                                    const active = grantForm[key] === val;
                                    return (
                                      <button key={opt} type="button"
                                        data-testid={`${testId}-${val}`}
                                        onClick={() => setYN(key)(active ? "" : val)}
                                        className={`px-7 py-2 text-[11px] font-bold uppercase tracking-[0.15em] border transition-colors ${active ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-transparent text-[#1e3a5f] border-slate-200 hover:border-[#1e3a5f]/50"}`}>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {!grantSubmitted && (
                    <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0">
                      <button onClick={() => setShowQuestionnaire(false)} className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                        ← {isFr ? "Retour" : "Back"}
                      </button>
                      <button form="grant-q-form" type="submit" disabled={grantLoading || !grantValid}
                        data-testid="button-grant-submit"
                        className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#264d7a] disabled:opacity-40 transition-colors">
                        {grantLoading ? (isFr ? "Envoi…" : "Sending…") : (isFr ? "Envoyer à Audrey" : "Send to Audrey")}
                        {!grantLoading && <Send className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                                {isFr ? "Votre profil correspond aux critères. Complétez le questionnaire pour qu'Audrey identifie vos subventions." : "Your profile meets the criteria. Complete the questionnaire so Audrey can identify your grants."}
                              </p>
                              <Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12 mb-3" size="lg" onClick={() => setShowQuestionnaire(true)} data-testid="button-result-questionnaire">
                                <Send className="mr-2 w-4 h-4" />{isFr ? "Compléter le questionnaire" : "Complete the questionnaire"}
                              </Button>
                              <Link href="/book"><button className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors" onClick={closeDiagnostic} data-testid="button-result-book">
                                <Calendar className="inline w-3.5 h-3.5 mr-1" />{isFr ? "Ou réserver une consultation →" : "Or book a consultation →"}
                              </button></Link>
                            </div>
                          )}
                          {result === "early" && (
                            <div className="text-center">
                              <div className="w-14 h-14 bg-amber-50 flex items-center justify-center mx-auto mb-4"><Lightbulb className="w-7 h-7 text-amber-500" /></div>
                              <div className="inline-block bg-amber-100 text-amber-700 text-[11px] font-bold px-3 py-1 uppercase tracking-widest mb-3">{isFr ? "Phase de démarrage" : "Early Stage"}</div>
                              <h3 className="text-xl font-bold text-foreground mb-2">{isFr ? "Conseils prioritaires requis" : "Priority Advice Needed"}</h3>
                              <p className="text-slate-500 text-sm leading-relaxed mb-5">{isFr ? "Formalisez d'abord votre structure. Complétez le questionnaire pour un accompagnement personnalisé." : "Formalize your structure first. Complete the questionnaire for personalized guidance."}</p>
                              <Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12 mb-3" size="lg" onClick={() => setShowQuestionnaire(true)} data-testid="button-result-questionnaire-early">
                                <Send className="mr-2 w-4 h-4" />{isFr ? "Compléter le questionnaire" : "Complete the questionnaire"}
                              </Button>
                            </div>
                          )}
                          {result === "review" && (
                            <div className="text-center">
                              <div className="w-14 h-14 bg-slate-100 flex items-center justify-center mx-auto mb-4"><Users className="w-7 h-7 text-slate-500" /></div>
                              <div className="inline-block bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 uppercase tracking-widest mb-3">{isFr ? "Révision requise" : "Review Required"}</div>
                              <h3 className="text-xl font-bold text-foreground mb-2">{isFr ? "Analyse individuelle nécessaire" : "Individual Review Needed"}</h3>
                              <p className="text-slate-500 text-sm leading-relaxed mb-5">{isFr ? "Votre profil mérite une analyse approfondie. Complétez le questionnaire pour qu'Audrey évalue votre dossier." : "Your profile merits deeper analysis. Complete the questionnaire for an expert review."}</p>
                              <Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white font-semibold rounded-none h-12 mb-3" size="lg" onClick={() => setShowQuestionnaire(true)} data-testid="button-result-questionnaire-review">
                                <Send className="mr-2 w-4 h-4" />{isFr ? "Compléter le questionnaire" : "Complete the questionnaire"}
                              </Button>
                            </div>
                          )}
                          <button className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors mt-1" onClick={() => { setStep(0); setAnswers([]); }} data-testid="button-restart-diagnostic">
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
                </>
              )}
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
              {isFr ? "Le financement qui" : "The funding that"}{" "}
              <span key={wordIndex} className="inline-block text-[#93c5fd] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {rotatingWords[wordIndex]}
              </span>
              <br />
              {isFr ? "votre projet" : "your project"}<span className="text-orange-400">.</span>
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

        {/* ── 3. HOW IT WORKS — solid dark navy ── */}
        <section className="py-28 bg-[#0d1f3c]" data-testid="section-grants-process">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-4">{isFr ? "Notre approche" : "Our Approach"}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
                {isFr ? "Comment ça fonctionne" : "How It Works"}
              </h2>
            </FadeUp>
            <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10">
              {[
                { titleFr: "Évaluation initiale", textFr: "Analyse de votre profil, statut et projet pour identifier les subventions auxquelles vous êtes admissible.", titleEn: "Initial Assessment", textEn: "Analysis of your profile, status and project to identify eligible grants." },
                { titleFr: "Identification des opportunités", textFr: "Sélection des programmes les mieux adaptés parmi des centaines d'options fédérales et provinciales.", titleEn: "Identify Opportunities", textEn: "Selection of the best-fit programs from hundreds of federal and provincial options." },
                { titleFr: "Préparation du dossier", textFr: "Accompagnement dans la rédaction d'un dossier de demande solide, maximisant vos chances.", titleEn: "Application Prep", textEn: "Guided preparation of a strong application file, maximizing your approval odds." },
                { titleFr: "Soumission & Suivi", textFr: "Soumission du dossier et suivi stratégique jusqu'à l'obtention de votre financement.", titleEn: "Submit & Follow-up", textEn: "Filing and strategic follow-up until your funding is secured." },
              ].map((step, i) => (
                <StaggerItem key={i} variant="fadeUp" className="bg-white/5 border border-white/10 p-8" data-testid={`step-process-${i + 1}`}>
                  <h3 className="font-bold text-white text-[16px] mb-3">{isFr ? step.titleFr : step.titleEn}</h3>
                  <p className="text-white/70 text-[13px] leading-relaxed">{isFr ? step.textFr : step.textEn}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── 4. FAQ ── */}
        <section className="py-28 bg-white" data-testid="section-grants-faq">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-16 items-start">

              {/* Left — sticky label + heading */}
              <FadeUp className="md:sticky md:top-32">
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-5">
                  {isFr ? "Questions fréquentes" : "Frequently Asked"}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                  {isFr ? <>Tout ce que vous devez <em className="not-italic text-primary">savoir</em></> : <>Everything you need to <em className="not-italic text-primary">know</em></>}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
                  {isFr ? "Des réponses claires sur le processus de subvention, les conditions d'admissibilité et l'accompagnement AudreyRH." : "Clear answers about the grant process, eligibility requirements, and AudreyRH's support."}
                </p>
                <Link href="/contact" data-testid="link-faq-contact">
                  <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-none h-11 px-6 text-[13px]">
                    {isFr ? "Poser une autre question" : "Ask Another Question"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </FadeUp>

              {/* Right — accordion */}
              <div className="divide-y divide-border border-t border-border">
                {FAQS.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} data-testid={`faq-item-${i}`}>
                      <button
                        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        data-testid={`faq-toggle-${i}`}
                      >
                        <span className="font-semibold text-[16px] text-foreground group-hover:text-[#1e3a5f] transition-colors leading-snug">
                          {isFr ? faq.qFr : faq.qEn}
                        </span>
                        <span className="flex-shrink-0 w-7 h-7 border border-border flex items-center justify-center text-muted-foreground group-hover:border-[#1e3a5f] group-hover:text-[#1e3a5f] transition-colors">
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[14px] text-muted-foreground leading-relaxed pb-6 max-w-lg">
                              {isFr ? faq.aFr : faq.aEn}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
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
