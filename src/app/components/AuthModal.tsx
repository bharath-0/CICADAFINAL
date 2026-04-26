import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'signin' | 'signup') => void;
  onSignIn: (email: string, password: string) => Promise<string | null>;
  onSignUp: (name: string, email: string, password: string) => Promise<string | null>;
}

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
  onSignIn,
  onSignUp,
}: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let err: string | null = null;
      if (mode === 'signin') {
        err = await onSignIn(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        err = await onSignUp(name, email, password);
      }
      if (err) setError(err);
      else onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-2xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-brand-primary p-1"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-['Syne'] font-bold text-brand-primary mb-1">
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {mode === 'signin'
            ? 'Sign in to continue to CICADA'
            : 'Join CICADA for a personalized experience'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Field label="Full Name" icon={UserIcon}>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="auth-input"
              />
            </Field>
          )}

          <Field label="Email" icon={Mail}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
              autoComplete="email"
            />
          </Field>

          <Field label="Password" icon={Lock}>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signin' ? 'Your password' : 'Min 6 characters'}
              className="auth-input"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </Field>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => onSwitchMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-brand-accent font-semibold hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <style>{`
          .auth-input {
            width: 100%;
            padding: 0.75rem 0.75rem 0.75rem 2.5rem;
            border: 1px solid rgba(26,26,46,0.1);
            border-radius: 0.5rem;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s;
          }
          .auth-input:focus {
            border-color: #E94560;
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-text-secondary mb-1">{label}</span>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        {children}
      </div>
    </label>
  );
}
