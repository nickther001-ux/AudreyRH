import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Message = {
  role: "user" | "model";
  content: string;
};

const WELCOME = {
  fr: "Bonjour ! 👋 Je suis l'assistante virtuelle d'AudreyRH. Comment puis-je vous aider dans votre parcours professionnel aujourd'hui ?",
  en: "Hello! 👋 I'm AudreyRH's virtual assistant. How can I help you with your career journey today?",
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

  async function captureLead(email: string) {
    if (leadSaved) return;
    const summary = messages
      .map((m) => `${m.role === "user" ? "Visiteur" : "Assistante"}: ${m.content}`)
      .join("\n");
    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, summary }),
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

    // Capture lead if email detected
    const emailMatch = text.match(EMAIL_REGEX);
    if (emailMatch) {
      captureLead(emailMatch[0]);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.reply || (language === "fr" ? "Désolée, une erreur s'est produite." : "Sorry, an error occurred.");
      setMessages([...newMessages, { role: "model", content: reply }]);

      // Check if reply contains an email too
      const replyEmail = reply.match(EMAIL_REGEX);
      if (replyEmail) captureLead(replyEmail[0]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: language === "fr"
            ? "Désolée, je ne suis pas disponible en ce moment. Écrivez-nous à info@audreyrh.com"
            : "Sorry, I'm unavailable right now. Email us at info@audreyrh.com",
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
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          boxShadow: "0 4px 24px rgba(30,58,95,0.45)",
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
            <p className="text-white font-bold text-sm leading-tight">AudreyRH</p>
            <p className="text-[#93c5fd] text-xs leading-tight">
              {language === "fr" ? "Assistante virtuelle · En ligne" : "Virtual assistant · Online"}
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
                    ? "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)"
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
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
            {(language === "fr"
              ? ["Reconnaître mon diplôme", "Tarifs & services", "Prendre RDV"]
              : ["Recognize my degree", "Pricing & services", "Book a consultation"]
            ).map((chip) => (
              <button
                key={chip}
                data-testid={`chat-chip-${chip}`}
                onClick={() => {
                  setInput(chip);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {chip}
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
              background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
            }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
