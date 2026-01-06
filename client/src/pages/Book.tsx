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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
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
      <div className="min-h-screen bg-background flex flex-col font-body">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="max-w-md w-full mx-4 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-bold text-primary" data-testid="text-success-title">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-success-message">
              Thank you for booking a consultation with Audrey Mondesir. You will receive a confirmation email shortly with your appointment details.
            </p>
            <div className="pt-4">
              <Button onClick={() => { setSuccess(false); setLocation('/'); }} variant="outline" data-testid="button-back-home">
                Return to Home
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
      <div className="min-h-screen bg-background flex flex-col font-body">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="max-w-md w-full mx-4 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold text-primary" data-testid="text-canceled-title">Payment Canceled</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-canceled-message">
              Your booking was not completed. No charges were made. Feel free to try again when you're ready.
            </p>
            <div className="pt-4">
              <Button onClick={() => setCanceled(false)} data-testid="button-try-again">
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">
            
            {/* Sidebar Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4" data-testid="text-book-title">Book a Consultation</h1>
                <p className="text-muted-foreground text-lg">
                  Get personalized strategy advice for your career path in Quebec.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-1">Session Duration</h3>
                  <p className="text-muted-foreground">45 - 60 Minutes</p>
                </div>
                <div className="h-px bg-border/50" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">Consultation Fee</h3>
                  <p className="text-2xl font-bold text-accent" data-testid="text-price">$50.00 CAD</p>
                  <p className="text-xs text-muted-foreground mt-1">Payment required to confirm booking</p>
                </div>
                <div className="h-px bg-border/50" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">Location</h3>
                  <p className="text-muted-foreground">Online (Google Meet / Zoom)</p>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h3 className="font-bold text-primary mb-2">What to prepare</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                  <li>Your current CV / Resume</li>
                  <li>Details about your education history</li>
                  <li>List of specific questions you have</li>
                </ul>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-3">
              <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                className="h-12 bg-muted/50 border-input" 
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="john@example.com" 
                                className="h-12 bg-muted/50 border-input" 
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
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+1 (514) 000-0000" 
                                className="h-12 bg-muted/50 border-input" 
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
                            <FormLabel className="mb-1">Requested Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "h-12 w-full pl-3 text-left font-normal bg-muted/50 border-input",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    data-testid="button-date-picker"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
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
                          <FormLabel>Reason for Consultation</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe your situation and what you hope to achieve..." 
                              className="min-h-[120px] bg-muted/50 border-input resize-none" 
                              data-testid="input-reason"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Info */}
                    <div className="pt-4 border-t border-dashed border-border">
                      <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg border border-secondary/20 mb-6">
                        <CreditCard className="text-primary" size={24} />
                        <div>
                          <p className="font-semibold text-foreground">Secure Payment via Stripe</p>
                          <p className="text-xs text-muted-foreground">You will be redirected to complete payment securely.</p>
                        </div>
                      </div>

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
                            Processing...
                          </>
                        ) : (
                          "Proceed to Payment - $50.00 CAD"
                        )}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4">
                        By confirming, you agree to our terms of service and consultation policy.
                      </p>
                    </div>

                  </form>
                </Form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
