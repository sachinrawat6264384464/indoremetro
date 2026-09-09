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
    <aside className="w-64 glass-panel border-r border-white/10 p-4 space-y-6 min-h-screen shrink-0">
      <div className="px-3 py-2 border-b border-white/10">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Operational Admin</span>
        <h2 className="text-lg font-bold text-white">Indore Metro HQ</h2>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 text-amber-400" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
