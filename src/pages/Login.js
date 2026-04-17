import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form);
      toast.success(`Welcome back, ${u.first_name || u.username}!`);
      navigate(u.is_admin ? '/admin' : '/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && detail.toLowerCase().includes('active')) {
        toast.error('Please verify your email first.');
      } else {
        toast.error('Incorrect username or password');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: '#FAFAF7' }}>
      {/* Left */}
      <div style={{ background: '#0F172A', padding: 'clamp(40px, 6vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 48, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: '#E84A27', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, color: '#FFFFFF' }}>Inkwell</span>
        </Link>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
          Good to see<br />you again.
        </h1>
        <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7 }}>
          Sign in and pick up where you left off.
        </p>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vw, 64px)', background: '#FFFFFF' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Sign in</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>Enter your credentials below</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="form-input" placeholder="your username" required autoFocus />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 18 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: '#64748B', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo accounts</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ label: 'Admin', u: 'admin', p: 'admin123' }, { label: 'User', u: 'anita', p: 'user123' }].map(d => (
                <button key={d.label} type="button" onClick={() => setForm({ username: d.u, password: d.p })}
                  style={{ flex: 1, background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 6, padding: '8px 10px', fontSize: 12, cursor: 'pointer', color: '#374151', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                  {d.label}: <span style={{ color: '#E84A27' }}>{d.u}</span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B' }}>
            No account? <Link to="/register" style={{ color: '#E84A27', fontWeight: 700 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
