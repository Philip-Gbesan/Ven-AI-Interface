import { Link, useNavigate } from 'react-router-dom';
import { MoreVertical, Pause, Trash, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { formatBytes, type Instant } from '../data/mockData';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface InstantCardProps {
  instant: Instant;
  onDelete: () => void;
  onStatusChange: (status: 'active' | 'hibernating' | 'processing') => void;
}

export default function InstantCard({ instant, onDelete, onStatusChange }: InstantCardProps) {
  // Animation State 1: Active Status Text ("Processing" -> "Active")
  const [statusText, setStatusText] = useState(instant.status === 'hibernating' ? 'Hibernated' : 'Processing');
  
  // Animation State 2: Footer Text Toggling (ONLY for processing state)
  const footerMessages = [
    "Allocating resources and configuring instant",
    "Preparing data and initializing context engine"
  ];
  const [footerIndex, setFooterIndex] = useState(0);

  // V24: Menu & Modal States
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHibernateModal, setShowHibernateModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If not hibernating, simulate "Processing" -> "Ready"
    if (instant.status !== 'hibernating') {
        const statusTimer = setTimeout(() => {
            setStatusText('Ready');
        }, 1500);
        return () => clearTimeout(statusTimer);
    } else {
        setStatusText('Hibernated');
    }
  }, [instant.status]);

  useEffect(() => {
    // Footer text toggle interval
    const footerTimer = setInterval(() => {
      setFooterIndex((prev) => (prev + 1) % footerMessages.length);
    }, 3000);

    // Click outside for menu
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(footerTimer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHibernate = () => {
      setShowHibernateModal(false);
      // Simulate API call
      onStatusChange('hibernating');
      setStatusText('Hibernated');
  };

  const handleTerminate = () => {
      setShowTerminateModal(false);
      onDelete();
  };

  return (
    <>
        <Link to={`/app/instant/${instant.id}/dashboard`} className="block group h-full relative">
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 h-[18rem] flex flex-col relative overflow-hidden"
        >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-3 relative z-10 w-full">
                
                {/* Left: Name */}
                <div className="flex items-center gap-3">
                    <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-100 tracking-tight">
                        {instant.name}
                        </h3>
                    </div>
                    </div>
                </div>

                {/* Right: Status Indicator (V26 Fix) */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {statusText === 'Hibernated' ? 'Paused' : statusText === 'Processing' ? 'Processing' : 'Ready'}
                    </span>

                    {/* V24: Card Actions Menu */}
                    <div className="relative" ref={menuRef} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                            {menuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setMenuOpen(false);
                                            setShowHibernateModal(true);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                                    >
                                        <Pause className="w-4 h-4" />
                                        Hold
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setMenuOpen(false);
                                            setShowTerminateModal(true);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash className="w-4 h-4" />
                                        Terminate
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>



            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Storage Info */}
            <div className="mb-3">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span className="text-zinc-900 dark:text-zinc-100">{formatBytes(instant.storageUsed)}</span>
                <span className="text-zinc-400 mx-1">/</span>
                <span className="text-zinc-500 dark:text-zinc-400">1GB</span>
                </p>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 h-10 flex items-center">
                {statusText === 'Processing' ? (
                    <div className="w-full relative h-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={footerIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs text-zinc-400 font-mono absolute w-full truncate"
                            >
                                Preparing private data environment
                            </motion.p>
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusText === 'Hibernated' ? 'bg-zinc-400' : 'bg-zinc-900'}`} />
                    {statusText === 'Hibernated' ? 'Instant is paused' : 'Your data is ready for interaction'}
                    </div>
                )}
            </div>
            
            <div className="absolute top-5 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                 {/* Status Label if needed, mostly handled by footer now */}
            </div>

        </motion.div>
        </Link>
        
        {/* Hibernate Modal */}
        <Modal
            isOpen={showHibernateModal}
            onClose={() => setShowHibernateModal(false)}
            title="Hibernate Instant?"
        >
            <div className="p-6">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Pause className="w-6 h-6 text-zinc-600 dark:text-zinc-500" />
                </div>
                <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                    This will pause your instant while preserving all your data. You can resume it anytime.
                </p>
                <div className="flex gap-3">
                    <Button variant="ghost" className="w-full" onClick={() => setShowHibernateModal(false)}>Cancel</Button>
                    <Button className="w-full text-white dark:text-zinc-900" onClick={handleHibernate}>Confirm Hold</Button>
                </div>
            </div>
        </Modal>

        {/* Terminate Modal */}
        <Modal
            isOpen={showTerminateModal}
            onClose={() => setShowTerminateModal(false)}
            title={`Delete ${instant.name}?`}
        >
             <div className="p-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                </div>
                <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                    Warning: This will <strong className="text-zinc-900 dark:text-zinc-100">permanently delete</strong> this Instant and all associated files. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <Button variant="ghost" className="w-full" onClick={() => setShowTerminateModal(false)}>Cancel</Button>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent" onClick={handleTerminate}>Terminate Instant</Button>
                </div>
            </div>
        </Modal>
    </>
  );
}
