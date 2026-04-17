import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Account created! Check your email for a verification code.');
      navigate('/verify-email', { state: { username: form.username } });
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const msg = Object.values(errors).flat()[0];
        toast.error(typeof msg === 'string' ? msg : 'Registration failed');
      } else {
        toast.error('Registration failed');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: '#FAFAF7' }}>
      {/* Left panel */}
      <div style={{ background: '#0F172A', padding: 'clamp(40px, 6vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 48, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: '#E84A27', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, color: '#FFFFFF' }}>Inkwell</span>
        </Link>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
          Start writing<br />today.
        </h1>
        <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7 }}>
          Join our community of writers and share your stories with the world.
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['Publish unlimited articles', 'Engage with readers through comments', 'Build your author profile', 'Email verified for security'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94A3B8' }}>
              <div style={{ width: 6, height: 6, background: '#E84A27', borderRadius: '50%', flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vw, 56px)', background: '#FFFFFF', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Create account</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 26 }}>We'll send a verification code to your email</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">First name</label>
                <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="form-input" placeholder="Jane" />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="form-input" placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Username <span style={{ color: '#E84A27' }}>*</span></label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="form-input" placeholder="janedoe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email <span style={{ color: '#E84A27' }}>*</span></label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="jane@email.com" required />
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>A verification code will be sent here</p>
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password <span style={{ color: '#E84A27' }}>*</span></label>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="Min. 6 characters" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password <span style={{ color: '#E84A27' }}>*</span></label>
              <input type="password" value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} className="form-input" placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 18 }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B' }}>
            Already have an account? <Link to="/login" style={{ color: '#E84A27', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
