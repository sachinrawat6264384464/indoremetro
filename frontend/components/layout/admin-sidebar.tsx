"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, MapPin, Route as RouteIcon, Calculator, 
  Ticket, CreditCard, Users, AlertTriangle, ShieldCheck, QrCode, FileText 
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/stations", label: "Stations", icon: MapPin },
    { href: "/admin/routes", label: "Routes & Sequence", icon: RouteIcon },
    { href: "/admin/fares", label: "Fare Matrix", icon: Calculator },
    { href: "/admin/tickets", label: "Ticket Audit", icon: Ticket },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/users", label: "Users & RBAC", icon: Users },
    { href: "/admin/alerts", label: "Service Alerts", icon: AlertTriangle },
    { href: "/admin/audit-logs", label: "Audit Trail", icon: FileText },
    { href: "/admin/scan-qr", label: "Gate Scanner Tool", icon: QrCode },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-5 space-y-6 min-h-screen shrink-0 shadow-sm">
      <div className="px-3 py-3 border-b border-slate-100 bg-slate-50/80 rounded-2xl">
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Operational Admin</span>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Indore Metro HQ</h2>
      </div>

      <nav className="space-y-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-md font-black translate-x-1"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-500"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
