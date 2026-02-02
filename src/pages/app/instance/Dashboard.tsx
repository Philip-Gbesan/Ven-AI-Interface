import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  MessageSquare,
  HardDrive,
  FileStack,
  Activity,
  Check,
  Pencil
} from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { useToast } from '../../../components/ui/Toast';
import {
  getInstanceById,
  getFilesByInstance,
  formatBytes,
  type FileItem
} from '../../../data/mockData';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const instance = getInstanceById(id || '');
  const { addToast } = useToast();
  
  // Local state
  const [files, setFiles] = useState<FileItem[]>(getFilesByInstance(id || ''));
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [instanceName, setInstanceName] = useState(instance?.name || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!instance) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-500">Instance not found</p>
      </div>
    );
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         simulateUpload(file);
     }
  };

  const simulateUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 200));
    }
    
    // Create new file item - V4: Status mostly Ready
    const newFile: FileItem = {
        id: `file-${Date.now()}`,
        instanceId: instance.id,
        name: file.name,
        size: file.size,
        type: file.name.split('.').pop() as any || 'txt',
        status: 'chunking', 
        uploadedAt: new Date().toISOString(),
        chunkCount: 0,
    };

    setFiles(prev => [newFile, ...prev]);
    setUploading(false);
    
    setTimeout(() => {
        setFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...f, status: 'ready', chunkCount: Math.floor(Math.random() * 50) + 10 } : f
        ));
        addToast({ type: 'success', title: 'File Processed', message: `${file.name} is ready for queries.` });
    }, 2000);
  };

  const handleDelete = (fileId: string) => {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      addToast({ type: 'info', title: 'File Deleted', message: 'The file has been removed.' });
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Header / Hero */}
      <div className="mb-8">
        <div className="flex w-full items-center justify-between">
             {/* Left: Title & Edit */}
            {isEditingName ? (
                <div className="flex items-center gap-2">
                    <input 
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                        className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                        autoFocus
                    />
                    <button onClick={() => setIsEditingName(false)} className="p-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200">
                        <Check className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3 group">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {instanceName}
                    </h1>
                    <button 
                        onClick={() => setIsEditingName(true)} 
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all p-1"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                </div>
            )}

             {/* Right: Active Status */}
             {/* <div className="flex items-center gap-1.5">
                 <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active</span>
             </div> */}
        </div>
      </div>

      {/* Stats Row
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <StatsCard icon={FileStack} label="Total Files" value={files.length.toString()} />
         <StatsCard icon={HardDrive} label="Storage Used" value={`${formatBytes(instance.storageUsed)} / 1GB`} />
         <StatsCard icon={Activity} label="System Status" value="Online" highlight />
      </div> */}

      {/* Action Grid - V11: Compact Cards (h-36) with wide, clickable panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {/* Upload Box */}
         <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className="group relative h-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-start text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all gap-6"
         >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Upload className="w-7 h-7" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Upload Data</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Add documents to knowledge base</p>
            </div>
            
            {uploading && (
                <div className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 z-10 flex flex-col items-center justify-center rounded-2xl">
                     <div className="w-64 space-y-2">
                        <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Processing...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-blue-500" 
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                     </div>
                </div>
            )}
         </button>

         {/* Chat Box */}
         <Link 
            to={`/app/instance/${instance.id}/chat`}
            className="group h-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-start text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all gap-6"
         >
             <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <MessageSquare className="w-7 h-7" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Interact with Chat</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Query your data with AI</p>
            </div>
         </Link>
      </div>

      {/* Data Table Section */}
      <div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Data Resources</h2>
         </div>
         {/* V4: DataTable handles fixed height internally */}
         <DataTable files={files} onDelete={handleDelete} />
      </div>

    </div>
  );
}

function StatsCard({ icon: Icon, label, value, highlight }: { icon: any, label: string, value: string, highlight?: boolean }) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{label}</p>
                <p className={`text-lg font-bold ${highlight ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-zinc-100'}`}>{value}</p>
            </div>
        </div>
    );
}
