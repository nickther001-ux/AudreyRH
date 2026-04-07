import { useMutation } from "@tanstack/react-query";
import { api, type CreateAppointmentInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

type UseCreateAppointmentOptions = {
  onPaidRedirect?: () => void;
  onFreeSuccess?: (email: string) => void;
};

export function useCreateAppointment(options: UseCreateAppointmentOptions = {}) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateAppointmentInput) => {
      const validated = api.appointments.create.input.parse(data);
      
      const res = await fetch(api.appointments.create.path, {
        method: api.appointments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create appointment");
      }

      const result = await res.json();
      return result;
    },
    onSuccess: (data) => {
      if (data.type === 'free_consultation') {
        // Free consultation — request sent, pending Audrey's confirmation
        options.onFreeSuccess?.(data.appointment?.email ?? '');
      } else if (data.checkoutUrl) {
        // Paid service — redirect to Stripe
        options.onPaidRedirect?.();
        toast({
          title: "Redirection vers le paiement",
          description: "Vous êtes redirigé vers le paiement sécurisé...",
        });
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 500);
      } else {
        toast({
          title: "Réservation enregistrée",
          description: "Vous recevrez un email de confirmation sous peu.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
