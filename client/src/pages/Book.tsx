import { useState } from "react";
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
import { CalendarIcon, CreditCard, Loader2, CheckCircle2 } from "lucide-react";

export default function Book() {
  const [success, setSuccess] = useState(false);
  const { mutate, isPending } = useCreateAppointment();

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
    mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-body">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="max-w-md w-full mx-4 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-bold text-primary">Request Received!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for booking a consultation. You will receive an email shortly with payment instructions to finalize your appointment.
            </p>
            <div className="pt-4">
              <Button onClick={() => setSuccess(false)} variant="outline">
                Book Another Appointment
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
                <h1 className="text-4xl font-bold mb-4">Book a Consultation</h1>
                <p className="text-muted-foreground text-lg">
                  Get personalized strategy advice for your career path in Quebec.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-1">Session Duration</h3>
                  <p className="text-muted-foreground">45 - 60 Minutes</p>
                </div>
                <div className="h-px bg-border/50" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">Consultation Fee</h3>
                  <p className="text-2xl font-bold text-accent">$50.00 CAD</p>
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
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-border/50">
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
                              <Input placeholder="John Doe" className="h-12 bg-gray-50 border-gray-200" {...field} />
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
                              <Input placeholder="john@example.com" className="h-12 bg-gray-50 border-gray-200" {...field} />
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
                              <Input placeholder="+1 (514) 000-0000" className="h-12 bg-gray-50 border-gray-200" {...field} value={field.value || ''} />
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
                                      "h-12 w-full pl-3 text-left font-normal bg-gray-50 border-gray-200",
                                      !field.value && "text-muted-foreground"
                                    )}
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
                              className="min-h-[120px] bg-gray-50 border-gray-200 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Placeholder UI */}
                    <div className="pt-4 border-t border-dashed border-gray-200">
                      <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10 mb-6">
                        <CreditCard className="text-primary" size={24} />
                        <div>
                          <p className="font-semibold text-primary">Payment Details</p>
                          <p className="text-xs text-muted-foreground">Secure payment processing will be handled after submission.</p>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Request...
                          </>
                        ) : (
                          "Confirm Booking Request"
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
