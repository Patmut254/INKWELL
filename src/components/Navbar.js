import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, PenSquare, LogOut, User, Shield, BookOpen, Search, Mail } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/?search=${encodeURIComponent(search)}`); setSearch(''); setMenuOpen(false); }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '1.5px solid #E2E2DA', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, background: '#E84A27', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, color: '#0F172A', letterSpacing: '-0.01em' }}>Inkwell</span>
          </Link>

          <form onSubmit={handleSearch} className="nav-search" style={{ flex: 1, maxWidth: 300, margin: '0 24px', display: 'flex', alignItems: 'center', background: '#F4F4F0', borderRadius: 6, padding: '8px 14px', gap: 8 }}>
            <Search size={15} color="#94A3B8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13, color: '#0F172A', fontFamily: 'Inter, sans-serif' }} />
          </form>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link to="/contact" className="btn btn-ghost btn-sm" style={{ color: isActive('/contact') ? '#0F172A' : '#64748B' }}>
              <Mail size={14} /> Contact
            </Link>
            {user ? (
              <>
                <Link to="/create" className="btn btn-primary btn-sm"><PenSquare size={14} /> Write</Link>
                <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ color: isActive('/dashboard') ? '#0F172A' : '#64748B' }}>
                  <User size={14} /> Dashboard
                </Link>
                {user.is_admin && (
                  <Link to="/admin" className="btn btn-ghost btn-sm" style={{ color: '#6D28D9' }}>
                    <Shield size={14} /> Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-ghost btn-sm"><LogOut size={14} /></button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile-btn btn btn-ghost" style={{ display: 'none', padding: 8 }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ borderTop: '1.5px solid #E2E2DA', background: '#FFFFFF', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#F4F4F0', borderRadius: 6, padding: '8px 14px', gap: 8, marginBottom: 6 }}>
            <Search size={15} color="#94A3B8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13, fontFamily: 'Inter, sans-serif' }} />
          </form>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}><Mail size={15} /> Contact</Link>
          {user ? (
            <>
              <Link to="/create" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center' }}><PenSquare size={15} /> Write Article</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}><User size={15} /> Dashboard</Link>
              {user.is_admin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: '#6D28D9' }}><Shield size={15} /> Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}><LogOut size={15} /> Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: 'center' }}>Sign in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center' }}>Get started</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-search { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
