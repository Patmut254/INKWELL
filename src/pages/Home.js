import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { PenSquare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const search = searchParams.get('search') || '';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;
      const res = await postsAPI.getAll(params);
      setPosts(res.data);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { categoriesAPI.getAll().then(r => setCategories(r.data)); }, []);

  const handleLike = async (postId) => {
    if (!user) { toast.error('Please sign in to like posts'); return; }
    try {
      const res = await postsAPI.like(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: res.data.like_count, is_liked: res.data.liked } : p));
    } catch {
      toast.error('Failed to update like');
    }
  };

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div>
      {!search && !activeCategory && (
        <div style={{ background: '#0F172A', padding: '72px 0 64px' }}>
          <div className="container">
            <div style={{ maxWidth: 600 }}>
              <span style={{ display: 'inline-block', background: '#E84A27', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 4, marginBottom: 20 }}>
                The writers community
              </span>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(36px, 6vw, 58px)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: 18 }}>
                Ideas worth<br />reading about.
              </h1>
              <p style={{ color: '#94A3B8', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
                A home for curious minds. Discover articles on technology, business, travel, and the world around us.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {user ? (
                  <Link to="/create" className="btn btn-primary"><PenSquare size={15} /> Start writing</Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary">Join for free <ArrowRight size={15} /></Link>
                    <Link to="/login" className="btn" style={{ background: '#1E293B', color: '#E2E8F0', border: '1.5px solid #334155' }}>Sign in</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 36, paddingBottom: 64 }}>
        {search && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700 }}>
              Results for <span style={{ color: '#E84A27' }}>"{search}"</span>
            </h2>
            <p style={{ color: '#64748B', marginTop: 4, fontSize: 14 }}>{posts.length} article{posts.length !== 1 ? 's' : ''} found</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 36, scrollbarWidth: 'none' }}>
          {[{ slug: '', name: 'All' }, ...categories].map(cat => (
            <button
              key={cat.slug || 'all'}
              onClick={() => setActiveCategory(cat.slug === '' ? '' : (activeCategory === cat.slug ? '' : cat.slug))}
              style={{
                padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', border: '1.5px solid',
                borderColor: (!cat.slug && !activeCategory) || activeCategory === cat.slug ? '#0F172A' : '#E2E2DA',
                background: (!cat.slug && !activeCategory) || activeCategory === cat.slug ? '#0F172A' : '#FFFFFF',
                color: (!cat.slug && !activeCategory) || activeCategory === cat.slug ? '#FFFFFF' : '#64748B',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {cat.name}
              {cat.post_count !== undefined && (
                <span style={{ marginLeft: 6, opacity: 0.6, fontWeight: 400 }}>{cat.post_count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>✦</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#0F172A', marginBottom: 8 }}>Nothing here yet</h3>
            <p style={{ fontSize: 14 }}>Try a different search term or category</p>
          </div>
        ) : (
          <>
            {featured && !search && !activeCategory && (
              <div className="card" style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                <Link to={`/post/${featured.id}`} style={{ overflow: 'hidden', display: 'block' }}>
                  <img src={featured.cover_image || `https://picsum.photos/seed/${featured.id}/1200/600`} alt={featured.title}
                    style={{ width: '100%', height: '100%', minHeight: 260, objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
                </Link>
                <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>Featured</span>
                    {featured.category && <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{featured.category.name}</span>}
                  </div>
                  <Link to={`/post/${featured.id}`}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84A27'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#0F172A'; }}>
                      {featured.title}
                    </h2>
                  </Link>
                  <p style={{ color: '#64748B', lineHeight: 1.7, fontSize: 14 }}>{featured.excerpt || featured.content.substring(0, 180) + '…'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${featured.author?.username}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', background: '#F4F4F0' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{featured.author?.first_name || featured.author?.username}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>{featured.like_count} likes · {featured.comment_count} comments</div>
                    </div>
                    <Link to={`/post/${featured.id}`} className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>Read <ArrowRight size={13} /></Link>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 }}>
              {(search || activeCategory ? posts : rest).map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
