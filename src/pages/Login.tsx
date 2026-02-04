import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.length > 0 && formData.password.length > 0) {
        setIsLoading(true);
        // Simulate login
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        navigate('/app/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card padding="lg" className="border-zinc-700">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Sign in to access your instants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-400">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-sm border-zinc-700 bg-zinc-900 text-zinc-50 focus:ring-zinc-500"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign in
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-zinc-300 hover:text-zinc-100 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
