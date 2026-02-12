import { z } from "zod";
import { 
  insertDoctorSchema, 
  insertPatientSchema, 
  insertAppointmentSchema, 
  insertPrescriptionSchema, 
  insertLabTestSchema, 
  insertTimelineSchema,
  doctors,
  patients,
  appointments,
  prescriptions,
  labTests,
  timeline
} from "./schema";

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
  doctors: {
    list: {
      method: 'GET' as const,
      path: '/api/doctors' as const,
      responses: {
        200: z.array(z.custom<typeof doctors.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/doctors/:id' as const,
      responses: {
        200: z.custom<typeof doctors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  patients: {
    list: {
      method: 'GET' as const,
      path: '/api/patients' as const,
      responses: {
        200: z.array(z.custom<typeof patients.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/patients/:id' as const,
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/patients/:id' as const,
      input: insertPatientSchema.partial(),
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments' as const,
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect>()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id' as const,
      input: insertAppointmentSchema.partial(),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  prescriptions: {
    list: {
      method: 'GET' as const,
      path: '/api/prescriptions' as const,
      input: z.object({ patientId: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof prescriptions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/prescriptions' as const,
      input: insertPrescriptionSchema,
      responses: {
        201: z.custom<typeof prescriptions.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/prescriptions/:id' as const,
      input: insertPrescriptionSchema.partial(),
      responses: {
        200: z.custom<typeof prescriptions.$inferSelect>(),
      },
    },
  },
  labTests: {
    list: {
      method: 'GET' as const,
      path: '/api/lab-tests' as const,
      responses: {
        200: z.array(z.custom<typeof labTests.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/lab-tests' as const,
      input: insertLabTestSchema,
      responses: {
        201: z.custom<typeof labTests.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/lab-tests/:id' as const,
      input: insertLabTestSchema.partial(),
      responses: {
        200: z.custom<typeof labTests.$inferSelect>(),
      },
    },
  },
  timeline: {
    list: {
      method: 'GET' as const,
      path: '/api/timeline' as const,
      input: z.object({ patientId: z.coerce.number() }),
      responses: {
        200: z.array(z.custom<typeof timeline.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/timeline' as const,
      input: insertTimelineSchema,
      responses: {
        201: z.custom<typeof timeline.$inferSelect>(),
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
