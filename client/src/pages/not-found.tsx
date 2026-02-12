import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="text-slate-600 text-lg">Page not found</p>
        <div className="pt-4">
          <Link href="/" className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-blue-700 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
