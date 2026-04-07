import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, X, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const STORAGE_KEY = "audreyrh_privacy_consent";

export function PrivacyConsent() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  const fr = language === "fr";

  const points = fr
    ? [
        "Vos données sont utilisées uniquement pour traiter vos demandes de consultation et de subventions.",
        "Vos informations ne sont jamais vendues, louées ou partagées avec des tiers à des fins commerciales.",
        "Nous utilisons un chiffrement de bout en bout pour protéger vos données personnelles.",
        "Vous pouvez demander la suppression de vos données à tout moment en nous contactant.",
        "Les seules données conservées sont celles nécessaires au suivi de votre dossier (nom, courriel, notes de consultation).",
      ]
    : [
        "Your data is used solely to process your consultation and grant requests.",
        "Your information is never sold, rented, or shared with third parties for commercial purposes.",
        "We use end-to-end encryption to protect your personal data.",
        "You may request deletion of your data at any time by contacting us.",
        "Only data necessary for case management is retained (name, email, session notes).",
      ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-[9999]"
          data-testid="privacy-consent-banner"
        >
          {/* Main banner */}
          <div className="bg-[#0d1f3c] border-t border-white/10 shadow-2xl">
            <div className="max-w-6xl mx-auto px-5 py-5">
              <div className="flex flex-col md:flex-row md:items-center gap-5">

                {/* Icon + text */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white/8 border border-white/14 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-[#93c5fd]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] mb-1 font-semibold">
                      {fr ? "Confidentialité des données" : "Data Privacy"}
                    </p>
                    <p className="text-[13px] text-white/75 leading-relaxed">
                      {fr
                        ? "AudreyRH collecte uniquement les informations nécessaires à vos demandes. Vos données ne seront jamais vendues à des tiers."
                        : "AudreyRH collects only the information needed for your requests. Your data will never be sold to third parties."}
                      {" "}
                      <button
                        onClick={() => setExpanded((e) => !e)}
                        className="inline-flex items-center gap-1 text-[#93c5fd] font-semibold hover:underline underline-offset-2 transition-colors"
                        data-testid="privacy-details-toggle"
                      >
                        {fr ? "En savoir plus" : "Learn more"}
                        {expanded
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0 pl-13 md:pl-0">
                  <a
                    href="/terms"
                    className="text-[11px] text-white/35 hover:text-white/60 underline underline-offset-2 transition-colors hidden md:block"
                    data-testid="privacy-terms-link"
                  >
                    {fr ? "Politique complète" : "Full policy"}
                  </a>
                  <button
                    onClick={decline}
                    data-testid="privacy-decline"
                    className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50 border border-white/14 hover:border-white/28 hover:text-white/75 transition-colors"
                  >
                    {fr ? "Refuser" : "Decline"}
                  </button>
                  <button
                    onClick={accept}
                    data-testid="privacy-accept"
                    className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] bg-[#1e3a5f] text-white border border-white/20 hover:bg-[#264d7a] transition-colors"
                  >
                    {fr ? "Accepter" : "Accept"}
                  </button>
                </div>

              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-white/8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {points.map((point, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-4 h-4 rounded-full bg-white/10 border border-white/18 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[8px] text-white/60 font-bold">✓</span>
                            </span>
                            <p className="text-[12px] text-white/55 leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                      <a
                        href="/terms"
                        className="text-[11px] text-[#93c5fd] hover:underline underline-offset-2 font-semibold transition-colors"
                        data-testid="privacy-full-policy-link"
                      >
                        {fr ? "Lire notre politique complète de confidentialité →" : "Read our full privacy policy →"}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
