import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { mockUser } from '../../data/mockData';

// Mock Transaction History
const TRANSACTIONS = [
    { id: 'tx-102', instantName: 'Research Papers', date: 'Feb 04, 2026', amount: -10.00, expiry: 'Mar 04, 2026', status: 'Active' },
    { id: 'tx-101', instantName: 'System Top Up', date: 'Feb 01, 2026', amount: +50.00, expiry: '-', status: 'Success' },
    { id: 'tx-100', instantName: 'Legal Documents', date: 'Jan 28, 2026', amount: -10.00, expiry: 'Feb 28, 2026', status: 'Expired' },
];

export default function UsageHistory() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            Usage History
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Transaction logs for your account ({mockUser.email}).
            </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
        </button>
      </div>

      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden"
      >
          <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Instant Name / Desc</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Billing Date</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {tx.instantName}
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                              {tx.date}
                          </td>
                          <td className={`px-6 py-4 text-sm font-bold text-right tabular-nums ${
                              tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-zinc-100'
                          }`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                              {tx.expiry}
                          </td>
                          <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                  tx.status === 'Active' || tx.status === 'Success'
                                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                              }`}>
                                  {tx.status}
                              </span>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </motion.div>
    </div>
  );
}
