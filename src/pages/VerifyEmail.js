import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { BookOpen, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!username) navigate('/register');
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) { toast.error('Please enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await authAPI.verifyEmail({ username, code });
      setVerified(true);
      toast.success('Email verified!');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendVerification({ username });
      toast.success('New code sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not resend code');
    } finally { setResending(false); }
  };

  if (verified) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF7' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ width: 64, height: 64, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#059669' }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Email verified!</h2>
          <p style={{ color: '#64748B', fontSize: 15 }}>Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: '#FAFAF7' }}>
      <div style={{ background: '#0F172A', padding: 'clamp(40px, 6vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, background: '#E84A27', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, color: '#FFFFFF' }}>Inkwell</span>
        </Link>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
          Check your<br />inbox.
        </h1>
        <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7 }}>
          We sent a 6-digit code to your email address to confirm your account.
        </p>
        <div style={{ marginTop: 32, padding: '16px 20px', background: '#1E293B', borderRadius: 10, border: '1px solid #334155' }}>
          <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
            The code expires in <strong style={{ color: '#E2E8F0' }}>30 minutes</strong>. Check your spam folder if you don't see it.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vw, 64px)', background: '#FFFFFF' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Enter your code</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>
            Sent to the email for <strong style={{ color: '#0F172A' }}>@{username}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">6-digit verification code</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input"
                placeholder="000000"
                maxLength={6}
                style={{ fontSize: 28, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading || code.length !== 6} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 14 }}>
              {loading ? 'Verifying…' : 'Verify email'}
            </button>
          </form>

          <div style={{ textAlign: 'center', paddingTop: 14, borderTop: '1.5px solid #F4F4F0' }}>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 10 }}>Didn't receive the code?</p>
            <button onClick={handleResend} disabled={resending} className="btn btn-ghost btn-sm" style={{ color: '#E84A27' }}>
              <RefreshCw size={14} />{resending ? 'Sending…' : 'Resend code'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 20 }}>
            Wrong account? <Link to="/register" style={{ color: '#E84A27', fontWeight: 700 }}>Register again</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
