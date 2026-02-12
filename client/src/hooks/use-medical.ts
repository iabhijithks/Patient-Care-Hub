import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { insertPatientSchema, insertPrescriptionSchema, insertLabTestSchema, insertTimelineSchema, insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

// ============================================
// DOCTORS
// ============================================
export function useDoctors() {
  return useQuery({
    queryKey: [api.doctors.list.path],
    queryFn: async () => {
      const res = await fetch(api.doctors.list.path);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return api.doctors.list.responses[200].parse(await res.json());
    },
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: [api.doctors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.doctors.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch doctor");
      return api.doctors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// ============================================
// PATIENTS
// ============================================
export function usePatients() {
  return useQuery({
    queryKey: [api.patients.list.path],
    queryFn: async () => {
      const res = await fetch(api.patients.list.path);
      if (!res.ok) throw new Error("Failed to fetch patients");
      return api.patients.list.responses[200].parse(await res.json());
    },
  });
}

export function usePatient(id: number) {
  return useQuery({
    queryKey: [api.patients.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.patients.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch patient");
      return api.patients.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & z.infer<typeof api.patients.update.input>) => {
      const url = buildUrl(api.patients.update.path, { id });
      const res = await fetch(url, {
        method: api.patients.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update patient");
      return api.patients.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.patients.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.patients.get.path] });
    },
  });
}

// ============================================
// APPOINTMENTS
// ============================================
export function useAppointments() {
  return useQuery({
    queryKey: [api.appointments.list.path],
    queryFn: async () => {
      const res = await fetch(api.appointments.list.path);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return api.appointments.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & z.infer<typeof api.appointments.update.input>) => {
      const url = buildUrl(api.appointments.update.path, { id });
      const res = await fetch(url, {
        method: api.appointments.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      return api.appointments.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] }),
  });
}

// ============================================
// PRESCRIPTIONS
// ============================================
export function usePrescriptions(patientId?: number) {
  return useQuery({
    queryKey: [api.prescriptions.list.path, patientId],
    queryFn: async () => {
      const url = patientId 
        ? `${api.prescriptions.list.path}?patientId=${patientId}`
        : api.prescriptions.list.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      return api.prescriptions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.prescriptions.create.input>) => {
      const res = await fetch(api.prescriptions.create.path, {
        method: api.prescriptions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create prescription");
      return api.prescriptions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.prescriptions.list.path] }),
  });
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & z.infer<typeof api.prescriptions.update.input>) => {
      const url = buildUrl(api.prescriptions.update.path, { id });
      const res = await fetch(url, {
        method: api.prescriptions.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update prescription");
      return api.prescriptions.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.prescriptions.list.path] }),
  });
}

// ============================================
// LAB TESTS
// ============================================
export function useLabTests() {
  return useQuery({
    queryKey: [api.labTests.list.path],
    queryFn: async () => {
      const res = await fetch(api.labTests.list.path);
      if (!res.ok) throw new Error("Failed to fetch lab tests");
      return api.labTests.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLabTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.labTests.create.input>) => {
      const res = await fetch(api.labTests.create.path, {
        method: api.labTests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create lab test");
      return api.labTests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.labTests.list.path] }),
  });
}

export function useUpdateLabTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & z.infer<typeof api.labTests.update.input>) => {
      const url = buildUrl(api.labTests.update.path, { id });
      const res = await fetch(url, {
        method: api.labTests.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update lab test");
      return api.labTests.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.labTests.list.path] }),
  });
}

// ============================================
// TIMELINE
// ============================================
export function useTimeline(patientId: number) {
  return useQuery({
    queryKey: [api.timeline.list.path, patientId],
    queryFn: async () => {
      // Use query param structure properly
      const url = `${api.timeline.list.path}?patientId=${patientId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return api.timeline.list.responses[200].parse(await res.json());
    },
    enabled: !!patientId,
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.timeline.create.input>) => {
      const res = await fetch(api.timeline.create.path, {
        method: api.timeline.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create timeline event");
      return api.timeline.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.timeline.list.path] }),
  });
}
