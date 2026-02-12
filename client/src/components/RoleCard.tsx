import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

export function RoleCard({ title, description, href, icon: Icon, color }: RoleCardProps) {
  return (
    <Link href={href} className={cn(
      "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
      "bg-white border border-border shadow-sm cursor-pointer block h-full"
    )}>
      <div className={cn(
        "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500",
        color
      )} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={cn("p-3 w-fit rounded-xl mb-4 text-white shadow-lg", color)}>
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
        
        <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
          Access Portal 
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
