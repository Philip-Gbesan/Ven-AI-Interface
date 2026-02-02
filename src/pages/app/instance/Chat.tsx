import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import ChatPanel from '../../../components/ChatPanel';
import ContextEvidence from '../../../components/ContextEvidence';
import Button from '../../../components/ui/Button';
import {
  getInstanceById,
  getConversationsByInstance,
} from '../../../data/mockData';
import type { ChatMessage, ChatSource, Conversation } from '../../../data/mockData';

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const instance = getInstanceById(id || '');
  const conversations = getConversationsByInstance(id || '');

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversations[0]?.messages || []
  );
  const [selectedSource, setSelectedSource] = useState<ChatSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);

  if (!instance) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Instance not found</p>
      </div>
    );
  }

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      instanceId: id || '',
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
      {
        id: `src-${Date.now()}-2`,
        fileId: 'file-2',
        fileName: 'NDA_Standard.docx',
        snippet:
          'Additional context from another document in your private container. This snippet provides supporting information that complements the primary source.',
        chunkIndex: Math.floor(Math.random() * 50),
        relevanceScore: 0.85,
      },
    ];

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      instanceId: id || '',
      role: 'assistant',
      content: `Based on the documents in your private container, I found relevant information to answer your question.

The key findings from your uploaded data indicate that [Source 1]:

1. **Primary insight**: The documents contain specific provisions related to your query that are worth noting.

2. **Supporting context**: Additional documentation [Source 2] provides complementary information that helps complete the picture.

Please note that this response is generated strictly from your uploaded data within this isolated instance.`,
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

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      {/* Conversation History - Left Panel */}
      <motion.div
        initial={{ width: historyOpen ? 280 : 0 }}
        animate={{ width: historyOpen ? 280 : 0 }}
        className="flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden"
      >
        <div className="h-full flex flex-col w-[280px]">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                History
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

          {/* Conversation List */}
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

      {/* Chat Panel - Center */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onSourceClick={handleSourceClick}
          isLoading={isLoading}
        />
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
