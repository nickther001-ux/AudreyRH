import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { insertAvailabilitySlotSchema, type AvailabilitySlot, type InsertAvailabilitySlot } from "@shared/schema";
import { CalendarIcon, Plus, Trash2, Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export default function Admin() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));

  const { data: slots = [], isLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ['/api/availability'],
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
        title: "Disponibilité ajoutée",
        description: "Le créneau a été ajouté avec succès.",
      });
      form.reset({
        date: selectedDate || addDays(startOfDay(new Date()), 1),
        startTime: "09:00",
        endTime: "10:00",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le créneau.",
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
        title: "Créneau supprimé",
        description: "Le créneau a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau.",
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
            <h1 className="text-3xl font-bold" data-testid="text-admin-title">Gérer mes disponibilités</h1>
            <p className="text-muted-foreground">Ajoutez vos créneaux disponibles pour les consultations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Ajouter un créneau
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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
                        <FormLabel>Heure de début</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-start-time">
                              <SelectValue placeholder="Début" />
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
                        <FormLabel>Heure de fin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-end-time">
                              <SelectValue placeholder="Fin" />
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
                  {isCreating ? "Ajout en cours..." : "Ajouter ce créneau"}
                </Button>
              </form>
            </Form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Créneaux disponibles
            </h2>

            {isLoading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : Object.keys(groupedSlots).length === 0 ? (
              <p className="text-muted-foreground" data-testid="text-no-slots">
                Aucun créneau disponible. Ajoutez vos disponibilités à gauche.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSlots)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([dateKey, dateSlots]) => (
                    <div key={dateKey}>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        {format(new Date(dateKey), "EEEE d MMMM yyyy", { locale: fr })}
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
      </div>
    </div>
  );
}
