import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataMissingStateProps {
  onUploadClick: () => void;
}

export default function DataMissingState({ onUploadClick }: DataMissingStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8 h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-zinc-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Data Required
        </h2>
        
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            No data found in this Instant. You must upload documents to the knowledge base before you can start chatting.
        </p>
        
        <button
            onClick={onUploadClick}
            className="w-full group relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl p-8 transition-all duration-200"
        >
            <div className="flex flex-col items-center gap-3">
                 <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Upload className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                 </div>
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">Click to upload documents</span>
                 <span className="text-xs text-zinc-500 dark:text-zinc-400">Supports PDF, DOCX, TXT</span>
            </div>
        </button>
      </motion.div>
    </div>
  );
}
