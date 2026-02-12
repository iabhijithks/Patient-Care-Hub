# Hospital Patient-Care Coordination System

A role-based hospital workflow web application that centralizes patient records and enables real-time coordination between doctors, nurses, pharmacy, lab, and patients.

This project focuses on **patient-centric clinical workflow visibility**, not full hospital management.

---

## Problem

In many hospitals, patient-care information is scattered across departments:

- Prescriptions written by doctors
- Diagnostic requests sent to labs
- Pharmacy dispensing medicines
- Nurses updating care instructions
- Lab results delivered manually

This leads to:
- delays in patient care
- miscommunication between departments
- lack of visibility into patient workflow

This system solves that by organizing **all clinical actions around a single patient record**.

---

## Core Concept

The application revolves around:

> One patient record shared across multiple hospital roles with real-time updates.

Each department interacts with the same patient record but only sees what they need.

---

## Role-Based System

The application starts with a **role selection screen**:

- Patient
- Doctor
- Nurse
- Lab
- Pharmacy

Each role gets a different dashboard interface.

---

## Patient Record Structure

Each patient record includes:

### Basic Information
- Name
- Age
- Patient ID
- Current problem
- Previous conditions (diabetes, BP, etc.)
- Old medicines

---

### Assigned Doctor
- Doctor name
- Qualification (MBBS / MD / PhD)
- Specialization
- Estimated consultation time

Example:
```
Your consultation is expected around 11:00 AM
```

---

## Workflow Phases

---

# Phase 1 — Doctor Assignment & Queue

- Patient record created
- Doctor assigned
- Doctor sees patient in queue
- Patient sees doctor details and estimated time
- Doctor calls patient through system

Status flow:
```
Waiting → Called → In Consultation → Completed
```

---

# Phase 2 — Consultation & Prescription

During consultation:
- Patient explains symptoms
- Nurse may type prescription draft
- Doctor confirms prescription

Only after **doctor confirmation**:
- Patient sees prescription
- Pharmacy gets prescription
- Timeline updates

Prescription includes:
- Medicine name
- Dosage
- Timing
- Duration

---

# Phase 3 — Pharmacy Workflow

Pharmacy receives prescription with limited patient info.

Pharmacy dashboard shows:
- Patient name / ID
- Medicine list
- Quantity
- Timing

Each medicine has:
- Dispensed checkbox
- Unavailable option

If medicine is unavailable:
- Doctor is notified
- Nurse is notified
- Patient is notified
- Doctor can modify prescription immediately

This reduces treatment delays.

---

# Phase 4 — Lab / Diagnostic Workflow

Doctor can request diagnostic tests.

Lab receives:
- Patient ID
- Test requests
- Required measurements

Patient sees:
- Lab info
- Approximate time
- Tests list
- Progress bar

Example progress bar stages:
```
Test Requested → Sample Collected → Testing → Results Ready
```

---

## Result Sharing

When lab uploads results:

Doctor dashboard:
- Detailed medical results

Patient dashboard:
- Simplified explanation to avoid panic

Example:
```
Doctor view → measurements and report
Patient view → "Results are normal. Doctor will confirm."
```

---

# Phase 5 — Doctor Review & Follow-Up

After results:
- Doctor reviews report
- Patient becomes ready for follow-up

Doctor can:
- confirm normal result
- continue treatment

Patient gets notified.

---

# Phase 6 — Referral System

Doctor can refer another doctor using doctor ID.

Use cases:
- specialists
- operations
- second opinions

Referral workflow:
- Referred doctor gets access to patient record
- Patient sees new doctor details
- Consultation time allocated

Access control rule:
Only assigned doctor and referred doctor can view patient data.

---

## Patient Timeline

The system maintains a **patient activity timeline**.

Example:
```
Doctor added prescription
Pharmacy dispensed medicine
Lab uploaded results
Doctor reviewed results
Referral created
```

This provides full visibility into patient care.

---

## Interfaces

### Doctor Dashboard
- Patient queue
- Patient record view
- Prescription creation
- Diagnostic requests
- Referral
- Pharmacy updates
- Lab results

---

### Patient Dashboard
- Patient info
- Assigned doctor details
- Prescription list
- Pharmacy status
- Lab progress
- Results
- Referral info

---

### Nurse Dashboard
- View patient record
- Enter prescription draft
- Update vitals
- Add care instructions

---

### Pharmacy Dashboard
- Medicine checklist
- Dispense medicines
- Mark unavailable medicines
- Submit updates

---

### Lab Dashboard
- Test request list
- Mark sample collected
- Mark test completed
- Upload results
- Submit updates

---

## UI Design Goals

- Modern hospital dashboard layout
- Card-based UI
- Status badges
- Progress bars
- Activity timeline
- Clean medical color palette

---

## Tech Approach

This project is designed for **AI-assisted development (vibe coding)** using:
- React dashboards
- Mock data
- Shared patient state
- Role-based UI

No authentication required for demo.

---

## Demo Flow

The end-to-end demo scenario:

1. Create patient
2. Assign doctor
3. Doctor calls patient
4. Doctor writes prescription
5. Pharmacy dispenses medicine
6. Doctor requests test
7. Lab uploads result
8. Doctor reviews result
9. Doctor refers specialist

---

## Goal of the Project

To demonstrate how **patient-centric workflow visibility** can reduce delays and improve coordination between hospital departments.

This is not a hospital management system —  
it is a **clinical workflow coordination system**.
