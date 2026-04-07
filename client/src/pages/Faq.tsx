import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp, Stagger, StaggerItem } from "@/lib/animations";

type Category = "general" | "booking" | "individuals" | "business";

const CATEGORIES: { key: Category; icon: string }[] = [
  { key: "general",     icon: "01" },
  { key: "booking",     icon: "02" },
  { key: "individuals", icon: "03" },
  { key: "business",    icon: "04" },
];

const FAQ_COUNT = 10;

export default function Faq() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("general");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCategory = (key: Category) => {
    setActiveCategory(key);
    setOpenFaq(null);
  };

  const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow">

        {/* ── HERO — dark editorial ── */}
        <section className="bg-foreground min-h-[70vh] flex flex-col justify-end pb-20 pt-40 relative overflow-hidden" data-testid="section-faq-hero">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80)" }}
          />
          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
          >
            <motion.p
              className="text-[11px] text-white/40 uppercase tracking-[0.22em] mb-8"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {t("faq.badge" as any)}
            </motion.p>
            <motion.h1
              className="text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-[0.92] tracking-tighter text-white mb-10 max-w-3xl"
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25,0.1,0.25,1] } } }}
            >
              <span className="block">{t("faq.hero.title1" as any)}</span>
              <span className="block text-[#93c5fd]">{t("faq.hero.title2" as any)}</span>
              <span className="block">{t("faq.hero.title3" as any)}<span className="text-orange-400">.</span></span>
            </motion.h1>
          </motion.div>
        </section>

        {/* ── CATEGORY TABS ── */}
        <section className="bg-[#162030] border-b border-white/10 sticky top-16 z-30" data-testid="section-faq-tabs">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => handleCategory(key)}
                  data-testid={`tab-faq-${key}`}
                  className={`flex-shrink-0 flex items-center gap-3 px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.15em] border-b-2 transition-colors ${
                    activeCategory === key
                      ? "border-[#93c5fd] text-[#93c5fd]"
                      : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  <span className="text-white/20 font-black">{icon}</span>
                  {t(`faq.category.${key}` as any)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ACCORDIONS ── */}
        <section className="bg-[#1e3a5f] py-24" data-testid="section-faq-content">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
                  {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => {
                    const isOpen = openFaq === n;
                    return (
                      <div key={n} className="bg-[#1e3a5f]" data-testid={`faq-item-${activeCategory}-${n}`}>
                        <button
                          onClick={() => toggle(n)}
                          className="w-full flex items-start justify-between gap-4 p-8 text-left group hover:bg-white/5 transition-colors"
                          data-testid={`faq-toggle-${activeCategory}-${n}`}
                        >
                          <span className="text-white font-semibold text-[15px] leading-snug flex-1">
                            <span className="text-[#93c5fd] text-[11px] font-black uppercase tracking-[0.15em] block mb-2">
                              {String(n).padStart(2, "0")}
                            </span>
                            {t(`faq.${activeCategory}.q${n}` as any)}
                          </span>
                          <span className="flex-shrink-0 mt-1">
                            {isOpen
                              ? <Minus className="w-4 h-4 text-[#93c5fd]" />
                              : <Plus className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                            }
                          </span>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="px-8 pb-8 text-white/60 text-[14px] leading-relaxed border-t border-white/10 pt-5">
                                {t(`faq.${activeCategory}.a${n}` as any)}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-foreground py-28" data-testid="section-faq-cta">
          <FadeUp className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-[11px] text-white/35 uppercase tracking-[0.22em] mb-6">AudreyRH · CRIA</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {t("faq.cta.title" as any)}
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed max-w-lg mx-auto mb-10">
              {t("faq.cta.subtitle" as any)}
            </p>
            <Link href="/book" data-testid="link-faq-cta-book">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-10 h-12 text-[13px] font-semibold">
                {t("faq.cta.button" as any)} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </FadeUp>
        </section>

      </main>
      <Footer />
    </div>
  );
}
