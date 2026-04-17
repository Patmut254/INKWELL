import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, postsAPI, categoriesAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Tag, Shield, Trash2, Eye, EyeOff, Plus, Edit2, Mail, BarChart2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catForm, setCatForm] = useState({ name: '', color: '#E84A27', description: '' });
  const [editingCat, setEditingCat] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, p, c, ct, st] = await Promise.all([
        adminAPI.getUsers(), postsAPI.getAll(), categoriesAPI.getAll(),
        adminAPI.getContacts(), adminAPI.getStats()
      ]);
      setUsers(u.data); setPosts(p.data); setCategories(c.data);
      setContacts(ct.data); setStats(st.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!user?.is_admin) { navigate('/'); return; }
    loadAll();
  }, [user, navigate, loadAll]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await adminAPI.deleteUser(id); setUsers(p => p.filter(u => u.id !== id)); toast.success('User deleted'); }
    catch { toast.error('Failed to delete user'); }
  };

  const handleToggleStaff = async (id) => {
    try { const res = await adminAPI.toggleStaff(id); setUsers(p => p.map(u => u.id === id ? res.data : u)); toast.success('Role updated'); }
    catch { toast.error('Failed to update role'); }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try { await postsAPI.delete(id); setPosts(p => p.filter(x => x.id !== id)); toast.success('Post deleted'); }
    catch { toast.error('Failed to delete post'); }
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        const res = await categoriesAPI.update(editingCat.id, catForm);
        setCategories(p => p.map(c => c.id === editingCat.id ? res.data : c));
        toast.success('Category updated');
      } else {
        const res = await categoriesAPI.create(catForm);
        setCategories(p => [...p, res.data]);
        toast.success('Category created');
      }
      setCatForm({ name: '', color: '#E84A27', description: '' }); setEditingCat(null); setShowCatForm(false);
    } catch { toast.error('Failed to save category'); }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await categoriesAPI.delete(id); setCategories(p => p.filter(c => c.id !== id)); toast.success('Category deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const handleMarkRead = async (id) => {
    try { await adminAPI.markContactRead(id); setContacts(p => p.map(c => c.id === id ? { ...c, is_read: true } : c)); }
    catch { toast.error('Failed'); }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
    { key: 'users', label: 'Users', icon: <Users size={14} />, count: users.length },
    { key: 'posts', label: 'Posts', icon: <FileText size={14} />, count: posts.length },
    { key: 'categories', label: 'Categories', icon: <Tag size={14} />, count: categories.length },
    { key: 'contacts', label: 'Messages', icon: <Mail size={14} />, count: contacts.filter(c => !c.is_read).length },
  ];

  const TH = ({ children }) => (
    <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', background: '#F8FAFC', borderBottom: '1.5px solid #E2E2DA', whiteSpace: 'nowrap' }}>{children}</th>
  );
  const TD = ({ children, style }) => (
    <td style={{ padding: '13px 16px', borderBottom: '1px solid #F4F4F0', fontSize: 13, ...style }}>{children}</td>
  );

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      <div style={{ background: '#0F172A', padding: '36px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: '#6D28D9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 22, color: '#FFFFFF' }}>Admin Panel</h1>
              <p style={{ color: '#475569', fontSize: 13 }}>Manage users, posts, and content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div style={{ display: 'flex', gap: 2, background: '#F4F4F0', borderRadius: 8, padding: 3, marginBottom: 20, overflowX: 'auto', border: '1.5px solid #E2E2DA', width: 'fit-content', maxWidth: '100%' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === t.key ? '#FFFFFF' : 'transparent', color: tab === t.key ? '#0F172A' : '#64748B', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
              {t.icon}{t.label}
              {t.count !== undefined && t.count > 0 && (
                <span style={{ background: tab === t.key ? '#0F172A' : '#E2E2DA', color: tab === t.key ? '#FFF' : '#94A3B8', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 12, overflow: 'hidden' }}>

            {/* OVERVIEW */}
            {tab === 'overview' && stats && (
              <div style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Platform Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
                  {[
                    { label: 'Total users', value: stats.total_users, color: '#6D28D9' },
                    { label: 'Total posts', value: stats.total_posts, color: '#E84A27' },
                    { label: 'Published', value: stats.published_posts, color: '#059669' },
                    { label: 'Comments', value: stats.total_comments, color: '#DB2777' },
                    { label: 'Total views', value: stats.total_views, color: '#1D4ED8' },
                    { label: 'Categories', value: stats.total_categories, color: '#0D9488' },
                    { label: 'Unread msgs', value: stats.unread_messages, color: '#F59E0B' },
                  ].map((s, i) => (
                    <div key={i} style={{ border: '1.5px solid #E2E2DA', borderRadius: 10, padding: '16px 18px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, marginBottom: 10 }} />
                      <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 26, color: '#0F172A' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#FAFAF7', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: '16px 20px' }}>
                  <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>
                    <strong style={{ color: '#0F172A' }}>Contact:</strong> jehu.anita@gmail.com · +254 714 676 921
                  </p>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #E2E2DA' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 16 }}>All users</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><TH>User</TH><TH>Email</TH><TH>Posts</TH><TH>Verified</TH><TH>Role</TH><TH>Joined</TH><TH>Actions</TH></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <TD>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.username}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%', background: '#F4F4F0', border: '1px solid #E2E2DA' }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{u.first_name ? `${u.first_name} ${u.last_name}` : u.username}</div>
                                <div style={{ fontSize: 11, color: '#94A3B8' }}>@{u.username}</div>
                              </div>
                            </div>
                          </TD>
                          <TD style={{ color: '#64748B' }}>{u.email}</TD>
                          <TD><span style={{ fontWeight: 700, color: '#0F172A' }}>{u.post_count}</span></TD>
                          <TD><span className="badge" style={{ background: u.profile?.is_email_verified ? '#D1FAE5' : '#FEF3C7', color: u.profile?.is_email_verified ? '#065F46' : '#92400E' }}>{u.profile?.is_email_verified ? 'Yes' : 'No'}</span></TD>
                          <TD><span className="badge" style={{ background: u.is_admin ? '#EDE9FE' : '#F4F4F0', color: u.is_admin ? '#4C1D95' : '#64748B' }}>{u.is_admin ? 'Admin' : 'User'}</span></TD>
                          <TD style={{ color: '#94A3B8', whiteSpace: 'nowrap' }}>{formatDistanceToNow(new Date(u.date_joined), { addSuffix: true })}</TD>
                          <TD>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => handleToggleStaff(u.id)} className="btn btn-ghost btn-xs" title={u.is_admin ? 'Remove admin' : 'Make admin'}>{u.is_admin ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                              {u.id !== user.id && <button onClick={() => handleDeleteUser(u.id)} className="btn btn-ghost btn-xs" style={{ color: '#DC2626' }}><Trash2 size={13} /></button>}
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* POSTS */}
            {tab === 'posts' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #E2E2DA' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 16 }}>All posts</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><TH>Title</TH><TH>Author</TH><TH>Category</TH><TH>Status</TH><TH>Views</TH><TH>Date</TH><TH>Delete</TH></tr></thead>
                    <tbody>
                      {posts.map(p => (
                        <tr key={p.id}>
                          <TD><span style={{ fontWeight: 700, color: '#0F172A', display: 'block', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span></TD>
                          <TD style={{ color: '#64748B' }}>{p.author?.username}</TD>
                          <TD>{p.category ? <span className="badge" style={{ background: '#F4F4F0', color: '#374151' }}>{p.category.name}</span> : <span style={{ color: '#CBD5E1' }}>—</span>}</TD>
                          <TD><span className="badge" style={{ background: p.status === 'published' ? '#D1FAE5' : '#FEF3C7', color: p.status === 'published' ? '#065F46' : '#92400E' }}>{p.status}</span></TD>
                          <TD style={{ fontWeight: 700 }}>{p.views}</TD>
                          <TD style={{ color: '#94A3B8', whiteSpace: 'nowrap' }}>{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</TD>
                          <TD><button onClick={() => handleDeletePost(p.id)} className="btn btn-ghost btn-xs" style={{ color: '#DC2626' }}><Trash2 size={13} /></button></TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* CATEGORIES */}
            {tab === 'categories' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #E2E2DA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 16 }}>Categories</h3>
                  <button onClick={() => { setShowCatForm(!showCatForm); setEditingCat(null); setCatForm({ name: '', color: '#E84A27', description: '' }); }} className="btn btn-primary btn-xs"><Plus size={13} /> Add category</button>
                </div>
                {showCatForm && (
                  <form onSubmit={handleCatSubmit} style={{ padding: '16px 20px', background: '#F8FAFC', borderBottom: '1.5px solid #E2E2DA' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <label className="form-label">Name</label>
                        <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} className="form-input" placeholder="e.g. Science" required />
                      </div>
                      <div style={{ flex: 2, minWidth: 200 }}>
                        <label className="form-label">Description</label>
                        <input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} className="form-input" placeholder="Short description…" />
                      </div>
                      <div>
                        <label className="form-label">Color</label>
                        <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} style={{ width: 52, height: 38, borderRadius: 6, border: '1.5px solid #E2E2DA', cursor: 'pointer', padding: 3, display: 'block' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="btn btn-primary btn-sm">{editingCat ? 'Update' : 'Create'}</button>
                        <button type="button" onClick={() => setShowCatForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
                      </div>
                    </div>
                  </form>
                )}
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ border: '1.5px solid #E2E2DA', borderRadius: 8, padding: '14px 16px', background: '#FAFAF7' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color, border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{cat.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => { setEditingCat(cat); setCatForm({ name: cat.name, color: cat.color, description: cat.description || '' }); setShowCatForm(true); }} className="btn btn-ghost btn-xs"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteCat(cat.id)} className="btn btn-ghost btn-xs" style={{ color: '#DC2626' }}><Trash2 size={12} /></button>
                        </div>
                      </div>
                      {cat.description && <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, marginBottom: 6 }}>{cat.description}</p>}
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{cat.post_count} posts</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CONTACTS */}
            {tab === 'contacts' && (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #E2E2DA' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 16 }}>Contact messages</h3>
                </div>
                {contacts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>No messages yet</div>
                ) : (
                  contacts.map(c => (
                    <div key={c.id} style={{ padding: '16px 20px', borderBottom: '1px solid #F4F4F0', background: c.is_read ? '#FFFFFF' : '#FEFCE8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            {!c.is_read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E84A27', flexShrink: 0 }} />}
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{c.subject}</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>{c.name} · <a href={`mailto:${c.email}`} style={{ color: '#E84A27' }}>{c.email}</a> · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</div>
                          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{c.message}</p>
                        </div>
                        {!c.is_read && <button onClick={() => handleMarkRead(c.id)} className="btn btn-ghost btn-xs" style={{ flexShrink: 0 }}>Mark read</button>}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
