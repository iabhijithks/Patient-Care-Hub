import { useState } from "react";
import { useDoctors, useAppointments, usePatients, useUpdateAppointment, useCreatePrescription, useCreateLabTest, useCreateTimelineEvent } from "@/hooks/use-medical";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, User, Clock, Activity, FileText, FlaskConical, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export default function DoctorDashboard() {
  const { data: doctors } = useDoctors();
  const { data: appointments } = useAppointments();
  const { data: patients } = usePatients();
  
  // Just grabbing the first doctor as "current user" for demo
  const currentDoctor = doctors?.[0];

  if (!currentDoctor || !appointments || !patients) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter appointments for this doctor
  const myAppointments = appointments.filter(apt => apt.doctorId === currentDoctor.id);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-900">MediFlow <span className="text-slate-400 font-normal">| Doctor Portal</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{currentDoctor.name}</p>
              <p className="text-xs text-slate-500">{currentDoctor.specialization}</p>
            </div>
            {/* Using a placeholder avatar image */}
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img 
                src={currentDoctor.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"} 
                alt={currentDoctor.name}
                className="w-full h-full object-cover"
              />
              {/* Image of a doctor */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 font-medium text-sm">Appointments Today</p>
                  <h3 className="text-3xl font-bold mt-2">{myAppointments.length}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Waiting Patients</p>
                  <h3 className="text-3xl font-bold mt-2 text-slate-900">
                    {myAppointments.filter(a => a.status === 'waiting').length}
                  </h3>
                </div>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Completed</p>
                  <h3 className="text-3xl font-bold mt-2 text-slate-900">
                    {myAppointments.filter(a => a.status === 'completed').length}
                  </h3>
                </div>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue */}
        <Card className="border-none shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle>Patient Queue</CardTitle>
            <CardDescription>Today's appointments scheduled for Dr. {currentDoctor.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAppointments.map((apt) => {
                    const patient = patients.find(p => p.id === apt.patientId);
                    if (!patient) return null;
                    return (
                      <PatientRow 
                        key={apt.id} 
                        appointment={apt} 
                        patient={patient} 
                        doctorId={currentDoctor.id}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function PatientRow({ appointment, patient, doctorId }: { appointment: any, patient: any, doctorId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateAppointment = useUpdateAppointment();
  const createTimeline = useCreateTimelineEvent();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: string) => {
    updateAppointment.mutate({ id: appointment.id, status: newStatus });
    createTimeline.mutate({
      patientId: patient.id,
      title: `Appointment ${newStatus}`,
      type: "doctor",
      description: `Status changed to ${newStatus}`
    });
    
    if (newStatus === "in-progress") {
      toast({ title: "Session Started", description: `Consultation with ${patient.name} started.` });
    }
  };

  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors">
      <TableCell className="font-medium text-slate-700">{appointment.time}</TableCell>
      <TableCell>
        <div>
          <span className="font-semibold text-slate-900 block">{patient.name}</span>
          <span className="text-xs text-slate-500">{patient.age} yrs • {patient.gender}</span>
        </div>
      </TableCell>
      <TableCell className="text-slate-600 max-w-xs truncate">{patient.condition}</TableCell>
      <TableCell>
        <StatusBadge status={appointment.status} />
      </TableCell>
      <TableCell className="text-right">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-all">
              Consult Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-2xl">
                <span>Patient Consultation</span>
                <StatusBadge status={appointment.status} className="ml-4" />
              </DialogTitle>
              <div className="flex gap-2 pt-2">
                {appointment.status === "waiting" && (
                  <Button size="sm" onClick={() => handleStatusChange("in-progress")}>Start Session</Button>
                )}
                {appointment.status === "in-progress" && (
                  <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusChange("completed")}>Complete Session</Button>
                )}
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Panel: Patient Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{patient.name}</h4>
                      <p className="text-sm text-slate-500">{patient.age} years • {patient.gender}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">BP</span>
                        <span className="font-medium">{patient.vitals?.bp || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Heart Rate</span>
                        <span className="font-medium">{patient.vitals?.hr || "N/A"} bpm</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Temp</span>
                        <span className="font-medium">{patient.vitals?.temp || "N/A"} °F</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Weight</span>
                        <span className="font-medium">{patient.vitals?.weight || "N/A"} kg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <h4 className="font-semibold mb-2 text-sm text-slate-700">Medical History</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{patient.history || "No history recorded."}</p>
                </div>
              </div>

              {/* Right Panel: Actions */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="prescribe" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="prescribe">Prescribe</TabsTrigger>
                    <TabsTrigger value="lab">Lab Test</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prescribe" className="mt-4">
                    <PrescriptionForm patientId={patient.id} doctorId={doctorId} onSuccess={() => toast({ title: "Prescription Sent", description: "Pharmacy has been notified." })} />
                  </TabsContent>
                  
                  <TabsContent value="lab" className="mt-4">
                    <LabTestForm patientId={patient.id} doctorId={doctorId} onSuccess={() => toast({ title: "Test Requested", description: "Lab request sent successfully." })} />
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <Textarea placeholder="Add clinical notes here..." className="min-h-[200px]" />
                        <div className="flex justify-end mt-4">
                          <Button>Save Notes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function PrescriptionForm({ patientId, doctorId, onSuccess }: { patientId: number, doctorId: number, onSuccess: () => void }) {
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", timing: "", dispensed: false }]);
  const createPrescription = useCreatePrescription();
  const createTimeline = useCreateTimelineEvent();

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", timing: "", dispensed: false }]);
  
  const updateMedicine = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    (newMeds[index] as any)[field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrescription.mutate({
      patientId,
      doctorId,
      medicines,
      status: "pending"
    }, {
      onSuccess: () => {
        createTimeline.mutate({
          patientId,
          type: "pharmacy",
          title: "Prescription Issued",
          description: `Prescribed ${medicines.length} medicines.`
        });
        setMedicines([{ name: "", dosage: "", timing: "", dispensed: false }]);
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {medicines.map((med, idx) => (
        <Card key={idx}>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Medicine Name</Label>
              <Input 
                value={med.name} 
                onChange={(e) => updateMedicine(idx, "name", e.target.value)} 
                placeholder="e.g. Paracetamol"
                required
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Dosage</Label>
              <Input 
                value={med.dosage} 
                onChange={(e) => updateMedicine(idx, "dosage", e.target.value)} 
                placeholder="e.g. 500mg"
                required
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Timing</Label>
              <Input 
                value={med.timing} 
                onChange={(e) => updateMedicine(idx, "timing", e.target.value)} 
                placeholder="e.g. 1-0-1 After Food"
                required
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addMedicine}>+ Add Another Medicine</Button>
        <Button type="submit" disabled={createPrescription.isPending}>
          {createPrescription.isPending ? "Sending..." : "Send to Pharmacy"}
        </Button>
      </div>
    </form>
  );
}

function LabTestForm({ patientId, doctorId, onSuccess }: { patientId: number, doctorId: number, onSuccess: () => void }) {
  const [testName, setTestName] = useState("");
  const createLabTest = useCreateLabTest();
  const createTimeline = useCreateTimelineEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLabTest.mutate({
      patientId,
      doctorId,
      testName,
      status: "requested"
    }, {
      onSuccess: () => {
        createTimeline.mutate({
          patientId,
          type: "lab",
          title: "Lab Test Requested",
          description: `Requested test: ${testName}`
        });
        setTestName("");
        onSuccess();
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Lab Test</Label>
            <Select onValueChange={setTestName} value={testName}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a test..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</SelectItem>
                <SelectItem value="Blood Sugar Fasting">Blood Sugar Fasting</SelectItem>
                <SelectItem value="Liver Function Test">Liver Function Test</SelectItem>
                <SelectItem value="Lipid Profile">Lipid Profile</SelectItem>
                <SelectItem value="Thyroid Profile">Thyroid Profile</SelectItem>
                <SelectItem value="X-Ray Chest">X-Ray Chest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!testName || createLabTest.isPending}>
              {createLabTest.isPending ? "Requesting..." : "Request Test"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
