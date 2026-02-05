import { useState } from 'react';
import { CreditCard, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUser, mockInstants } from '../../data/mockData';
import RedeemModal from '../../components/RedeemModal';

export default function Billing() {
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const navigate = useNavigate();
  // Force update to reflect balance changes
  const [, setTick] = useState(0);

  const activeInstantCount = mockInstants.filter(i => i.status === 'active').length;
  const estimatedCost = activeInstantCount * 10; // $10 per active instant

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
          Billings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          Manage your subscription controls and credit balance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 min-h-0">
        {/* Card 1: Active Usage */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
            <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                        Active Usage
                    </h2>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Row 1: Active Instants & Cost */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                Total Active Instants
                            </p>
                            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                {activeInstantCount}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                Est. Cost
                            </p>
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                ${estimatedCost.toFixed(2)}
                                <span className="text-xs text-zinc-400 font-medium ml-0.5">/mo</span>
                            </span>
                        </div>
                    </div>

                    {/* Row 2: Prompts */}
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                            Total Number of Prompts
                        </p>
                        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            12,450
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
               <button 
                onClick={() => navigate('/app/billings/history')}
                className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
               >
                   View Usage History &rarr;
               </button>
            </div>
        </div>

        {/* Card 2: System Credits */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
            <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm">
                        <CreditCard className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                        System Credits
                    </h2>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                Credits Available
                            </p>
                             <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                ${mockUser.credits?.toFixed(2)}
                            </span>
                        </div>
                        
                        <div className="text-right">
                             <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                Credits Used (mo)
                            </p>
                             <span className="text-xl font-semibold text-zinc-400">
                                $18.00
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                        Credits are used to renew instants and prompt the data.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-4">
                <button 
                  onClick={() => setIsRedeemOpen(true)}
                  className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-bold hover:bg-black dark:hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-3 h-3" />
                    Top Up Credits
                </button>
            </div>
        </div>
      </div>

      <RedeemModal 
        isOpen={isRedeemOpen} 
        onClose={() => setIsRedeemOpen(false)}
        onSuccess={() => setTick(t => t + 1)} 
      />
    </div>
  );
}
