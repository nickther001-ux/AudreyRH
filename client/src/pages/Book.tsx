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
import { CreditCard, Loader2, CheckCircle2, XCircle, Clock, Video, FileText, CalendarDays, Shield, User, Mail, Phone, MessageSquare, Sparkles, Inbox } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";
import montrealSkyline from "@assets/generated_images/montreal_skyline_at_dusk.png";

function parseLocalDate(dateInput: string | Date): Date {
  const str = typeof dateInput === 'string' ? dateInput : dateInput.toISOString();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), 12, 0, 0);
  }
  return new Date(str);
}

export default function Book() {
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const { mutate, isPending } = useCreateAppointment();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const dateLocale = language === "fr" ? fr : enUS;

  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ['/api/availability'],
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Capture all params BEFORE replaceState wipes the URL
      const emailParam = params.get('email');
      const sessionId = params.get('session_id');
      const appointmentId = params.get('appointmentId');

      if (emailParam) {
        // Primary: email was passed directly in the success URL
        setConfirmedEmail(decodeURIComponent(emailParam));
      } else if (sessionId) {
        // Fallback: retrieve email from the Stripe session
        fetch(`/api/stripe/session-email?sessionId=${encodeURIComponent(sessionId)}`)
          .then(r => r.json())
          .then(data => { if (data.email) setConfirmedEmail(data.email); })
          .catch(err => console.error('Session email fetch error:', err));
      }

      setSuccess(true);
      window.history.replaceState({}, '', '/book');

      if (appointmentId) {
        fetch(`/api/appointments/${appointmentId}/confirm`, { method: 'POST' })
          .then(r => r.json())
          .catch(err => console.error('Confirm error:', err));
      }
    }
    if (params.get('canceled') === 'true') {
      setCanceled(true);
      window.history.replaceState({}, '', '/book');
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
    },
  });

  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const dateKey = format(parseLocalDate(slot.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlotId(slot.id);
    form.setValue('date', parseLocalDate(slot.date));
    form.setValue('slotId', slot.id);
    form.setValue('startTime', slot.startTime);
    form.setValue('endTime', slot.endTime);
  };

  const onSubmit = (data: InsertAppointment) => {
    if (selectedSlotId) {
      const selectedSlot = availableSlots.find(s => s.id === selectedSlotId);
      if (selectedSlot) {
        data.slotId = selectedSlot.id;
        data.startTime = selectedSlot.startTime;
        data.endTime = selectedSlot.endTime;
      }
    }
    mutate(data);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full mx-auto text-center space-y-6">

            {/* Success icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#0d1f3c] text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#1e3a5f]/30">
              <CheckCircle2 size={48} />
            </div>

            {/* Title */}
            <h1
              className="text-3xl font-bold text-foreground"
              data-testid="text-success-title"
            >
              {t("book.success.title")}
            </h1>

            {/* Subtitle */}
            <p
              className="text-base leading-relaxed"
              style={{ color: "#64748b" }}
              data-testid="text-success-message"
            >
              {t("book.success.message")}
            </p>

            {/* Email notice */}
            {confirmedEmail && (
              <div
                className="flex items-start gap-3 rounded-xl px-5 py-4 text-left mx-auto"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", maxWidth: "420px" }}
                data-testid="text-success-email-notice"
              >
                <Inbox
                  size={20}
                  className="mt-0.5 shrink-0"
                  style={{ color: "#f97316" }}
                />
                <p className="text-sm leading-relaxed text-foreground">
                  {t("book.success.emailNoticePrefix")}{" "}
                  <span className="font-bold" style={{ color: "#f97316" }}>
                    {confirmedEmail}
                  </span>
                  <br />
                  <span style={{ color: "#64748b" }}>
                    {t("book.success.emailNoticeSuffix")}{" "}
                    <span className="font-bold" style={{ color: "#f97316" }}>
                      {confirmedEmail}
                    </span>
                  </span>
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="pt-2">
              <Button
                onClick={() => { setSuccess(false); setLocation('/'); }}
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center ken-burns-zoom"
          style={{ backgroundImage: `url(${montrealSkyline})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-background" />
        
        <div className="relative container mx-auto px-4 md:px-6 pt-12 pb-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e3a5f]/20 border border-[#1e3a5f]/30 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t("book.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white" data-testid="text-book-title">
              {t("book.title")}
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              {t("book.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <main className="flex-grow pb-20 -mt-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
            
            {/* Left Column - Sticky Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="lg:sticky lg:top-24">
                {/* Session Summary Card */}
                <Card className="overflow-hidden border-2 border-[#1e3a5f]/20 shadow-xl">
                  <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0d1f3c] p-6 text-white">
                    <h3 className="font-bold text-xl mb-2">{t("book.details")}</h3>
                    <div className="text-4xl font-bold" data-testid="text-price">{t("book.rateValue")}</div>
                    <p className="text-white/80 text-sm mt-1">{t("book.perSession")}</p>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div>
                        <p className="font-semibold">{t("book.durationLabel")}</p>
                        <p className="text-sm text-muted-foreground">{t("book.durationValue")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div>
                        <p className="font-semibold">{t("book.format")}</p>
                        <p className="text-sm text-muted-foreground">{t("book.formatValue")}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div>
                        <p className="font-semibold">{t("book.securePayment")}</p>
                        <p className="text-sm text-muted-foreground">{t("book.stripeProtected")}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Preparation Checklist */}
                <Card className="p-6 mt-6 bg-accent/30 border-accent">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-[#1e3a5f]" />
                    <h4 className="font-bold">{t("book.prepare")}</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{t("book.prepareCV")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{t("book.prepareEducation")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{t("book.prepareQuestions")}</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-8">
              <Card className="p-6 md:p-8 shadow-xl border-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Section 1: Contact Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">1</div>
                        <h3 className="text-lg font-bold">{t("book.contactInfo")}</h3>
                      </div>
                      
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
                                <Input 
                                  placeholder={t("book.namePlaceholder")} 
                                  className="h-12" 
                                  data-testid="input-name"
                                  {...field} 
                                />
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
                                <Input 
                                  placeholder={t("book.emailPlaceholder")} 
                                  className="h-12" 
                                  data-testid="input-email"
                                  {...field} 
                                />
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
                                <Input 
                                  placeholder="+1 (514) 000-0000" 
                                  className="h-12" 
                                  data-testid="input-phone"
                                  {...field} 
                                  value={field.value || ''} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Section 2: Date Selection */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">2</div>
                        <h3 className="text-lg font-bold">{t("book.selectDateTime")}</h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4" />
                              {t("book.availableSlots")}
                            </FormLabel>
                            <FormControl>
                              {slotsLoading ? (
                                <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg">
                                  <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
                                </div>
                              ) : Object.keys(groupedSlots).length === 0 ? (
                                <div className="p-8 bg-muted/30 rounded-lg text-center">
                                  <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                                  <p className="text-muted-foreground font-medium" data-testid="text-no-availability">
                                    {t("book.noSlots")}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">{t("book.checkBack")}</p>
                                </div>
                              ) : (
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
                                                onClick={() => handleSlotSelect(slot)}
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
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Section 3: Session Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">3</div>
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
                                <Textarea 
                                  placeholder={t("book.reasonPlaceholder")} 
                                  className="min-h-[120px] resize-none" 
                                  data-testid="input-reason"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 gap-4"
                                >
                                  <div>
                                    <RadioGroupItem
                                      value="zoom"
                                      id="zoom"
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor="zoom"
                                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 hover:bg-accent/50 peer-data-[state=checked]:border-[#1e3a5f] peer-data-[state=checked]:bg-[#1e3a5f]/5 [&:has([data-state=checked])]:border-[#1e3a5f] cursor-pointer transition-all"
                                      data-testid="radio-zoom"
                                    >
                                      <SiZoom className="mb-3 h-8 w-8 text-[#2D8CFF]" />
                                      <span className="font-semibold">Zoom</span>
                                    </Label>
                                  </div>
                                  <div>
                                    <RadioGroupItem
                                      value="google_meet"
                                      id="google_meet"
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor="google_meet"
                                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 hover:bg-accent/50 peer-data-[state=checked]:border-[#1e3a5f] peer-data-[state=checked]:bg-[#1e3a5f]/5 [&:has([data-state=checked])]:border-[#1e3a5f] cursor-pointer transition-all"
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
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="pt-6 border-t-2 border-border">
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
                    </div>

                  </form>
                </Form>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
