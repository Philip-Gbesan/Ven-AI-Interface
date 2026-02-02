import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CreditCard, Bell, Trash2, AlertTriangle, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

export default function Settings() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    security: true,
    updates: false,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    
    addToast({
        type: 'info',
        title: 'Verification Sent',
        message: 'A deletion verification link has been sent to your email.'
    });
  };

  return (
    <div className="w-full px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          Manage your subscription, preferences, and security.
        </p>
      </div>

      {/* Plan Section - V5: Dark Card */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            Subscription Plan
        </h2>
        <Card padding="lg" variant="default" className="bg-zinc-900 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 dark:bg-zinc-700/50 border border-zinc-700 dark:border-zinc-700 text-xs font-medium text-white mb-3">
                        <Shield className="w-3 h-3" />
                        Ven AI Professional
                     </div>
                     <h3 className="text-2xl font-bold mb-1 text-white">SDE Standard Plan</h3>
                     <p className="text-zinc-400 text-sm">$20.00 / month · Renews Feb 28, 2026</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="bg-zinc-800 dark:bg-zinc-700 text-white hover:bg-zinc-700 dark:hover:bg-zinc-600 border-zinc-700 hover:border-zinc-600">
                        Manage Billing
                    </Button>
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-800 dark:border-zinc-700/50">
                <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Compute</p>
                     <p className="text-sm font-medium text-zinc-300">GPU Computing Power</p>
                </div>
                <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Storage</p>
                     <p className="text-sm font-medium text-zinc-300">1GB Secure Data Environment</p>
                </div>
                <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Context</p>
                     <p className="text-sm font-medium text-zinc-300">Unlimited Context</p>
                </div>
            </div>
        </Card>
      </section>

      {/* Preferences Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            Notifications
        </h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 shadow-sm">
             <div className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email Notifications</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive weekly digests and activity summaries.</p>
                </div>
                <Toggle enabled={notifications.email} onChange={(v) => setNotifications(prev => ({...prev, email: v}))} />
             </div>
             <div className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Security Alerts</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Immediate alerts for new logins and sensitive actions.</p>
                </div>
                <Toggle enabled={notifications.security} onChange={(v) => setNotifications(prev => ({...prev, security: v}))} />
             </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-500 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
        </h2>
        <div className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold text-red-900 dark:text-red-200">Delete Account & Resources</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1 max-w-lg">
                        Permanently delete your account and all associated secure data instances. This action cannot be undone.
                    </p>
                </div>
                <Button 
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500"
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    Delete Account
                </Button>
            </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
            <>
                <div 
                    className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 z-50 border border-zinc-200 dark:border-zinc-800"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                             <Trash2 className="w-6 h-6" />
                        </div>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Delete Account?</h2>
                    <p className="text-sm text-zinc-600 mb-6">
                        This will permanently delete your **Ven AI** account and all **{3}** active instances. All data will be wiped from our secure enclaves immediately.
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-zinc-900 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <Button 
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                            onClick={handleDeleteAccount}
                            isLoading={isDeleting}
                        >
                            Yes, Delete Everything
                        </Button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}
