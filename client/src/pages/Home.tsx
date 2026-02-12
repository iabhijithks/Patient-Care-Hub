import { RoleCard } from "@/components/RoleCard";
import { Stethoscope, User, Pill, TestTube, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 mb-6 bg-white rounded-full shadow-sm border border-slate-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide px-2">System Online</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            MediFlow <span className="text-primary">Connect</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Unified healthcare coordination platform seamlessly connecting patients, doctors, labs, and pharmacies in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          <RoleCard
            title="Doctor"
            description="Manage appointments, diagnose patients, prescribe medication, and review lab reports."
            href="/dashboard/doctor"
            icon={Stethoscope}
            color="bg-blue-600"
          />
          <RoleCard
            title="Patient"
            description="View your medical history, current prescriptions, lab results, and care timeline."
            href="/dashboard/patient"
            icon={User}
            color="bg-emerald-500"
          />
          <RoleCard
            title="Nurse"
            description="Monitor patient vitals, update records, and coordinate daily care activities."
            href="/dashboard/nurse"
            icon={Activity}
            color="bg-rose-500"
          />
          <RoleCard
            title="Pharmacy"
            description="View incoming prescriptions, manage inventory, and track dispensed medicines."
            href="/dashboard/pharmacy"
            icon={Pill}
            color="bg-amber-500"
          />
          <RoleCard
            title="Pathology Lab"
            description="Process test requests, update status, and upload diagnostic reports."
            href="/dashboard/lab"
            icon={TestTube}
            color="bg-purple-600"
          />
        </div>

        <div className="mt-20 text-center text-slate-400 text-sm">
          <p>&copy; 2024 MediFlow Hospital Management System. Secure & Compliant.</p>
        </div>
      </div>
    </div>
  );
}
