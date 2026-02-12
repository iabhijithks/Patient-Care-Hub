import { 
  doctors, patients, appointments, prescriptions, labTests, timeline,
  type Doctor, type Patient, type Appointment, type Prescription, type LabTest, type TimelineEvent,
  type InsertDoctor, type InsertPatient, type InsertAppointment, type InsertPrescription, type InsertLabTest, type InsertTimeline
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Patients
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;

  // Prescriptions
  getPrescriptions(patientId?: number): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription>;

  // Lab Tests
  getLabTests(): Promise<LabTest[]>;
  createLabTest(test: InsertLabTest): Promise<LabTest>;
  updateLabTest(id: number, test: Partial<InsertLabTest>): Promise<LabTest>;

  // Timeline
  getTimeline(patientId: number): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimeline): Promise<TimelineEvent>;
}

export class DatabaseStorage implements IStorage {
  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db.insert(patients).values(insertPatient).returning();
    return patient;
  }

  async updatePatient(id: number, updates: Partial<InsertPatient>): Promise<Patient> {
    const [updated] = await db.update(patients).set(updates).where(eq(patients.id, id)).returning();
    return updated;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async updateAppointment(id: number, updates: Partial<InsertAppointment>): Promise<Appointment> {
    const [updated] = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return updated;
  }

  // Prescriptions
  async getPrescriptions(patientId?: number): Promise<Prescription[]> {
    if (patientId) {
      return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId));
    }
    return await db.select().from(prescriptions);
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const [prescription] = await db.insert(prescriptions).values(insertPrescription).returning();
    return prescription;
  }

  async updatePrescription(id: number, updates: Partial<InsertPrescription>): Promise<Prescription> {
    const [updated] = await db.update(prescriptions).set(updates).where(eq(prescriptions.id, id)).returning();
    return updated;
  }

  // Lab Tests
  async getLabTests(): Promise<LabTest[]> {
    return await db.select().from(labTests);
  }

  async createLabTest(insertLabTest: InsertLabTest): Promise<LabTest> {
    const [labTest] = await db.insert(labTests).values(insertLabTest).returning();
    return labTest;
  }

  async updateLabTest(id: number, updates: Partial<InsertLabTest>): Promise<LabTest> {
    const [updated] = await db.update(labTests).set(updates).where(eq(labTests.id, id)).returning();
    return updated;
  }

  // Timeline
  async getTimeline(patientId: number): Promise<TimelineEvent[]> {
    return await db.select().from(timeline).where(eq(timeline.patientId, patientId));
  }

  async createTimelineEvent(insertTimeline: InsertTimeline): Promise<TimelineEvent> {
    const [event] = await db.insert(timeline).values(insertTimeline).returning();
    return event;
  }
}

export const storage = new DatabaseStorage();
