import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateAppointmentInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateAppointmentInput) => {
      // Validate with Zod before sending if possible, but route parsing handles it too
      const validated = api.appointments.create.input.parse(data);
      
      const res = await fetch(api.appointments.create.path, {
        method: api.appointments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json(); // Simple parsing for now
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create appointment");
      }

      // 201 Response matches schema: { appointment: ..., clientSecret: ... }
      return api.appointments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate relevant queries if we had a list view
      // queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] });
      toast({
        title: "Booking Initiated",
        description: "Your appointment request has been received. Please complete payment if required.",
      });
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
