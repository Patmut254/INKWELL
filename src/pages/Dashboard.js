import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { PenSquare, Trash2, Edit2, Eye, Heart, MessageCircle, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsAPI.myPosts()
      .then(r => setPosts(r.data))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await postsAPI.delete(id); setPosts(prev => prev.filter(p => p.id !== id)); toast.success('Article deleted'); }
    catch { toast.error('Could not delete article'); }
  };

  const published = posts.filter(p => p.status === 'published');
  const drafts = posts.filter(p => p.status === 'draft');
  const totalLikes = posts.reduce((s, p) => s + p.like_count, 0);
  const totalComments = posts.reduce((s, p) => s + p.comment_count, 0);

  const stats = [
    { label: 'Articles', value: posts.length, color: '#E84A27' },
    { label: 'Published', value: published.length, color: '#059669' },
    { label: 'Total likes', value: totalLikes, color: '#DB2777' },
    { label: 'Comments', value: totalComments, color: '#6D28D9' },
  ];

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      <div style={{ background: '#0F172A', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt="" style={{ width: 56, height: 56, borderRadius: '50%', border: '2.5px solid #334155', background: '#1E293B' }} />
              <div>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 22, color: '#FFFFFF', marginBottom: 2 }}>
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                </h1>
                <p style={{ color: '#64748B', fontSize: 13 }}>@{user?.username} · {user?.is_admin ? 'Administrator' : 'Author'}</p>
              </div>
            </div>
            <Link to="/create" className="btn btn-primary"><PenSquare size={14} /> New article</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, marginBottom: 14 }} />
              <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 30, color: '#0F172A', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1.5px solid #E2E2DA', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1.5px solid #E2E2DA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 17 }}>Your articles</h3>
            {drafts.length > 0 && <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>{drafts.length} draft{drafts.length > 1 ? 's' : ''}</span>}
          </div>

          {loading ? <div className="spinner" /> : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ width: 48, height: 48, background: '#FEF3C7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#E84A27' }}><FileText size={22} /></div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, marginBottom: 6 }}>No articles yet</h3>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 18 }}>Share your ideas with the world</p>
              <Link to="/create" className="btn btn-primary btn-sm"><PenSquare size={14} /> Write first article</Link>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ padding: '16px 20px', borderTop: '1.5px solid #F4F4F0', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {post.cover_image && (
                  <img src={post.cover_image} alt="" style={{ width: 66, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0, border: '1px solid #E2E2DA' }} onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <Link to={`/post/${post.id}`} style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 14, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 380 }}>{post.title}</Link>
                    <span className="badge" style={{ background: post.status === 'published' ? '#D1FAE5' : '#FEF3C7', color: post.status === 'published' ? '#065F46' : '#92400E' }}>{post.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#94A3B8', flexWrap: 'wrap' }}>
                    <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={12} />{post.like_count}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MessageCircle size={12} />{post.comment_count}</span>
                    {post.category && <span>{post.category.name}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Link to={`/post/${post.id}`} className="btn btn-ghost btn-xs"><Eye size={13} /></Link>
                  <Link to={`/edit/${post.id}`} className="btn btn-ghost btn-xs"><Edit2 size={13} /></Link>
                  <button onClick={() => handleDelete(post.id)} className="btn btn-ghost btn-xs" style={{ color: '#DC2626' }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
