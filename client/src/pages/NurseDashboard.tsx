import { usePatients, useUpdatePatient, useCreateTimelineEvent } from "@/hooks/use-medical";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, Heart, Activity, Thermometer, Weight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function NurseDashboard() {
  const { data: patients, isLoading } = usePatients();

  if (isLoading || !patients) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Filter only admitted patients or those waiting
  const activePatients = patients.filter(p => p.status !== "discharged");

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-900">MediFlow <span className="text-slate-400 font-normal">| Nursing Station</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Patients ({activePatients.length})</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePatients.map(patient => (
            <PatientVitalCard key={patient.id} patient={patient} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PatientVitalCard({ patient }: { patient: any }) {
  const updatePatient = useUpdatePatient();
  const createTimeline = useCreateTimelineEvent();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [vitals, setVitals] = useState({
    bp: patient.vitals?.bp || "",
    hr: patient.vitals?.hr || "",
    temp: patient.vitals?.temp || "",
    weight: patient.vitals?.weight || ""
  });

  const handleSave = () => {
    updatePatient.mutate({
      id: patient.id,
      vitals: vitals
    }, {
      onSuccess: () => {
        createTimeline.mutate({
          patientId: patient.id,
          type: "doctor", // Use 'doctor' type for generic medical updates for now as 'nurse' isn't in schema enums
          title: "Vitals Updated",
          description: `BP: ${vitals.bp}, HR: ${vitals.hr}, Temp: ${vitals.temp}`
        });
        toast({ title: "Updated", description: "Patient vitals recorded successfully." });
        setOpen(false);
      }
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-rose-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{patient.name}</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Age: {patient.age} • {patient.gender}</p>
          </div>
          <StatusBadge status={patient.status || "waiting"} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">BP</p>
              <p className="font-semibold">{patient.vitals?.bp || "--/--"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <div>
              <p className="text-xs text-slate-500">Heart Rate</p>
              <p className="font-semibold">{patient.vitals?.hr || "--"} <span className="text-xs font-normal text-slate-400">bpm</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs text-slate-500">Temp</p>
              <p className="font-semibold">{patient.vitals?.temp || "--"} <span className="text-xs font-normal text-slate-400">°F</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-slate-500">Weight</p>
              <p className="font-semibold">{patient.vitals?.weight || "--"} <span className="text-xs font-normal text-slate-400">kg</span></p>
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-slate-900 hover:bg-slate-800">Update Vitals</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Vitals - {patient.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Blood Pressure</Label>
                <Input value={vitals.bp} onChange={(e) => setVitals({...vitals, bp: e.target.value})} placeholder="120/80" />
              </div>
              <div className="space-y-2">
                <Label>Heart Rate (bpm)</Label>
                <Input value={vitals.hr} onChange={(e) => setVitals({...vitals, hr: e.target.value})} placeholder="72" />
              </div>
              <div className="space-y-2">
                <Label>Temperature (°F)</Label>
                <Input value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} placeholder="98.6" />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input value={vitals.weight} onChange={(e) => setVitals({...vitals, weight: e.target.value})} placeholder="70" />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">Save Records</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
