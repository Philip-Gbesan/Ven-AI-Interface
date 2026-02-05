import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, UploadCloud } from 'lucide-react';
import DataTable from '../../components/DataTable';
import RemoteUploadModal from '../../components/RemoteUploadModal';
import { mockFiles, mockInstants, type FileItem } from '../../data/mockData';

export default function Files() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Aggregate all files from all instances for the global view
  const allFiles: FileItem[] = mockFiles.map(file => {
      const instant = mockInstants.find(i => i.id === file.instantId);
      return {
          ...file,
          instantName: instant?.name || 'Unknown Instant' 
      };
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col"> 
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            Files
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Global view of {allFiles.length} secure data artifacts.
          </p>
        </div>
        
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UploadCloud className="w-4 h-4" />
          Upload File Remotely
        </button>
      </div>

      <RemoteUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 min-h-0" // Critical for ensuring internal scroll works in flexible flex container
      >
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    <Database className="w-4 h-4" />
                    <span>All Repository Files</span>
                </div>
            </div>
            {/* Reusing DataTable with full-height adjustment */}
            <div className="flex-1 min-h-0">
                 <DataTable files={allFiles} /> 
            </div>
        </div>
      </motion.div>
    </div>
  );
}
