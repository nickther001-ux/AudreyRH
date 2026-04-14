import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type InsertAppointment, type AvailabilitySlot } from "@shared/schema";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  CreditCard, Loader2, CheckCircle2, XCircle, Clock, Video,
  FileText, CalendarDays, Shield, User, Mail, Phone,
  MessageSquare, Sparkles, Inbox, Send, HourglassIcon
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";
import heroBg from "@assets/stock_images/hr_strategy.jpg";

type BookingMode = "free" | "paid";

// ─── Calendly embed ───────────────────────────────────────────────────────────
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL as string | undefined;

function CalendlyEmbed({ t }: { t: (key: any) => string }) {
  if (!CALENDLY_URL) return null;
  return (
    <div className="mb-10 rounded-2xl border border-border overflow-hidden shadow-lg" data-testid="section-calendly">
      <div className="bg-[#1e3a5f] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#93c5fd] uppercase tracking-[0.2em] mb-0.5">{t("book.calendly.label")}</p>
          <h3 className="text-white font-bold text-lg">{t("book.calendly.title")}</h3>
        </div>
        <CalendarDays className="w-6 h-6 text-[#93c5fd]" />
      </div>
      <iframe
        src={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=1e3a5f`}
        width="100%"
        height="660"
        frameBorder="0"
        title="Calendly booking"
        data-testid="iframe-calendly"
        className="block"
      />
    </div>
  );
}

function parseLocalDate(dateInput: string | Date): Date {
  const str = typeof dateInput === "string" ? dateInput : dateInput.toISOString();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), 12, 0, 0);
  }
  return new Date(str);
}

// ─── Shared slot picker ───────────────────────────────────────────────────────
function SlotPicker({
  availableSlots,
  slotsLoading,
  selectedSlotId,
  onSelect,
  dateLocale,
  t,
}: {
  availableSlots: AvailabilitySlot[];
  slotsLoading: boolean;
  selectedSlotId: number | null;
  onSelect: (slot: AvailabilitySlot) => void;
  dateLocale: Locale;
  t: (key: string) => string;
}) {
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const dateKey = format(parseLocalDate(slot.date), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  if (slotsLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  if (Object.keys(groupedSlots).length === 0) {
    return (
      <div className="p-8 bg-muted/30 rounded-lg text-center">
        <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground font-medium" data-testid="text-no-availability">
          {t("book.noSlots")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{t("book.checkBack")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2">
      {Object.entries(groupedSlots)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateKey, dateSlots]) => (
          <div key={dateKey} className="p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm font-semibold text-foreground capitalize mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#1e3a5f]" />
              {format(parseLocalDate(dateKey), "EEEE d MMMM yyyy", { locale: dateLocale })}
            </p>
            <div className="flex flex-wrap gap-2">
              {dateSlots
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={selectedSlotId === slot.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelect(slot)}
                    className={cn(
                      "transition-all font-medium",
                      selectedSlotId === slot.id
                        ? "ring-2 ring-[#1e3a5f] ring-offset-2 shadow-lg"
                        : "hover:border-[#1e3a5f]/50"
                    )}
                    data-testid={`button-slot-${slot.id}`}
                  >
                    <Clock className="w-3 h-3 mr-1.5" />
                    {slot.startTime} - {slot.endTime}
                  </Button>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}

// ─── Contact fields ───────────────────────────────────────────────────────────
function ContactFields({ form, t }: { form: any; t: (k: string) => string }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("book.name")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("book.namePlaceholder")} className="h-12" data-testid="input-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t("book.email")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("book.emailPlaceholder")} className="h-12" data-testid="input-email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-5">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t("book.phone")}
              </FormLabel>
              <FormControl>
                <Input placeholder="+1 (514) 000-0000" className="h-12" data-testid="input-phone" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

// ─── Platform picker ──────────────────────────────────────────────────────────
function PlatformPicker({ form, t }: { form: any; t: (k: string) => string }) {
  return (
    <FormField
      control={form.control}
      name="platform"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            {t("book.platform")}
          </FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="zoom" id="zoom" className="peer sr-only" />
                <Label
                  htmlFor="zoom"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 hover:bg-accent/50 peer-data-[state=checked]:border-[#1e3a5f] peer-data-[state=checked]:bg-[#1e3a5f]/5 cursor-pointer transition-all"
                  data-testid="radio-zoom"
                >
                  <SiZoom className="mb-3 h-8 w-8 text-[#2D8CFF]" />
                  <span className="font-semibold">Zoom</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="google_meet" id="google_meet" className="peer sr-only" />
                <Label
                  htmlFor="google_meet"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 hover:bg-accent/50 peer-data-[state=checked]:border-[#1e3a5f] peer-data-[state=checked]:bg-[#1e3a5f]/5 cursor-pointer transition-all"
                  data-testid="radio-google-meet"
                >
                  <SiGooglemeet className="mb-3 h-8 w-8 text-[#00897B]" />
                  <span className="font-semibold">Google Meet</span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Book() {
  const [mode, setMode] = useState<BookingMode>("free");
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [freeSuccess, setFreeSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [freeEmail, setFreeEmail] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const dateLocale = language === "fr" ? fr : enUS;

  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ["/api/availability"],
  });

  const { mutate, isPending } = useCreateAppointment({
    onFreeSuccess: (email) => {
      setFreeEmail(email);
      setFreeSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onPaidRedirect: () => {},
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const emailParam = params.get("email");
      const sessionId = params.get("session_id");
      const appointmentId = params.get("appointmentId");

      if (emailParam) {
        setConfirmedEmail(decodeURIComponent(emailParam));
      } else if (sessionId) {
        fetch(`/api/stripe/session-email?sessionId=${encodeURIComponent(sessionId)}`)
          .then((r) => r.json())
          .then((data) => { if (data.email) setConfirmedEmail(data.email); })
          .catch(console.error);
      }

      setPaidSuccess(true);
      window.history.replaceState({}, "", "/book");

      if (appointmentId) {
        fetch(`/api/appointments/${appointmentId}/confirm`, { method: "POST" })
          .then((r) => r.json())
          .catch(console.error);
      }
    }
    if (params.get("canceled") === "true") {
      setCanceled(true);
      window.history.replaceState({}, "", "/book");
    }
  }, []);

  const form = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "",
      platform: "zoom",
      appointmentType: "free_consultation",
    },
  });

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlotId(slot.id);
    form.setValue("date", parseLocalDate(slot.date));
    form.setValue("slotId", slot.id);
    form.setValue("startTime", slot.startTime);
    form.setValue("endTime", slot.endTime);
  };

  const handleModeChange = (newMode: BookingMode) => {
    setMode(newMode);
    setSelectedSlotId(null);
    form.reset({
      name: form.getValues("name"),
      email: form.getValues("email"),
      phone: form.getValues("phone"),
      reason: form.getValues("reason"),
      platform: form.getValues("platform"),
      appointmentType: newMode === "free" ? "free_consultation" : "paid_service",
    });
  };

  const onSubmit = (data: InsertAppointment) => {
    data.appointmentType = mode === "free" ? "free_consultation" : "paid_service";
    if (selectedSlotId) {
      const slot = availableSlots.find((s) => s.id === selectedSlotId);
      if (slot) {
        data.slotId = slot.id;
        data.startTime = slot.startTime;
        data.endTime = slot.endTime;
      }
    }
    mutate(data);
  };

  // ── FREE SUCCESS ──────────────────────────────────────────────────────────
  if (freeSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full mx-auto text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#0d1f3c] text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#1e3a5f]/30">
              <HourglassIcon size={42} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e3a5f]/10 border border-[#1e3a5f]/30">
              <span className="text-sm font-semibold text-[#1e3a5f]">{t("book.free.success.pending")}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-free-success-title">
              {t("book.free.success.title")}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground" data-testid="text-free-success-message">
              {t("book.free.success.message")}
            </p>
            {freeEmail && (
              <div
                className="flex items-start gap-3 rounded-xl px-5 py-4 text-left mx-auto"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", maxWidth: "420px" }}
                data-testid="text-free-success-email"
              >
                <Inbox size={20} className="mt-0.5 shrink-0 text-[#1e3a5f]" />
                <p className="text-sm leading-relaxed text-foreground">
                  {t("book.success.emailNoticePrefix")}{" "}
                  <span className="font-bold text-[#1e3a5f]">{freeEmail}</span>
                </p>
              </div>
            )}
            <div className="pt-2">
              <Button
                onClick={() => { setFreeSuccess(false); setLocation("/"); }}
                size="lg"
                data-testid="button-back-home-free"
                style={{ background: "#f97316", color: "#fff" }}
                className="hover:opacity-90 transition-opacity font-bold px-8"
              >
                {t("book.success.back")}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── PAID SUCCESS ──────────────────────────────────────────────────────────
  if (paidSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full mx-auto text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#0d1f3c] text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#1e3a5f]/30">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-success-title">
              {t("book.success.title")}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground" data-testid="text-success-message">
              {t("book.success.message")}
            </p>
            {confirmedEmail && (
              <div
                className="flex items-start gap-3 rounded-xl px-5 py-4 text-left mx-auto"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", maxWidth: "420px" }}
                data-testid="text-success-email-notice"
              >
                <Inbox size={20} className="mt-0.5 shrink-0" style={{ color: "#f97316" }} />
                <p className="text-sm leading-relaxed text-foreground">
                  {t("book.success.emailNoticePrefix")}{" "}
                  <span className="font-bold" style={{ color: "#f97316" }}>{confirmedEmail}</span>
                  <br />
                  <span className="text-muted-foreground">
                    {t("book.success.emailNoticeSuffix")}{" "}
                    <span className="font-bold" style={{ color: "#f97316" }}>{confirmedEmail}</span>
                  </span>
                </p>
              </div>
            )}
            <div className="pt-2">
              <Button
                onClick={() => { setPaidSuccess(false); setLocation("/"); }}
                size="lg"
                data-testid="button-back-home"
                style={{ background: "#f97316", color: "#fff" }}
                className="hover:opacity-90 transition-opacity font-bold px-8"
              >
                {t("book.success.back")}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── CANCELLED ─────────────────────────────────────────────────────────────
  if (canceled) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="max-w-md w-full mx-4 text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30">
              <XCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold" data-testid="text-canceled-title">{t("book.cancel.title")}</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-canceled-message">
              {t("book.cancel.message")}
            </p>
            <div className="pt-4">
              <Button onClick={() => setCanceled(false)} size="lg" data-testid="button-try-again">
                {t("book.cancel.retry")}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── MAIN PAGE ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,31,60,0.82) 0%, rgba(13,31,60,0.72) 60%, rgba(13,31,60,0.88) 100%)" }} />
        <div className="relative container mx-auto px-4 md:px-6 pt-12 pb-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t("book.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white" data-testid="text-book-title">
              {t("book.title")}
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">{t("book.subtitle")}</p>
          </div>
        </div>
      </section>

      <main className="flex-grow pb-20 -mt-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">

            {/* ── Calendly embed ── */}
            <CalendlyEmbed t={t} />

            {/* ── Mode Selector ── */}
            <div className="mb-8">
              <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                {t("book.typeSelector.title")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Free tab */}
                <button
                  type="button"
                  onClick={() => handleModeChange("free")}
                  data-testid="tab-free-consultation"
                  className={cn(
                    "relative rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                    mode === "free"
                      ? "border-[#1e3a5f] bg-[#1e3a5f]/5 shadow-md shadow-[#1e3a5f]/20"
                      : "border-border bg-card hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5"
                  )}
                >
                  {mode === "free" && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center mb-3">
                    <HourglassIcon className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <p className="font-bold text-base text-foreground">{t("book.free.tab")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("book.free.tabSub")}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#1e3a5f] bg-[#1e3a5f]/10 px-2 py-0.5 rounded-full">
                    {t("book.free.badge")}
                  </span>
                </button>

                {/* Paid tab */}
                <button
                  type="button"
                  onClick={() => handleModeChange("paid")}
                  data-testid="tab-paid-service"
                  className={cn(
                    "relative rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                    mode === "paid"
                      ? "border-[#1e3a5f] bg-[#1e3a5f]/5 shadow-md shadow-[#1e3a5f]/20"
                      : "border-border bg-card hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5"
                  )}
                >
                  {mode === "paid" && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <p className="font-bold text-base text-foreground">{t("book.paid.tab")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("book.paid.tabSub")}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#1e3a5f] bg-[#1e3a5f]/10 px-2 py-0.5 rounded-full">
                    {t("book.rateValue")}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Main layout ── */}
            <div className="grid lg:grid-cols-12 gap-8">

              {/* Left sidebar */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <Card className={cn("overflow-hidden border-2 shadow-xl", mode === "free" ? "border-[#1e3a5f]/20" : "border-[#1e3a5f]/20")}>
                    <div className={cn("p-6 text-white", mode === "free" ? "bg-gradient-to-br from-[#1e3a5f] to-[#0d1f3c]" : "bg-gradient-to-br from-[#1e3a5f] to-[#0d1f3c]")}>
                      <h3 className="font-bold text-xl mb-2">
                        {mode === "free" ? t("book.free.sideTitle") : t("book.paid.sideTitle")}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {mode === "free" ? t("book.free.sideDesc") : t("book.paid.sideDesc")}
                      </p>
                      {mode === "paid" && (
                        <div className="mt-3 text-4xl font-bold" data-testid="text-price">{t("book.rateValue")}</div>
                      )}
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", mode === "free" ? "bg-[#1e3a5f]/5" : "bg-[#1e3a5f]/10")}>
                          <Clock className={cn("w-5 h-5", mode === "free" ? "text-[#1e3a5f]" : "text-[#1e3a5f]")} />
                        </div>
                        <div>
                          <p className="font-semibold">{t("book.durationLabel")}</p>
                          <p className="text-sm text-muted-foreground">
                            {mode === "free" ? t("book.free.duration") : t("book.durationValue")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", mode === "free" ? "bg-[#1e3a5f]/5" : "bg-[#1e3a5f]/10")}>
                          <Video className={cn("w-5 h-5", mode === "free" ? "text-[#1e3a5f]" : "text-[#1e3a5f]")} />
                        </div>
                        <div>
                          <p className="font-semibold">{t("book.format")}</p>
                          <p className="text-sm text-muted-foreground">{t("book.formatValue")}</p>
                        </div>
                      </div>
                      {mode === "paid" && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-[#1e3a5f]" />
                          </div>
                          <div>
                            <p className="font-semibold">{t("book.securePayment")}</p>
                            <p className="text-sm text-muted-foreground">{t("book.stripeProtected")}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Preparation checklist (paid) / Info note (free) */}
                  {mode === "free" ? (
                    <Card className="p-5 border-[#1e3a5f]/20 bg-[#1e3a5f]/5">
                      <div className="flex items-start gap-3">
                        <HourglassIcon className="w-5 h-5 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#1e3a5f] leading-relaxed">{t("book.free.note")}</p>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-6 bg-accent/30 border-accent">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-[#1e3a5f]" />
                        <h4 className="font-bold">{t("book.prepare")}</h4>
                      </div>
                      <ul className="space-y-3">
                        {[t("book.prepareCV"), t("book.prepareEducation"), t("book.prepareQuestions")].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-8">
                <Card className="p-6 md:p-8 shadow-xl border-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                      {/* Section 1: Contact */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn("w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold", mode === "free" ? "bg-[#1e3a5f]/50" : "bg-[#1e3a5f]")}>1</div>
                          <h3 className="text-lg font-bold">{t("book.contactInfo")}</h3>
                        </div>
                        <ContactFields form={form} t={t} />
                      </div>

                      {/* Section 2: Date / slots */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn("w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold", mode === "free" ? "bg-[#1e3a5f]/50" : "bg-[#1e3a5f]")}>2</div>
                          <h3 className="text-lg font-bold">
                            {mode === "free" ? t("book.free.selectTitle") : t("book.selectDateTime")}
                          </h3>
                        </div>

                        {mode === "free" && (
                          <p className="text-sm text-muted-foreground mb-4 flex items-start gap-2">
                            <HourglassIcon className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
                            <span>{t("book.free.note")}</span>
                          </p>
                        )}

                        <FormField
                          control={form.control}
                          name="date"
                          render={() => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                {t("book.availableSlots")}
                              </FormLabel>
                              <FormControl>
                                <SlotPicker
                                  availableSlots={availableSlots}
                                  slotsLoading={slotsLoading}
                                  selectedSlotId={selectedSlotId}
                                  onSelect={handleSlotSelect}
                                  dateLocale={dateLocale}
                                  t={t}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Section 3: Session details */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={cn("w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold", mode === "free" ? "bg-[#1e3a5f]/50" : "bg-[#1e3a5f]")}>3</div>
                          <h3 className="text-lg font-bold">{t("book.sessionDetails")}</h3>
                        </div>
                        <div className="space-y-5">
                          <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  {t("book.reason")}
                                </FormLabel>
                                <FormControl>
                                  <Textarea placeholder={t("book.reasonPlaceholder")} className="min-h-[120px] resize-none" data-testid="input-reason" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <PlatformPicker form={form} t={t} />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-6 border-t-2 border-border">
                        {mode === "free" ? (
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full h-16 text-lg font-bold bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] hover:from-[#0d1f3c] hover:to-[#0d1f3c] text-white shadow-xl shadow-[#1e3a5f]/30"
                            disabled={isPending}
                            data-testid="button-submit-free"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                {t("book.free.submitting")}
                              </>
                            ) : (
                              <>
                                <Send className="mr-3 h-6 w-6" />
                                {t("book.free.submit")}
                              </>
                            )}
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="submit"
                              size="lg"
                              className="w-full h-16 text-lg font-bold shadow-xl shadow-[#1e3a5f]/30 bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c]"
                              disabled={isPending}
                              data-testid="button-submit"
                            >
                              {isPending ? (
                                <>
                                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                  {t("book.processing")}
                                </>
                              ) : (
                                <>
                                  <CreditCard className="mr-3 h-6 w-6" />
                                  {t("book.pay")}
                                </>
                              )}
                            </Button>
                            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                              <Shield className="w-4 h-4" />
                              <p className="text-sm">{t("book.secure")}</p>
                            </div>
                          </>
                        )}
                      </div>

                    </form>
                  </Form>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
