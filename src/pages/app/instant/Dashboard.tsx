import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    HardDrive, 
    Upload, 
    MoreVertical, 
    PenLine, 
    FileText, 
    Table,
    FileCode,
    MessageSquare,
    Trash2,
    FileStack
} from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { useUploadQueue } from '../../../hooks/useUploadQueue';
import { useToast } from '../../../components/ui/Toast';
import { 
    getInstantById, 
    formatBytes, 
    getStoragePercentage,
    getFilesByInstant,
    mockInstants,
    type FileItem
} from '../../../data/mockData';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  // Force re-render of data based on ID since it's mock
  const instant = getInstantById(id || '');
  const [files, setFiles] = useState<FileItem[]>(getFilesByInstant(id || ''));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  
  const { isUploading, progress, uploadFiles, recentUpload } = useUploadQueue();

  if (!instant) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-500">Instant not found</p>
      </div>
    );
  }

  const handleDelete = (fileId: string) => {
      setFiles(files.filter(f => f.id !== fileId));
      addToast({ type: 'info', title: 'File Deleted', message: 'The file has been removed.', action: { label: 'Files', path: '/app/files' } });
  };

  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const fileList = Array.from(e.target.files);
          
          uploadFiles(fileList, (file) => {
             // On Single File Complete
             const ext = file.name.split('.').pop()?.toLowerCase();
             let type: any = 'txt';
             if(['pdf','doc','docx','csv','md'].includes(ext || '')) type = ext;

             const newFile: FileItem = {
                id: `file-${Date.now()}-${Math.random()}`,
                instantId: instant.id,
                name: file.name,
                size: file.size,
                type: type,
                status: 'ready', 
                uploadedAt: new Date().toISOString(),
                chunkCount: 10,
             };
             setFiles(prev => [newFile, ...prev]);
          });
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* V19 HEADER REVERT: Clean & Minimal */}
      <div className="flex w-full items-center">
         <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-4">
            {instant.name}
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <PenLine className="w-5 h-5" />
            </button>
         </h1>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Upload Box */}
         <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="group relative h-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-start text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all gap-6"
         >
             {/* Progress / Ephemeral State Overlay */}
             {(isUploading || recentUpload) && (
                <div className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 z-10 flex flex-col items-center justify-center rounded-2xl pointer-events-none transition-opacity duration-300">
                     <div className="w-64 space-y-3 text-center">
                        {isUploading && !recentUpload && (
                             <>
                                <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                    <span>Uploading queue... {progress}</span>
                                </div>
                                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden w-full">
                                   <motion.div 
                                        className="h-full bg-blue-500" 
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    />
                                </div>
                             </>
                        )}
                        {recentUpload && (
                             <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2"
                             >
                                — {recentUpload} uploaded
                             </motion.div>
                        )}
                     </div>
                </div>
            )}

            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Upload className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Upload Data</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Supports .docx, .xls, .pdf</p>
            </div>
         </button>

         {/* Query Box */}
         <Link 
            to={`/app/instant/${instant.id}/chat`}
            className="group h-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-start text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all gap-6"
         >
             <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Query Data</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Interact with your knowledge base using natural language</p>
            </div>
         </Link>
      </div>

      {/* Data Table Section */}
      <div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Data Resources</h2>
         </div>
         {files.length === 0 ? (
            <div className="h-[500px] border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <FileStack className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No files uploaded yet</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                    Use the upload box above to add documents to this Secure Environment and start generating insights.
                </p>
            </div>
         ) : (
             <DataTable files={files} onDelete={handleDelete} />
         )}
      </div>

    </div>
  );
}
