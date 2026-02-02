import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Database,
  MessageSquare,
  ArrowRight,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Landing() {
  const features = [
    {
      icon: Shield,
      title: 'Private Containers',
      description:
        'Your data stays isolated in secure containers with strict access controls.',
    },
    {
      icon: Database,
      title: 'Intelligent Indexing',
      description:
        'Advanced chunking and embedding of your documents for precise retrieval.',
    },
    {
      icon: MessageSquare,
      title: 'Natural Language Queries',
      description:
        'Ask questions in plain English and get accurate answers from your data.',
    },
    {
      icon: Lock,
      title: 'Zero Data Leakage',
      description:
        'Answers are generated strictly from your uploaded data. Nothing else.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-50 rounded-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">
              VEN AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 mb-6">
              <Layers className="w-3.5 h-3.5" />
              Data Context Engine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-50 tracking-tight leading-tight mb-6">
              Query Your Private Data
              <br />
              <span className="text-zinc-400">With Intelligence</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Upload your internal documents into isolated containers. Ven AI
              chunks, embeds, and indexes your data so you can retrieve answers
              with natural language—privately and securely.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Demo */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
            <div className="border border-zinc-800 rounded-sm bg-zinc-900 p-1 shadow-2xl shadow-black/50">
              <div className="bg-zinc-950 rounded-sm p-6">
                {/* Mock Dashboard Preview */}
                <div className="flex gap-4">
                  {/* Sidebar Mock */}
                  <div className="w-48 border-r border-zinc-800 pr-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-zinc-800 rounded-sm" />
                      <div className="h-3 w-20 bg-zinc-800 rounded" />
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-8 rounded-sm ${
                            i === 1 ? 'bg-zinc-800' : 'bg-zinc-900'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Main Content Mock */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-4 h-4 text-zinc-600" />
                      <div className="flex-1 h-8 bg-zinc-900 border border-zinc-800 rounded-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-24 bg-zinc-900 border border-zinc-800 rounded-sm p-3"
                        >
                          <div className="h-3 w-16 bg-zinc-800 rounded mb-2" />
                          <div className="h-8 w-full bg-zinc-800 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight mb-4">
              Built for Privacy-First Intelligence
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Every feature is designed with data isolation and security at its
              core.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="p-6 border border-zinc-800 bg-zinc-900/50 rounded-sm hover:border-zinc-700 transition-colors"
              >
                <div className="w-10 h-10 bg-zinc-800 rounded-sm flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight mb-4">
            Ready to Query Your Data?
          </h2>
          <p className="text-zinc-400 mb-8">
            Start building your private data context engine today.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Create Your First Instance
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-zinc-600" />
            <span className="text-xs text-zinc-600">Ven AI</span>
          </div>
          <p className="text-xs text-zinc-600">
            © 2024 Ven AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
