import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type InsertAppointment } from "@shared/schema";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, CreditCard, Loader2, CheckCircle2, XCircle, Clock, Video, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function Book() {
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const { mutate, isPending } = useCreateAppointment();
  const [, setLocation] = useLocation();

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
    },
  });

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

                    <div className="grid md:grid-cols-2 gap-6">
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
                          <FormItem className="flex flex-col">
                            <FormLabel>Date souhaitée</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "h-12 w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    data-testid="button-date-picker"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
                                    ) : (
                                      <span>Choisir une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
