import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { FadeUp } from "@/lib/animations";

type Category = "general" | "booking" | "individuals" | "business";

const CATEGORIES: { key: Category; num: string }[] = [
  { key: "general",     num: "01" },
  { key: "booking",     num: "02" },
  { key: "individuals", num: "03" },
  { key: "business",    num: "04" },
];

const FAQ_COUNT = 10;

export default function Faq() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggle = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const jumpTo = useCallback((id: string) => {
    setOpenFaq(id);
    setTimeout(() => {
      const el = document.getElementById(`faq-item-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow">

        {/* ── HERO — dark editorial ── */}
        <section className="bg-foreground min-h-[60vh] flex flex-col justify-end pb-20 pt-40 relative overflow-hidden" data-testid="section-faq-hero">
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

        {/* ── QUESTIONS INDEX ── white section at top showing all titles ── */}
        <section className="bg-white py-16 border-b border-gray-100" data-testid="section-faq-index">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.22em] mb-10">
              {t("faq.badge" as any)} — {FAQ_COUNT * CATEGORIES.length} {t("faq.hero.title3" as any)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {CATEGORIES.map(({ key, num }) => (
                <div key={key}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] font-black text-[#93c5fd] uppercase tracking-[0.2em]">{num}</span>
                    <h3 className="text-[13px] font-bold text-foreground uppercase tracking-[0.12em]">
                      {t(`faq.category.${key}` as any)}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => {
                      const id = `${key}-${n}`;
                      return (
                        <li key={id}>
                          <button
                            onClick={() => jumpTo(id)}
                            data-testid={`index-link-${id}`}
                            className="group flex items-start gap-2 text-left text-[13px] text-muted-foreground hover:text-[#1e3a5f] transition-colors leading-snug w-full"
                          >
                            <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#93c5fd] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="group-hover:underline underline-offset-2">
                              {t(`faq.${key}.q${n}` as any)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL FAQ SECTIONS — accordions ── */}
        <section className="bg-[#1e3a5f] py-20" data-testid="section-faq-content">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-20">
            {CATEGORIES.map(({ key, num }) => (
              <div key={key} data-testid={`section-faq-${key}`}>

                {/* Category header */}
                <div className="flex items-center gap-5 mb-10 pb-6 border-b border-white/10">
                  <span className="text-[#93c5fd] text-[11px] font-black uppercase tracking-[0.2em]">{num}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {t(`faq.category.${key}` as any)}
                  </h2>
                </div>

                {/* Questions */}
                <div className="divide-y divide-white/10">
                  {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => {
                    const id = `${key}-${n}`;
                    const isOpen = openFaq === id;
                    return (
                      <div key={id} id={`faq-item-${id}`} data-testid={`faq-item-${key}-${n}`}>
                        <button
                          onClick={() => toggle(id)}
                          className="w-full flex items-start justify-between gap-6 py-6 text-left group hover:bg-white/5 transition-colors px-4 -mx-4 rounded"
                          data-testid={`faq-toggle-${key}-${n}`}
                        >
                          <span className="text-white font-semibold text-[15px] leading-snug flex-1">
                            {t(`faq.${key}.q${n}` as any)}
                          </span>
                          <span className="flex-shrink-0 mt-0.5">
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
                              transition={{ duration: 0.28, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="pb-6 px-4 text-white/60 text-[14px] leading-relaxed">
                                {t(`faq.${key}.a${n}` as any)}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
