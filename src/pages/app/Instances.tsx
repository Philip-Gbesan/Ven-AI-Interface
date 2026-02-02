import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import InstanceCard from '../../components/InstanceCard';
import CreateInstanceModal from '../../components/CreateInstanceModal';
import { mockInstances, type Instance } from '../../data/mockData';

export default function Instances() {
  const [instances, setInstances] = useState<Instance[]>(mockInstances);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInstanceCreated = (newInstance: Instance) => {
    setInstances([...instances, newInstance]);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Manage your secure data environments
          </p>
        </div>
        
        <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
        >
            <Plus className="w-4 h-4" />
            Create Instance
        </button>
      </div>

      {/* Instance Grid - V6: auto-rows-fr for equal height */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr"
      >
        {/* Existing Instances */}
        {instances.map((instance, index) => (
          <motion.div
            key={instance.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[380px] h-full" 
          >
            <InstanceCard instance={instance} />
          </motion.div>
        ))}

        {/* Add Instance Card - V6: h-full matches grid row height, triggers modal */}
        <button onClick={() => setIsModalOpen(true)} className="group block min-w-[380px] h-full w-full text-left">
          <div className="h-45 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer ">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200">
               <Plus className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
            </div>
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">
              Create New Instance
            </span>
          </div>
        </button>
      </motion.div>

      {/* Helper Modal */}
      <CreateInstanceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleInstanceCreated}
      />
    </div>
  );
}
