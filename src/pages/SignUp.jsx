import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';

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
    // The metadata object is stored on user.user_metadata in Supabase.
    const { data, error: signUpError } = await signUp(form.email, form.password, {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // If email confirmation is required, Supabase returns a user without a session.
    // Send them to a dedicated screen so they know what to do next.
    if (data?.user && !data?.session) {
      navigate('/verify-email', {
        state: { email: form.email },
        replace: true,
      });
      return;
    }
    navigate('/', { replace: true });
  };

  const fieldClass =
    'rounded border border-neutral-300 px-3 py-2 text-sm text-black outline-none focus:border-black';
  const labelClass = 'flex flex-col gap-1.5';
  const labelText = 'text-xs font-medium text-neutral-700';

  return (
    <AuthLayout title="Create account" subtitle="Start tracking your applications.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            <span className={labelText}>First name</span>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={update('firstName')}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            <span className={labelText}>Last name</span>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={update('lastName')}
              className={fieldClass}
            />
          </label>
        </div>

        <label className={labelClass}>
          <span className={labelText}>Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelText}>Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
            className={fieldClass}
          />
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {info && <p className="text-xs text-green-700">{info}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 rounded bg-black px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-medium text-black hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
