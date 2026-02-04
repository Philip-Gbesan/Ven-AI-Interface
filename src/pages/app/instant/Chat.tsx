import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Clock, ChevronRight, ChevronLeft, Upload, File as FileIcon } from 'lucide-react';
import ChatPanel from '../../../components/ChatPanel';
import ContextEvidence from '../../../components/ContextEvidence';
import DataMissingState from '../../../components/DataMissingState';
import Button from '../../../components/ui/Button';
import { useUploadQueue } from '../../../hooks/useUploadQueue';
import { useToast } from '../../../components/ui/Toast';
import {
  getInstantById,
  getConversationsByInstant,
  getFilesByInstant,
  type FileItem
} from '../../../data/mockData';
import type { ChatMessage, ChatSource, Conversation } from '../../../data/mockData';

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const instant = getInstantById(id || '');
  const conversations = getConversationsByInstant(id || '');
  const [instanceFiles, setInstanceFiles] = useState<FileItem[]>(getFilesByInstant(id || ''));
  const { addToast } = useToast();
  
  const { isUploading, progress, uploadFiles, currentFilename, recentUpload, progressLabel } = useUploadQueue();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversations[0]?.messages || []
  );
  const [selectedSource, setSelectedSource] = useState<ChatSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!instant) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Instant not found</p>
      </div>
    );
  }

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      instantId: id || '',
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockSources: ChatSource[] = [
      {
        id: `src-${Date.now()}-1`,
        fileId: 'file-1',
        fileName: 'Contract_Template_2024.pdf',
        snippet:
          'This is a relevant section from your uploaded document that directly addresses your query. The content here would be the actual extracted text from the embedded chunks that matched your question with high semantic similarity.',
        chunkIndex: Math.floor(Math.random() * 100),
        relevanceScore: 0.92,
      },
    ];

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      instantId: id || '',
      role: 'assistant',
      content: `Based on the documents in your private container, I found relevant information to answer your question.

The key findings from your uploaded data indicate that [Source 1]:

1. **Primary insight**: The documents contain specific provisions related to your query that are worth noting.`,
      sources: mockSources,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSourceClick = (source: ChatSource) => {
    setSelectedSource(source);
  };

  const handleNewConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
    setSelectedSource(null);
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages(conv.messages);
    setSelectedSource(null);
  };

  // Upload Logic
  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const fileList = Array.from(e.target.files);
          
          uploadFiles(fileList, (file) => {
              const ext = file.name.split('.').pop()?.toLowerCase();
              let type: any = 'txt';
              if(['pdf','doc','docx','csv','md'].includes(ext || '')) type = ext;

              const newFile: FileItem = {
                id: `file-${Date.now()}`,
                instantId: instant.id,
                name: file.name,
                size: file.size,
                type: type,
                status: 'ready', 
                uploadedAt: new Date().toISOString(),
                chunkCount: 10,
              };
              
              setInstanceFiles(prev => [newFile, ...prev]);
          });
      }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <input 
          type="file" 
          multiple
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
      />
      
      {/* Conversation History - Left Panel */}
      <motion.div
        initial={{ width: historyOpen ? 280 : 0 }}
        animate={{ width: historyOpen ? 280 : 0 }}
        className="flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden flex flex-col"
      >
        <div className="h-full flex flex-col w-[280px]">
          
          {/* Section 1: Top Header & New Chat */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Chats
              </h2>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={handleNewConversation}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Section 2: Scrollable History List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length > 0 ? (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-colors flex items-start gap-2
                      ${selectedConversation?.id === conv.id
                        ? 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                      }
                    `}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedConversation?.id === conv.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <div className="min-w-0">
                      <p className={`text-sm truncate font-medium ${selectedConversation?.id === conv.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {conv.title}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                         2h ago
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 dark:text-zinc-500">No conversations yet</p>
              </div>
            )}
          </div>
          
          {/* Section 3: Bottom Upload Zone */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex-shrink-0">
             <div className="flex items-center justify-between mb-3">
                 <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                     Uploads
                 </h3>
                 {isUploading && <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{Math.round(progress)}%</span>}
             </div>
             
             <button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group mb-3 relative overflow-hidden"
             >
                 {isUploading && (
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute bottom-0 left-0 h-1 bg-zinc-500"
                    />
                 )}
                 {recentUpload ? (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                         className="flex items-center gap-2 text-zinc-500 text-xs font-medium"
                     >
                         <span>— {recentUpload} uploaded</span>
                     </motion.div>
                 ) : (
                    <>
                        <Upload className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                        <span className="text-sm text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-300">
                            {isUploading ? 'Uploading...' : 'Drop files here'}
                        </span>
                    </>
                 )}
             </button>
             
             
          </div>

        </div>
      </motion.div>

      {/* Toggle History Button (when collapsed) */}
      {!historyOpen && (
        <button
          onClick={() => setHistoryOpen(true)}
          className="flex-shrink-0 w-8 border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900">
         {/* DATA GUARD: If no files, show Empty State */}
         {instanceFiles.length === 0 ? (
             <DataMissingState onUploadClick={handleUploadClick} />
         ) : (
             /* Otherwise show Chat */
            <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onSourceClick={handleSourceClick}
            isLoading={isLoading}
            />
         )}
      </div>

      {/* Context Evidence - Right Panel */}
      <ContextEvidence
        source={selectedSource}
        isOpen={!!selectedSource}
        onClose={() => setSelectedSource(null)}
      />
    </div>
  );
}
