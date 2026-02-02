import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  FileCode,
  Table,
  MoreVertical,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatBytes, formatDate, type FileItem } from '../data/mockData';

interface DataTableProps {
  files: FileItem[];
  onDelete?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  isLoading?: boolean;
}

type SortField = 'name' | 'size' | 'uploadedAt' | 'status';
type SortDirection = 'asc' | 'desc';

const FILE_ICONS: Record<FileItem['type'], React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  txt: FileCode,
  csv: Table,
  md: FileCode,
};

export default function DataTable({ files, onDelete, onRetry, isLoading }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // V6: Store active menu ID and its position
  const [activeMenu, setActiveMenu] = useState<{ id: string; top: number; left: number } | null>(null);

  type ButtonRefMap = { [key: string]: HTMLButtonElement | null };
  const buttonRefs = useRef<ButtonRefMap>({});

  // Close menu on scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
      const handleScroll = () => {
          if (activeMenu) setActiveMenu(null);
      };
      const el = scrollContainerRef.current;
      if (el) el.addEventListener('scroll', handleScroll);
      window.addEventListener('scroll', handleScroll, true); // Catch global scrolls
      return () => {
          if (el) el.removeEventListener('scroll', handleScroll);
          window.removeEventListener('scroll', handleScroll, true);
      };
  }, [activeMenu]);

  const handleMenuClick = (fileId: string) => {
      if (activeMenu?.id === fileId) {
          setActiveMenu(null);
          return;
      }
      
      const btn = buttonRefs.current[fileId];
      if (btn) {
          const rect = btn.getBoundingClientRect();
          // Position relative to viewport (fixed)
          // Open to the left of the button
          setActiveMenu({
              id: fileId,
              top: rect.bottom + 4, // 4px gap
              left: rect.right - 160 // Width of menu (w-40 = 10rem = 160px)
          });
      }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'uploadedAt':
        comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  const HeaderCell = ({ field, children, className = '' }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <th
      className={`px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-900 transition-colors bg-zinc-50 sticky top-0 z-10 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <>
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm h-[500px] flex flex-col relative z-0">
       {/* Scrollable Container */}
       <div className="overflow-y-auto flex-1 custom-scrollbar" ref={scrollContainerRef}>
          <table className="w-full">
            <thead className="border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <HeaderCell field="name" className="w-[45%] pl-6 bg-zinc-50 dark:bg-zinc-900/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">Filename</HeaderCell>
                <HeaderCell field="size" className="bg-zinc-50 dark:bg-zinc-900/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">Size</HeaderCell>
                <HeaderCell field="status" className="bg-zinc-50 dark:bg-zinc-900/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">Status</HeaderCell>
                <HeaderCell field="uploadedAt" className="bg-zinc-50 dark:bg-zinc-900/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">Date Uploaded</HeaderCell>
                <th className="px-6 py-3 w-12 bg-zinc-50 dark:bg-zinc-900/90 sticky top-0 z-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <AnimatePresence>
                {sortedFiles.map((file) => {
                  const Icon = FILE_ICONS[file.type];
                  const isReady = file.status === 'ready';
                  const isError = file.status === 'error';
                  const isIndexing = !isReady && !isError;

                  return (
                    <motion.tr
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors group relative"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 tabular-nums">
                          {formatBytes(file.size)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         {isReady && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"><CheckCircle2 className="w-3.5 h-3.5" />Ready</span>}
                         {isError && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"><AlertCircle className="w-3.5 h-3.5" />Failed</span>}
                         {isIndexing && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"><Loader2 className="w-3.5 h-3.5 animate-spin" />Indexing</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {formatDate(file.uploadedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            ref={el => buttonRefs.current[file.id] = el}
                            onClick={() => handleMenuClick(file.id)}
                            className={`p-1.5 rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${activeMenu?.id === file.id ? 'opacity-100 text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
       </div>
    </div>
    
    {/* Fixed Menu Overlay (Outside of clipped container) */}
    <AnimatePresence>
        {activeMenu && (
             <>
             <div className="fixed inset-0 z-50" onClick={() => setActiveMenu(null)} />
             <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.1 }}
                 style={{ 
                     position: 'fixed', 
                     top: activeMenu.top, 
                     left: activeMenu.left,
                     zIndex: 60 
                 }}
                 className="w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 py-1 overflow-hidden"
             >
                 {/* Logic to find active file */}
                 {(() => {
                     const file = files.find(f => f.id === activeMenu.id);
                     if (!file) return null;
                     const isError = file.status === 'error';
                     return (
                         <>
                            {isError && onRetry && (
                                <button
                                    onClick={() => { onRetry(file.id); setActiveMenu(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> Retry
                                </button>
                            )}
                             <button disabled className="w-full px-4 py-2 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FileText className="w-4 h-4" /> View Details
                            </button>
                            {onDelete && (
                                <>
                                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                                    <button
                                        onClick={() => { onDelete(file.id); setActiveMenu(null); }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete File
                                    </button>
                                </>
                            )}
                         </>
                     );
                 })()}
             </motion.div>
             </>
        )}
    </AnimatePresence>
    </>
  );
}
