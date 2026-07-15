import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, BookOpen, Briefcase, ArrowRight, CheckCircle, Send, Plus, Minus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp, Stagger, StaggerItem } from "@/lib/animations";

const OFFER_CARDS = [
  {
    key: "formations",
    icon: GraduationCap,
    photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  },
  {
    key: "guides",
    icon: BookOpen,
    photo: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  },
  {
    key: "planification",
    icon: Briefcase,
    photo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
];

const FAQS = [
  {
    qFr: "Quelle est la différence entre les Formations et la Planification RH ?",
    qEn: "What's the difference between Formations and HR Planning?",
    aFr: "Les formations sont des ateliers structurés (CV, entrevue, permis de travail) pour les particuliers. La Planification RH est un accompagnement stratégique pour les entreprises qui veulent structurer leur fonction RH.",
    aEn: "Formations are structured workshops (resume, interview, work permit) for individuals. HR Planning is strategic support for businesses looking to structure their HR function.",
  },
  {
    qFr: "Les guides sont-ils inclus dans les forfaits d'accompagnement ?",
    qEn: "Are the guides included in coaching packages?",
    aFr: "Non, les guides sont vendus séparément comme ressources autonomes. Ils peuvent toutefois être offerts en complément lors d'un accompagnement personnalisé.",
    aEn: "No, guides are sold separately as standalone resources. They can be offered as a complement during personalized coaching.",
  },
  {
    qFr: "Puis-je suivre une formation avant mon arrivée au Québec ?",
    qEn: "Can I take a training before arriving in Quebec?",
    aFr: "Oui, toutes nos formations sont offertes en ligne et accessibles où que vous soyez.",
    aEn: "Yes, all our trainings are offered online and accessible wherever you are.",
  },
  {
    qFr: "Comment fonctionne la consultation de Planification RH ?",
    qEn: "How does the HR Planning consultation work?",
    aFr: "Après une consultation initiale, nous évaluons vos besoins organisationnels et proposons un plan structuré : politiques, processus, conformité et stratégie de main-d'œuvre.",
    aEn: "After an initial consultation, we assess your organizational needs and propose a structured plan: policies, processes, compliance, and workforce strategy.",
  },
];

export default function Essentials() {
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  const rotatingWords = [
    t("essentials.hero.rotating.1" as any),
    t("essentials.hero.rotating.2" as any),
    t("essentials.hero.rotating.3" as any),
  ];

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((p) => (p + 1) % 3), 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow">

        {/* HERO */}
        <section className="bg-foreground min-h-[85vh] flex flex-col justify-end pb-24 pt-40 overflow-hidden relative" data-testid="section-essentials-hero">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-12"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80)" }}
          />
          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } }}
          >
            <motion.p
              className="text-[11px] text-white/40 uppercase tracking-[0.22em] mb-8"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {t("essentials.badge" as any)}
            </motion.p>
            <motion.h1
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95] tracking-tighter text-white mb-8 max-w-4xl"
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } } }}
              data-testid="text-essentials-hero-title"
            >
              {isFr ? "Ce qui" : "What"}{" "}
              <span key={wordIndex} className="inline-block text-[#93c5fd] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {rotatingWords[wordIndex]}
              </span>
              <br />
              {isFr ? "votre carrière" : "your career"}<span className="text-orange-400">.</span>
            </motion.h1>
            <motion.p
              className="text-white/60 text-lg max-w-xl leading-relaxed mb-12"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}
            >
              {t("essentials.hero.description" as any)}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <a href="#offres" data-testid="link-essentials-hero-explore">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {t("essentials.hero.cta" as any)} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <Link href="/contact" data-testid="link-essentials-hero-contact">
                <Button size="lg" variant="outline" className="rounded-none px-8 h-12 text-[13px] border-white/25 text-white hover:bg-white/10 bg-transparent">
                  {isFr ? "Nous contacter" : "Contact Us"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* OFFER CARDS */}
        <section id="offres" className="py-28 bg-white" data-testid="section-essentials-offers">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <FadeUp className="mb-16">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-4">
                {isFr ? "Nos offres" : "Our Offers"}
              </p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-sm">
                  {isFr ? "Trois façons de progresser" : "Three ways to move forward"}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">
                  {t("essentials.intro.text" as any)}
                </p>
              </div>
            </FadeUp>

            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
              {OFFER_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <StaggerItem key={card.key} variant="fadeUp" className="bg-white group" data-testid={`card-essentials-${card.key}`}>
                    <div className="overflow-hidden h-[200px] relative">
                      <img
                        src={card.photo}
                        alt={t(`essentials.${card.key}.title` as any)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-8">
                      <div className="w-10 h-10 bg-[#1e3a5f]/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <h3 className="font-bold text-foreground text-[17px] mb-2">
                        {t(`essentials.${card.key}.title` as any)}
                      </h3>
                      <p className="text-muted-foreground text-[13px] leading-relaxed mb-5">
                        {t(`essentials.${card.key}.desc` as any)}
                      </p>
                      <ul className="space-y-2 mb-7">
                        {[1, 2, 3].map((i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/70">
                            <CheckCircle className="w-4 h-4 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                            {t(`essentials.${card.key}.feature${i}` as any)}
                          </li>
                        ))}
                      </ul>
                      <Link href="/contact" data-testid={`link-essentials-${card.key}`}>
                        <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-none text-[13px] h-10">
                          {isFr ? "En savoir plus" : "Learn More"} <ArrowRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 bg-white" data-testid="section-essentials-faq">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-16 items-start">
              <FadeUp className="md:sticky md:top-32">
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-5">
                  {isFr ? "Questions fréquentes" : "Frequently Asked"}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                  {isFr ? "Ce que vous devez savoir" : "What you need to know"}
                </h2>
                <Link href="/contact" data-testid="link-essentials-faq-contact">
                  <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-none h-11 px-6 text-[13px]">
                    {isFr ? "Poser une question" : "Ask a Question"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </FadeUp>

              <div className="divide-y divide-border border-t border-border">
                {FAQS.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} data-testid={`essentials-faq-item-${i}`}>
                      <button
                        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        data-testid={`essentials-faq-toggle-${i}`}
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

        {/* FINAL CTA */}
        <section
          className="py-28"
          style={{ background: "linear-gradient(to bottom, #080f1e 0%, #122240 50%, #1e3a5f 100%)" }}
          data-testid="section-essentials-cta"
        >
          <FadeUp className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <div className="max-w-xl">
              <p className="text-[11px] text-white/35 uppercase tracking-[0.2em] mb-5">
                {isFr ? "Passez à l'action" : "Take Action"}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {t("essentials.cta.title" as any)}
              </h2>
              <p className="text-white/50 text-[14px] leading-relaxed mt-5 max-w-md">
                {t("essentials.cta.text" as any)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/contact" data-testid="link-essentials-final-contact">
                <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-semibold">
                  {isFr ? "Nous contacter" : "Contact Us"} <Send className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/book" data-testid="link-essentials-final-book">
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
