import { Link } from "wouter";
import { User, Building2, ArrowRight, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        <section
          className="relative flex-grow flex flex-col items-center justify-center py-32 px-4 min-h-screen overflow-hidden"
          data-testid="section-gateway-hero"
        >
          {/* Background photo */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${montrealSkyline})` }}
          />
          {/* Near-black editorial overlay — consulting.framer.media aesthetic */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(160deg, rgba(8,8,8,0.88) 0%, rgba(15,30,15,0.80) 50%, rgba(8,8,8,0.88) 100%)"
          }} />

          <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <Award className="w-4 h-4 text-accent" />
              {t("gateway.badge")}
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight" data-testid="text-gateway-title">
                <span className="text-primary">Audrey</span>
                <span className="text-white">RH</span>
                <span className="text-accent">.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed" data-testid="text-gateway-subtitle">
                {t("gateway.subtitle")}
              </p>
            </div>

            {/* Dual Entry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 max-w-3xl mx-auto">

              {/* For Individuals */}
              <Link href="/individuals" data-testid="link-gateway-individuals">
                <div className="group relative bg-white/8 hover:bg-primary/70 border border-white/20 hover:border-primary/60 rounded-2xl p-8 text-left transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary/30 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-5 transition-colors">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {t("gateway.individuals.title")}
                  </h2>
                  <p className="text-white/65 group-hover:text-white/85 text-sm leading-relaxed mb-6 transition-colors">
                    {t("gateway.individuals.subtitle")}
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    {t("gateway.individuals.cta")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* For Businesses */}
              <Link href="/business" data-testid="link-gateway-business">
                <div className="group relative bg-accent/10 hover:bg-accent/20 border border-accent/25 hover:border-accent/50 rounded-2xl p-8 text-left transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-accent/25 group-hover:bg-accent/35 rounded-xl flex items-center justify-center mb-5 transition-colors">
                    <Building2 className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {t("gateway.business.title")}
                  </h2>
                  <p className="text-white/65 group-hover:text-white/85 text-sm leading-relaxed mb-6 transition-colors">
                    {t("gateway.business.subtitle")}
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    {t("gateway.business.cta")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Note */}
            <p className="text-white/35 text-sm" data-testid="text-gateway-note">
              {t("gateway.note")}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
