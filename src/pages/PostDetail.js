import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, ArrowLeft, Edit2, Trash2, Send, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

const CAT_STYLES = {
  technology: { bg: '#FEF3C7', color: '#92400E' },
  lifestyle:  { bg: '#D1FAE5', color: '#065F46' },
  travel:     { bg: '#DBEAFE', color: '#1E40AF' },
  business:   { bg: '#EDE9FE', color: '#4C1D95' },
  culture:    { bg: '#FCE7F3', color: '#831843' },
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  const loadPost = useCallback(async () => {
    try {
      const res = await postsAPI.getOne(id);
      setPost(res.data);
    } catch {
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { loadPost(); }, [loadPost]);

  const handleLike = async () => {
    if (!user) { toast.error('Sign in to like posts'); return; }
    const res = await postsAPI.like(id);
    setPost(prev => ({ ...prev, like_count: res.data.like_count, is_liked: res.data.liked }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this article permanently?')) return;
    try { await postsAPI.delete(id); toast.success('Article deleted'); navigate('/'); }
    catch { toast.error('Could not delete article'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try { await commentsAPI.create(id, { content: comment }); setComment(''); loadPost(); toast.success('Comment posted'); }
    catch { toast.error('Could not post comment'); }
    finally { setSubmitting(false); }
  };

  const handleEditComment = async (cid) => {
    try { await commentsAPI.update(id, cid, { content: editContent }); setEditingComment(null); loadPost(); toast.success('Comment updated'); }
    catch { toast.error('Could not update comment'); }
  };

  const handleDeleteComment = async (cid) => {
    if (!window.confirm('Delete this comment?')) return;
    try { await commentsAPI.delete(id, cid); loadPost(); toast.success('Comment deleted'); }
    catch { toast.error('Could not delete comment'); }
  };

  if (loading) return <div className="spinner" />;
  if (!post) return null;

  const cs = CAT_STYLES[post.category?.slug] || { bg: '#F3F4F6', color: '#374151' };

  return (
    <div className="fade-in">
      <div style={{ position: 'relative', height: 'clamp(220px, 40vw, 460px)', overflow: 'hidden', background: '#0F172A' }}>
        <img src={post.cover_image || `https://picsum.photos/seed/${post.id}/1400/600`} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.55)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 0' }}>
          <div className="container">
            <button onClick={() => navigate(-1)} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 14 }}>
              <ArrowLeft size={14} /> Back
            </button>
            {post.category && <div style={{ marginBottom: 10 }}><span className="badge" style={{ background: cs.bg, color: cs.color }}>{post.category.name}</span></div>}
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(20px, 4vw, 40px)', color: '#FFFFFF', maxWidth: 760, lineHeight: 1.2 }}>{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 64 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 20, borderBottom: '1.5px solid #E2E2DA', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`} alt="" style={{ width: 44, height: 44, borderRadius: '50%', background: '#F4F4F0', border: '2px solid #E2E2DA' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {post.author?.first_name ? `${post.author.first_name} ${post.author.last_name}` : post.author?.username}
                  {post.author?.is_admin && <span className="badge" style={{ background: '#EDE9FE', color: '#4C1D95' }}>Admin</span>}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={11} />{format(new Date(post.created_at), 'MMMM d, yyyy')} · {post.views} views
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={handleLike} className="btn btn-sm" style={{ background: post.is_liked ? '#FDF2F8' : '#F8FAFC', color: post.is_liked ? '#DB2777' : '#64748B', border: `1.5px solid ${post.is_liked ? '#FBCFE8' : '#E2E2DA'}` }}>
                <Heart size={14} fill={post.is_liked ? '#DB2777' : 'none'} /> {post.like_count}
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94A3B8', fontSize: 13 }}><MessageCircle size={14} />{post.comment_count}</span>
              {post.is_owner && (
                <>
                  <Link to={`/edit/${post.id}`} className="btn btn-sm btn-secondary"><Edit2 size={13} /> Edit</Link>
                  <button onClick={handleDelete} className="btn btn-sm btn-danger"><Trash2 size={13} /></button>
                </>
              )}
            </div>
          </div>

          <div style={{ fontSize: 17, lineHeight: 1.85, color: '#1E293B', whiteSpace: 'pre-wrap', marginBottom: 56, fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}>
            {post.content}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{ flex: 1, height: 1, background: '#E2E2DA' }} />
            <div style={{ width: 6, height: 6, background: '#E84A27', borderRadius: '50%' }} />
            <div style={{ flex: 1, height: 1, background: '#E2E2DA' }} />
          </div>

          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, marginBottom: 22 }}>
            Responses ({post.comments?.length || 0})
          </h3>

          {user ? (
            <form onSubmit={handleComment} style={{ marginBottom: 28, background: '#F8FAFC', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="" style={{ width: 34, height: 34, borderRadius: '50%', background: '#E2E2DA', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts…" className="form-input form-textarea" style={{ minHeight: 72, resize: 'none', marginBottom: 10 }} />
                  <button type="submit" disabled={submitting || !comment.trim()} className="btn btn-primary btn-sm">
                    <Send size={13} />{submitting ? 'Posting…' : 'Post response'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div style={{ background: '#FAFAF7', border: '1.5px dashed #E2E2DA', borderRadius: 10, padding: 18, textAlign: 'center', marginBottom: 28 }}>
              <p style={{ color: '#64748B', fontSize: 14 }}>
                <Link to="/login" style={{ color: '#E84A27', fontWeight: 700 }}>Sign in</Link> to join the conversation
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {post.comments?.map(c => (
              <div key={c.id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.author?.username}`} alt="" style={{ width: 30, height: 30, borderRadius: '50%', background: '#F4F4F0' }} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{c.author?.first_name || c.author?.username}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                  </div>
                  {user && (user.id === c.author?.id || user.is_admin) && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingComment(c.id); setEditContent(c.content); }} className="btn btn-ghost btn-xs"><Edit2 size={12} /></button>
                      <button onClick={() => handleDeleteComment(c.id)} className="btn btn-ghost btn-xs" style={{ color: '#DC2626' }}><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
                {editingComment === c.id ? (
                  <div>
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="form-input form-textarea" style={{ minHeight: 64, marginBottom: 8, resize: 'none' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEditComment(c.id)} className="btn btn-primary btn-xs">Save</button>
                      <button onClick={() => setEditingComment(null)} className="btn btn-ghost btn-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{c.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
