import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, ArrowRight, Send, CheckCircle, User, CalendarDays, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import heroBg from "@assets/stock_images/hr_strategy.jpg";

const inputClass =
  "rounded-none border-0 border-b-2 border-black/20 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f] px-0 text-black placeholder:text-black/30 text-[15px] h-12 transition-colors";

const textareaClass =
  "rounded-none border border-black/15 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f] text-black placeholder:text-black/30 text-[14px] resize-none leading-relaxed";

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[11px] text-[#1e3a5f] font-bold uppercase tracking-[0.18em] mb-2.5">
      {children} <span className="text-[#1e3a5f]/40">*</span>
    </label>
  );
}

export default function Contact() {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [touched, setTouched] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = form.name && form.email && form.type && form.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setLoading(true);
    setSubmissionError(false);
    try {
      const res = await fetch("/api/contact-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Send failed");
      setIsSubmitted(true);
    } catch {
      setSubmissionError(true);
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = isFr
    ? ["Consultation individuelle", "Services aux entreprises", "Subventions & financement", "Autre"]
    : ["Individual Consultation", "Business Services", "Grants & Funding", "Other"];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(13,31,60,0.82) 0%, rgba(13,31,60,0.72) 60%, rgba(13,31,60,0.88) 100%)" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-40 pb-16 w-full">
          <div className="max-w-2xl">
            <p className="text-[11px] text-white/35 uppercase tracking-[0.25em] mb-6">
              {isFr ? "AudreyRH · Contact" : "AudreyRH · Contact"}
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.0] mb-6">
              {isFr ? "Parlons de votre projet" : "Let's talk about your project"}
              <span className="text-[#93c5fd]">.</span>
            </h1>
            <p className="text-white/55 text-[16px] leading-relaxed">
              {isFr
                ? "Une question, un projet, une idée ? Envoyez-nous un message et nous vous répondrons sous 24h."
                : "A question, a project, an idea? Send us a message and we'll get back to you within 24 hours."}
            </p>
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
                    {isFr ? "Avec qui vous échangerez" : "Who you'll meet"}
                  </p>
                </div>
                <h3 className="text-white text-[18px] font-bold mb-1 leading-snug">Audrey Mondesir</h3>
                <p className="text-white/45 text-[11px] uppercase tracking-[0.12em] mb-4">CRIA · Conseillère agréée</p>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  {isFr
                    ? "Conseillère en relations industrielles agréée avec 16 ans d'expérience. Audrey aide les particuliers et les organisations à atteindre leurs objectifs professionnels."
                    : "Certified Industrial Relations Advisor with 16+ years of experience. Audrey helps individuals and organizations achieve their professional goals."}
                </p>
              </div>

              <div className="py-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <p className="text-[10px] text-white/35 uppercase tracking-[0.22em]">
                    {isFr ? "Réserver une consultation" : "Book a consultation"}
                  </p>
                </div>
                <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                  {isFr
                    ? "Vous préférez échanger directement ? Choisissez un créneau disponible."
                    : "Prefer to speak directly? Pick an available slot."}
                </p>
                <a
                  href="/book"
                  data-testid="link-contact-book"
                  className="inline-flex items-center gap-3 text-white text-[11px] font-bold uppercase tracking-[0.18em] border border-white/25 px-5 py-3 hover:bg-white/8 transition-colors group w-full justify-center"
                >
                  {isFr ? "Réserver un appel gratuit" : "Book a free call"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="pt-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <p className="text-[10px] text-white/35 uppercase tracking-[0.22em]">
                    {isFr ? "Coordonnées" : "Contact details"}
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Email", value: "info@audreyrh.com" },
                    { label: isFr ? "Réponse" : "Response", value: "24 – 48h" },
                    { label: isFr ? "Confidentialité" : "Confidentiality", value: "100%" },
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
                      {isFr
                        ? "Toutes vos informations sont traitées de manière strictement confidentielle."
                        : "All your information is handled with strict confidentiality."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT — contact form ── */}
            <div className="lg:col-span-3 py-16 px-10 lg:px-16">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-24 gap-6"
                  >
                    <div className="w-16 h-16 bg-[#1e3a5f] flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">
                        {isFr ? "Message envoyé !" : "Message sent!"}
                      </h3>
                      <p className="text-black/50 text-[14px] leading-relaxed max-w-sm mx-auto">
                        {isFr
                          ? "Merci de nous avoir contactés. Audrey vous répondra dans les 24 à 48 heures."
                          : "Thank you for reaching out. Audrey will get back to you within 24 to 48 hours."}
                      </p>
                    </div>
                    <button
                      onClick={() => { setIsSubmitted(false); setForm({ name: "", email: "", type: "", message: "" }); setTouched(false); }}
                      className="text-[12px] text-[#1e3a5f] uppercase tracking-[0.15em] font-semibold underline underline-offset-4 mt-2"
                      data-testid="button-contact-reset"
                    >
                      {isFr ? "Envoyer un autre message" : "Send another message"}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[11px] text-[#1e3a5f] uppercase tracking-[0.2em] mb-3 font-semibold">
                      {isFr ? "Formulaire de contact" : "Contact form"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] leading-tight mb-2">
                      {isFr ? "Écrivez-nous" : "Write to us"}
                    </h2>
                    <div className="w-8 h-0.5 bg-[#1e3a5f] mb-10" />

                    <form onSubmit={handleSubmit} className="space-y-8" data-testid="form-contact">

                      <div>
                        <FieldLabel htmlFor="c-name">
                          {isFr ? "Prénom et nom" : "First and last name"}
                        </FieldLabel>
                        <Input
                          id="c-name"
                          value={form.name}
                          onChange={set("name")}
                          required
                          data-testid="input-contact-name"
                          placeholder={isFr ? "Marie Dupont" : "Jane Smith"}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <FieldLabel htmlFor="c-email">
                          {isFr ? "Adresse courriel" : "Email address"}
                        </FieldLabel>
                        <Input
                          id="c-email"
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          required
                          data-testid="input-contact-email"
                          placeholder="exemple@courriel.com"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <FieldLabel htmlFor="c-type">
                          {isFr ? "Sujet de votre message" : "Subject of your message"}
                        </FieldLabel>
                        <select
                          id="c-type"
                          value={form.type}
                          onChange={set("type")}
                          required
                          data-testid="select-contact-type"
                          className="w-full rounded-none border-0 border-b-2 border-black/20 bg-transparent focus:outline-none focus:border-[#1e3a5f] text-[15px] h-12 transition-colors text-black"
                        >
                          <option value="" disabled className="text-black/40">
                            {isFr ? "Sélectionner…" : "Select…"}
                          </option>
                          {typeOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <FieldLabel htmlFor="c-message">
                          {isFr ? "Votre message" : "Your message"}
                        </FieldLabel>
                        <Textarea
                          id="c-message"
                          value={form.message}
                          onChange={set("message")}
                          required
                          rows={6}
                          data-testid="textarea-contact-message"
                          placeholder={isFr
                            ? "Dites-nous comment nous pouvons vous aider…"
                            : "Tell us how we can help you…"}
                          className={textareaClass}
                        />
                      </div>

                      {touched && !isValid && (
                        <p className="text-red-500 text-[12px]">
                          {isFr ? "Veuillez remplir tous les champs." : "Please fill in all fields."}
                        </p>
                      )}

                      {submissionError && (
                        <p
                          className="text-red-600 text-[13px] bg-red-50 border border-red-200 rounded px-4 py-3 leading-relaxed"
                          data-testid="text-contact-submission-error"
                        >
                          {isFr
                            ? "Une erreur s'est produite lors de l'envoi. Veuillez réessayer plus tard."
                            : "An error occurred while sending. Please try again later."}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        data-testid="button-contact-submit"
                        className="flex items-center gap-3 bg-[#1e3a5f] text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#264d7a] disabled:opacity-50 transition-colors group"
                      >
                        {loading
                          ? (isFr ? "Envoi en cours…" : "Sending…")
                          : (isFr ? "Envoyer le message" : "Send message")}
                        {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      </button>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
