import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  insertAvailabilitySlotSchema,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type Appointment,
} from "@shared/validators";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Clock,
  ArrowLeft,
  Users,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  CalendarClock,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import beachBg from "@assets/beach_1776191148475.avif";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function parseLocalDate(dateInput: string | Date | null | undefined): Date {
  if (!dateInput) return new Date(NaN);
  const str = typeof dateInput === "string" ? dateInput : dateInput.toISOString();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), 12, 0, 0);
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
  "07:30","07:45",
  "08:00","08:15","08:30","08:45",
  "09:00","09:15","09:30","09:45",
  "10:00","10:15","10:30","10:45",
  "11:00","11:15","11:30","11:45",
  "12:00","12:15","12:30","12:45",
  "13:00","13:15","13:30","13:45",
  "14:00","14:15","14:30","14:45",
  "15:00","15:15","15:30","15:45",
  "16:00","16:15","16:30","16:45",
  "17:00","17:15","17:30","17:45",
  "18:00",
];

function statusBadge(appt: Appointment) {
  const s = appt.status ?? "pending";
  if (s === "confirmed") return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1" />Confirmé</Badge>;
  if (s === "cancelled") return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Annulé</Badge>;
  if (s === "completed") return <Badge className="bg-slate-100 text-slate-700 border-slate-200"><CheckCircle2 className="h-3 w-3 mr-1" />Terminé</Badge>;
  return <Badge className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
}

/* ─── Error Boundary ──────────────────────────────────────────────────────── */

interface EBState { hasError: boolean; message: string }
class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
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
            <p className="text-muted-foreground text-sm mb-1">Failed to load admin data. Please refresh.</p>
            <p className="text-xs text-slate-400 font-mono mb-6 break-all">{this.state.message}</p>
            <Button onClick={() => { this.setState({ hasError: false, message: "" }); window.location.reload(); }} className="gap-2">
              <RefreshCw className="w-4 h-4" />Rafraîchir la page
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
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-12 w-full rounded-lg bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
          <Skeleton className="h-5 w-40 bg-white/10" />
          <Skeleton className="h-4 w-64 bg-white/10" />
          <Skeleton className="h-16 w-full rounded-md bg-white/10" />
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
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${beachBg})` }}
    >
      <div className="absolute inset-0 bg-[#0d1f3c]/75" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-[#0d1f3c]/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="px-8 py-8 text-center border-b border-white/10">
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Audrey<span className="text-white">RH</span><span className="text-[#93c5fd]">.</span>
            </p>
            <p className="text-xs text-white/40 mt-1.5 uppercase tracking-widest">
              Espace administrateur
            </p>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-sm font-semibold text-white/70">
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
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#93c5fd]/50 transition"
              />
            </div>
            {error && (
              <p data-testid="text-login-error" className="text-sm text-red-400 font-medium">
                {error}
              </p>
            )}
            <button
              data-testid="button-admin-login"
              type="submit"
              disabled={isPending}
              className="w-full bg-[#1e3a5f] hover:bg-[#2a4f7f] disabled:opacity-60 text-white font-bold py-3 rounded-lg text-sm border border-[#93c5fd]/30 transition-colors"
            >
              {isPending ? "Vérification…" : "Accéder au panneau"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-white/30 mt-4">AudreyRH · accès réservé</p>
      </div>
    </div>
  );
}

/* ─── Reschedule Dialog ───────────────────────────────────────────────────── */

function RescheduleDialog({
  appt,
  open,
  onClose,
  onSuccess,
}: {
  appt: Appointment;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [calOpen, setCalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!date) throw new Error("Choisissez une date");
      const res = await apiRequest("PATCH", `/api/admin/appointments/${appt.id}/reschedule`, {
        date: format(date, "yyyy-MM-dd"),
        startTime,
        endTime,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({ title: "Reprogrammé", description: "Le client recevra un email de notification." });
      onSuccess();
    },
    onError: (err: Error) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#0d1f3c] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Reprogrammer — {appt.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Nouvelle date</label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <button
                  data-testid="button-reschedule-date"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10 transition"
                >
                  <span>{date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}</span>
                  <CalendarIcon className="h-4 w-4 text-white/40" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0d1f3c] border border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setCalOpen(false); }}
                  disabled={(d) => d < startOfDay(new Date())}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Début</label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-reschedule-start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1f3c] border-white/10 text-white">
                  {timeSlots.map((t) => <SelectItem key={t} value={t} className="text-white hover:bg-white/10">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Fin</label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-reschedule-end">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1f3c] border-white/10 text-white">
                  {timeSlots.map((t) => <SelectItem key={t} value={t} className="text-white hover:bg-white/10">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/5">
            Annuler
          </Button>
          <Button
            onClick={() => mutate()}
            disabled={isPending || !date}
            className="bg-[#1e3a5f] hover:bg-[#2a4f7f] border border-[#93c5fd]/30 text-white"
            data-testid="button-confirm-reschedule"
          >
            {isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <CalendarClock className="h-4 w-4 mr-2" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Appointment Card ────────────────────────────────────────────────────── */

function AppointmentCard({
  appt,
  dateLocale,
}: {
  appt: Appointment;
  dateLocale: Locale;
}) {
  const { toast } = useToast();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/admin/appointments/${appt.id}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({ title: "Confirmé", description: "Email de confirmation envoyé au client." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de confirmer.", variant: "destructive" });
    },
  });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/admin/appointments/${appt.id}/reject`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({ title: "Annulé", description: "Email de refus envoyé au client." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible d'annuler.", variant: "destructive" });
    },
  });

  const isActive = appt.status !== "cancelled" && appt.status !== "completed";

  return (
    <>
      <div
        className="p-5 rounded-xl border border-white/15 bg-[#0d1f3c]/55 backdrop-blur-sm transition-all hover:bg-[#0d1f3c]/70"
        data-testid={`appointment-${appt?.id}`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-lg leading-none">{appt?.name ?? "—"}</span>
              {statusBadge(appt)}
              <Badge variant="outline" className="border-white/15 text-white/60 text-xs">
                {appt?.platform === "zoom" ? "Zoom" : "Google Meet"}
              </Badge>
              {appt?.paymentStatus === "paid" && (
                <Badge className="bg-green-900/40 text-green-300 border-green-700/40 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />Payé
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
              <a href={`mailto:${appt?.email}`} className="hover:text-[#93c5fd] transition">{appt?.email ?? "—"}</a>
              {appt?.phone && <span>{appt.phone}</span>}
            </div>

            <div className="text-sm text-white/70">
              <span className="font-medium text-white/90">Date:</span>{" "}
              {appt?.date
                ? safeFormat(appt.date, "EEEE d MMMM yyyy", { locale: dateLocale })
                : <span className="italic text-white/35">Non spécifiée</span>}
              {appt?.startTime && appt?.endTime && (
                <span className="ml-2 text-white/50">· {appt.startTime} – {appt.endTime}</span>
              )}
            </div>

            {appt?.reason && (
              <div className="mt-1 p-3 rounded-lg bg-white/5 border border-white/8">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Sujet</p>
                <p className="text-sm text-white/65">{appt.reason}</p>
              </div>
            )}
          </div>

          {isActive && (
            <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
              <Button
                size="sm"
                onClick={() => approve()}
                disabled={isApproving || isRejecting || appt.status === "confirmed"}
                className="bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-600/30 text-emerald-300 text-xs gap-1.5"
                data-testid={`button-approve-${appt.id}`}
              >
                {isApproving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
                Confirmer
              </Button>
              <Button
                size="sm"
                onClick={() => setRescheduleOpen(true)}
                disabled={isApproving || isRejecting}
                className="bg-[#1e3a5f]/70 hover:bg-[#2a4f7f]/80 border border-[#93c5fd]/20 text-[#93c5fd] text-xs gap-1.5"
                data-testid={`button-reschedule-${appt.id}`}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Reprog.
              </Button>
              <Button
                size="sm"
                onClick={() => reject()}
                disabled={isApproving || isRejecting}
                className="bg-red-900/30 hover:bg-red-900/50 border border-red-700/30 text-red-400 text-xs gap-1.5"
                data-testid={`button-reject-${appt.id}`}
              >
                {isRejecting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ThumbsDown className="h-3.5 w-3.5" />}
                Refuser
              </Button>
            </div>
          )}
        </div>
      </div>

      <RescheduleDialog
        appt={appt}
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        onSuccess={() => setRescheduleOpen(false)}
      />
    </>
  );
}

/* ─── Main Admin dashboard ────────────────────────────────────────────────── */

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const dateLocale = language === "fr" ? fr : enUS;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [justAdded, setJustAdded] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const {
    data: slots,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
  } = useQuery<AvailabilitySlot[]>({ queryKey: ["/api/admin/availability"] });

  const {
    data: allAppointments,
    isLoading: isApptsLoading,
    isFetching: isApptsFetching,
  } = useQuery<Appointment[]>({ queryKey: ["/api/admin/appointments"] });

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
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message ?? `Erreur serveur (${res.status})`);
      }
      return json;
    },
    onSuccess: (newSlot) => {
      queryClient.refetchQueries({ queryKey: ["/api/admin/availability"] });
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 5000);
      const nextDate = selectedDate ?? addDays(startOfDay(new Date()), 1);
      form.reset({ date: nextDate, startTime: "09:00", endTime: "10:00" });
      toast({
        title: "Créneau ajouté ✓",
        description: newSlot?.startTime && newSlot?.endTime
          ? `${newSlot.startTime} – ${newSlot.endTime} enregistré avec succès.`
          : "Le créneau a été enregistré.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Erreur — Créneau non ajouté",
        description: err?.message || t("admin.errorAdd"),
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteSlot, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/availability/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/availability"] });
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: t("admin.slotDeleted"), description: t("admin.slotDeletedDesc") });
    },
    onError: () => {
      toast({ title: t("admin.error"), description: t("admin.errorDelete"), variant: "destructive" });
    },
  });

  const safeSlots: AvailabilitySlot[] = Array.isArray(slots) ? slots : [];
  const safeAppointments: Appointment[] = Array.isArray(allAppointments) ? allAppointments : [];

  useEffect(() => {
    if (allAppointments !== undefined) {
      console.log("[Admin] raw appointments from API:", JSON.stringify(allAppointments, null, 2));
    }
  }, [allAppointments]);

  useEffect(() => {
    console.log("[Admin] slots from API:", safeSlots.length, "items", safeSlots.map(s => ({ id: s.id, date: s.date, start: s.startTime })));
  }, [slots]);

  const groupedSlots = safeSlots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    if (!slot?.date) return acc;
    const dateKey = safeFormat(slot.date, "yyyy-MM-dd");
    if (dateKey === "—") return acc;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const sortedAppointments = [...safeAppointments].sort(
    (a, b) => safeCreatedAt(b?.createdAt) - safeCreatedAt(a?.createdAt)
  );

  const pendingCount = safeAppointments.filter(a => a.status === "pending").length;
  const confirmedCount = safeAppointments.filter(a => a.status === "confirmed").length;

  const onSubmit = (data: InsertAvailabilitySlot) => createSlot(data);

  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL as string | undefined;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${beachBg})` }}
    >
      <div className="absolute inset-0 bg-[#060f1e]/50 pointer-events-none" />

      <div className="relative z-10">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 bg-[#060f1e]/80 backdrop-blur-md border-b border-white/8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition" data-testid="button-back-home">
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
              </Link>
              <div>
                <p className="text-white font-extrabold text-xl leading-none tracking-tight">
                  Audrey<span className="text-[#93c5fd]">RH</span><span className="text-[#93c5fd]">.</span>
                </p>
                <p className="text-white/30 text-[10px] uppercase tracking-widest leading-none mt-0.5">
                  Tableau de bord
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                {pendingCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/20">
                    {pendingCount} en attente
                  </span>
                )}
                {confirmedCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {confirmedCount} confirmé{confirmedCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
                data-testid="button-logout"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* ── Stats strip ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total réservations", value: safeAppointments.length, color: "text-white" },
              { label: "En attente", value: pendingCount, color: "text-amber-300" },
              { label: "Confirmés", value: confirmedCount, color: "text-emerald-400" },
              { label: "Créneaux dispo", value: Object.values(groupedSlots).flat().length, color: "text-[#93c5fd]" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/20 bg-[#0d1f3c]/75 backdrop-blur-md px-5 py-4">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* ── Appointments (FIRST — most important) ── */}
          <div className="rounded-2xl border border-white/15 bg-[#0d1f3c]/75 backdrop-blur-md p-6 mb-8">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#93c5fd]" />
              Réservations clients
              {isApptsFetching && !isApptsLoading && (
                <RefreshCw className="h-3.5 w-3.5 ml-auto animate-spin text-white/30" />
              )}
            </h2>

            {isApptsLoading ? (
              <AppointmentsSkeleton />
            ) : sortedAppointments.length === 0 ? (
              <p className="text-white/40 text-sm" data-testid="text-no-appointments">{t("admin.noAppointments")}</p>
            ) : (
              <div className={cn("space-y-3", isApptsFetching && "opacity-60 transition-opacity")}>
                {sortedAppointments.map((appt) => (
                  <AppointmentCard key={appt?.id} appt={appt} dateLocale={dateLocale} />
                ))}
              </div>
            )}
          </div>

          {/* ── Two-column: slots form + current slots ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Add slot form */}
            <div className="rounded-2xl border border-white/15 bg-[#0d1f3c]/65 backdrop-blur-md p-6">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#93c5fd]" />
                {t("admin.addSlot")}
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">{t("admin.date")}</FormLabel>
                        <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                                  !field.value && "text-white/30"
                                )}
                                data-testid="button-admin-date-picker"
                              >
                                {field.value ? safeFormat(field.value, "PPP", { locale: dateLocale }) : <span>{t("admin.date")}</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-40" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-[#0d1f3c] border border-white/10" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                                setDatePopoverOpen(false);
                              }}
                              disabled={(date) => date < startOfDay(new Date())}
                              initialFocus
                              className="text-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">{t("admin.startTime")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-start-time">
                                <SelectValue placeholder={t("admin.startPlaceholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#0d1f3c] border-white/10">
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="text-white hover:bg-white/10 focus:bg-white/10">{time}</SelectItem>
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
                          <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">{t("admin.endTime")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-end-time">
                                <SelectValue placeholder={t("admin.endPlaceholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#0d1f3c] border-white/10">
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="text-white hover:bg-white/10 focus:bg-white/10">{time}</SelectItem>
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
                    className="w-full bg-[#1e3a5f] hover:bg-[#2a4f7f] border border-[#93c5fd]/25 text-white font-semibold"
                    disabled={isCreating}
                    data-testid="button-add-slot"
                  >
                    {isCreating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {isCreating ? t("admin.adding") : t("admin.add")}
                  </Button>

                  {justAdded && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-900/30 border border-emerald-600/25 text-emerald-300 text-sm font-medium" data-testid="banner-slot-added">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {t("admin.slotAdded")} — {t("admin.slotAddedDesc")}
                    </div>
                  )}
                </form>
              </Form>
            </div>

            {/* Current slots */}
            <div className="rounded-2xl border border-white/15 bg-[#0d1f3c]/65 backdrop-blur-md p-6">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#93c5fd]" />
                {t("admin.currentSlots")}
                {isSlotsFetching && !isSlotsLoading && (
                  <RefreshCw className="h-3.5 w-3.5 ml-auto animate-spin text-white/30" />
                )}
              </h2>

              {isSlotsLoading ? (
                <SlotsSkeleton />
              ) : Object.keys(groupedSlots).length === 0 ? (
                <p className="text-white/35 text-sm" data-testid="text-no-slots">{t("admin.noSlots")}</p>
              ) : (
                <div className={cn("space-y-5 max-h-72 overflow-y-auto pr-1", isSlotsFetching && "opacity-60 pointer-events-none transition-opacity")}>
                  {Object.entries(groupedSlots)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([dateKey, dateSlots]) => (
                      <div key={dateKey}>
                        <h3 className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-2">
                          {safeFormat(dateKey, "EEEE d MMMM yyyy", { locale: dateLocale })}
                        </h3>
                        <div className="space-y-1.5">
                          {[...(dateSlots ?? [])]
                            .sort((a, b) => (a?.startTime ?? "").localeCompare(b?.startTime ?? ""))
                            .map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 border border-white/8"
                                data-testid={`slot-${slot.id}`}
                              >
                                <span className="text-sm font-medium text-white">
                                  {slot?.startTime ?? "—"} – {slot?.endTime ?? "—"}
                                </span>
                                <button
                                  disabled={isDeleting}
                                  onClick={() => deleteSlot(slot.id)}
                                  className="p-1.5 rounded-md text-white/25 hover:text-red-400 hover:bg-red-900/20 transition"
                                  data-testid={`button-delete-slot-${slot.id}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Calendly section ── */}
          {calendlyUrl && (
            <div className="rounded-2xl border border-white/15 bg-[#0d1f3c]/65 backdrop-blur-md p-6">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[#93c5fd]" />
                Calendly
              </h2>
              <p className="text-xs text-white/40 mb-4">Votre lien de réservation Calendly</p>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#93c5fd]/25 bg-[#1e3a5f]/60 text-[#93c5fd] text-sm font-medium hover:bg-[#2a4f7f]/60 transition"
                data-testid="link-calendly-admin"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ouvrir Calendly
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Exported page ───────────────────────────────────────────────────────── */

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("admin_auth") === "1"
  );

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminErrorBoundary>
      <AdminDashboard onLogout={handleLogout} />
    </AdminErrorBoundary>
  );
}
