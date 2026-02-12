import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DoctorDashboard from "@/pages/DoctorDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import PharmacyDashboard from "@/pages/PharmacyDashboard";
import LabDashboard from "@/pages/LabDashboard";
import NurseDashboard from "@/pages/NurseDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard/doctor" component={DoctorDashboard} />
      <Route path="/dashboard/patient" component={PatientDashboard} />
      <Route path="/dashboard/pharmacy" component={PharmacyDashboard} />
      <Route path="/dashboard/lab" component={LabDashboard} />
      <Route path="/dashboard/nurse" component={NurseDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
