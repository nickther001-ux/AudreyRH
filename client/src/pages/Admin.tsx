import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, startOfDay } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertAvailabilitySlotSchema, type AvailabilitySlot, type InsertAvailabilitySlot, type Appointment } from "@shared/schema";
import { CalendarIcon, Plus, Trash2, Clock, ArrowLeft, Users, CheckCircle, XCircle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export default function Admin() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const dateLocale = language === "fr" ? fr : enUS;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError("");
    
    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
      } else {
        setPasswordError(language === "fr" ? "Mot de passe incorrect" : "Incorrect password");
      }
    } catch (error) {
      setPasswordError(language === "fr" ? "Erreur de connexion" : "Connection error");
    } finally {
      setIsVerifying(false);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold" data-testid="text-admin-login-title">
              {language === "fr" ? "Accès Administration" : "Admin Access"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "fr" ? "Entrez le mot de passe pour accéder à cette page" : "Enter password to access this page"}
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === "fr" ? "Mot de passe" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "fr" ? "Entrez le mot de passe" : "Enter password"}
                data-testid="input-admin-password"
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isVerifying || !password}
              data-testid="button-admin-login"
            >
              {isVerifying 
                ? (language === "fr" ? "Vérification..." : "Verifying...") 
                : (language === "fr" ? "Accéder" : "Access")}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "fr" ? "Retour à l'accueil" : "Back to home"}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const { data: slots = [], isLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ['/api/availability'],
  });

  const { data: allAppointments = [], isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ['/api/admin/appointments'],
  });

  const form = useForm<InsertAvailabilitySlot>({
    resolver: zodResolver(insertAvailabilitySlotSchema),
    defaultValues: {
      date: addDays(startOfDay(new Date()), 1),
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const { mutate: createSlot, isPending: isCreating } = useMutation({
    mutationFn: async (data: InsertAvailabilitySlot) => {
      return apiRequest('POST', '/api/availability', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
      toast({
        title: t("admin.slotAdded"),
        description: t("admin.slotAddedDesc"),
      });
      form.reset({
        date: selectedDate || addDays(startOfDay(new Date()), 1),
        startTime: "09:00",
        endTime: "10:00",
      });
    },
    onError: () => {
      toast({
        title: t("admin.error"),
        description: t("admin.errorAdd"),
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteSlot } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/availability/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
      toast({
        title: t("admin.slotDeleted"),
        description: t("admin.slotDeletedDesc"),
      });
    },
    onError: () => {
      toast({
        title: t("admin.error"),
        description: t("admin.errorDelete"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAvailabilitySlot) => {
    createSlot(data);
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const dateKey = format(new Date(slot.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-admin-title">{t("admin.title")}</h1>
            <p className="text-muted-foreground">{t("admin.addSlot")}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {t("admin.addSlot")}
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("admin.date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-admin-date-picker"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: dateLocale })
                              ) : (
                                <span>{t("admin.date")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setSelectedDate(date);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.startTime")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-start-time">
                              <SelectValue placeholder={t("admin.startPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.endTime")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-end-time">
                              <SelectValue placeholder={t("admin.endPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCreating}
                  data-testid="button-add-slot"
                >
                  {isCreating ? t("admin.adding") : t("admin.add")}
                </Button>
              </form>
            </Form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("admin.currentSlots")}
            </h2>

            {isLoading ? (
              <p className="text-muted-foreground">{t("book.loading")}</p>
            ) : Object.keys(groupedSlots).length === 0 ? (
              <p className="text-muted-foreground" data-testid="text-no-slots">
                {t("admin.noSlots")}
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSlots)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([dateKey, dateSlots]) => (
                    <div key={dateKey}>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        {format(new Date(dateKey), "EEEE d MMMM yyyy", { locale: dateLocale })}
                      </h3>
                      <div className="space-y-2">
                        {dateSlots
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                              data-testid={`slot-${slot.id}`}
                            >
                              <span className="font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSlot(slot.id)}
                                data-testid={`button-delete-slot-${slot.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>

        {/* Appointments Section */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t("admin.appointments")}
          </h2>

          {isLoadingAppointments ? (
            <p className="text-muted-foreground">{t("book.loading")}</p>
          ) : allAppointments.length === 0 ? (
            <p className="text-muted-foreground" data-testid="text-no-appointments">
              {t("admin.noAppointments")}
            </p>
          ) : (
            <div className="space-y-4">
              {allAppointments
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-lg border bg-muted/30"
                    data-testid={`appointment-${appt.id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-lg">{appt.name}</span>
                          <Badge variant={appt.paymentStatus === "paid" ? "default" : "secondary"}>
                            {appt.paymentStatus === "paid" ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> {t("admin.paid")}</>
                            ) : (
                              <><XCircle className="h-3 w-3 mr-1" /> {t("admin.unpaid")}</>
                            )}
                          </Badge>
                          <Badge variant="outline">
                            {appt.platform === "zoom" ? "Zoom" : "Google Meet"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{appt.email}</p>
                        {appt.phone && <p className="text-sm text-muted-foreground">{appt.phone}</p>}
                        <div className="text-sm">
                          <span className="font-medium">Date:</span>{" "}
                          {format(new Date(appt.date), "EEEE d MMMM yyyy", { locale: dateLocale })}
                          {appt.startTime && appt.endTime && (
                            <span className="ml-2">
                              {t("admin.from")} {appt.startTime} {t("admin.to")} {appt.endTime}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 p-3 bg-background rounded-md">
                          <p className="text-sm font-medium mb-1">{t("admin.consultationReason")}</p>
                          <p className="text-sm text-muted-foreground">{appt.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
