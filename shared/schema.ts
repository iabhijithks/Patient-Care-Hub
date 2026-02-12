import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Doctors
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  qualification: text("qualification").notNull(),
  specialization: text("specialization").notNull(),
  experience: integer("experience").notNull(),
  department: text("department").notNull(),
  imageUrl: text("image_url"),
});

// Patients
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  condition: text("condition"), // Current problem
  history: text("history"), // Previous conditions
  vitals: jsonb("vitals").$type<{ bp: string; hr: string; temp: string; weight: string }>().default({ bp: "", hr: "", temp: "", weight: "" }),
  status: text("status").default("waiting"), // waiting, consulting, discharged
  admissionDate: timestamp("admission_date").defaultNow(),
});

// Appointments/Queue
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  time: text("time").notNull(), // e.g., "11:00 AM"
  status: text("status").default("waiting"), // waiting, in-progress, completed
});

// Prescriptions
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  medicines: jsonb("medicines").$type<Array<{ name: string; dosage: string; timing: string; dispensed: boolean }>>().notNull(),
  status: text("status").default("pending"), // pending, dispensed
  createdAt: timestamp("created_at").defaultNow(),
});

// Lab Tests
export const labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  testName: text("test_name").notNull(),
  // Status flow: requested -> collected -> testing -> completed
  status: text("status").default("requested"),
  result: text("result"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timeline Events
export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // doctor, pharmacy, lab, referral
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schemas
export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, admissionDate: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true, createdAt: true });
export const insertLabTestSchema = createInsertSchema(labTests).omit({ id: true, createdAt: true });
export const insertTimelineSchema = createInsertSchema(timeline).omit({ id: true, timestamp: true });

// Types
export type Doctor = typeof doctors.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Prescription = typeof prescriptions.$inferSelect;
export type LabTest = typeof labTests.$inferSelect;
export type TimelineEvent = typeof timeline.$inferSelect;
