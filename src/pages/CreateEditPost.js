import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../api';
import { Image, Tag, FileText, Eye, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateEditPost() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', cover_image: '', category_id: '', status: 'published' });

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data));
    if (isEdit) {
      postsAPI.getOne(id)
        .then(r => {
          const p = r.data;
          setForm({ title: p.title, content: p.content, excerpt: p.excerpt, cover_image: p.cover_image, category_id: p.category?.id || '', status: p.status });
        })
        .catch(() => { toast.error('Post not found'); navigate('/'); });
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error('Title and content are required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, category_id: form.category_id || null };
      if (isEdit) {
        await postsAPI.update(id, payload);
        toast.success('Article updated');
        navigate(`/post/${id}`);
      } else {
        const res = await postsAPI.create(payload);
        toast.success('Article published');
        navigate(`/post/${res.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      <div style={{ background: '#FFFFFF', borderBottom: '1.5px solid #E2E2DA', padding: '10px 0', position: 'sticky', top: 64, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{isEdit ? 'Edit article' : 'New article'}</h2>
            <span style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{wordCount} words · {readTime} min read</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => setPreview(!preview)} className="btn btn-ghost btn-sm"><Eye size={14} />{preview ? 'Edit' : 'Preview'}</button>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-sm"><Save size={14} />{loading ? 'Saving…' : isEdit ? 'Update' : 'Publish'}</button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>
          <div>
            {preview ? (
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 12, padding: '32px 36px' }}>
                {form.cover_image && <img src={form.cover_image} alt="" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8, marginBottom: 24 }} onError={e => { e.target.style.display = 'none'; }} />}
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 30, marginBottom: 14, lineHeight: 1.2 }}>{form.title || 'Your title here'}</h1>
                {form.excerpt && <p style={{ color: '#64748B', fontSize: 16, marginBottom: 22, lineHeight: 1.7, borderLeft: '3px solid #E84A27', paddingLeft: 14, fontStyle: 'italic' }}>{form.excerpt}</p>}
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.85, fontSize: 16, color: '#1E293B', fontFamily: 'Georgia, serif' }}>{form.content || 'Your content will appear here…'}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article title…" className="form-input" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, padding: '14px 18px', border: '1.5px solid #E2E2DA', background: '#FFFFFF' }} />
                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short excerpt or summary (optional)…" className="form-input form-textarea" style={{ minHeight: 72, background: '#FFFFFF', border: '1.5px solid #E2E2DA' }} />
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your article here…" className="form-input form-textarea" style={{ minHeight: 420, background: '#FFFFFF', border: '1.5px solid #E2E2DA', fontSize: 15, lineHeight: 1.8, fontFamily: 'Georgia, serif' }} />
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: '16px 18px' }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Tag size={13} />Category</h4>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="form-input" style={{ fontSize: 13 }}>
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: '16px 18px' }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Image size={13} />Cover image</h4>
              <input value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} placeholder="Paste image URL…" className="form-input" style={{ fontSize: 13, marginBottom: 10 }} />
              {form.cover_image && <img src={form.cover_image} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #E2E2DA' }} onError={e => { e.target.style.display = 'none'; }} />}
            </div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 10, padding: '16px 18px' }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={13} />Status</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                {['published', 'draft'].map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} style={{ flex: 1, padding: '7px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '1.5px solid', textTransform: 'capitalize', fontFamily: 'Inter, sans-serif', borderColor: form.status === s ? '#0F172A' : '#E2E2DA', background: form.status === s ? '#0F172A' : '#FFFFFF', color: form.status === s ? '#FFFFFF' : '#64748B' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.container>div{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
