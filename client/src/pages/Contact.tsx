import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, Clock, ArrowRight, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";

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
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />

      {/* ── HERO ── */}
      <section className="bg-foreground pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-5">{t("contact.badge")}</p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-6">
              {t("contact.title")}<span className="text-orange-400">.</span>
            </h1>
            <p className="text-white/50 text-[16px] leading-relaxed max-w-lg">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* ── LEFT SIDEBAR ── */}
            <div className="lg:col-span-2 space-y-12">

              {/* Info items */}
              <div>
                <p className="text-[11px] text-black/35 uppercase tracking-[0.2em] mb-8">{t("contact.info.title")}</p>
                <div className="space-y-8">

                  <div className="flex items-start gap-5" data-testid="contact-email-info">
                    <div className="w-10 h-10 bg-foreground flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-black/40 uppercase tracking-[0.15em] mb-1">{t("contact.info.email")}</p>
                      <a href="mailto:info@audreyrh.com" className="text-black font-semibold text-[15px] hover:text-[#1e3a5f] transition-colors">
                        info@audreyrh.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5" data-testid="contact-location-info">
                    <div className="w-10 h-10 bg-foreground flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-black/40 uppercase tracking-[0.15em] mb-1">{t("contact.info.location")}</p>
                      <p className="text-black font-semibold text-[15px]">Montréal, Québec</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5" data-testid="contact-response-info">
                    <div className="w-10 h-10 bg-foreground flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-black/40 uppercase tracking-[0.15em] mb-1">{t("contact.info.response")}</p>
                      <p className="text-black font-semibold text-[15px]">{t("contact.info.responseTime")}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Book CTA block */}
              <div className="bg-[#1e3a5f] p-8">
                <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-4">{t("contact.sidebar.consultTitle")}</p>
                <p className="text-white/70 text-[14px] leading-relaxed mb-7">
                  {t("contact.sidebar.consultText")}
                </p>
                <a href="/book" data-testid="link-contact-book" className="inline-flex items-center gap-3 text-white text-[13px] font-semibold uppercase tracking-[0.1em] group">
                  {t("contact.sidebar.consultCta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

            {/* ── FORM ── */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <SuccessMessage key="success" onReset={handleReset} />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <p className="text-[11px] text-black/35 uppercase tracking-[0.2em] mb-4">{t("contact.form.title")}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">{t("contact.form.subtitle")}</h2>
                    <div className="w-10 h-px bg-orange-400 mb-10" />

                    <form onSubmit={handleSubmit} className="space-y-7" data-testid="form-contact">

                      {/* Name */}
                      <div>
                        <label className="block text-[11px] text-black/50 uppercase tracking-[0.15em] mb-2" htmlFor="contact-name">
                          {t("contact.form.name")} <span className="text-black/40">*</span>
                        </label>
                        <Input
                          id="contact-name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={t("contact.form.namePlaceholder")}
                          required
                          data-testid="input-contact-name"
                          className="rounded-none border-0 border-b border-black/15 bg-transparent focus-visible:ring-0 focus-visible:border-black px-0 text-black placeholder:text-black/30 text-[15px] h-11"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] text-black/50 uppercase tracking-[0.15em] mb-2" htmlFor="contact-email">
                          {t("contact.form.email")} <span className="text-black/40">*</span>
                        </label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder={t("contact.form.emailPlaceholder")}
                          required
                          data-testid="input-contact-email"
                          className="rounded-none border-0 border-b border-black/15 bg-transparent focus-visible:ring-0 focus-visible:border-black px-0 text-black placeholder:text-black/30 text-[15px] h-11"
                        />
                      </div>

                      {/* Grant/Business Type */}
                      <div>
                        <label className="block text-[11px] text-black/50 uppercase tracking-[0.15em] mb-2">
                          {t("contact.form.grantType")} <span className="text-black/40">*</span>
                        </label>
                        <Select
                          value={form.grantType}
                          onValueChange={(val) => setForm({ ...form, grantType: val })}
                          required
                        >
                          <SelectTrigger
                            data-testid="select-grant-type"
                            className="rounded-none border-0 border-b border-black/15 bg-transparent focus:ring-0 px-0 text-[15px] text-black h-11"
                          >
                            <SelectValue placeholder={t("contact.form.grantTypePlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
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
                        <label className="block text-[11px] text-black/50 uppercase tracking-[0.15em] mb-2" htmlFor="contact-project">
                          {t("contact.form.project")} <span className="text-black/40">*</span>
                        </label>
                        <Textarea
                          id="contact-project"
                          value={form.projectDescription}
                          onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                          placeholder={t("contact.form.projectPlaceholder")}
                          rows={5}
                          required
                          data-testid="textarea-contact-project"
                          className="rounded-none border border-black/15 bg-transparent focus-visible:ring-0 focus-visible:border-black text-black placeholder:text-black/30 text-[15px] resize-none mt-1"
                        />
                        <p className="text-[12px] text-black/35 mt-2">{t("contact.form.projectHint")}</p>
                      </div>

                      {/* Submit */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading || !form.name || !form.email || !form.grantType || !form.projectDescription}
                          data-testid="button-contact-submit"
                          className="w-full bg-[#1e3a5f] text-white py-4 text-[13px] font-semibold uppercase tracking-[0.15em] flex items-center justify-center gap-3 disabled:opacity-40 hover:bg-[#162c48] transition-colors"
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {t("contact.form.sending")}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              {t("contact.form.submit")}
                            </>
                          )}
                        </button>
                        <p className="text-[12px] text-black/35 text-center mt-4">
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
