import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingDoctors = await storage.getDoctors();
  if (existingDoctors.length === 0) {
    const doc1 = await storage.createDoctor({
      name: "Dr. Sarah Smith",
      qualification: "MD, PhD (Cardiology)",
      specialization: "Cardiologist",
      experience: 12,
      department: "Cardiology",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
    });

    const doc2 = await storage.createDoctor({
      name: "Dr. James Wilson",
      qualification: "MBBS, MD",
      specialization: "General Physician",
      experience: 8,
      department: "General Medicine",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
    });

    const patient1 = await storage.createPatient({
      name: "John Doe",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      history: "None",
      status: "waiting",
      vitals: { bp: "140/90", hr: "80", temp: "98.6", weight: "85kg" }
    });

    const patient2 = await storage.createPatient({
      name: "Alice Johnson",
      age: 32,
      gender: "Female",
      condition: "Flu Symptoms",
      history: "Asthma",
      status: "consulting",
      vitals: { bp: "120/80", hr: "92", temp: "101.2", weight: "62kg" }
    });

    await storage.createAppointment({
      patientId: patient1.id,
      doctorId: doc1.id,
      time: "10:00 AM",
      status: "waiting"
    });

    await storage.createAppointment({
      patientId: patient2.id,
      doctorId: doc2.id,
      time: "11:30 AM",
      status: "in-progress"
    });

    // Seed a timeline event
    await storage.createTimelineEvent({
      patientId: patient1.id,
      title: "Appointment Scheduled",
      description: "Scheduled with Dr. Sarah Smith",
      type: "referral" // generic type
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  await seedDatabase();

  // Doctors
  app.get(api.doctors.list.path, async (_req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  app.get(api.doctors.get.path, async (req, res) => {
    const doctor = await storage.getDoctor(Number(req.params.id));
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  });

  // Patients
  app.get(api.patients.list.path, async (_req, res) => {
    const patients = await storage.getPatients();
    res.json(patients);
  });

  app.get(api.patients.get.path, async (req, res) => {
    const patient = await storage.getPatient(Number(req.params.id));
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  });

  app.patch(api.patients.update.path, async (req, res) => {
    const input = api.patients.update.input.parse(req.body);
    const updated = await storage.updatePatient(Number(req.params.id), input);
    res.json(updated);
  });

  // Appointments
  app.get(api.appointments.list.path, async (_req, res) => {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  });

  app.patch(api.appointments.update.path, async (req, res) => {
    const input = api.appointments.update.input.parse(req.body);
    const updated = await storage.updateAppointment(Number(req.params.id), input);
    res.json(updated);
  });

  // Prescriptions
  app.get(api.prescriptions.list.path, async (req, res) => {
    const patientId = req.query.patientId ? Number(req.query.patientId) : undefined;
    const prescriptions = await storage.getPrescriptions(patientId);
    res.json(prescriptions);
  });

  app.post(api.prescriptions.create.path, async (req, res) => {
    const input = api.prescriptions.create.input.parse(req.body);
    const prescription = await storage.createPrescription(input);
    
    // Add timeline event
    await storage.createTimelineEvent({
      patientId: input.patientId,
      title: "Prescription Added",
      description: "Doctor added a new prescription",
      type: "doctor"
    });

    res.status(201).json(prescription);
  });

  app.patch(api.prescriptions.update.path, async (req, res) => {
    const input = api.prescriptions.update.input.parse(req.body);
    const updated = await storage.updatePrescription(Number(req.params.id), input);
    
    // If status changed to dispensed
    if (input.status === 'dispensed') {
      const p = await storage.getPrescriptions(); // Not efficient but simple for now
      const target = p.find(px => px.id === Number(req.params.id));
      if (target) {
        await storage.createTimelineEvent({
          patientId: target.patientId,
          title: "Medicine Dispensed",
          description: "Pharmacy has dispensed the medicine",
          type: "pharmacy"
        });
      }
    }

    res.json(updated);
  });

  // Lab Tests
  app.get(api.labTests.list.path, async (_req, res) => {
    const tests = await storage.getLabTests();
    res.json(tests);
  });

  app.post(api.labTests.create.path, async (req, res) => {
    const input = api.labTests.create.input.parse(req.body);
    const test = await storage.createLabTest(input);
    
    await storage.createTimelineEvent({
      patientId: input.patientId,
      title: "Lab Test Requested",
      description: `${input.testName} requested by doctor`,
      type: "lab"
    });

    res.status(201).json(test);
  });

  app.patch(api.labTests.update.path, async (req, res) => {
    const input = api.labTests.update.input.parse(req.body);
    const updated = await storage.updateLabTest(Number(req.params.id), input);
    
    if (input.status) {
       // Fetch to get patient Id (simplified)
       // For real app we'd do a fetch or return from update
       // For now, assuming update returns full object
       await storage.createTimelineEvent({
         patientId: updated.patientId,
         title: `Lab Test ${input.status === 'completed' ? 'Result Ready' : 'Update'}`,
         description: `Test ${updated.testName} is now ${input.status}`,
         type: "lab"
       });
    }

    res.json(updated);
  });

  // Timeline
  app.get(api.timeline.list.path, async (req, res) => {
    const patientId = Number(req.query.patientId);
    if (!patientId) return res.status(400).json({ message: "Patient ID required" });
    const events = await storage.getTimeline(patientId);
    res.json(events);
  });

  app.post(api.timeline.create.path, async (req, res) => {
    const input = api.timeline.create.input.parse(req.body);
    const event = await storage.createTimelineEvent(input);
    res.status(201).json(event);
  });

  return httpServer;
}
