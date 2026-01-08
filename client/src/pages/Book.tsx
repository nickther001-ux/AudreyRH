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
import { format, isSameDay } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { CreditCard, Loader2, CheckCircle2, XCircle, Clock, Video, FileText, CalendarDays } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";

export default function Book() {
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);
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
      setSuccess(true);
      window.history.replaceState({}, '', '/book');
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

  // Group slots by date
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const dateKey = format(new Date(slot.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlotId(slot.id);
    form.setValue('date', new Date(slot.date));
    form.setValue('slotId', slot.id);
    form.setValue('startTime', slot.startTime);
    form.setValue('endTime', slot.endTime);
  };

  const onSubmit = (data: InsertAppointment) => {
    // Ensure slot info is included
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
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="max-w-md w-full mx-4 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-bold" data-testid="text-success-title">{t("book.success.title")}</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-success-message">
              {t("book.success.message")}
            </p>
            <div className="pt-4">
              <Button onClick={() => { setSuccess(false); setLocation('/'); }} variant="outline" data-testid="button-back-home">
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
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold" data-testid="text-canceled-title">{t("book.cancel.title")}</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-canceled-message">
              {t("book.cancel.message")}
            </p>
            <div className="pt-4">
              <Button onClick={() => setCanceled(false)} data-testid="button-try-again">
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

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-book-title">
              {t("book.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("book.subtitle")}
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
            
            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-border">
                <h3 className="font-bold text-lg mb-4">{t("book.details")}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t("book.durationLabel")}</p>
                      <p className="text-sm text-muted-foreground">{t("book.durationValue")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t("book.format")}</p>
                      <p className="text-sm text-muted-foreground">{t("book.formatValue")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{t("book.rate")}</p>
                      <p className="text-2xl font-bold text-primary" data-testid="text-price">{t("book.rateValue")}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border bg-primary/5">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-2">{t("book.prepare")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("book.prepareCV")}</li>
                      <li>{t("book.prepareEducation")}</li>
                      <li>{t("book.prepareQuestions")}</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-3">
              <Card className="p-6 md:p-8 border-border">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("book.name")}</FormLabel>
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
                            <FormLabel>{t("book.email")}</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("book.phone")}</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {t("book.availableSlots")}
                          </FormLabel>
                          <FormControl>
                            {slotsLoading ? (
                              <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                            ) : Object.keys(groupedSlots).length === 0 ? (
                              <div className="p-6 bg-muted/50 rounded-lg text-center">
                                <p className="text-muted-foreground" data-testid="text-no-availability">
                                  {t("book.noSlots")} {t("book.checkBack")}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {Object.entries(groupedSlots)
                                  .sort(([a], [b]) => a.localeCompare(b))
                                  .map(([dateKey, dateSlots]) => (
                                    <div key={dateKey} className="space-y-2">
                                      <p className="text-sm font-medium text-muted-foreground capitalize">
                                        {format(new Date(dateKey), "EEEE d MMMM", { locale: dateLocale })}
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
                                                "transition-all",
                                                selectedSlotId === slot.id && "ring-2 ring-primary ring-offset-2"
                                              )}
                                              data-testid={`button-slot-${slot.id}`}
                                            >
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

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("book.reason")}</FormLabel>
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
                          <FormLabel>{t("book.platform")}</FormLabel>
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
                                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                  data-testid="radio-zoom"
                                >
                                  <SiZoom className="mb-2 h-6 w-6 text-[#2D8CFF]" />
                                  <span className="font-medium">Zoom</span>
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
                                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                  data-testid="radio-google-meet"
                                >
                                  <SiGooglemeet className="mb-2 h-6 w-6 text-[#00897B]" />
                                  <span className="font-medium">Google Meet</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <div className="pt-4 border-t border-border">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-14 text-lg bg-primary shadow-lg shadow-primary/20"
                        disabled={isPending}
                        data-testid="button-submit"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("book.processing")}
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            {t("book.pay")}
                          </>
                        )}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4">
                        {t("book.secure")}
                      </p>
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
