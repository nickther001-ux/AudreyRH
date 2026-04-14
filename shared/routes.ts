import { z } from 'zod';
import { insertAppointmentSchema, insertAvailabilitySlotSchema, type Appointment, type AvailabilitySlot } from './validators';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  appointments: {
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.object({
          appointment: z.custom<Appointment>(),
          checkoutUrl: z.string().nullable().optional(),
        }),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/appointments/:id',
      responses: {
        200: z.custom<Appointment>(),
        404: errorSchemas.notFound,
      },
    },
  },
  availability: {
    create: {
      method: 'POST' as const,
      path: '/api/availability',
      input: insertAvailabilitySlotSchema,
      responses: {
        201: z.custom<AvailabilitySlot>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/availability',
      responses: {
        200: z.array(z.custom<AvailabilitySlot>()),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/availability/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CreateAppointmentInput = z.infer<typeof api.appointments.create.input>;
