'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Crown, 
  Coins, 
  Edit2, 
  Save, 
  X, 
  Plus,
  Minus,
  RefreshCw,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Search,
  Filter,
  Mail,
  User,
  Calendar,
  Check,
  Ban
} from 'lucide-react';

export default function AdminPanel({ 
  users, 
  upgradeRequests = [], 
  onUserUpdate, 
  onUpgradeRequestUpdate, 
  onRefresh 
}) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'upgrade-requests'
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ tokens: 0, isPro: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [upgradeSearch, setUpgradeSearch] = useState('');
  const [upgradeFilter, setUpgradeFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  // User stats
  const stats = {
    totalUsers: users.length,
    proUsers: users.filter(u => u.isPro).length,
    freeUsers: users.filter(u => !u.isPro).length,
    totalTokens: users.reduce((acc, u) => acc + (u.tokens || 0), 0),
  };

  // Upgrade request stats
  const upgradeStats = {
    total: upgradeRequests.length,
    pending: upgradeRequests.filter(r => r.status === 'pending').length,
    approved: upgradeRequests.filter(r => r.status === 'approved').length,
    rejected: upgradeRequests.filter(r => r.status === 'rejected').length,
    totalRevenue: upgradeRequests.filter(r => r.status === 'approved').length * 50,
  };

  // User management functions
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      tokens: user.tokens || 0,
      isPro: user.isPro || false,
    });
  };

  const handleSaveUser = async (userId) => {
    await onUserUpdate(userId, editForm);
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ tokens: 0, isPro: false });
  };

  const handleAddTokens = (amount) => {
    setEditForm(prev => ({
      ...prev,
      tokens: Math.max(0, prev.tokens + amount)
    }));
  };

  // Upgrade request functions
  const handleApproveRequest = async (requestId, userId) => {
    if (!confirm('Are you sure you want to approve this upgrade request?')) return;
    
    setProcessing(requestId);
    try {
      await onUpgradeRequestUpdate(requestId, 'approve', userId);
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;
    
    setProcessing(requestId);
    try {
      await onUpgradeRequestUpdate(requestId, 'reject', null, reason);
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setProcessing(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      searchTerm === '';
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pro' && user.isPro) ||
      (filterStatus === 'free' && !user.isPro);

    return matchesSearch && matchesFilter;
  });

  // Filtered upgrade requests
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

  // Status badge for upgrade requests
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

  // Payment method badge
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

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 text-center font-semibold transition-all relative ${
            activeTab === 'users'
              ? 'text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            Users ({users.length})
          </div>
          {activeTab === 'users' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('upgrade-requests')}
          className={`flex-1 py-4 text-center font-semibold transition-all relative ${
            activeTab === 'upgrade-requests'
              ? 'text-white'
              : 'text-white/50 hover:text-white/70'
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
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
              <div className="text-white/70 text-sm">Total Users</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Crown className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.proUsers}</div>
              <div className="text-white/70 text-sm">Pro Users</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-green-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.freeUsers}</div>
              <div className="text-white/70 text-sm">Free Users</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Coins className="w-8 h-8 text-orange-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalTokens}</div>
              <div className="text-white/70 text-sm">Total Tokens</div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterStatus === 'all'
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('pro')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterStatus === 'pro'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Pro
                </button>
                <button
                  onClick={() => setFilterStatus('free')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterStatus === 'free'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={onRefresh}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
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
                    <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Tokens</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Joined</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
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
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isPro
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-500 text-white'
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
                              onClick={() => handleAddTokens(-1)}
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
                              className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-center"
                              min="0"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddTokens(1)}
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
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-white/70">
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
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-8 h-8 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{upgradeStats.total}</div>
              <div className="text-white/70 text-sm">Total Requests</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{upgradeStats.pending}</div>
              <div className="text-white/70 text-sm">Pending</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{upgradeStats.approved}</div>
              <div className="text-white/70 text-sm">Approved</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-300" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{upgradeStats.totalRevenue} BDT</div>
              <div className="text-white/70 text-sm">Total Revenue</div>
            </motion.div>
          </div>

          {/* Filters and Search for Upgrade Requests */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by email, name, or transaction ID..."
                    value={upgradeSearch}
                    onChange={(e) => setUpgradeSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setUpgradeFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    upgradeFilter === 'all'
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setUpgradeFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    upgradeFilter === 'pending'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setUpgradeFilter('approved')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    upgradeFilter === 'approved'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setUpgradeFilter('rejected')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    upgradeFilter === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Rejected
                </button>
                <button
                  onClick={onRefresh}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Upgrade Requests Table */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Method</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
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
                            <div className="text-sm text-gray-400 flex items-center gap-1">
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
                          <div className="text-xs text-gray-400">{request.paymentNumber}</div>
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
                <div className="text-center py-12 text-white/70">
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
  );
}