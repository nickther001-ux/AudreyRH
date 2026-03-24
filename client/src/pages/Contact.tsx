import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";

export default function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
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
    // Simulate form submission (no backend endpoint needed — sends to email)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const grantTypes = [
    { value: "artists", labelKey: "grants.artists.title" },
    { value: "entrepreneurs", labelKey: "grants.entrepreneurs.title" },
    { value: "sme", labelKey: "grants.sme.title" },
    { value: "corporate", labelKey: "grants.corporate.title" },
    { value: "other", labelKey: "contact.grantType.other" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="text-center max-w-md" data-testid="contact-success">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("contact.success.title")}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t("contact.success.message")}</p>
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="mr-3"
              data-testid="button-contact-new"
            >
              {t("contact.success.newRequest")}
            </Button>
            <a href="/" data-testid="link-contact-home">
              <Button className="bg-primary text-white">
                {t("book.success.back")}
              </Button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-foreground to-foreground/90 text-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Mail className="w-4 h-4" />
            {t("contact.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-background/70 text-lg max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">{t("contact.info.title")}</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4" data-testid="contact-email-info">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-1">{t("contact.info.email")}</p>
                      <a href="mailto:info@audreyRH.com" className="text-primary hover:underline text-sm">
                        info@audreyRH.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4" data-testid="contact-location-info">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-1">{t("contact.info.location")}</p>
                      <p className="text-muted-foreground text-sm">Montréal, Québec, Canada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4" data-testid="contact-response-info">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-1">{t("contact.info.response")}</p>
                      <p className="text-muted-foreground text-sm">{t("contact.info.responseTime")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Also book a consultation */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-2">{t("contact.sidebar.consultTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {t("contact.sidebar.consultText")}
                </p>
                <a href="/book" data-testid="link-contact-book">
                  <Button size="sm" className="bg-primary text-white w-full">
                    {t("contact.sidebar.consultCta")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-2">{t("contact.form.title")}</h2>
                <p className="text-muted-foreground text-sm mb-8">{t("contact.form.subtitle")}</p>

                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="contact-name">
                      {t("contact.form.name")} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t("contact.form.namePlaceholder")}
                      required
                      data-testid="input-contact-name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="contact-email">
                      {t("contact.form.email")} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t("contact.form.emailPlaceholder")}
                      required
                      data-testid="input-contact-email"
                    />
                  </div>

                  {/* Grant/Business Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.grantType")} <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={form.grantType}
                      onValueChange={(val) => setForm({ ...form, grantType: val })}
                      required
                    >
                      <SelectTrigger data-testid="select-grant-type">
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
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="contact-project">
                      {t("contact.form.project")} <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="contact-project"
                      value={form.projectDescription}
                      onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                      placeholder={t("contact.form.projectPlaceholder")}
                      rows={5}
                      required
                      data-testid="textarea-contact-project"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t("contact.form.projectHint")}</p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading || !form.name || !form.email || !form.grantType || !form.projectDescription}
                    className="w-full bg-primary text-white py-6 text-base font-semibold"
                    data-testid="button-contact-submit"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {t("contact.form.sending")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t("contact.form.submit")}
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {t("contact.form.privacy")}
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
