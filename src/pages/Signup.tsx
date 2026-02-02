import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orgName: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/app/instances');
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
            Create your account
          </h1>
          <p className="text-sm text-zinc-500">
            Start building your data context engine
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Work email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label="Organization name"
            type="text"
            placeholder="Acme Corporation"
            value={formData.orgName}
            onChange={(e) =>
              setFormData({ ...formData, orgName: e.target.value })
            }
            hint="This will be your workspace name"
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
            hint="At least 8 characters"
            required
          />

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-zinc-500 text-center">
            By signing up, you agree to our{' '}
            <a href="#" className="text-zinc-400 hover:text-zinc-200">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-zinc-400 hover:text-zinc-200">
              Privacy Policy
            </a>
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-zinc-300 hover:text-zinc-100 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
