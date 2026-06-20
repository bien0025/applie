import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const location = useLocation();
  const { resendConfirmation, user } = useAuth();
  const email = location.state?.email;
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  // Hit this URL directly without going through sign-up? Bounce.
  if (!email) return <Navigate to="/sign-up" replace />;
  // Already signed in? Skip the screen entirely.
  if (user) return <Navigate to="/" replace />;

  const handleResend = async () => {
    setError('');
    setBusy(true);
    const { error: resendError } = await resendConfirmation(email);
    setBusy(false);
    if (resendError) {
      setError(resendError.message);
      return;
    }
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <AuthLayout title="Check your email">
      <div className="flex flex-col gap-5">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-neutral-100">
          <Mail size={24} className="text-neutral-700" />
        </div>

        <p className="text-sm leading-relaxed text-neutral-700">
          We sent a confirmation link to{' '}
          <span className="font-medium text-black">{email}</span>. Click it to
          finish creating your account — you'll be signed in automatically.
        </p>

        <div className="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
          Don't see it? Check your spam folder, or{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={busy}
            className="font-medium text-black hover:underline disabled:opacity-50"
          >
            {busy ? 'sending…' : 'resend the email'}
          </button>
          .
          {resent && (
            <span className="mt-1 block text-green-700">Email resent.</span>
          )}
          {error && <span className="mt-1 block text-red-600">{error}</span>}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Wrong address?{' '}
        <Link to="/sign-up" className="font-medium text-black hover:underline">
          Sign up again
        </Link>
      </p>
    </AuthLayout>
  );
}
