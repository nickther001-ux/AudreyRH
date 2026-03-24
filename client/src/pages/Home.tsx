import { Link } from "wouter";
import { User, Building2, ArrowRight, DollarSign } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Gateway */}
      <main className="flex-grow flex flex-col">
        <section
          className="relative flex-grow flex flex-col items-center justify-center py-32 px-4 min-h-screen overflow-hidden"
          data-testid="section-gateway-hero"
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${montrealSkyline})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/75 to-foreground/90" />

          <div className="relative z-10 w-full max-w-6xl mx-auto text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <DollarSign className="w-4 h-4 text-accent" />
              {t("gateway.badge")}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-4" data-testid="text-gateway-title">
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">Audrey</span>
                <span className="text-white">RH</span>
                <span className="text-accent">.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed" data-testid="text-gateway-subtitle">
                {t("gateway.subtitle")}
              </p>
            </div>

            {/* Dual Entry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
              {/* For Individuals */}
              <Link href="/individuals" data-testid="link-gateway-individuals">
                <div className="group relative bg-white/10 hover:bg-primary/80 border-2 border-white/30 hover:border-primary rounded-3xl p-10 text-left transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-white/20 group-hover:bg-white/25 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {t("gateway.individuals.title")}
                  </h2>
                  <p className="text-white/75 group-hover:text-white/90 text-base leading-relaxed mb-8 transition-colors">
                    {t("gateway.individuals.subtitle")}
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    {t("gateway.individuals.cta")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* For Businesses */}
              <Link href="/business" data-testid="link-gateway-business">
                <div className="group relative bg-white/10 hover:bg-white/[0.15] border-2 border-white/30 hover:border-accent/60 rounded-3xl p-10 text-left transition-all duration-300 cursor-pointer backdrop-blur-sm hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-accent/20 group-hover:bg-accent/30 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {t("gateway.business.title")}
                  </h2>
                  <p className="text-white/75 group-hover:text-white/90 text-base leading-relaxed mb-8 transition-colors">
                    {t("gateway.business.subtitle")}
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    {t("gateway.business.cta")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Bottom note */}
            <p className="text-white/50 text-sm" data-testid="text-gateway-note">
              {t("gateway.note")}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
