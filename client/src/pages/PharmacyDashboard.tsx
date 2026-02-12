import { usePrescriptions, useUpdatePrescription, usePatients, useDoctors, useCreateTimelineEvent } from "@/hooks/use-medical";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, Pill, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function PharmacyDashboard() {
  const { data: prescriptions, isLoading } = usePrescriptions();
  const { data: patients } = usePatients();
  const { data: doctors } = useDoctors();

  if (isLoading || !patients || !doctors) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Filter out completed ones to separate lists or sort by status
  const pendingScripts = prescriptions?.filter(p => p.status === "pending") || [];
  const completedScripts = prescriptions?.filter(p => p.status === "dispensed") || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <Pill className="w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-900">MediFlow <span className="text-slate-400 font-normal">| Pharmacy</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-amber-500 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <p className="text-amber-100 font-medium">Pending Requests</p>
              <h3 className="text-4xl font-bold mt-2">{pendingScripts.length}</h3>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-slate-500 font-medium">Dispensed Today</p>
              <h3 className="text-4xl font-bold mt-2 text-slate-900">{completedScripts.length}</h3>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Incoming Prescriptions</h2>
          <div className="space-y-4">
            {pendingScripts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">All caught up! No pending prescriptions.</p>
              </div>
            ) : (
              pendingScripts.map(script => (
                <PrescriptionCard 
                  key={script.id} 
                  prescription={script}
                  patient={patients.find(p => p.id === script.patientId)}
                  doctor={doctors.find(d => d.id === script.doctorId)}
                />
              ))
            )}
          </div>
        </div>

        {completedScripts.length > 0 && (
          <div className="pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Dispensed History</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedScripts.map(script => (
                    <TableRow key={script.id}>
                      <TableCell className="font-medium">
                        {patients.find(p => p.id === script.patientId)?.name}
                      </TableCell>
                      <TableCell>
                        Dr. {doctors.find(d => d.id === script.doctorId)?.name}
                      </TableCell>
                      <TableCell>{script.medicines.length} medicines</TableCell>
                      <TableCell><StatusBadge status={script.status || "dispensed"} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PrescriptionCard({ prescription, patient, doctor }: { prescription: any, patient: any, doctor: any }) {
  const updatePrescription = useUpdatePrescription();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState(prescription.medicines || []);

  const toggleStatus = (idx: number, field: 'dispensed' | 'unavailable') => {
    const newMeds = [...medicines];
    const med = newMeds[idx];
    
    if (field === 'dispensed') {
      med.dispensed = !med.dispensed;
      if (med.dispensed) med.unavailable = false;
    } else {
      med.unavailable = !med.unavailable;
      if (med.unavailable) med.dispensed = false;
    }
    
    setMedicines(newMeds);
  };

  const handleUpdate = () => {
    const allProcessed = medicines.every((m: any) => m.dispensed || m.unavailable);
    const newStatus = allProcessed ? "dispensed" : "pending";

    updatePrescription.mutate({
      id: prescription.id,
      status: newStatus,
      medicines: medicines
    }, {
      onSuccess: () => {
        toast({ 
          title: "Inventory Updated", 
          description: allProcessed ? "Prescription fully processed." : "Medicine statuses updated." 
        });
      }
    });
  };

  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-slate-50/50 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {patient?.name}
              <Badge variant="outline" className="font-normal text-xs">{patient?.age} yrs</Badge>
            </CardTitle>
            <CardDescription>Prescribed by Dr. {doctor?.name}</CardDescription>
          </div>
          <Button onClick={handleUpdate} disabled={updatePrescription.isPending} size="sm" className="bg-amber-600 hover:bg-amber-700">
            {updatePrescription.isPending ? "Processing..." : "Submit Updates"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {medicines.map((med: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full border border-slate-200">
                  <Pill className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className={cn("font-semibold", med.unavailable ? "text-slate-400 line-through" : "text-slate-900")}>
                    {med.name}
                  </p>
                  <p className="text-xs text-slate-500">{med.dosage} • {med.timing}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`dispensed-${prescription.id}-${idx}`}
                    checked={med.dispensed}
                    onCheckedChange={() => toggleStatus(idx, 'dispensed')}
                  />
                  <Label htmlFor={`dispensed-${prescription.id}-${idx}`} className="text-xs cursor-pointer">Dispensed</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`unavailable-${prescription.id}-${idx}`}
                    checked={med.unavailable}
                    onCheckedChange={() => toggleStatus(idx, 'unavailable')}
                    className="data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                  />
                  <Label htmlFor={`unavailable-${prescription.id}-${idx}`} className="text-xs cursor-pointer text-destructive">Unavailable</Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
