import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, ArrowRight, Send, CheckCircle, User, CalendarDays, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import heroBg from "@assets/stock_images/hr_strategy.jpg";

type FormState = {
  name: string;
  email: string;
  companyName: string;
  registrationInfo: string;
  cities: string;
  activities: string;
  fundingNeeds: string;
  dreams: string;
  pastGrants: string;
  employees: string;
  planToHire: string;
  openToInterns: string;
  desjardins: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  companyName: "",
  registrationInfo: "",
  cities: "",
  activities: "",
  fundingNeeds: "",
  dreams: "",
  pastGrants: "",
  employees: "",
  planToHire: "",
  openToInterns: "",
  desjardins: "",
};

function YesNo({
  value,
  onChange,
  testId,
}: {
  value: string;
  onChange: (v: string) => void;
  testId: string;
}) {
  return (
    <div className="flex gap-3 mt-1">
      {["Oui", "Non"].map((opt) => {
        const val = opt.toLowerCase();
        const active = value === val;
        return (
          <button
            key={opt}
            type="button"
            data-testid={`${testId}-${val}`}
            onClick={() => onChange(active ? "" : val)}
            className={`px-8 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] border transition-colors ${
              active
                ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                : "bg-transparent text-[#1e3a5f] border-black/20 hover:border-[#1e3a5f]/50"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] text-[#1e3a5f] font-bold uppercase tracking-[0.18em] mb-2.5"
    >
      {children} <span className="text-[#1e3a5f]/50">*</span>
    </label>
  );
}

const inputClass =
  "rounded-none border-0 border-b-2 border-black/20 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f] px-0 text-black placeholder:text-black/30 text-[15px] h-12 transition-colors";

const textareaClass =
  "rounded-none border border-black/15 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f] text-black placeholder:text-black/30 text-[14px] resize-none leading-relaxed";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 pt-4">
      <p className="text-[10px] text-[#1e3a5f]/50 font-bold uppercase tracking-[0.22em] whitespace-nowrap">{label}</p>
      <div className="flex-1 h-px bg-black/8" />
    </div>
  );
}

export default function Contact() {
  const { language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid =
    form.name && form.email && form.companyName && form.registrationInfo &&
    form.cities && form.activities && form.fundingNeeds && form.dreams &&
    form.pastGrants && form.employees && form.planToHire && form.openToInterns && form.desjardins;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Send failed");
      setIsSubmitted(true);
    } catch {
      alert("Une erreur s'est produite. Veuillez réessayer. / An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[72vh] flex flex-col justify-end overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(13,31,60,0.82) 0%, rgba(13,31,60,0.72) 60%, rgba(13,31,60,0.88) 100%)" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-40 pb-20 w-full">
          <div className="max-w-3xl">
            <p className="text-[11px] text-white/35 uppercase tracking-[0.25em] mb-6">
              {language === "en" ? "Grant Research · Contact" : "Recherche de subventions · Contact"}
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-7">
              {language === "en" ? "Grant questionnaire" : "Questionnaire subventions"}
              <span className="text-[#93c5fd]">.</span>
            </h1>
            <p className="text-white/55 text-[16px] md:text-[18px] leading-relaxed max-w-xl">
              {language === "en"
                ? "Help us find the best grants for your organization. All answers are strictly confidential."
                : "Aidez-nous à trouver les meilleures subventions pour votre organisation. Toutes vos réponses sont strictement confidentielles."}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-px bg-white/10 max-w-xl">
            {[
              { num: "24h", label: language === "en" ? "Response time" : "Délai de réponse" },
              { num: "16+", label: language === "en" ? "Years experience" : "Ans d'expérience" },
              { num: "100%", label: language === "en" ? "Confidential" : "Confidentiel" },
            ].map((s) => (
              <div key={s.num} className="bg-[#1e3a5f]/60 px-6 py-5">
                <p className="text-2xl font-black text-white mb-1">{s.num}</p>
                <p className="text-white/45 text-[11px] uppercase tracking-[0.12em] leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* ── LEFT SIDEBAR ── */}
            <div className="lg:col-span-2 bg-[#1e3a5f] py-16 px-10 flex flex-col divide-y divide-white/10">

              <div className="pb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <p className="text-[10px] text-white/35 uppercase tracking-[0.22em]">
                    {language === "en" ? "Who you'll meet" : "Avec qui vous échangerez"}
                  </p>
                </div>
                <h3 className="text-white text-[18px] font-bold mb-1 leading-snug">Audrey Mondesir</h3>
                <p className="text-white/45 text-[11px] uppercase tracking-[0.12em] mb-4">CRIA · Conseillère agréée</p>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  {language === "en"
                    ? "Certified Industrial Relations Advisor with 16+ years of experience. Audrey specialises in helping organizations access grants and HR funding."
                    : "Conseillère en relations industrielles agréée avec 16 ans d'expérience. Audrey aide les organisations à accéder aux subventions et aux financements RH."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["CRIA", "Subventions", "PME", "Montréal"].map((tag) => (
                    <span key={tag} className="text-[10px] text-white/40 border border-white/12 px-2.5 py-1 uppercase tracking-[0.1em]">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="py-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <p className="text-[10px] text-white/35 uppercase tracking-[0.22em]">
                    {language === "en" ? "Book a consultation" : "Réserver une consultation"}
                  </p>
                </div>
                <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                  {language === "en"
                    ? "Prefer to speak directly? Pick an available slot and we'll confirm within 24 hours."
                    : "Vous préférez échanger directement ? Choisissez un créneau et nous confirmons sous 24h."}
                </p>
                <a
                  href="/book"
                  data-testid="link-contact-book"
                  className="inline-flex items-center gap-3 text-white text-[11px] font-bold uppercase tracking-[0.18em] border border-white/25 px-5 py-3 hover:bg-white/8 transition-colors group w-full justify-center"
                >
                  {language === "en" ? "Book a free call" : "Réserver un appel gratuit"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="pt-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <p className="text-[10px] text-white/35 uppercase tracking-[0.22em]">
                    {language === "en" ? "Contact" : "Coordonnées"}
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Email", value: "info@audreyrh.com" },
                    { label: language === "en" ? "Response" : "Réponse", value: "24 – 48h" },
                    { label: language === "en" ? "Confidentiality" : "Confidentialité", value: "100%" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4 text-[13px]">
                      <span className="text-white/35 flex-shrink-0">{label}</span>
                      <span className="text-white text-right font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                    <p className="text-white/40 text-[12px] leading-relaxed">
                      {language === "en"
                        ? "Rest assured of the confidentiality of all information you share with us."
                        : "Soyez assuré(e) de la confidentialité des données que vous nous partagez."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT — questionnaire form ── */}
            <div className="lg:col-span-3 py-16 px-10 lg:px-16">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20 gap-6"
                  >
                    <div className="w-16 h-16 bg-[#1e3a5f] flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">
                        {language === "en" ? "Questionnaire submitted!" : "Questionnaire envoyé !"}
                      </h3>
                      <p className="text-black/50 text-[14px] leading-relaxed max-w-sm mx-auto">
                        {language === "en"
                          ? "Thank you for your answers. Audrey will get back to you within 24 to 48 hours."
                          : "Merci pour vos réponses. Audrey communiquera avec vous dans les 24 à 48 heures."}
                      </p>
                    </div>
                    <button
                      onClick={() => { setIsSubmitted(false); setForm(EMPTY); }}
                      className="text-[12px] text-[#1e3a5f] uppercase tracking-[0.15em] font-semibold underline underline-offset-4 mt-2"
                    >
                      {language === "en" ? "Submit another" : "Envoyer un autre questionnaire"}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <p className="text-[11px] text-[#1e3a5f] uppercase tracking-[0.2em] mb-3 font-semibold">
                      {language === "en" ? "Grant research" : "Recherche de subventions"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] leading-tight mb-2">
                      {language === "en" ? "Tell us about your organization" : "Parlez-nous de votre organisation"}
                    </h2>
                    <div className="w-8 h-0.5 bg-[#1e3a5f] mb-8" />
                    <p className="text-black/45 text-[13px] leading-relaxed mb-10">
                      {language === "en"
                        ? "In order to optimise the grant research for your organization, please answer the following questions. Thank you!"
                        : "Dans le but d'optimiser la recherche de subventions pour votre organisation, veuillez répondre aux questions suivantes. Merci !"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-7" data-testid="form-contact">

                      {/* ── Section 1: Coordonnées ── */}
                      <SectionDivider label={language === "en" ? "Your contact info" : "Vos coordonnées"} />

                      <div>
                        <FieldLabel htmlFor="q-name">
                          {language === "en" ? "First and last name" : "Prénom et nom de famille"}
                        </FieldLabel>
                        <Input id="q-name" value={form.name} onChange={set("name")} required
                          data-testid="input-contact-name"
                          placeholder={language === "en" ? "Jane Smith" : "Marie Dupont"}
                          className={inputClass} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="q-email">
                          {language === "en" ? "Your email address" : "Votre adresse courriel"}
                        </FieldLabel>
                        <Input id="q-email" type="email" value={form.email} onChange={set("email")} required
                          data-testid="input-contact-email"
                          placeholder="exemple@organisation.com"
                          className={inputClass} />
                      </div>

                      {/* ── Section 2: Organisation ── */}
                      <SectionDivider label={language === "en" ? "Your organization" : "Votre organisation"} />

                      <div>
                        <FieldLabel htmlFor="q-company">
                          {language === "en" ? "Company or organization name" : "Nom de l'entreprise ou organisme"}
                        </FieldLabel>
                        <Input id="q-company" value={form.companyName} onChange={set("companyName")} required
                          data-testid="input-contact-company"
                          placeholder={language === "en" ? "Acme Inc." : "Mon Organisation inc."}
                          className={inputClass} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="q-registration">
                          {language === "en"
                            ? "Since what year are you registered and in what form? (e.g., since November 2008, incorporated)"
                            : "Depuis quelle année êtes-vous enregistré comme entreprise et sous quelle forme ? (Ex : depuis novembre 2008, incorporé)"}
                        </FieldLabel>
                        <Textarea id="q-registration" value={form.registrationInfo} onChange={set("registrationInfo")} required
                          data-testid="textarea-contact-registration"
                          rows={2}
                          placeholder={language === "en" ? "e.g., Since March 2015, incorporated" : "Ex : Depuis mars 2015, incorporé"}
                          className={textareaClass} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="q-cities">
                          {language === "en"
                            ? "In which city is your business registered? If you have service points or events in other cities, please list them too."
                            : "Dans quelle ville votre entreprise est-elle enregistrée ? Si vous avez des points de services ou des évènements dans d'autres villes, veuillez les nommer aussi."}
                        </FieldLabel>
                        <Textarea id="q-cities" value={form.cities} onChange={set("cities")} required
                          data-testid="textarea-contact-cities"
                          rows={2}
                          placeholder={language === "en" ? "e.g., Montréal (head office), Laval (events)" : "Ex : Montréal (siège social), Laval (évènements)"}
                          className={textareaClass} />
                      </div>

                      {/* ── Section 3: Activités & Besoins ── */}
                      <SectionDivider label={language === "en" ? "Activities & needs" : "Activités & besoins"} />

                      <div>
                        <FieldLabel htmlFor="q-activities">
                          {language === "en" ? "Describe your company's activities" : "Décrivez-nous les activités de votre entreprise"}
                        </FieldLabel>
                        <Textarea id="q-activities" value={form.activities} onChange={set("activities")} required
                          data-testid="textarea-contact-activities"
                          rows={4}
                          placeholder={language === "en" ? "Describe what your organization does..." : "Décrivez ce que fait votre organisation..."}
                          className={textareaClass} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="q-funding">
                          {language === "en"
                            ? "What are your current funding needs? (e.g., subsidize the salary of an assistant position, funding for project XYZ, etc.)"
                            : "Quels sont les besoins que vous éprouvez en ce moment au niveau du financement ? (Exemple : subventionner le salaire du poste d'adjointe, financement pour le projet XYZ, etc.)"}
                        </FieldLabel>
                        <Textarea id="q-funding" value={form.fundingNeeds} onChange={set("fundingNeeds")} required
                          data-testid="textarea-contact-funding"
                          rows={4}
                          placeholder={language === "en" ? "Describe your funding needs..." : "Décrivez vos besoins de financement..."}
                          className={textareaClass} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="q-dreams">
                          {language === "en"
                            ? "Are there projects or dreams you're not pursuing due to lack of resources, that you would start if you had them?"
                            : "Avez-vous des projets ou même des rêves que vous ne réalisez pas par manque de ressources, et que si vous les auriez vous mettriez votre projet en marche ?"}
                        </FieldLabel>
                        <Textarea id="q-dreams" value={form.dreams} onChange={set("dreams")} required
                          data-testid="textarea-contact-dreams"
                          rows={4}
                          placeholder={language === "en" ? "Describe your unrealized projects..." : "Décrivez vos projets non encore réalisés..."}
                          className={textareaClass} />
                      </div>

                      {/* ── Section 4: Historique & RH ── */}
                      <SectionDivider label={language === "en" ? "History & HR" : "Historique & ressources humaines"} />

                      <div>
                        <FieldLabel htmlFor="q-past-grants">
                          {language === "en"
                            ? "Have you already applied for grants or taken steps? If yes, name the grant and the project it funded. (e.g., PSOC for mission funding, Services-Québec for HR training)"
                            : "Avez-vous déjà fait des demandes de subventions ou entrepris des démarches ? Si oui, nommer la subvention ainsi que le projet. (Ex : PSOC pour le financement à la mission, Services-Québec pour la formation en ressources humaines)"}
                        </FieldLabel>
                        <Textarea id="q-past-grants" value={form.pastGrants} onChange={set("pastGrants")} required
                          data-testid="textarea-contact-past-grants"
                          rows={4}
                          placeholder={language === "en" ? "e.g., PSOC for mission funding, or None" : "Ex : PSOC pour le financement à la mission, ou Aucune"}
                          className={textareaClass} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="q-employees">
                          {language === "en" ? "Do you have employees? If yes, how many?" : "Avez-vous des employés ? Si oui, combien ?"}
                        </FieldLabel>
                        <Input id="q-employees" value={form.employees} onChange={set("employees")} required
                          data-testid="input-contact-employees"
                          placeholder={language === "en" ? "e.g., Yes, 5 full-time employees" : "Ex : Oui, 5 employés à temps plein"}
                          className={inputClass} />
                      </div>

                      <div>
                        <FieldLabel>
                          {language === "en"
                            ? "Are you planning to hire human resources in the next year?"
                            : "Planifiez-vous embaucher des ressources humaines d'ici la prochaine année ?"}
                        </FieldLabel>
                        <YesNo value={form.planToHire} onChange={(v) => setForm((f) => ({ ...f, planToHire: v }))} testId="radio-hire" />
                      </div>

                      <div>
                        <FieldLabel>
                          {language === "en"
                            ? "Are you open to having interns in your company or organization?"
                            : "Êtes-vous ouvert(e) à l'idée d'avoir des stagiaires dans votre entreprise ou organisme ?"}
                        </FieldLabel>
                        <YesNo value={form.openToInterns} onChange={(v) => setForm((f) => ({ ...f, openToInterns: v }))} testId="radio-interns" />
                      </div>

                      {/* ── Section 5: Financier ── */}
                      <SectionDivider label={language === "en" ? "Financial" : "Informations financières"} />

                      <div>
                        <FieldLabel>
                          {language === "en"
                            ? "Is your business bank account at Desjardins?"
                            : "Est-ce que votre compte bancaire entreprise est chez Desjardins ?"}
                        </FieldLabel>
                        <p className="text-[12px] text-black/40 mb-3 leading-relaxed">
                          {language === "en"
                            ? "Desjardins offers various forms of donations, sponsorships, and grants to its clients — we want to verify your eligibility."
                            : "Desjardins offre différentes formes de dons, commandites et subventions à leurs clients — nous désirons vérifier votre admissibilité."}
                        </p>
                        <YesNo value={form.desjardins} onChange={(v) => setForm((f) => ({ ...f, desjardins: v }))} testId="radio-desjardins" />
                      </div>

                      {/* ── Submit ── */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading || !isValid}
                          data-testid="button-contact-submit"
                          className="w-full bg-[#1e3a5f] text-white py-5 text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-35 hover:bg-[#162c48] transition-colors"
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                              {language === "en" ? "Sending..." : "Envoi en cours..."}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              {language === "en" ? "Submit questionnaire" : "Envoyer le questionnaire"}
                            </>
                          )}
                        </button>
                        <p className="text-[11px] text-black/35 text-center mt-5 leading-relaxed">
                          {language === "en"
                            ? "Your information is strictly confidential and will only be used for grant research purposes."
                            : "Vos informations sont strictement confidentielles et utilisées uniquement à des fins de recherche de subventions."}
                        </p>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── Closing CTA strip ── */}
      <section className="bg-[#1e3a5f] py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] text-white/35 uppercase tracking-[0.22em] mb-3">
              {language === "en" ? "Ready to take the next step?" : "Prêt à passer à l'action ?"}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">
              {language === "en"
                ? "Book your free 15-minute discovery call"
                : "Réservez votre appel découverte gratuit de 15 minutes"}
            </h3>
          </div>
          <a
            href="/book"
            data-testid="link-contact-closing-cta"
            className="flex-shrink-0 inline-flex items-center gap-3 bg-white text-[#1e3a5f] text-[12px] font-bold uppercase tracking-[0.18em] px-8 py-4 hover:bg-white/90 transition-colors group"
          >
            {language === "en" ? "Book a free call" : "Réserver un appel gratuit"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
