import { Link } from "wouter";
import { CheckCircle, ArrowRight, ChevronRight } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import audreyPhoto from "@assets/Gemini_Generated_Image_oiinvioiinvioiin_1775503767318.png";
import approachPhoto from "@assets/Gemini_Generated_Image_ujepw0ujepw0ujep_1775505394811.png";

const SERVICE_PHOTOS = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
];

const APPROACH_PHOTO = approachPhoto;
const JOURNEY_PHOTO  = "https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=400&q=80";
const STATS_PHOTO    = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80";

type Partner = { name: string; logo?: string; icon?: "linkedin" };

// Direct confirmed logo URLs from official sources / Wikimedia Commons
const PARTNERS: Partner[] = [
  {
    name: "Ordre des CRHA",
    logo: "https://logo.clearbit.com/ordrecrha.org",
  },
  { name: "LinkedIn", icon: "linkedin" },
  {
    name: "Service Canada",
    // Government of Canada official wordmark SVG (Wikimedia Commons)
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Canada_wordmark.svg",
  },
  {
    name: "Gouvernement du Québec",
    // Official Quebec government logo (Wikimedia Commons)
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Logo_du_gouvernement_du_Qu%C3%A9bec.svg",
  },
  {
    name: "CPMT Québec",
    // Quebec government design system logo (CPMT is a Quebec gov body)
    logo: "https://www.quebec.ca/assets/trousse-sdg/dist/img/QUEBEC_couleur.svg",
  },
  {
    name: "Services Québec",
    logo: "https://www.quebec.ca/assets/trousse-sdg/dist/img/QUEBEC_couleur.svg",
  },
  {
    name: "CRIA",
    logo: "https://logo.clearbit.com/ordrecrha.org",
  },
];

function PartnerLogo({ p }: { p: Partner }) {
  if (p.icon === "linkedin") {
    return (
      <span className="flex items-center gap-2 text-foreground/30 select-none whitespace-nowrap">
        <SiLinkedin size={20} />
        <span className="font-semibold text-[13px]">LinkedIn</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center select-none">
      <img
        src={p.logo}
        alt={p.name}
        className="h-7 w-auto max-w-[130px] object-contain grayscale opacity-35"
        style={{ filter: "grayscale(100%) opacity(0.35)" }}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const sib = target.nextElementSibling as HTMLElement | null;
          if (sib) sib.style.display = "inline";
        }}
      />
      <span
        className="font-semibold text-[13px] whitespace-nowrap text-foreground/30"
        style={{ display: "none" }}
      >
        {p.name}
      </span>
    </span>
  );
}

const TESTIMONIALS = [
  { id: 1, initials: "Y.K." },
  { id: 2, initials: "J.N." },
  { id: 3, initials: "A.S." },
  { id: 4, initials: "F.D." },
  { id: 5, initials: "M.S." },
  { id: 6, initials: "K.B." },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />

      {/* ─────────────────────────────────────────────────────────
          1. HERO — full-width background, text bottom-left
      ───────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
        style={{
          backgroundImage: `url(${audreyPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
        data-testid="section-hero"
      >
        {/* Subtle dark overlay for contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(6,6,6,0.85) 0%, rgba(6,6,6,0.55) 40%, rgba(6,6,6,0.20) 100%)",
          }}
        />

        {/* Text + buttons — bottom-left */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-[540px]">
            <p
              className="text-[11px] text-white/60 uppercase tracking-[0.22em] mb-5"
              data-testid="text-hero-label"
            >
              {t("home.hero.label")}
            </p>
            <h1
              className="text-5xl md:text-[3.6rem] font-bold leading-[1.08] tracking-tight text-white mb-5"
              data-testid="text-hero-title"
            >
              {t("home.hero.title")}
            </h1>
            <p
              className="text-[15px] text-white/70 leading-relaxed mb-9 max-w-[420px]"
              data-testid="text-hero-subtitle"
            >
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book" data-testid="link-hero-book">
                <Button
                  size="lg"
                  className="bg-foreground text-white hover:bg-foreground/90 rounded-none px-8 h-12 text-[13px] font-medium tracking-wide"
                >
                  {t("home.hero.cta")}
                </Button>
              </Link>
              <Link href="/contact" data-testid="link-hero-contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-none px-8 h-12 text-[13px] border-white/40 text-white hover:bg-white/10 hover:border-white/60 bg-transparent"
                >
                  {t("home.hero.cta2")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. TRUST STRIP — infinite marquee of partner orgs
      ───────────────────────────────────────────────────────── */}
      <section
        className="border-y border-border py-10 bg-white overflow-hidden"
        data-testid="section-trust"
      >
        <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-7">
          {t("home.trust.text")}
        </p>
        <div className="flex items-center gap-20 animate-marquee">
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
            <PartnerLogo key={i} p={p} />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          3. SERVICES — label + title/subtitle + 3 photo cards
      ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white" id="services" data-testid="section-services">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mb-4">
            {t("home.services.label")}
          </p>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-14">
            <h2
              className="text-4xl md:text-[2.6rem] font-bold text-foreground leading-tight tracking-tight max-w-xs"
              data-testid="text-services-title"
            >
              {t("home.services.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm md:pt-2">
              {t("home.services.subtitle")}
            </p>
          </div>

          {/* Photo cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[1, 2, 3].map((i) => (
              <Link key={i} href="/individuals" data-testid={`link-service-${i}`}>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden bg-muted h-[280px] md:h-[300px] mb-4">
                    <img
                      src={SERVICE_PHOTOS[i - 1]}
                      alt={t(`home.services.${i}.title`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      data-testid={`img-service-${i}`}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[15px] font-semibold text-foreground">
                      {t(`home.services.${i}.title`)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Need customized CTA */}
          <div
            className="border border-border p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            data-testid="section-services-custom"
          >
            <h3 className="text-lg font-semibold text-foreground">
              {t("home.services.custom")}
            </h3>
            <Link href="/contact" data-testid="link-services-contact">
              <button className="flex items-center gap-2 text-[13px] text-foreground font-medium hover:gap-3 transition-all group">
                {t("home.services.contact")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. APPROACH — large photo + floating stat (left), text (right)
      ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-border" data-testid="section-approach">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo + floating stat */}
            <div className="relative">
              <img
                src={APPROACH_PHOTO}
                alt="Consultation approach"
                className="w-full h-[480px] object-cover"
                data-testid="img-approach"
              />
              {/* Stat card — top-left covers the baked-in text from the image */}
              <div className="absolute top-0 left-0 bg-white shadow-2xl px-7 py-6 min-w-[260px]">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  {t("home.approach.stat")}
                </p>
                <p className="text-[2.6rem] font-bold text-foreground leading-none">
                  {t("home.approach.statValue")}
                </p>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-7">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mb-4">
                  {t("home.approach.label")}
                </p>
                <h2
                  className="text-4xl font-bold text-foreground leading-tight tracking-tight"
                  data-testid="text-approach-title"
                >
                  {t("home.approach.title")}
                </h2>
              </div>

              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {t("home.approach.subtitle")}
              </p>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-[15px] h-[15px] text-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-foreground font-medium">
                      {t(`home.approach.point${i}`)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Journey photo + read link */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={JOURNEY_PHOTO}
                  alt="Our journey"
                  className="w-20 h-14 object-cover flex-shrink-0"
                  data-testid="img-journey"
                />
                <div>
                  <p className="text-[13px] font-semibold text-foreground mb-1.5">
                    {t("home.approach.journey")}
                  </p>
                  <Link href="/individuals" data-testid="link-approach-read">
                    <button className="text-[13px] text-muted-foreground font-medium underline underline-offset-4 decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground/40 transition-colors">
                      {t("home.approach.read")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. WHY CHOOSE US — 3 linked feature cards
      ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-border" data-testid="section-why">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mb-4">
            {t("home.why.label")}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <h2
              className="text-4xl md:text-[2.6rem] font-bold text-foreground leading-tight tracking-tight max-w-xs"
              data-testid="text-why-title"
            >
              {t("home.why.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[280px]">
              {t("home.why.subtitle")}
            </p>
          </div>

          {/* gap-px grid creates the divider lines between cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {[1, 2, 3].map((i) => (
              <Link key={i} href="/individuals" data-testid={`link-why-${i}`}>
                <div className="group bg-white hover:bg-neutral-50 transition-colors cursor-pointer h-full flex flex-col min-h-[240px] p-10">
                  <h3 className="text-[15px] font-bold text-foreground mb-3">
                    {t(`home.why.${i}.title`)}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed flex-1">
                    {t(`home.why.${i}.text`)}
                  </p>
                  <div className="mt-8 flex items-center gap-1 text-[13px] text-foreground font-medium group-hover:gap-2 transition-all">
                    {t(`home.why.${i}.link`)}
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          6. PROCESS — heading left + 4 numbered step cards 2×2
      ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-border" data-testid="section-process">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
              data-testid="text-process-title"
            >
              {t("home.process.title")}
            </h2>
            <div className="max-w-sm">
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
                {t("home.process.subtitle")}
              </p>
              <Link href="/individuals" data-testid="link-process-learn">
                <button className="flex items-center gap-2 text-[13px] text-foreground font-medium hover:gap-3 transition-all group">
                  {t("home.process.learn")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} href="/individuals" data-testid={`link-process-${i}`}>
                <div className="group bg-white hover:bg-neutral-50 transition-colors cursor-pointer p-10 md:p-12">
                  <p className="text-xl font-bold text-foreground mb-4 tracking-tight">
                    {t(`home.process.${i}.num`)}
                  </p>
                  <h3 className="text-[17px] font-bold text-foreground mb-3">
                    {t(`home.process.${i}.title`)}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {t(`home.process.${i}.text`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          7. STATS + COMMITMENT — photo with stats left, text right
      ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-border" data-testid="section-stats">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo + stat overlay */}
            <div className="relative">
              <img
                src={STATS_PHOTO}
                alt="Our commitment"
                className="w-full h-[520px] object-cover object-center"
                data-testid="img-stats"
              />
              <div className="absolute inset-0 bg-foreground/40" />
              <div className="absolute bottom-0 left-0 right-0 p-10 flex items-end gap-12">
                <div>
                  <p
                    className="text-[3.5rem] font-bold text-white leading-none tracking-tight"
                    data-testid="text-stat1"
                  >
                    {t("home.stats.stat1")}
                  </p>
                  <p className="text-[11px] text-white/60 mt-2 uppercase tracking-[0.15em]">
                    {t("home.stats.stat1.label")}
                  </p>
                </div>
                <div className="w-px h-14 bg-white/25 mb-5" />
                <div>
                  <p
                    className="text-[3.5rem] font-bold text-white leading-none tracking-tight"
                    data-testid="text-stat2"
                  >
                    {t("home.stats.stat2")}
                  </p>
                  <p className="text-[11px] text-white/60 mt-2 uppercase tracking-[0.15em]">
                    {t("home.stats.stat2.label")}
                  </p>
                </div>
              </div>
            </div>

            {/* Commitment text */}
            <div className="space-y-8">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                {t("home.stats.commitment.label")}
              </p>
              <h2
                className="text-4xl font-bold text-foreground leading-tight tracking-tight"
                data-testid="text-commitment-title"
              >
                {t("home.stats.commitment.title")}
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {t("home.stats.commitment.text")}
              </p>
              <Link href="/book">
                <Button
                  className="bg-foreground text-white hover:bg-foreground/90 rounded-none px-8 h-12 text-[13px] font-medium tracking-wide mt-2"
                  data-testid="button-stats-cta"
                >
                  {t("home.stats.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          8. TESTIMONIALS — label + heading + 6 cards grid
      ───────────────────────────────────────────────────────── */}
      <section
        className="py-28 bg-neutral-50 border-t border-border"
        data-testid="section-testimonials"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mb-4">
            {t("home.testimonials.label")}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <h2
              className="text-4xl md:text-[2.6rem] font-bold text-foreground leading-tight tracking-tight max-w-xs"
              data-testid="text-testimonials-title"
            >
              {t("home.testimonials.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-xs leading-relaxed">
              {t("home.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ id, initials }) => (
              <div
                key={id}
                className="bg-white p-8 border border-border"
                data-testid={`card-testimonial-${id}`}
              >
                <p className="text-[14px] text-foreground leading-relaxed mb-10">
                  "{t(`testimonial.${id}.text`)}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {t(`testimonial.${id}.name`)}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {t(`testimonial.${id}.job`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
