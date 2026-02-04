import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, RefreshCw } from 'lucide-react';
import FileUploader from '../../../components/FileUploader';
import DataTable from '../../../components/DataTable';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import {
  getFilesByInstant,
  getInstantById,
  formatBytes,
} from '../../../data/mockData';
import type { FileItem } from '../../../data/mockData';

export default function Data() {
  const { id } = useParams<{ id: string }>();
  const instance = getInstantById(id || '');
  const initialFiles = getFilesByInstant(id || '');
  const { addToast } = useToast();

  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!instance) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Instance not found</p>
      </div>
    );
  }

  const handleUpload = (uploadedFiles: File[]) => {
    // Simulate adding files with processing status
    const newFiles: FileItem[] = uploadedFiles.map((file, i) => ({
      id: `new-file-${Date.now()}-${i}`,
      instantId: id || '',
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop() as FileItem['type'],
      status: 'parsing' as const,
      chunkCount: 0,
      uploadedAt: new Date().toISOString(),
    }));

    setFiles((prev) => [...newFiles, ...prev]);

    // Simulate processing pipeline
    newFiles.forEach((file, i) => {
      const statuses: FileItem['status'][] = [
        'parsing',
        'chunking',
        'embedding',
        'ready',
      ];
      
      statuses.forEach((status, statusIndex) => {
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status,
                    chunkCount: status === 'ready' ? Math.floor(Math.random() * 150) + 20 : 0,
                  }
                : f
            )
          );

          if (status === 'ready') {
            addToast({
              type: 'success',
              title: 'Processing complete',
              message: `${file.name} is now ready for querying`,
            });
          }
        }, (statusIndex + 1) * 2000 + i * 500);
      });
    });
  };

  const handleDelete = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    addToast({
      type: 'info',
      title: 'File deleted',
      message: `${file?.name} has been removed`,
    });
  };

  const handleRetry = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: 'parsing', errorMessage: undefined } : f
      )
    );
    addToast({
      type: 'info',
      title: 'Retrying',
      message: 'Processing will restart shortly',
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    addToast({
      type: 'info',
      title: 'Refreshed',
      message: 'File list updated',
    });
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const readyCount = files.filter((f) => f.status === 'ready').length;
  const processingCount = files.filter(
    (f) => !['ready', 'error'].includes(f.status)
  ).length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-1">
            Data Management
          </h1>
          <p className="text-sm text-zinc-500">
            Upload and manage files for {instance.name}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          isLoading={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-sm">
          <p className="text-xs text-zinc-500 mb-1">Total Files</p>
          <p className="text-xl font-bold text-zinc-100">{files.length}</p>
        </div>
        <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-sm">
          <p className="text-xs text-zinc-500 mb-1">Total Size</p>
          <p className="text-xl font-bold text-zinc-100">{formatBytes(totalSize)}</p>
        </div>
        <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-sm">
          <p className="text-xs text-zinc-500 mb-1">Status</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="success" size="sm">{readyCount} ready</Badge>
            {processingCount > 0 && (
              <Badge variant="warning" size="sm">{processingCount} processing</Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="error" size="sm">{errorCount} errors</Badge>
            )}
          </div>
        </div>
        <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-sm">
          <p className="text-xs text-zinc-500 mb-1">Total Chunks</p>
          <p className="text-xl font-bold text-zinc-100">
            {files.reduce((acc, f) => acc + f.chunkCount, 0).toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <FileUploader onUpload={handleUpload} instanceId={id || ''} />
      </motion.div>

      {/* File Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Uploaded Files
          </h2>
        </div>
        <DataTable
          files={files}
          onDelete={handleDelete}
          onRetry={handleRetry}
        />
      </motion.div>
    </div>
  );
}
