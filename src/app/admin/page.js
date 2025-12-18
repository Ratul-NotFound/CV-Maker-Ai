'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Shield, Search, Plus, Infinity as InfinityIcon, Loader2, Crown } from "lucide-react";

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(null);

  // YOUR ADMIN EMAIL
  const ADMIN_EMAIL = 'm.h.ratul18@gmail.com';

  useEffect(() => {
    if (!loading) {
      // SECURITY CHECK: Allow if Role is Admin OR Email Matches
      const isAuthorized = (userData?.role === "admin") || (user?.email === ADMIN_EMAIL);

      if (!user || !isAuthorized) {
        router.push("/admin/login"); 
      } else {
        fetchUsers();
      }
    }
  }, [user, userData, loading, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (e) { console.error("Fetch failed", e); }
  };

  const handleAddTokens = async (userId, amount) => {
    setProcessing(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'add_tokens', amount })
      });
      fetchUsers();
    } catch (e) { alert("Error adding tokens"); }
    setProcessing(null);
  };

  const handleGrantPro = async (userId) => {
    setProcessing(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { isPro: true, tokens: 999999 } })
      });
      fetchUsers();
    } catch (e) { alert("Error granting Pro"); }
    setProcessing(null);
  };

  // Show loading while checking permissions
  const isAuthorized = (userData?.role === "admin") || (user?.email === ADMIN_EMAIL);
  if (loading || !user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Shield className="w-12 h-12 text-purple-600 animate-pulse mb-4" />
        <p className="font-mono text-sm text-slate-500">ESTABLISHING SECURE CONNECTION...</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 pt-24">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Shield className="text-purple-500" size={36} /> Admin Command
            </h1>
            <p className="text-slate-400">Manage Users & Credits</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search User Email..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 text-white focus:border-purple-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 uppercase text-xs tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="p-6">User</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Balance</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-white">{u.displayName || "Unknown"}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                      <div className="text-[10px] text-slate-600 font-mono mt-1 opacity-50">{u.id}</div>
                    </td>
                    <td className="p-6">
                      {u.isPro ? 
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-xs border border-yellow-500/50 flex w-fit items-center gap-1">
                          <Crown size={12}/> PRO
                        </span> 
                        : 
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-bold text-xs">FREE</span>
                      }
                    </td>
                    <td className="p-6 font-mono text-lg text-blue-400 font-bold">
                      {u.isPro ? '∞' : (u.tokens || 0)}
                    </td>
                    <td className="p-6 flex justify-end gap-3">
                      <button 
                        onClick={() => handleAddTokens(u.id, 5)}
                        disabled={processing === u.id}
                        className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded-lg text-sm font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <Plus size={14}/> 5 Tokens
                      </button>
                      
                      <button 
                        onClick={() => handleGrantPro(u.id)}
                        disabled={processing === u.id || u.isPro}
                        className="px-3 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 rounded-lg text-sm font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <InfinityIcon size={14}/> {u.isPro ? 'Active' : 'Grant Pro'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && <div className="p-10 text-center text-slate-500">No users found.</div>}
        </div>

      </div>
    </div>
  );
}