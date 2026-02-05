import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, UploadCloud, ChevronDown, Mail, Info } from 'lucide-react';
import { mockInstants } from '../data/mockData';
import { useToast } from './ui/Toast';

interface RemoteUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RemoteUploadModal({ isOpen, onClose }: RemoteUploadModalProps) {
  const [selectedInstantId, setSelectedInstantId] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmailInput, setCurrentEmailInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addToast } = useToast();

  // Filter only active instants
  const activeInstants = mockInstants.filter(i => i.status === 'active');
  const selectedInstant = activeInstants.find(i => i.id === selectedInstantId);

  const handleAddEmail = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentEmailInput.trim() && !emails.includes(currentEmailInput.trim())) {
        setEmails([...emails, currentEmailInput.trim()]);
        setCurrentEmailInput('');
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const generateLink = () => {
    if (!selectedInstantId) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        const link = `https://venai.io/upload/${selectedInstantId}/${Math.random().toString(36).substring(7)}`;
        setGeneratedLink(link);
        setIsLoading(false);
        console.log('Generated Link:', link, 'For Emails:', emails);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    addToast({ type: 'success', title: 'Copied', message: 'Upload link copied to clipboard.' });
  };

  const reset = () => {
      setGeneratedLink('');
      setEmails([]);
      setSelectedInstantId('');
      onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <UploadCloud className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Remote Upload Link
                    </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {!generatedLink ? (
                    <>
                        {/* Step 1: Select Instant */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Target Instant
                            </label>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full text-left px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <span className={selectedInstant ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
                                    {selectedInstant?.name || 'Select specific data context...'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto"
                                    >
                                        {activeInstants.map(instant => (
                                            <button
                                                key={instant.id}
                                                onClick={() => {
                                                    setSelectedInstantId(instant.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                                            >
                                                <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                                                    {instant.name}
                                                </span>
                                                {selectedInstantId === instant.id && (
                                                    <Check className="w-4 h-4 text-blue-500" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Step 2: Emails */}
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                                Recipient Emails
                                <span className="text-xs font-normal text-zinc-400">Optional</span>
                            </label>
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                {emails.map(email => (
                                    <span key={email} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                                        {email}
                                        <button onClick={() => removeEmail(email)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={currentEmailInput}
                                    onChange={(e) => setCurrentEmailInput(e.target.value)}
                                    onKeyDown={handleAddEmail}
                                    placeholder={emails.length === 0 ? "Enter email addresses..." : ""}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-900 dark:text-zinc-100 min-w-[120px] p-1"
                                />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Press Enter or Comma to add multiple recipients.
                            </p>
                        </div>

                        {/* Info Note */}
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg flex gap-3 items-start border border-zinc-100 dark:border-zinc-800">
                            <Info className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                This link grants temporary write-only access to <strong>{selectedInstant?.name || 'the selected instant'}</strong>. The link will expire automatically in 24 hours.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="py-6 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 dark:text-green-400">
                             <Check className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Link Generated Successfully</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
                                Share this secure link with your external collaborators.
                            </p>
                        </div>
                         
                        <div className="w-full flex items-center gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-3">
                            <code className="flex-1 text-sm text-zinc-600 dark:text-zinc-300 font-mono truncate text-left">
                                {generatedLink}
                            </code>
                            <button 
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-md shadow-sm transition-all text-zinc-600 dark:text-zinc-300"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
              </div>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex justify-end gap-3">
                {generatedLink ? (
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Done
                    </button>
                ) : (
                    <>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={generateLink}
                            disabled={!selectedInstantId || isLoading}
                            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? 'Generating...' : 'Generate Link'}
                            {!isLoading && <Mail className="w-4 h-4" />}
                        </button>
                    </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
