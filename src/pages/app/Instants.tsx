import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import InstantCard from '../../components/InstantCard';
import CreateInstantModal from '../../components/CreateInstantModal';
import { mockInstants, addInstant, type Instant } from '../../data/mockData';

export default function Instants() {
  const [instants, setInstants] = useState<Instant[]>(mockInstants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInstantCreated = (newInstant: Instant) => {
    addInstant(newInstant);
    setInstants([newInstant, ...instants]);
    setIsModalOpen(false);
    navigate(`/app/instant/${newInstant.id}/dashboard`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Manage your secure data Instants
          </p>
        </div>
        
        <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
        >
            <Plus className="w-4 h-4" />
            Create Instant
        </button>
      </div>

      {/* Grid Layout */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        {instants.map((instant) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key={instant.id}
          >
            <InstantCard 
                instant={instant} 
                onDelete={() => {
                    setInstants(prev => prev.filter(i => i.id !== instant.id));
                }}
                onStatusChange={(newStatus) => {
                    setInstants(prev => prev.map(i => i.id === instant.id ? { ...i, status: newStatus } : i));
                }}
            />
          </motion.div>
        ))}
        
      </motion.div>

      {/* Helper Modal */}
      <CreateInstantModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleInstantCreated}
      />
    </div>
  );
}
