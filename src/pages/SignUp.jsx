import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignUp() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    const { data, error: signUpError } = await signUp(form.email, form.password, {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data?.user && !data?.session) {
      navigate('/verify-email', {
        state: { email: form.email },
        replace: true,
      });
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout title="Create account" subtitle="Start tracking your applications.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            required
            value={form.firstName}
            onChange={update('firstName')}
            placeholder="Obed"
          />
          <Input
            label="Last name"
            required
            value={form.lastName}
            onChange={update('lastName')}
            placeholder="Bien-Aime"
          />
        </div>

        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={update('email')}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={update('password')}
          placeholder="••••••••"
        />

        {error && <p className="text-xs text-error">{error}</p>}
        {info && <p className="text-xs text-success">{info}</p>}

        <Button type="submit" disabled={busy} className="mt-2 w-full">
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
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
