import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const location = useLocation();
  const { resendConfirmation, user } = useAuth();
  const email = location.state?.email;
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  if (!email) return <Navigate to="/sign-up" replace />;
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
    <AuthLayout title="Check your email" subtitle="We just sent your verification link.">
      <div className="flex flex-col gap-5">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-border bg-background shadow-sm">
          <Mail size={24} className="text-accent" />
        </div>

        <p className="text-sm leading-relaxed text-secondary">
          We sent a confirmation link to{' '}
          <span className="font-medium text-primary">{email}</span>. Click it to
          finish creating your account — you&apos;ll be signed in automatically.
        </p>

        <div className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-secondary">
          Don&apos;t see it? Check your spam folder, or{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={busy}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {busy ? 'sending…' : 'resend the email'}
          </button>
          .
          {resent && (
            <span className="mt-2 block text-success">Email resent.</span>
          )}
          {error && <span className="mt-2 block text-error">{error}</span>}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-secondary">
        Wrong address?{' '}
        <Link to="/sign-up" className="font-medium text-primary hover:underline">
          Sign up again
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
