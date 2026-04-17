import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Message = {
  role: "user" | "model";
  content: string;
};

const WELCOME = {
  fr: "Bonjour ! 👋 Je suis Amara, l'assistante virtuelle d'AudreyRH. Comment puis-je vous aider dans votre parcours professionnel aujourd'hui ?",
  en: "Hello! 👋 I'm Amara, AudreyRH's virtual assistant. How can I help you with your career journey today?",
};

const PLACEHOLDER = {
  fr: "Posez votre question…",
  en: "Ask your question…",
};

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export function AIChatWidget() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: WELCOME[language] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [segment, setSegment] = useState<"Individual" | "Business" | "Hybrid-Artist" | "Hybrid-Founder" | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset welcome message when language changes (only if conversation not started)
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: "model", content: WELCOME[language] }]);
    }
  }, [language]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function detectSegment(msgs: Message[]): "Individual" | "Business" | "Hybrid-Artist" | "Hybrid-Founder" | null {
    const fullText = msgs.map((m) => m.content).join(" ").toLowerCase();

    const artistSignals = [
      "artiste", "artist", "créateur", "creator", "musicien", "musician",
      "auteur", "author", "photographe", "photographer", "peintre", "painter",
      "designer indépendant", "freelance designer", "galerie", "gallery",
      "œuvre", "oeuvre", "diffusion", "résidence", "calq", "conseil des arts",
      "arts council", "droit d'auteur", "copyright", "cachet",
    ];
    const founderSignals = [
      "startup", "fondateur", "founder", "entrepreneur", "je lance",
      "on lance", "lancer mon", "lancer une", "mon projet d'entreprise",
      "ma startup", "my startup", "my business", "scalabilité", "scalable",
      "première embauche", "first hire", "solopreneur", "solo entrepreneur",
      "travailleur autonome", "self-employed", "incorporated", "incorporé",
    ];
    const businessSignals = [
      "pme", "employés", "nos employés", "mes employés", "audit rh",
      "audit", "conformité", "ressources humaines", "rh corporatif",
      "recrutement structuré", "département rh", "hr department",
      "employees", "workforce", "staff", "corporate", "organisation",
      "organisme", "subvention entreprise", "enterprise", "company with",
    ];
    const individualSignals = [
      "cv", "curriculum", "resume", "emploi", "carrière", "career",
      "diplôme", "diploma", "degree", "immigration", "immigrant",
      "arrivant", "nouvel arrivant", "newcomer", "linkedin", "entretien",
      "interview", "recherche d'emploi", "job search", "travail",
      "permis de travail", "work permit", "mon emploi", "my job",
      "cherche un emploi", "looking for a job", "find a job",
    ];

    const scores = {
      "Hybrid-Artist":  artistSignals.filter((w) => fullText.includes(w)).length,
      "Hybrid-Founder": founderSignals.filter((w) => fullText.includes(w)).length,
      "Business":       businessSignals.filter((w) => fullText.includes(w)).length,
      "Individual":     individualSignals.filter((w) => fullText.includes(w)).length,
    } as const;

    const best = (Object.keys(scores) as Array<keyof typeof scores>)
      .reduce((a, b) => scores[a] >= scores[b] ? a : b);

    return scores[best] === 0 ? null : best;
  }

  async function captureLead(email: string, currentMessages: Message[]) {
    if (leadSaved) return;
    const detectedSegment = detectSegment(currentMessages);
    if (detectedSegment) setSegment(detectedSegment);
    const summary = currentMessages
      .map((m) => `${m.role === "user" ? "Visiteur" : "Assistante"}: ${m.content}`)
      .join("\n");
    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, summary, segment: detectedSegment }),
      });
      setLeadSaved(true);
    } catch {
      // non-fatal
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    // Capture lead if email detected in user message
    const emailMatch = text.match(EMAIL_REGEX);
    if (emailMatch) {
      captureLead(emailMatch[0], newMessages);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        const isBusy = res.status === 503 || (data.message ?? "").includes("503") || (data.message ?? "").includes("UNAVAILABLE");
        throw new Error(isBusy ? "busy" : "error");
      }

      const reply = data.reply || (language === "fr" ? "Désolée, une erreur s'est produite." : "Sorry, an error occurred.");
      const finalMessages: Message[] = [...newMessages, { role: "model", content: reply }];
      setMessages(finalMessages);

      // Check if reply contains an email too (rare, but handle it)
      const replyEmail = reply.match(EMAIL_REGEX);
      if (replyEmail) captureLead(replyEmail[0], finalMessages);
    } catch (err: any) {
      const isBusy = err?.message === "busy";
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: isBusy
            ? (language === "fr"
                ? "Je suis très sollicitée en ce moment ! Réessayez dans quelques secondes, ou écrivez-nous à info@audreyrh.com 😊"
                : "I'm very busy right now! Try again in a few seconds, or email us at info@audreyrh.com 😊")
            : (language === "fr"
                ? "Désolée, une erreur s'est produite. Écrivez-nous à info@audreyrh.com"
                : "Sorry, an error occurred. Email us at info@audreyrh.com"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* ── Floating bubble ── */}
      <button
        data-testid="chat-widget-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir le chat"
        className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none"
        style={{
          background: "#0d1f3c",
          boxShadow: "0 4px 24px rgba(13,31,60,0.6)",
        }}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* ── Chat panel ── */}
      <div
        className={`fixed z-50 bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ background: "#0d1f3c" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: "#1e3a5f", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
            <Bot className="w-5 h-5 text-[#93c5fd]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight">Amara</p>
            <p className="text-[#93c5fd] text-xs leading-tight">
              {language === "fr" ? "Assistante AudreyRH · En ligne" : "AudreyRH assistant · Online"}
            </p>
          </div>
          <button
            data-testid="chat-widget-close"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ scrollbarWidth: "thin" }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {m.role === "model" && (
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: "#1e3a5f" }}>
                  <Bot className="w-4 h-4 text-[#93c5fd]" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "text-white rounded-tr-sm"
                    : "text-white/90 rounded-tl-sm"
                }`}
                style={{
                  background: m.role === "user"
                    ? "#0d1f3c"
                    : "rgba(255,255,255,0.07)",
                  border: m.role === "model" ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                {m.content.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < m.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center" style={{ background: "#1e3a5f" }}>
                <Bot className="w-4 h-4 text-[#93c5fd]" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Loader2 className="w-4 h-4 text-[#93c5fd] animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestion chips */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
            {(language === "fr"
              ? [
                  { label: "Mon diplôme 🎓",   text: "Comment faire reconnaître mon diplôme au Québec ?" },
                  { label: "Tarifs 💼",         text: "Quels sont vos tarifs et services ?" },
                  { label: "Prendre RDV 📅",    text: "Je voudrais prendre un rendez-vous" },
                ]
              : [
                  { label: "My diploma 🎓",     text: "How do I get my degree recognized in Quebec?" },
                  { label: "Pricing 💼",         text: "What are your rates and services?" },
                  { label: "Book a call 📅",     text: "I would like to book an appointment" },
                ]
            ).map((chip) => (
              <button
                key={chip.label}
                data-testid={`chat-chip-${chip.label}`}
                onClick={() => {
                  setInput(chip.text);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="flex items-center gap-2 px-3 py-3 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0d1f3c" }}
        >
          <input
            ref={inputRef}
            data-testid="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER[language]}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30 min-w-0"
            disabled={loading}
          />
          <button
            data-testid="chat-send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-30 hover:scale-110 focus:outline-none"
            style={{
              background: "#0d1f3c",
            }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
