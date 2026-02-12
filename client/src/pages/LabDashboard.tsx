import { useLabTests, useUpdateLabTest, usePatients, useDoctors, useCreateTimelineEvent } from "@/hooks/use-medical";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, TestTube, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format } from "date-fns";

export default function LabDashboard() {
  const { data: tests, isLoading } = useLabTests();
  const { data: patients } = usePatients();
  const { data: doctors } = useDoctors();

  if (isLoading || !patients || !doctors) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Sort by status priority: requested > collected > testing > completed
  const sortedTests = [...(tests || [])].sort((a, b) => {
    const priority = { requested: 0, collected: 1, testing: 2, completed: 3 };
    return (priority[a.status as keyof typeof priority] || 0) - (priority[b.status as keyof typeof priority] || 0);
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <TestTube className="w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-900">MediFlow <span className="text-slate-400 font-normal">| Pathology Lab</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Requests" value={tests?.length || 0} color="bg-purple-600" />
          <StatCard title="Pending Collection" value={tests?.filter(t => t.status === 'requested').length || 0} color="bg-amber-500" />
          <StatCard title="In Testing" value={tests?.filter(t => t.status === 'testing').length || 0} color="bg-blue-500" />
          <StatCard title="Completed Today" value={tests?.filter(t => t.status === 'completed').length || 0} color="bg-emerald-500" />
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Lab Requests Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Ref. Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTests.map(test => (
                  <LabTestRow 
                    key={test.id} 
                    test={test}
                    patient={patients.find(p => p.id === test.patientId)}
                    doctor={doctors.find(d => d.id === test.doctorId)}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <Card className={cn("border-none shadow-md text-white", color)}>
      <CardContent className="p-6">
        <p className="text-white/80 font-medium text-sm">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </CardContent>
    </Card>
  );
}

function LabTestRow({ test, patient, doctor }: { test: any, patient: any, doctor: any }) {
  const updateTest = useUpdateLabTest();
  const createTimeline = useCreateTimelineEvent();
  const { toast } = useToast();
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleStatusUpdate = (newStatus: string) => {
    updateTest.mutate({
      id: test.id,
      status: newStatus
    }, {
      onSuccess: () => {
        const messages: Record<string, string> = {
          collected: "Sample Collected",
          testing: "Processing Started",
          completed: "Report Generated"
        };
        
        toast({ title: "Status Updated", description: messages[newStatus] });
        
        createTimeline.mutate({
          patientId: test.patientId,
          type: "lab",
          title: messages[newStatus],
          description: `Status for ${test.testName} updated to ${newStatus}`
        });
      }
    });
  };

  const handleResultSubmit = () => {
    updateTest.mutate({
      id: test.id,
      status: "completed",
      result: resultText
    }, {
      onSuccess: () => {
        setResultDialogOpen(false);
        createTimeline.mutate({
          patientId: test.patientId,
          type: "lab",
          title: "Lab Report Ready",
          description: `Result for ${test.testName} is now available.`
        });
        toast({ title: "Report Uploaded", description: "Result has been saved successfully." });
      }
    });
  };

  return (
    <TableRow>
      <TableCell className="text-slate-500 text-sm">
        {test.createdAt ? format(new Date(test.createdAt), "MMM d") : "-"}
      </TableCell>
      <TableCell className="font-medium">{patient?.name}</TableCell>
      <TableCell>{test.testName}</TableCell>
      <TableCell className="text-slate-500">Dr. {doctor?.name.split(' ').pop()}</TableCell>
      <TableCell><StatusBadge status={test.status || "requested"} /></TableCell>
      <TableCell className="text-right">
        {test.status === "requested" && (
          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("collected")}>Collect Sample</Button>
        )}
        {test.status === "collected" && (
          <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleStatusUpdate("testing")}>Start Testing</Button>
        )}
        {test.status === "testing" && (
          <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Upload Result</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Test Results</DialogTitle>
                <DialogDescription>Input findings for {test.testName} - {patient?.name}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label>Result/Findings</Label>
                <Input 
                  className="mt-2" 
                  placeholder="e.g. Normal range, Positive/Negative, or value"
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleResultSubmit} disabled={!resultText}>Save & Complete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {test.status === "completed" && (
          <Button size="sm" variant="ghost" disabled>Report Sent</Button>
        )}
      </TableCell>
    </TableRow>
  );
}
