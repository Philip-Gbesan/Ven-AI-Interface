import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ExternalLink, ChevronRight, Quote } from 'lucide-react';
import Badge from './ui/Badge';
import type { ChatSource } from '../data/mockData';

interface ContextEvidenceProps {
  source: ChatSource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContextEvidence({
  source,
  isOpen,
  onClose,
}: ContextEvidenceProps) {
  return (
    <AnimatePresence>
      {isOpen && source && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full border-l border-zinc-200 bg-zinc-50 overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-white">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-900">
                Context Evidence
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Source File Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3 p-3 bg-white border border-zinc-200 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {source.fileName}
                    </p>
                    <p className="text-xs text-zinc-500">Source Document</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm">
                  Chunk #{source.chunkIndex}
                </Badge>
                <Badge
                  variant={
                    source.relevanceScore >= 0.9
                      ? 'success'
                      : source.relevanceScore >= 0.7
                        ? 'warning'
                        : 'default'
                  }
                  size="sm"
                >
                  {Math.round(source.relevanceScore * 100)}% Match Score
                </Badge>
              </div>
            </div>

            {/* Snippet */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Extracted Content
              </h4>
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap font-mono relative">
                   <span className="absolute -left-2 top-0 bottom-0 w-1 bg-zinc-100 rounded-full" />
                   {source.snippet}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-200">
              <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:text-zinc-900 hover:border-zinc-300 hover:shadow-sm transition-all">
                <span>View full source document</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-200 bg-zinc-100/50">
            <p className="text-xs text-zinc-500 text-center">
              Retrieved from your private data store.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
