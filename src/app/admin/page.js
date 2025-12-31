'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { 
  Shield, 
  Search, 
  Plus, 
  Infinity as InfinityIcon, 
  Loader2, 
  Crown, 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Check, 
  Ban,
  Filter,
  RefreshCw,
  Edit2,
  Save,
  X,
  Minus
} from "lucide-react";
import Footer from '@/components/Footer';
import { motion } from "framer-motion";

export default function AdminPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [upgradeSearch, setUpgradeSearch] = useState("");
  const [upgradeFilter, setUpgradeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [processing, setProcessing] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ tokens: 0, isPro: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || userData?.role !== "admin") {
        router.push("/admin/login");
      } else {
        fetchData();
      }
    }
  }, [user, userData, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, upgradeRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/upgrade-requests')
      ]);
      
      const usersData = await usersRes.json();
      const upgradeData = await upgradeRes.json();
      
      if (usersData.success) setUsers(usersData.users);
      if (upgradeData.success) setUpgradeRequests(upgradeData.requests);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const handleAddTokens = async (userId, amount) => {
    setProcessing(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'add_tokens', amount })
      });
      fetchData();
    } catch (error) {
      alert("Error adding tokens");
    }
    setProcessing(null);
  };

  const handleGrantPro = async (userId) => {
    setProcessing(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          updates: { isPro: true, tokens: 999999, proSince: new Date().toISOString() } 
        })
      });
      fetchData();
    } catch (error) {
      alert("Error granting Pro");
    }
    setProcessing(null);
  };

  // Upgrade request functions
  const handleApproveRequest = async (requestId, userId) => {
    if (!confirm('Are you sure you want to approve this upgrade request?')) return;
    
    setProcessing(requestId);
    try {
      const response = await fetch('/api/admin/upgrade-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          userId,
          action: 'approve' 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Request approved! User upgraded to Pro.');
        fetchData();
      } else {
        alert(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('❌ Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;
    
    setProcessing(requestId);
    try {
      const response = await fetch('/api/admin/upgrade-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          action: 'reject',
          reason 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Request rejected.');
        fetchData();
      } else {
        alert(data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('❌ Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  // Edit user functions
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      tokens: user.tokens || 0,
      isPro: user.isPro || false,
    });
  };

  const handleSaveUser = async (userId) => {
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          updates: { 
            tokens: editForm.tokens, 
            isPro: editForm.isPro 
          } 
        })
      });
      fetchData();
      setEditingUser(null);
    } catch (error) {
      alert("Error updating user");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ tokens: 0, isPro: false });
  };

  const handleAddTokensEdit = (amount) => {
    setEditForm(prev => ({
      ...prev,
      tokens: Math.max(0, prev.tokens + amount)
    }));
  };

  // Stats calculations
  const userStats = {
    totalUsers: users.length,
    proUsers: users.filter(u => u.isPro).length,
    freeUsers: users.filter(u => !u.isPro).length,
    totalTokens: users.reduce((acc, u) => acc + (u.tokens || 0), 0),
  };

  const upgradeStats = {
    total: upgradeRequests.length,
    pending: upgradeRequests.filter(r => r.status === 'pending').length,
    approved: upgradeRequests.filter(r => r.status === 'approved').length,
    rejected: upgradeRequests.filter(r => r.status === 'rejected').length,
    totalRevenue: upgradeRequests.filter(r => r.status === 'approved').length * 50,
  };

  // Filter functions
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-bold">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-bold">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-bold">{status}</span>;
    }
  };

  const getPaymentMethodBadge = (method) => {
    const colors = {
      bikash: 'bg-purple-500/20 text-purple-300',
      nagad: 'bg-green-500/20 text-green-300',
      rocket: 'bg-blue-500/20 text-blue-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[method] || 'bg-gray-500/20 text-gray-300'}`}>
        {method?.toUpperCase()}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      searchTerm === '';
    
    const matchesFilter = 
      userFilter === 'all' ||
      (userFilter === 'pro' && user.isPro) ||
      (userFilter === 'free' && !user.isPro);

    return matchesSearch && matchesFilter;
  });

  const filteredUpgradeRequests = upgradeRequests.filter(request => {
    const matchesSearch = 
      (request.userEmail?.toLowerCase().includes(upgradeSearch.toLowerCase()) ||
      request.transactionId?.toLowerCase().includes(upgradeSearch.toLowerCase()) ||
      request.userName?.toLowerCase().includes(upgradeSearch.toLowerCase())) ||
      upgradeSearch === '';
    
    const matchesFilter = 
      upgradeFilter === 'all' || request.status === upgradeFilter;

    return matchesSearch && matchesFilter;
  });

  // Show loading while checking permissions
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Shield className="w-12 h-12 text-purple-600 animate-pulse mb-4" />
        <p className="font-mono text-sm text-slate-500">LOADING ADMIN DASHBOARD...</p>
      </div>
    );
  }

  if (!user || userData?.role !== 'admin') {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 pt-24">
        
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Shield className="text-purple-500" size={36} /> Admin Dashboard
          </h1>
          <p className="text-slate-400">Manage users and upgrade requests</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 text-center font-bold transition-all relative ${
              activeTab === 'users'
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Users ({users.length})
            </div>
            {activeTab === 'users' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('upgrade-requests')}
            className={`flex-1 py-4 text-center font-bold transition-all relative ${
              activeTab === 'upgrade-requests'
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Upgrade Requests ({upgradeRequests.length})
            </div>
            {activeTab === 'upgrade-requests' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
            )}
          </button>
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.totalUsers}</div>
                <div className="text-slate-400 text-sm">Total Users</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.proUsers}</div>
                <div className="text-slate-400 text-sm">Pro Users</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-green-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.freeUsers}</div>
                <div className="text-slate-400 text-sm">Free Users</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <InfinityIcon className="w-8 h-8 text-orange-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{userStats.totalTokens}</div>
                <div className="text-slate-400 text-sm">Total Tokens</div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      userFilter === 'all'
                        ? 'bg-white text-purple-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setUserFilter('pro')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      userFilter === 'pro'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Pro
                  </button>
                  <button
                    onClick={() => setUserFilter('free')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      userFilter === 'free'
                        ? 'bg-slate-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={fetchData}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <RefreshCw className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-bold">User</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Email</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Status</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Tokens</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Joined</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`border-t border-white/10 ${
                          index % 2 === 0 ? 'bg-white/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">
                            {user.displayName || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{user.id.substring(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4 text-white/80 text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === user.id ? (
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editForm.isPro}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, isPro: e.target.checked })
                                }
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-white text-sm">Pro</span>
                            </label>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                user.isPro
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {user.isPro ? 'PRO' : 'FREE'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === user.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleAddTokensEdit(-1)}
                                className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                value={editForm.tokens}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    tokens: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center"
                                min="0"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTokensEdit(1)}
                                className="p-1 bg-green-500 hover:bg-green-600 text-white rounded"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-white font-medium">
                              {user.isPro ? '∞' : user.tokens || 0}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === user.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveUser(user.id)}
                                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddTokens(user.id, 5)}
                                disabled={processing === user.id}
                                className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded-lg text-sm font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                <Plus size={14}/> 5 Tokens
                              </button>
                              <button
                                onClick={() => handleGrantPro(user.id)}
                                disabled={processing === user.id || user.isPro}
                                className="px-3 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 rounded-lg text-sm font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                <InfinityIcon size={14}/> {user.isPro ? 'Active' : 'Grant Pro'}
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No users found matching your criteria
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* UPGRADE REQUESTS TAB */}
        {activeTab === 'upgrade-requests' && (
          <>
            {/* Upgrade Request Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{upgradeStats.total}</div>
                <div className="text-slate-400 text-sm">Total Requests</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{upgradeStats.pending}</div>
                <div className="text-slate-400 text-sm">Pending</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{upgradeStats.approved}</div>
                <div className="text-slate-400 text-sm">Approved</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{upgradeStats.totalRevenue} BDT</div>
                <div className="text-slate-400 text-sm">Total Revenue</div>
              </div>
            </div>

            {/* Filters and Search for Upgrade Requests */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by email, name, or transaction ID..."
                      value={upgradeSearch}
                      onChange={(e) => setUpgradeSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setUpgradeFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      upgradeFilter === 'all'
                        ? 'bg-white text-purple-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setUpgradeFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      upgradeFilter === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setUpgradeFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      upgradeFilter === 'approved'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setUpgradeFilter('rejected')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      upgradeFilter === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Rejected
                  </button>
                  <button
                    onClick={fetchData}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <RefreshCw className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Upgrade Requests Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-bold">User</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Transaction ID</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Method</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Amount</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Date</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Status</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUpgradeRequests.map((request, index) => (
                      <tr
                        key={request.id}
                        className={`border-t border-white/10 ${
                          index % 2 === 0 ? 'bg-white/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{request.userName || 'User'}</div>
                              <div className="text-sm text-slate-400 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {request.userEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="bg-black/50 px-2 py-1 rounded text-sm font-mono text-white">
                            {request.transactionId}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {getPaymentMethodBadge(request.paymentMethod)}
                            <div className="text-xs text-slate-400">{request.paymentNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-white font-bold">{request.amount || 50} BDT</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4">
                          {request.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id, request.userId)}
                                disabled={processing === request.id}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {processing === request.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                disabled={processing === request.id}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Ban className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          ) : request.status === 'approved' ? (
                            <div className="text-green-400 text-sm font-bold">✓ Approved</div>
                          ) : (
                            <div className="text-red-400 text-sm font-bold">✗ Rejected</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUpgradeRequests.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No upgrade requests found matching your criteria
                  </div>
                )}
              </div>
            </div>

            {/* Admin Instructions */}
            <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
              <h3 className="text-white font-bold mb-2">Admin Instructions:</h3>
              <ul className="text-blue-200 text-sm space-y-1 list-disc pl-5">
                <li>Verify transaction ID in payment app before approving</li>
                <li>Check that amount matches (50 BDT)</li>
                <li>Reject if transaction ID is invalid or already used</li>
                <li>User will automatically be upgraded to Pro upon approval</li>
                <li>Email notifications will be sent to users</li>
              </ul>
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}