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
import { fr } from "date-fns/locale";
import { CreditCard, Loader2, CheckCircle2, XCircle, Clock, Video, FileText, CalendarDays } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Book() {
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const { mutate, isPending } = useCreateAppointment();
  const [, setLocation] = useLocation();

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
  };

  const onSubmit = (data: InsertAppointment) => {
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
            <h1 className="text-3xl font-bold" data-testid="text-success-title">Paiement réussi!</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-success-message">
              Merci d'avoir réservé une consultation avec Audrey Mondesir. Vous recevrez un courriel de confirmation avec les détails de votre rendez-vous.
            </p>
            <div className="pt-4">
              <Button onClick={() => { setSuccess(false); setLocation('/'); }} variant="outline" data-testid="button-back-home">
                Retour à l'accueil
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
            <h1 className="text-3xl font-bold" data-testid="text-canceled-title">Paiement annulé</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-canceled-message">
              Votre réservation n'a pas été complétée. Aucun frais n'a été facturé. N'hésitez pas à réessayer quand vous serez prêt.
            </p>
            <div className="pt-4">
              <Button onClick={() => setCanceled(false)} data-testid="button-try-again">
                Réessayer
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
              Prendre rendez-vous
            </h1>
            <p className="text-lg text-muted-foreground">
              Réservez une consultation personnalisée pour votre stratégie de carrière au Québec.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
            
            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-border">
                <h3 className="font-bold text-lg mb-4">Détails de la consultation</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Durée</p>
                      <p className="text-sm text-muted-foreground">45 - 60 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Format</p>
                      <p className="text-sm text-muted-foreground">Vidéoconférence (Zoom / Google Meet)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Tarif</p>
                      <p className="text-2xl font-bold text-primary" data-testid="text-price">50,00 $ USD</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border bg-primary/5">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-2">À préparer</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Votre CV / curriculum vitae</li>
                      <li>Historique de votre formation</li>
                      <li>Liste de vos questions spécifiques</li>
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
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Jean Dupont" 
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
                            <FormLabel>Adresse courriel</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="jean@exemple.com" 
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
                          <FormLabel>Téléphone (optionnel)</FormLabel>
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
                            Choisir un créneau disponible
                          </FormLabel>
                          <FormControl>
                            {slotsLoading ? (
                              <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                            ) : Object.keys(groupedSlots).length === 0 ? (
                              <div className="p-6 bg-muted/50 rounded-lg text-center">
                                <p className="text-muted-foreground" data-testid="text-no-availability">
                                  Aucune disponibilité pour le moment. Veuillez revenir plus tard.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {Object.entries(groupedSlots)
                                  .sort(([a], [b]) => a.localeCompare(b))
                                  .map(([dateKey, dateSlots]) => (
                                    <div key={dateKey} className="space-y-2">
                                      <p className="text-sm font-medium text-muted-foreground capitalize">
                                        {format(new Date(dateKey), "EEEE d MMMM", { locale: fr })}
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
                          <FormLabel>Raison de la consultation</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez brièvement votre situation et ce que vous espérez accomplir..." 
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
                          <FormLabel>Plateforme de vidéoconférence</FormLabel>
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
                            Traitement en cours...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Procéder au paiement - 50,00 $ USD
                          </>
                        )}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4">
                        Paiement sécurisé via Stripe. En confirmant, vous acceptez nos conditions de service.
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
