import { Link } from 'react-router-dom';
import { Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatBytes, type Instance } from '../data/mockData';

interface InstanceCardProps {
  instance: Instance;
}

export default function InstanceCard({ instance }: InstanceCardProps) {
  // Animation State 1: Active Status Text ("Processing" -> "Active")
  const [statusText, setStatusText] = useState('Processing');
  
  // Animation State 2: Footer Text Toggling (ONLY for processing state)
  const footerMessages = [
    "Allocating resources and configuring instance",
    "Preparing data and initializing context engine"
  ];
  const [footerIndex, setFooterIndex] = useState(0);

  useEffect(() => {
    // "Processing" -> "Active" after mount
    const statusTimer = setTimeout(() => {
      setStatusText('Ready');
    }, 1500);

    // Footer text toggle interval
    const footerTimer = setInterval(() => {
      setFooterIndex((prev) => (prev + 1) % footerMessages.length);
    }, 3000);

    return () => {
      clearTimeout(statusTimer);
      clearInterval(footerTimer);
    };
  }, []);


  return (
    <Link to={`/app/instance/${instance.id}/dashboard`} className="block group h-full">
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 h-45 flex flex-col relative overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
             {/* Logo Container */}
            <div className="w-10 h-10 bg-zinc-900 dark:bg-black rounded-lg flex items-center justify-center flex-shrink-0">
               <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {instance.name}
                </h3>
                
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-grow" />

        {/* Storage Info (Text Only) */}
        <div className="mb-3">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
               <span className="text-zinc-900 dark:text-zinc-100">{formatBytes(instance.storageUsed)}</span>
               <span className="text-zinc-400 mx-1">/</span>
               <span className="text-zinc-500 dark:text-zinc-400">1GB</span>
            </p>
        </div>

        {/* Dynamic Footer - V12 Update: "Your data is ready for interaction" */}
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
                   <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                   Your data is ready for interaction
                </div>
            )}
        </div>
        {/* Active Dot */}
        <div className="absolute top-7 right-17 flex items-center justify-center w-2.5 h-2.5">
            <span className="absolute w-full h-full rounded-full bg-green-500 opacity-75 animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-green-500" />
        </div>
        
        <div className="absolute top-5 right-5">
             <span className="text-xs font-semibold text-green-600 tracking-wide uppercase">
                {statusText}
             </span>
        </div>

      </motion.div>
    </Link>
  );
}
