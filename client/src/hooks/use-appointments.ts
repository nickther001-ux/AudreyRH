import { useMutation } from "@tanstack/react-query";
import { api, type CreateAppointmentInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateAppointment() {
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
      if (data.checkoutUrl) {
        toast({
          title: "Redirecting to Payment",
          description: "Taking you to secure checkout...",
        });
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 500);
      } else {
        toast({
          title: "Appointment Booked",
          description: "Your appointment has been scheduled. You will receive a confirmation email shortly.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
