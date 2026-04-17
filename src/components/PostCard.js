import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CAT_STYLES = {
  technology: { bg: '#FEF3C7', color: '#92400E' },
  lifestyle:  { bg: '#D1FAE5', color: '#065F46' },
  travel:     { bg: '#DBEAFE', color: '#1E40AF' },
  business:   { bg: '#EDE9FE', color: '#4C1D95' },
};

export default function PostCard({ post, onLike }) {
  const cs = CAT_STYLES[post.category?.slug] || { bg: '#F3F4F6', color: '#374151' };

  return (
    <article className="card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={`/post/${post.id}`} style={{ display: 'block', overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 196 }}>
          <img
            src={post.cover_image || `https://picsum.photos/seed/${post.id}/800/400`}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          {post.category && (
            <span className="badge" style={{ position: 'absolute', top: 10, left: 10, background: cs.bg, color: cs.color }}>
              {post.category.name}
            </span>
          )}
        </div>
      </Link>

      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link to={`/post/${post.id}`}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700, lineHeight: 1.35, color: '#0F172A' }}
            onMouseEnter={e => e.currentTarget.style.color = '#E84A27'}
            onMouseLeave={e => e.currentTarget.style.color = '#0F172A'}>
            {post.title}
          </h3>
        </Link>

        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.65, flex: 1 }}>
          {post.excerpt || post.content.substring(0, 110) + '…'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid #F4F4F0' }}>
          <img
            src={post.author?.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`}
            alt=""
            style={{ width: 28, height: 28, borderRadius: '50%', background: '#F4F4F0', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.author?.first_name || post.author?.username}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} />{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={e => { e.preventDefault(); onLike && onLike(post.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: post.is_liked ? '#DB2777' : '#94A3B8', fontSize: 12, fontWeight: 600, padding: 0 }}
            >
              <Heart size={14} fill={post.is_liked ? '#DB2777' : 'none'} />{post.like_count}
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94A3B8', fontSize: 12 }}>
              <MessageCircle size={14} />{post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
