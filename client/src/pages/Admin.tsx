import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, startOfDay, isValid } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
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
import {
  insertAvailabilitySlotSchema,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type Appointment,
} from "@shared/schema";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Clock,
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function parseLocalDate(dateInput: string | Date): Date {
  const str = typeof dateInput === "string" ? dateInput : dateInput.toISOString();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(
      parseInt(match[1]),
      parseInt(match[2]) - 1,
      parseInt(match[3]),
      12, 0, 0
    );
  }
  return new Date(str);
}

function safeFormat(
  raw: string | Date | null | undefined,
  fmt: string,
  options?: Parameters<typeof format>[2]
): string {
  if (!raw) return "—";
  try {
    const d = raw instanceof Date ? raw : parseLocalDate(raw);
    return isValid(d) ? format(d, fmt, options) : "—";
  } catch {
    return "—";
  }
}

function safeCreatedAt(raw: string | Date | null | undefined): number {
  if (!raw) return 0;
  try {
    const d = new Date(raw as string);
    const t = d.getTime();
    return isNaN(t) ? 0 : t;
  } catch {
    return 0;
  }
}

const timeSlots = [
  "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

/* ─── Error Boundary ──────────────────────────────────────────────────────── */

interface EBState { hasError: boolean; message: string }
class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  EBState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err?.message ?? "Unknown error" };
  }
  componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error("[Admin] render crash:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Erreur de chargement</h2>
            <p className="text-muted-foreground text-sm mb-1">
              Failed to load admin data. Please refresh.
            </p>
            <p className="text-xs text-slate-400 font-mono mb-6 break-all">
              {this.state.message}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, message: "" });
                window.location.reload();
              }}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Rafraîchir la page
            </Button>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Skeleton loaders ────────────────────────────────────────────────────── */

function SlotsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 rounded-lg border space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

/* ─── Login screen ────────────────────────────────────────────────────────── */

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "1");
        onSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Mot de passe incorrect");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#1e293b] px-8 py-8 text-center">
            <div className="h-1 bg-[#f97316] -mx-8 -mt-8 mb-8" />
            <p className="text-2xl font-bold text-white tracking-tight">
              Audrey<span className="text-[#f97316]">RH</span>
            </p>
            <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
              Espace administrateur
            </p>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-700"
              >
                Mot de passe
              </label>
              <input
                id="admin-password"
                data-testid="input-admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition"
              />
            </div>
            {error && (
              <p data-testid="text-login-error" className="text-sm text-red-600 font-medium">
                {error}
              </p>
            )}
            <button
              data-testid="button-admin-login"
              type="submit"
              disabled={isPending}
              className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-60 text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              {isPending ? "Vérification…" : "Accéder au panneau"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          AudreyRH · accès réservé
        </p>
      </div>
    </div>
  );
}

/* ─── Main Admin dashboard ────────────────────────────────────────────────── */

function AdminDashboard() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const dateLocale = language === "fr" ? fr : enUS;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );

  const {
    data: slots,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
  } = useQuery<AvailabilitySlot[]>({
    queryKey: ["/api/availability"],
  });

  const {
    data: allAppointments,
    isLoading: isApptsLoading,
    isFetching: isApptsFetching,
  } = useQuery<Appointment[]>({
    queryKey: ["/api/admin/appointments"],
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
      const res = await apiRequest("POST", "/api/availability", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: t("admin.slotAdded"), description: t("admin.slotAddedDesc") });
      const nextDate = selectedDate ?? addDays(startOfDay(new Date()), 1);
      form.reset({
        date: nextDate,
        startTime: "09:00",
        endTime: "10:00",
      });
    },
    onError: (err: Error) => {
      toast({
        title: t("admin.error"),
        description: err?.message || t("admin.errorAdd"),
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteSlot, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/availability/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: t("admin.slotDeleted"), description: t("admin.slotDeletedDesc") });
    },
    onError: () => {
      toast({
        title: t("admin.error"),
        description: t("admin.errorDelete"),
        variant: "destructive",
      });
    },
  });

  const safeSlots: AvailabilitySlot[] = Array.isArray(slots) ? slots : [];
  const safeAppointments: Appointment[] = Array.isArray(allAppointments)
    ? allAppointments
    : [];

  const groupedSlots = safeSlots.reduce<Record<string, AvailabilitySlot[]>>(
    (acc, slot) => {
      if (!slot?.date) return acc;
      const dateKey = safeFormat(slot.date, "yyyy-MM-dd");
      if (dateKey === "—") return acc;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    },
    {}
  );

  const sortedAppointments = [...safeAppointments].sort(
    (a, b) => safeCreatedAt(b?.createdAt) - safeCreatedAt(a?.createdAt)
  );

  const onSubmit = (data: InsertAvailabilitySlot) => createSlot(data);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-admin-title">
              {t("admin.title")}
            </h1>
            <p className="text-muted-foreground">{t("admin.addSlot")}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ── Add slot form ── */}
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
                              {field.value
                                ? safeFormat(field.value, "PPP", { locale: dateLocale })
                                : <span>{t("admin.date")}</span>}
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
                            disabled={(date) =>
                              date < startOfDay(new Date())
                            }
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-start-time">
                              <SelectValue placeholder={t("admin.startPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-end-time">
                              <SelectValue placeholder={t("admin.endPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
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

          {/* ── Current slots ── */}
          <Card className="p-6 relative">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("admin.currentSlots")}
              {isSlotsFetching && !isSlotsLoading && (
                <RefreshCw className="h-4 w-4 ml-auto animate-spin text-muted-foreground" />
              )}
            </h2>

            {isSlotsLoading ? (
              <SlotsSkeleton />
            ) : Object.keys(groupedSlots).length === 0 ? (
              <p className="text-muted-foreground" data-testid="text-no-slots">
                {t("admin.noSlots")}
              </p>
            ) : (
              <div className={cn("space-y-6", isSlotsFetching && "opacity-60 pointer-events-none transition-opacity")}>
                {Object.entries(groupedSlots)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([dateKey, dateSlots]) => (
                    <div key={dateKey}>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        {safeFormat(dateKey, "EEEE d MMMM yyyy", { locale: dateLocale })}
                      </h3>
                      <div className="space-y-2">
                        {[...(dateSlots ?? [])]
                          .sort((a, b) =>
                            (a?.startTime ?? "").localeCompare(b?.startTime ?? "")
                          )
                          .map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                              data-testid={`slot-${slot.id}`}
                            >
                              <span className="font-medium">
                                {slot?.startTime ?? "—"} – {slot?.endTime ?? "—"}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isDeleting}
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

        {/* ── Appointments ── */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t("admin.appointments")}
            {isApptsFetching && !isApptsLoading && (
              <RefreshCw className="h-4 w-4 ml-auto animate-spin text-muted-foreground" />
            )}
          </h2>

          {isApptsLoading ? (
            <AppointmentsSkeleton />
          ) : sortedAppointments.length === 0 ? (
            <p className="text-muted-foreground" data-testid="text-no-appointments">
              {t("admin.noAppointments")}
            </p>
          ) : (
            <div className={cn("space-y-4", isApptsFetching && "opacity-60 transition-opacity")}>
              {sortedAppointments.map((appt) => (
                <div
                  key={appt?.id}
                  className="p-4 rounded-lg border bg-muted/30"
                  data-testid={`appointment-${appt?.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-lg">{appt?.name ?? "—"}</span>
                        <Badge
                          variant={appt?.paymentStatus === "paid" ? "default" : "secondary"}
                        >
                          {appt?.paymentStatus === "paid" ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />{t("admin.paid")}</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" />{t("admin.unpaid")}</>
                          )}
                        </Badge>
                        <Badge variant="outline">
                          {appt?.platform === "zoom" ? "Zoom" : "Google Meet"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{appt?.email ?? "—"}</p>
                      {appt?.phone && (
                        <p className="text-sm text-muted-foreground">{appt.phone}</p>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">Date:</span>{" "}
                        {safeFormat(appt?.date, "EEEE d MMMM yyyy", { locale: dateLocale })}
                        {appt?.startTime && appt?.endTime && (
                          <span className="ml-2">
                            {t("admin.from")} {appt.startTime} {t("admin.to")} {appt.endTime}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 p-3 bg-background rounded-md">
                        <p className="text-sm font-medium mb-1">
                          {t("admin.consultationReason")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appt?.reason ?? "—"}
                        </p>
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

/* ─── Exported page ───────────────────────────────────────────────────────── */

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("admin_auth") === "1"
  );

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminErrorBoundary>
      <AdminDashboard />
    </AdminErrorBoundary>
  );
}
