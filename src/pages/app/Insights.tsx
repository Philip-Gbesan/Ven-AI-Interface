import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Insights() {
  const navigate = useNavigate();
  // Mock bookmarks data
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      query: "Analyze the termination clauses in the employee agreement.",
      insight: "The agreement specifies a 30-day notice period for voluntary termination. For cause, immediate termination is permitted without severance.",
      sourceInstance: "Legal Documents",
      instanceId: "inst-1",
      date: "2 hours ago"
    },
    {
      id: 2,
      query: "What is the projected revenue growth for Q3?",
      insight: "Based on the Q2 financial report, Q3 is projected to grow by 15% YoY, driven primarily by the enterprise segment expansion.",
      sourceInstance: "Financial Reports",
      instanceId: "inst-2",
      date: "Yesterday"
    },
     {
      id: 3,
      query: "Summary of patient data privacy requirements",
      insight: "HIPAA compliance requires all patient records to be encrypted at rest and in transit. Access logs must be maintained for 6 years.",
      sourceInstance: "Healthcare Records",
      instanceId: "inst-3",
      date: "3 days ago"
    }
  ]);

  const removeBookmark = (e: React.MouseEvent, id: number) => {
      e.stopPropagation(); // prevent card click
      setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleCardClick = (instanceId: string) => {
      navigate(`/app/instant/${instanceId}/chat`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
          Insights
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          Saved intelligence and key findings from your secure data contexts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
        {bookmarks.map((item, index) => (
          <motion.div
            key={item.id}
            layout // animate layout changes when items are removed
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleCardClick(item.instanceId)}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                </div>
                <button 
                    onClick={(e) => removeBookmark(e, item.id)}
                    className="text-purple-400 hover:text-zinc-300 dark:text-purple-400/50 dark:hover:text-zinc-500 transition-colors"
                    title="Remove Bookmark"
                >
                    <Bookmark className="w-5 h-5 fill-current" />
                </button>
            </div>

            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
                "{item.query}"
            </h3>
            
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 mb-4 group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-800 transition-colors">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                    {item.insight}
                </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <MessageSquare className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{item.sourceInstance}</span>
                </div>
                <div className="text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Open Context
                    <ArrowRight className="w-3 h-3" />
                </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {bookmarks.length === 0 && (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 border-dashed">
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400 dark:text-zinc-500">
                  <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">No saved insights</p>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm">Bookmark AI responses in the chat interface to save them here.</p>
          </div>
      )}
    </div>
  );
}
