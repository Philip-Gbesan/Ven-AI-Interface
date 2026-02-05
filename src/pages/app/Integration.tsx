import { Terminal, Mail, ArrowRight, Layers, Box, Cpu, Network, ShieldCheck, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Integration() {
  const apis = [
    { icon: Terminal, name: "Rest API", desc: "Full endpoints for instant management." },
    { icon: Network, name: "WebSocket", desc: "Real-time stream for chat completions." },
    { icon: Database, name: "Vector Store", desc: "Direct access to embedded chunks." },
    { icon: ShieldCheck, name: "Auth", desc: "Enterprise SSO and key management." },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Integrations
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg max-w-2xl">
                Connect Ven AI with your existing enterprise build.
            </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-sm">
           
           <div className="flex flex-col md:flex-row gap-12">
               {/* Left: Info */}
               <div className="flex-1 space-y-8">
                    <div className="inline-flex p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-2">
                        <Layers className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            Available API Endpoints
                        </h2>
                         <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                           Our system exposes a comprehensive set of endpoints for managing Instants, uploading data, and streaming completions. Custom integrations require a verified enterprise environment.
                       </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {apis.map((api) => (
                            <div key={api.name} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <api.icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{api.name}</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">{api.desc}</p>
                            </div>
                        ))}
                    </div>
               </div>

               {/* Right: CTA */}
               <div className="flex-1 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-8 flex flex-col justify-center text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800">
                        <Cpu className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                            Custom Build Required
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            To maintain security protocols, external API access is restricted to Dedicated Node deployments.
                        </p>
                    </div>
                     <a 
                        href="mailto:support@venai.io?subject=Enterprise Integration Request" 
                        className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-black dark:hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-none"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </a>
               </div>
           </div>

        </div>
      </motion.div>
    </div>
  );
}
