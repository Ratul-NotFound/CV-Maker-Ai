'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Zap, Sparkles, Loader2, ShieldCheck, CreditCard, ArrowLeft, Copy } from 'lucide-react';
import { submitUpgradeRequest } from '@/lib/firestore';

export default function PricingModal({ onClose, currentUser }) {
  const [step, setStep] = useState(1); // 1: Select plan, 2: Payment instructions, 3: Enter transaction
  const [transactionId, setTransactionId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bikash');
  const [copied, setCopied] = useState(false);

  const paymentMethods = {
    bikash: {
      name: 'Bkash',
      number: '01784090278',
      instructions: 'Send 50 BDT to this personal number',
      type: 'Personal',
      accountName: 'Mahmud HASAN RATUL'
    },
    nagad: {
      name: 'Nagad',
      number: '01784090278',
      instructions: 'Send 50 BDT to this personal number',
      type: 'Personal',
      accountName: 'Mahmud HASAN RATUL'
    },
    rocket: {
      name: 'Rocket',
      number: '01784090278',
      instructions: 'Send 50 BDT to this personal number',
      type: 'Personal',
      accountName: 'Mahmud HASAN RATUL'
    }
  };

  const currentMethod = paymentMethods[paymentMethod];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTransaction = async () => {
    if (!transactionId.trim()) {
      alert('Please enter transaction ID');
      return;
    }

    if (transactionId.length < 8) {
      alert('Transaction ID seems too short. Please check and try again.');
      return;
    }

    setProcessing(true);
    try {
      const requestId = await submitUpgradeRequest({
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        userName: currentUser?.displayName || 'User',
        transactionId: transactionId.trim(),
        paymentMethod,
        amount: 50,
        paymentNumber: currentMethod.number
      });

      if (requestId) {
        alert('✅ Upgrade request submitted successfully!\n\nAdmin will verify your payment within 24 hours. You will receive an email notification when your account is upgraded.');
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to submit request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="ai-border-glow p-[1px] rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-950/90 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/5">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>

            {/* STEP 1: Select Plan */}
            {step === 1 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <Crown size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
                  <p className="text-slate-400">Get unlimited AI CV generations with premium features</p>
                </div>

                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-white text-xl font-bold">Pro Plan</span>
                      <div className="text-sm text-slate-300 mt-1">Lifetime Access</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">50 BDT</div>
                      <div className="text-sm text-slate-300">One-time payment</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-white">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Unlimited CV Generations</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>All Template Architectures</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Industry-Specific Designs</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>High-Quality PDF Export</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Priority Support</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Continue to Payment
                  </button>
                </div>

                <div className="text-center text-slate-400 text-sm">
                  <p>✅ 100% Satisfaction Guarantee</p>
                  <p className="mt-1">🔒 Secure Payment • Instant Access</p>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {step === 2 && (
              <div className="p-8">
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="text-center mb-6">
                  <CreditCard className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Payment Method</h2>
                  <p className="text-slate-400">Choose your preferred payment method</p>
                </div>

                <div className="space-y-4 mb-6">
                  {Object.entries(paymentMethods).map(([key, method]) => (
                    <div
                      key={key}
                      onClick={() => setPaymentMethod(key)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === key 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            paymentMethod === key ? 'bg-blue-500' : 'bg-white/10'
                          }`}>
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold">{method.name}</h3>
                            <p className="text-slate-300 text-sm">{method.instructions}</p>
                          </div>
                        </div>
                        {paymentMethod === key && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod && (
                  <div className="mb-6 p-4 bg-black/30 rounded-lg">
                    <h3 className="text-white font-bold mb-3">Payment Details:</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-sm">Send to:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-black/50 px-3 py-2 rounded text-lg font-mono text-white flex-1">
                            {currentMethod.number}
                          </code>
                          <button
                            onClick={() => copyToClipboard(currentMethod.number)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            {copied ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-white" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Account Type:</label>
                        <div className="text-white">{currentMethod.type}</div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Account Name:</label>
                        <div className="text-white">{currentMethod.accountName}</div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Amount:</label>
                        <div className="text-white font-bold">50 BDT</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ Important: Save the transaction ID after payment. You'll need it in the next step.
                  </p>
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all"
                >
                  I've Made Payment
                </button>
              </div>
            )}

            {/* STEP 3: Verify Payment */}
            {step === 3 && (
              <div className="p-8">
                <button 
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="text-center mb-6">
                  <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Verify Payment</h2>
                  <p className="text-slate-400">Enter your transaction ID to complete upgrade</p>
                </div>

                <div className="mb-6">
                  <label className="block text-white mb-2">Transaction ID *</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID from your payment"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-slate-400 text-sm mt-2">
                    Find this in your {currentMethod.name} app transaction history
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-white mb-2">Payment Method</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white">{currentMethod.name}</span>
                      <span className="text-slate-400">50 BDT</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-6">
                  <h4 className="text-yellow-200 font-bold mb-2">Verification Process:</h4>
                  <ol className="text-yellow-200 text-sm space-y-2 list-decimal pl-5">
                    <li>Submit your transaction ID</li>
                    <li>Admin will verify the payment manually</li>
                    <li>You'll receive email confirmation within 24 hours</li>
                    <li>Your account will be upgraded to Pro immediately after verification</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitTransaction}
                    disabled={processing || !transactionId.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Verification'
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300 text-sm">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}