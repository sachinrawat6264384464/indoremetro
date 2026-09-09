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
        <h1 className="text-3xl font-extrabold text-white">User & RBAC Role Management</h1>
        <p className="text-slate-400 text-sm mt-1">Manage system users, staff operators, and access control permissions</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Phone</th>
              <th className="py-4 px-6">Current Roles</th>
              <th className="py-4 px-6">Assign Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition">
                <td className="py-4 px-6 font-bold text-white">{u.name}</td>
                <td className="py-4 px-6 text-slate-300">{u.email}</td>
                <td className="py-4 px-6 text-slate-400">{u.phone || "N/A"}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {u.roles?.join(", ") || "PASSENGER"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <select
                    defaultValue={u.roles?.[0] || "PASSENGER"}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium"
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
