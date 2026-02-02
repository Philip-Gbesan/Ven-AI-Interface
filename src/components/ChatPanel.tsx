import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Bot, 
    User, 
    Loader2, 
    Paperclip, 
    MoreHorizontal,
    Copy,
    RotateCcw,
    Bookmark,
    Pencil,
    Check
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import type { ChatMessage } from '../data/mockData';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onSourceClick: (source: any) => void;
}

export default function ChatPanel({ messages, onSendMessage, isLoading, onSourceClick }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  // Helper to parse citations for display
  const renderContent = (content: string, sources?: any[]) => {
    if (!sources || sources.length === 0) return <p className="leading-relaxed whitespace-pre-wrap">{content}</p>;

    const parts = content.split(/(\[Source \d+\])/g);
    return (
      <p className="leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          const match = part.match(/\[Source (\d+)\]/);
          if (match) {
            const index = parseInt(match[1]);                  
            const source = sources[index];
            if (source) {
              return (
                <button
                  key={i}
                  onClick={() => onSourceClick(source)}
                  className="inline-flex items-center gap-0.5 mx-1 px-1.5 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors -translate-y-0.5"
                >
                  Source {index + 1}
                </button>
              );
            }
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      addToast({ type: 'success', title: 'Copied', message: 'Message copied to clipboard.' });
  };

  const handleBookmark = () => {
      addToast({ type: 'success', title: 'Saved', message: 'Message added to Insights.' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
               <Bot className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-4" />
               <p className="text-zinc-500 dark:text-zinc-400 font-medium">Start a new conversation</p>
               <p className="text-sm text-zinc-400 dark:text-zinc-500">Ask questions about your uploaded documents</p>
           </div>
        ) : (
            <>
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`group flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Content */}
                    <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Name & Time */}
                        <div className={`flex items-center gap-2 mb-1 text-xs text-zinc-400 dark:text-zinc-500 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">{msg.role === 'user' ? 'You' : 'Ven AI'}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Message Bubble */}
                        <div className={`rounded-2xl p-4 shadow-sm relative group/bubble ${
                            msg.role === 'user' 
                                ? 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-tr-none' 
                                : 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                        }`}>
                            {renderContent(msg.content, msg.sources)}
                        </div>

                        {/* Message Actions (V5) */}
                         <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <button onClick={() => copyToClipboard(msg.content)} className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Copy">
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                            
                            {msg.role === 'user' && (
                                <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Edit">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {msg.role === 'assistant' && (
                                <>
                                    <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Regenerate">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <BookmarkButton onClick={handleBookmark} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                ))}
            </>
        )}
        
        {isLoading && (
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">Analyzing documents...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
         <div className="max-w-4xl mx-auto relative">
             <form onSubmit={handleSubmit} className="relative">
                <div className="absolute left-3 top-3">
                    <button type="button" className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                </div>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Ask anything about your data..."
                    className="w-full pl-14 pr-14 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-all resize-none min-h-[60px] max-h-[200px]"
                    rows={1}
                />
                <div className="absolute right-3 top-3">
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
             </form>
             <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                 AI can make mistakes. Verify important information.
             </p>
         </div>
      </div>
    </div>
  );
}

// Separated Bookmark Button for toggling state
function BookmarkButton({ onClick }: { onClick: () => void }) {
    const [bookmarked, setBookmarked] = useState(false);

    const handleClick = () => {
        setBookmarked(!bookmarked);
        if (!bookmarked) onClick();
    };

    return (
        <button 
            onClick={handleClick}
            className={`p-1.5 rounded-md transition-colors ${
                bookmarked 
                    ? 'text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700' 
                    : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800'
            }`} 
            title={bookmarked ? "Remove Bookmark" : "Bookmark"}
        >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
    );
}
