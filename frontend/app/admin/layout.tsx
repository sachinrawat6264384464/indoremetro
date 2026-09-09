"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { isAdminUser } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdminUser()) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center py-24 text-slate-500 font-semibold text-sm">
          Verifying administrative credentials...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">{children}</main>
    </div>
  );
}
