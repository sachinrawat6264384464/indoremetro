"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  async function loadUsers() {
    const res = await apiFetch<any[]>("/admin/users");
    if (res.success && res.data) setUsers(res.data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await apiFetch(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role_name: newRole }),
    });

    if (res.success) {
      toast.success(`User role updated to ${newRole}`);
      loadUsers();
    } else {
      toast.error(res.error?.message || "Role update failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User & RBAC Role Management</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage system users, staff operators, and access control permissions</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Phone</th>
              <th className="py-4 px-6">Current Roles</th>
              <th className="py-4 px-6">Assign Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition">
                <td className="py-4 px-6 font-extrabold text-slate-900">{u.name}</td>
                <td className="py-4 px-6 text-slate-600 font-medium">{u.email}</td>
                <td className="py-4 px-6 text-slate-500 font-medium">{u.phone || "N/A"}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    {u.roles?.join(", ") || "PASSENGER"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <select
                    defaultValue={u.roles?.[0] || "PASSENGER"}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    <option value="PASSENGER">PASSENGER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
