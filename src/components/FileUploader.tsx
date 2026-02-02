import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  FileCode,
  Table,
  X,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from './ui/Toast';

interface FileUploadState {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface FileUploaderProps {
  onUpload?: (files: File[]) => void;
  instanceId: string;
}

const ACCEPTED_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'application/msword': { icon: FileText, label: 'DOC' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    icon: FileText,
    label: 'DOCX',
  },
  'text/plain': { icon: FileCode, label: 'TXT' },
  'text/csv': { icon: Table, label: 'CSV' },
  'text/markdown': { icon: FileCode, label: 'MD' },
};

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.csv', '.md'];

export default function FileUploader({ onUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const { addToast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return ACCEPTED_EXTENSIONS.includes(extension);
  };

  const simulateUpload = async (file: File, index: number) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploads((prev) =>
        prev.map((u, i) =>
          i === index ? { ...u, progress, status: 'uploading' } : u
        )
      );
    }

    // Simulate success
    setUploads((prev) =>
      prev.map((u, i) => (i === index ? { ...u, status: 'success' } : u))
    );

    addToast({
      type: 'success',
      title: 'File uploaded',
      message: `${file.name} is now being processed`,
    });
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(validateFile);
      const invalidFiles = files.filter((f) => !validateFile(f));

      if (invalidFiles.length > 0) {
        addToast({
          type: 'error',
          title: 'Invalid file type',
          message: `${invalidFiles.length} file(s) rejected. Accepted: PDF, DOC, DOCX, TXT, CSV, MD`,
        });
      }

      if (validFiles.length === 0) return;

      const newUploads: FileUploadState[] = validFiles.map((file) => ({
        file,
        status: 'pending',
        progress: 0,
      }));

      setUploads((prev) => [...prev, ...newUploads]);

      // Start uploads
      const startIndex = uploads.length;
      validFiles.forEach((file, i) => {
        simulateUpload(file, startIndex + i);
      });

      onUpload?.(validFiles);
    },
    [onUpload, addToast, uploads.length]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateFile);

    if (validFiles.length === 0) {
      addToast({
        type: 'error',
        title: 'Invalid file type',
        message: 'Accepted formats: PDF, DOC, DOCX, TXT, CSV, MD',
      });
      return;
    }

    const newUploads: FileUploadState[] = validFiles.map((file) => ({
      file,
      status: 'pending' as const,
      progress: 0,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    const startIndex = uploads.length;
    validFiles.forEach((file, i) => {
      simulateUpload(file, startIndex + i);
    });

    onUpload?.(validFiles);
    e.target.value = '';
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    const config = ACCEPTED_TYPES[type as keyof typeof ACCEPTED_TYPES];
    if (config) {
      const Icon = config.icon;
      return <Icon className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-sm p-8
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-zinc-400 bg-zinc-800/50'
            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className={`
              w-12 h-12 rounded-sm flex items-center justify-center mb-4
              transition-colors
              ${isDragging ? 'bg-zinc-700' : 'bg-zinc-800'}
            `}
          >
            <Upload
              className={`w-6 h-6 ${isDragging ? 'text-zinc-100' : 'text-zinc-400'}`}
            />
          </div>
          <p className="text-sm font-medium text-zinc-200 mb-1">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-zinc-500">
            Supports PDF, DOC, DOCX, TXT, CSV, and Markdown files
          </p>
        </div>
      </div>

      {/* File Type Icons */}
      <div className="flex items-center justify-center gap-6">
        {Object.entries(ACCEPTED_TYPES)
          .slice(0, 5)
          .map(([type, config]) => (
            <div
              key={type}
              className="flex flex-col items-center gap-1 text-zinc-500"
            >
              <config.icon className="w-4 h-4" />
              <span className="text-xs">{config.label}</span>
            </div>
          ))}
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-zinc-800 rounded-sm overflow-hidden"
          >
            {uploads.map((upload, index) => (
              <motion.div
                key={`${upload.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 border-b border-zinc-800 last:border-0"
              >
                <div className="text-zinc-400">{getFileIcon(upload.file)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">
                    {upload.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {upload.status === 'uploading' && (
                      <>
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-zinc-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${upload.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 tabular-nums">
                          {upload.progress}%
                        </span>
                      </>
                    )}
                    {upload.status === 'success' && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Processing
                      </span>
                    )}
                  </div>
                </div>
                {upload.status === 'uploading' && (
                  <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                )}
                {upload.status === 'success' && (
                  <button
                    onClick={() => removeUpload(index)}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
