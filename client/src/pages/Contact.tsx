import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, Clock, ArrowRight, Send, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import bokehBg from "@assets/IMM_1768534974735.png";
import audreyPhoto from "@assets/FB_IMG_1767723555659_(1)_1767841722642.jpg";

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    grantType: "",
    projectDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.grantType || !form.projectDescription) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Send failed');
      setIsSubmitted(true);
    } catch {
      alert(t("contact.form.errorMessage") || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setForm({ name: "", email: "", grantType: "", projectDescription: "" });
  };

  const grantTypes = [
    { value: "artists", labelKey: "grants.artists.title" },
    { value: "entrepreneurs", labelKey: "grants.entrepreneurs.title" },
    { value: "sme", labelKey: "grants.sme.title" },
    { value: "corporate", labelKey: "grants.corporate.title" },
    { value: "other", labelKey: "contact.grantType.other" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO — bokeh city bg ── */}
      <section className="relative min-h-[72vh] flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        <img
          src={bokehBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Midnight blue overlay — light enough to see the bokeh */}
        <div className="absolute inset-0 bg-[#1e3a5f]/55" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-40 pb-20 w-full">
          <div className="max-w-3xl">
            <p className="text-[11px] text-white/35 uppercase tracking-[0.25em] mb-6">{t("contact.badge")}</p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-7">
              {t("contact.title")}<span className="text-orange-400">.</span>
            </h1>
            <p className="text-white/55 text-[16px] md:text-[18px] leading-relaxed max-w-xl">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-px bg-white/10 max-w-xl">
            {[
              { num: "24h", label: t("contact.info.responseTime") },
              { num: "16+", label: "Ans d'expérience" },
              { num: "95%", label: "Satisfaction client" },
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

            {/* ── LEFT — midnight blue sidebar ── */}
            <div className="lg:col-span-2 bg-[#1e3a5f] py-16 px-10 flex flex-col gap-10">

              {/* Audrey photo */}
              <div className="relative">
                <img
                  src={audreyPhoto}
                  alt="Audrey Mondesir, CRIA"
                  className="w-full h-56 object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#162c48]/90 px-4 py-3">
                  <p className="text-white text-[13px] font-bold">Audrey Mondesir</p>
                  <p className="text-white/45 text-[10px] uppercase tracking-[0.12em]">CRIA · Conseillère agréée</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-7">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.25em]">{t("contact.info.title")}</p>

                <div className="flex items-start gap-4" data-testid="contact-email-info">
                  <div className="w-8 h-8 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.12em] mb-1">{t("contact.info.email")}</p>
                    <a href="mailto:info@audreyrh.com" className="text-white text-[14px] font-semibold hover:text-white/80 transition-colors">
                      info@audreyrh.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-location-info">
                  <div className="w-8 h-8 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.12em] mb-1">{t("contact.info.location")}</p>
                    <p className="text-white text-[14px] font-semibold">Montréal, Québec</p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-response-info">
                  <div className="w-8 h-8 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.12em] mb-1">{t("contact.info.response")}</p>
                    <p className="text-white text-[14px] font-semibold">{t("contact.info.responseTime")}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Book CTA */}
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-4">{t("contact.sidebar.consultTitle")}</p>
                <p className="text-white/55 text-[13px] leading-relaxed mb-6">
                  {t("contact.sidebar.consultText")}
                </p>
                <a
                  href="/book"
                  data-testid="link-contact-book"
                  className="inline-flex items-center gap-3 text-white text-[12px] font-bold uppercase tracking-[0.15em] border border-white/20 px-5 py-3 hover:bg-white/8 transition-colors group"
                >
                  {t("contact.sidebar.consultCta")}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* ── RIGHT — form ── */}
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
                      <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">Message envoyé !</h3>
                      <p className="text-black/50 text-[14px] leading-relaxed max-w-sm mx-auto">
                        Merci pour votre message. Audrey vous répondra dans les 24 heures.
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-[12px] text-[#1e3a5f] uppercase tracking-[0.15em] font-semibold underline underline-offset-4 mt-2"
                    >
                      Envoyer un autre message
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
                    <p className="text-[11px] text-[#1e3a5f]/40 uppercase tracking-[0.2em] mb-3">{t("contact.form.title")}</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] leading-tight mb-2">
                      {t("contact.form.subtitle")}
                    </h2>
                    <div className="w-8 h-0.5 bg-orange-400 mb-10" />

                    <form onSubmit={handleSubmit} className="space-y-8" data-testid="form-contact">

                      {/* Name */}
                      <div>
                        <label className="block text-[10px] text-[#1e3a5f]/50 uppercase tracking-[0.18em] mb-2.5" htmlFor="contact-name">
                          {t("contact.form.name")} <span className="text-[#1e3a5f]/30">*</span>
                        </label>
                        <Input
                          id="contact-name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={t("contact.form.namePlaceholder")}
                          required
                          data-testid="input-contact-name"
                          className="rounded-none border-0 border-b-2 border-[#1e3a5f]/12 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f]/50 px-0 text-[#1e3a5f] placeholder:text-[#1e3a5f]/25 text-[15px] h-12 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] text-[#1e3a5f]/50 uppercase tracking-[0.18em] mb-2.5" htmlFor="contact-email">
                          {t("contact.form.email")} <span className="text-[#1e3a5f]/30">*</span>
                        </label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder={t("contact.form.emailPlaceholder")}
                          required
                          data-testid="input-contact-email"
                          className="rounded-none border-0 border-b-2 border-[#1e3a5f]/12 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f]/50 px-0 text-[#1e3a5f] placeholder:text-[#1e3a5f]/25 text-[15px] h-12 transition-colors"
                        />
                      </div>

                      {/* Grant Type */}
                      <div>
                        <label className="block text-[10px] text-[#1e3a5f]/50 uppercase tracking-[0.18em] mb-2.5">
                          {t("contact.form.grantType")} <span className="text-[#1e3a5f]/30">*</span>
                        </label>
                        <Select
                          value={form.grantType}
                          onValueChange={(val) => setForm({ ...form, grantType: val })}
                        >
                          <SelectTrigger
                            data-testid="select-grant-type"
                            className="rounded-none border-0 border-b-2 border-[#1e3a5f]/12 bg-transparent focus:ring-0 px-0 text-[15px] text-[#1e3a5f] h-12 data-[placeholder]:text-[#1e3a5f]/25"
                          >
                            <SelectValue placeholder={t("contact.form.grantTypePlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-[#1e3a5f]/20">
                            {grantTypes.map((gt) => (
                              <SelectItem key={gt.value} value={gt.value} data-testid={`option-grant-${gt.value}`}>
                                {t(gt.labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Project Description */}
                      <div>
                        <label className="block text-[10px] text-[#1e3a5f]/50 uppercase tracking-[0.18em] mb-2.5" htmlFor="contact-project">
                          {t("contact.form.project")} <span className="text-[#1e3a5f]/30">*</span>
                        </label>
                        <Textarea
                          id="contact-project"
                          value={form.projectDescription}
                          onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                          placeholder={t("contact.form.projectPlaceholder")}
                          rows={5}
                          required
                          data-testid="textarea-contact-project"
                          className="rounded-none border border-[#1e3a5f]/12 bg-transparent focus-visible:ring-0 focus-visible:border-[#1e3a5f]/40 text-[#1e3a5f] placeholder:text-[#1e3a5f]/25 text-[15px] resize-none"
                        />
                        <p className="text-[11px] text-[#1e3a5f]/35 mt-2 leading-relaxed">{t("contact.form.projectHint")}</p>
                      </div>

                      {/* Submit */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading || !form.name || !form.email || !form.grantType || !form.projectDescription}
                          data-testid="button-contact-submit"
                          className="w-full bg-[#1e3a5f] text-white py-5 text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-35 hover:bg-[#162c48] transition-colors"
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                              {t("contact.form.sending")}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              {t("contact.form.submit")}
                            </>
                          )}
                        </button>
                        <p className="text-[11px] text-[#1e3a5f]/30 text-center mt-5 leading-relaxed">
                          {t("contact.form.privacy")}
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

      <Footer />
    </div>
  );
}
