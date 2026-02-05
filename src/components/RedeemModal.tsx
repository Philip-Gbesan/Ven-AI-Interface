import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Sparkles, Check, Loader2, Gift } from 'lucide-react';
import { mockUser } from '../data/mockData';
import { useToast } from './ui/Toast';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback to refresh parent UI
}

export default function RedeemModal({ isOpen, onClose, onSuccess }: RedeemModalProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedAmount, setVerifiedAmount] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const { addToast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setError('');
    setIsVerifying(true);
    
    // Simulate API Check
    await new Promise(r => setTimeout(r, 1000));
    setIsVerifying(false);

    // Strict Code Validation
    const normalizedCode = code.trim().toUpperCase();
    
    switch (normalizedCode) {
        case 'VEN10':
            setVerifiedAmount(10.00);
            break;
        case 'VEN20':
            setVerifiedAmount(20.00);
            break;
        case 'VEN50':
            setVerifiedAmount(50.00);
            break;
        case 'VEN-WELCOME':
            setVerifiedAmount(5.00); // Easter egg
            break;
        default:
            setError('Invalid code. Valid codes: VEN10, VEN20, VEN50.');
            break;
    }
  };

  const handleConfirm = async () => {
    if (!verifiedAmount) return;

    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 800));
    
    mockUser.credits += verifiedAmount;
    
    addToast({
        type: 'success',
        title: 'Credits Added',
        message: `$${verifiedAmount.toFixed(2)} has been added to your balance.`
    });

    if (onSuccess) onSuccess();
    
    reset();
    onClose();
  };

  const reset = () => {
      setCode('');
      setVerifiedAmount(null);
      setError('');
      setIsVerifying(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg">
                        <Gift className="w-5 h-5" />
                   </div>
                   <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                       Redeem Credits
                   </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {!verifiedAmount ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                             <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Enter Redemption Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="VEN-XXXX-XXXX"
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-500 transition-all font-mono tracking-wide"
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                    <X className="w-3 h-3" /> {error}
                                </p>
                            )}
                        </div>
                         <button
                            type="submit"
                            disabled={!code || isVerifying}
                            className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-black dark:hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-900 dark:text-zinc-100 mx-auto">
                                <Check className="w-8 h-8" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Code Verified Successfully</p>
                            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                +${verifiedAmount.toFixed(2)}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={reset}
                                className="flex-1 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isVerifying}
                                className="flex-[2] py-2.5 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl font-medium shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Top Up'}
                            </button>
                        </div>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
