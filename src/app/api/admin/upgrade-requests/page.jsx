'use client';

import { useState, useEffect } from 'react';
import { Check, X, Clock, Search, Filter, Mail, User, DollarSign, CreditCard, Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function UpgradeRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/upgrade-requests');
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId, userId) => {
    if (!confirm('Are you sure you want to approve this request?')) return;

    setProcessing(true);
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
        fetchRequests();
      } else {
        alert(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('❌ Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;

    setProcessing(true);
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
        fetchRequests();
      } else {
        alert(data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('❌ Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = 
      search === '' ||
      request.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      request.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      request.userName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Upgrade Requests</h1>
      <p className="text-slate-400 mb-6">Manage user upgrade requests and verify payments</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-slate-400 text-sm">Total Requests</div>
            </div>
            <CreditCard className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-slate-400 text-sm">Pending</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{stats.approved}</div>
              <div className="text-slate-400 text-sm">Approved</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{stats.rejected}</div>
              <div className="text-slate-400 text-sm">Rejected</div>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by email, name, or transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <RefreshCw className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left text-white">User</th>
                <th className="p-4 text-left text-white">Transaction ID</th>
                <th className="p-4 text-left text-white">Method</th>
                <th className="p-4 text-left text-white">Amount</th>
                <th className="p-4 text-left text-white">Date</th>
                <th className="p-4 text-left text-white">Status</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white">
                    No requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{request.userName}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {request.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="bg-black/50 px-2 py-1 rounded text-sm font-mono text-white">
                        {request.transactionId}
                      </code>
                    </td>
                    <td className="p-4">
                      {getPaymentMethodBadge(request.paymentMethod)}
                      <div className="text-xs text-gray-400 mt-1">{request.paymentNumber}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-bold">{request.amount} BDT</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(request.submittedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="p-4">
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request.id, request.userId)}
                            disabled={processing}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={processing}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <div className="text-green-400 text-sm font-bold">✓ Approved</div>
                      )}
                      {request.status === 'rejected' && (
                        <div className="text-red-400 text-sm font-bold">✗ Rejected</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions for Admin */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
        <h3 className="text-white font-bold mb-2">Admin Instructions:</h3>
        <ul className="text-blue-200 text-sm space-y-1 list-disc pl-5">
          <li>Verify transaction ID in payment app before approving</li>
          <li>Check that amount matches (50 BDT)</li>
          <li>Reject if transaction ID is invalid or already used</li>
          <li>User will automatically be upgraded to Pro upon approval</li>
          <li>Email notifications will be sent to users (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}