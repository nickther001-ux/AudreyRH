import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-terms-title">
            {t("terms.title")}
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground">{t("terms.lastUpdated")}: {t("terms.date")}</p>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.intro.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.intro.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.services.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.services.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.booking.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.booking.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.payment.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.payment.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.cancellation.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.cancellation.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.client.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.client.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.disclaimer.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.disclaimer.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.confidentiality.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.confidentiality.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.liability.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.liability.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.jurisdiction.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.jurisdiction.text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("terms.contact.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("terms.contact.text")}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
