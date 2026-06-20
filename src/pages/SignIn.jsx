import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignIn() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: signInError } = await signIn(email, password);
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to Applie.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-xs text-error">{error}</p>}

        <Button type="submit" disabled={busy} className="mt-2 w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/sign-up" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>

      <p className="mt-6 flex items-center justify-center gap-3 text-xs text-subtle">
        <Link to="/about" className="hover:text-primary hover:underline">
          About
        </Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-primary hover:underline">
          Privacy policy
        </Link>
      </p>
    </AuthLayout>
  );
}
