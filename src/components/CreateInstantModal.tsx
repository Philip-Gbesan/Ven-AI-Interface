import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Server, Cpu, Database } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button'; // Assuming you have a Button component
import { type Instant } from '../data/mockData';

interface CreateInstantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (instant: Instant) => void;
}

export default function CreateInstantModal({ isOpen, onClose, onCreated }: CreateInstantModalProps) {
  const [step, setStep] = useState<'input' | 'provisioning'>('input');
  const [name, setName] = useState('');
  const [progress, setProgress] = useState(0);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setName('');
      setProgress(0);
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!name.trim()) return;
    setStep('provisioning');
    
    // Simulate provisioning process
    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            
            // Success Delay
            setTimeout(() => {
                const newInstant: Instant = {
                    id: `inst-${Date.now()}`,
                    name: name,
                    status: 'active',
                    engineEnabled: true,
                    storageUsed: 0,
                    maxStorage: 1024 * 1024 * 1024,
                    fileCount: 0,
                    chunkCount: 0,
                    createdAt: new Date().toISOString(),
                    lastActivity: 'Just now'
                };
                onCreated(newInstant);
            }, 800);
        }
        setProgress(currentProgress);
    }, 400); // ~3-4 seconds total
  };

  const checklistItems = [
    { label: "Allocating dedicated GPU resources...", threshold: 20 },
    { label: "Initializing secure context engine...", threshold: 45 },
    { label: "Preparing encrypted storage volume...", threshold: 70 },
    { label: "Configuring Instant parameters...", threshold: 90 },
  ];

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={step === 'provisioning' ? () => {} : onClose} // Prevent closing during provisioning
        title={step === 'input' ? "Create Instant" : "Creating Your Instant..."}
    >
        <div className="p-6 pt-2">
            
            {/* STEP 1: INPUT & REVIEW */}
            {step === 'input' && (
                <div className="space-y-8">
                    {/* Input Field */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Instant Name
                        </label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Legal Documents, Q1 Research"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                            autoFocus
                        />
                    </div>

                    {/* Plan Summary Box */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800/50">
                         <div className="flex items-start justify-between mb-4">
                             <div>
                                 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    Details:
                                 </h3>
                             </div>
                             <div className="text-right">
                                 <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">$20</span>
                                 <span className="text-sm text-zinc-500 dark:text-zinc-400">/mo</span>
                             </div>
                         </div>
                         
                         <ul className="space-y-3">
                             <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                    <Cpu className="w-4 h-4 text-zinc-500" />
                                 </div>
                                 <span>Nvidia H100 GPU Computing Power</span>
                             </li>
                             <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                    <Database className="w-4 h-4 text-zinc-500" />
                                 </div>
                                 <span>1GB Storage</span>
                             </li>
                             <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                    <Shield className="w-4 h-4 text-zinc-500" />
                                 </div>
                                 <span>Enterprise-Grade Encryption</span>
                             </li>
                         </ul>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                        onClick={handleCreate}
                        disabled={!name.trim()}
                        className="w-full h-12 text-base text-white dark:text-zinc-900 hover:bg-zinc-200"
                    >
                        Deploy Now
                    </Button>
                </div>
            )}


            {/* STEP 2: PROVISIONING */}
            {step === 'provisioning' && (
                <div className="space-y-6 py-4">
                    {/* Icon Animation */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 blur-xl opacity-20 rounded-full animate-pulse" />
                            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-700 relative z-10">
                                 <Server className="w-10 h-10 text-zinc-400 dark:text-zinc-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            <span>Provisioning Status</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-zinc-900 dark:bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                            />
                        </div>
                    </div>

                    {/* Dynamic Checklist */}
                    <div className="space-y-3 pt-2">
                        {checklistItems.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0.5, x: -10 }}
                                animate={{ 
                                    opacity: progress >= item.threshold ? 1 : 0.5,
                                    x: 0
                                }}
                                className="flex items-center gap-3 text-sm"
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                    progress >= item.threshold 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'border-zinc-200 dark:border-zinc-700 text-transparent'
                                } transition-all duration-300`}>
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className={`${
                                    progress >= item.threshold 
                                        ? 'text-zinc-900 dark:text-zinc-100 font-medium' 
                                        : 'text-zinc-400 dark:text-zinc-600'
                                } transition-colors duration-300`}>
                                    {item.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </Modal>
  );
}
