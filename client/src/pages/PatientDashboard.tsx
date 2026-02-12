import { usePatients, useTimeline, usePrescriptions, useLabTests, useDoctors } from "@/hooks/use-medical";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, User, Activity, FileText, CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function PatientDashboard() {
  const { data: patients } = usePatients();
  const { data: doctors } = useDoctors();
  
  // Hardcoded patient ID 1 for demo
  const PATIENT_ID = 1; 
  const currentPatient = patients?.find(p => p.id === PATIENT_ID);

  const { data: timeline } = useTimeline(PATIENT_ID);
  const { data: prescriptions } = usePrescriptions(PATIENT_ID);
  const { data: labTests } = useLabTests();
  
  const myLabTests = labTests?.filter(t => t.patientId === PATIENT_ID) || [];

  if (!currentPatient || !doctors) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-emerald-600 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6" />
            <h1 className="font-display font-bold text-xl">MediFlow <span className="font-normal opacity-80">| Patient Portal</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{currentPatient.name}</p>
              <p className="text-xs opacity-80">Patient ID: #{String(currentPatient.id).padStart(4, '0')}</p>
            </div>
            <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center font-bold">
              {currentPatient.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-2">Hello, {currentPatient.name.split(' ')[0]}</h2>
              <p className="text-emerald-50 opacity-90 max-w-xl text-lg mb-6">
                Your health overview is ready. You have {myLabTests.filter(t => t.status === 'completed').length} new test results and {prescriptions?.length || 0} active prescriptions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <div>
                    <span className="text-xs opacity-70 block">Blood Pressure</span>
                    <span className="font-semibold">{currentPatient.vitals?.bp || "--/--"}</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <div>
                    <span className="text-xs opacity-70 block">Heart Rate</span>
                    <span className="font-semibold">{currentPatient.vitals?.hr || "--"} bpm</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <div>
                    <span className="text-xs opacity-70 block">Weight</span>
                    <span className="font-semibold">{currentPatient.vitals?.weight || "--"} kg</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-slate-500">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={currentPatient.status || "waiting"} className="text-lg px-4 py-1" />
              <p className="mt-4 text-sm text-slate-500">Admitted since</p>
              <p className="font-medium text-slate-900">
                {currentPatient.admissionDate ? format(new Date(currentPatient.admissionDate), "MMM d, yyyy") : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Lab Tests & Prescriptions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lab Test Tracker */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Lab Requests
              </h3>
              <div className="space-y-4">
                {myLabTests.length === 0 ? (
                  <Card><CardContent className="p-8 text-center text-slate-500">No lab tests requested.</CardContent></Card>
                ) : (
                  myLabTests.map(test => (
                    <Card key={test.id} className="overflow-hidden border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="font-bold text-slate-900">{test.testName}</h4>
                            <p className="text-sm text-slate-500 mt-1">
                              Requested on {test.createdAt ? format(new Date(test.createdAt), "MMM d, h:mm a") : ""}
                            </p>
                          </div>
                          {test.status === "completed" && (
                            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                              View Report
                            </Button>
                          )}
                        </div>
                        <LabTracker status={test.status || "requested"} />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>

            {/* Prescriptions */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Prescriptions
              </h3>
              <div className="grid gap-4">
                {prescriptions?.map(script => {
                  const doc = doctors.find(d => d.id === script.doctorId);
                  return (
                    <Card key={script.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {/* Doctor Avatar Placeholder */}
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              DR
                            </div>
                            <div>
                              <CardTitle className="text-base">Dr. {doc?.name || "Unknown"}</CardTitle>
                              <CardDescription className="text-xs">{doc?.specialization}</CardDescription>
                            </div>
                          </div>
                          <StatusBadge status={script.status || "pending"} />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {script.medicines.map((med: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-slate-50">
                              <div className="font-medium text-slate-700">{med.name}</div>
                              <div className="text-slate-500">{med.dosage} • {med.timing}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar: Timeline */}
          <div className="lg:col-span-1">
            <Card className="h-full border-none shadow-lg bg-white/80 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle>Care Timeline</CardTitle>
                <CardDescription>Recent activity on your case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
                  {timeline?.map((event, idx) => (
                    <div key={event.id} className="relative pl-6">
                      <div className={cn(
                        "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                        event.type === 'doctor' ? "bg-blue-500" :
                        event.type === 'lab' ? "bg-purple-500" :
                        event.type === 'pharmacy' ? "bg-amber-500" : "bg-slate-400"
                      )} />
                      <p className="text-xs text-slate-400 mb-1 font-mono">
                        {event.timestamp ? format(new Date(event.timestamp), "MMM d, h:mm a") : ""}
                      </p>
                      <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{event.description}</p>
                    </div>
                  ))}
                  {(!timeline || timeline.length === 0) && (
                    <p className="text-sm text-slate-400 pl-6 italic">No activity recorded yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function LabTracker({ status }: { status: string }) {
  const steps = [
    { id: "requested", label: "Requested" },
    { id: "collected", label: "Sample Collected" },
    { id: "testing", label: "Testing" },
    { id: "completed", label: "Report Ready" },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === status);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
      <div 
        className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />
      
      <div className="relative flex justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full border-2 bg-white transition-all duration-300 z-10",
                isCompleted ? "border-emerald-500 bg-emerald-500" : "border-slate-300",
                isCurrent && "ring-4 ring-emerald-100 scale-110"
              )}>
                {isCompleted && <CheckCircle2 className="w-full h-full text-white opacity-0" />} {/* Hidden icon for spacing/future use */}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300 absolute top-6 w-24 text-center",
                isCompleted ? "text-emerald-700" : "text-slate-400",
                // Align labels: first left, last right, others center
                idx === 0 ? "left-0 text-left" : idx === steps.length - 1 ? "right-0 text-right" : "left-1/2 -translate-x-1/2 text-center"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" /> {/* Spacer for labels */}
    </div>
  );
}
