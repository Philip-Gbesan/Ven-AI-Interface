import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
            />
            
            {/* Modal Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`relative w-full ${maxWidth} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden`}
                >
                     {/* Header (Optional) */}
                     {title && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                             <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                {title}
                             </h2>
                             <button 
                                onClick={onClose}
                                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                             >
                                <X className="w-5 h-5" />
                             </button>
                        </div>
                     )}

                     {/* Keep Close button if no title but still need to close */}
                     {!title && (
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 z-10 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                     )}

                    {children}
                </motion.div>
            </div>
        </>
      )}
    </AnimatePresence>
  );
}
