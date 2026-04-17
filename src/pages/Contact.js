import React, { useState } from 'react';
import { contactAPI } from '../api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await contactAPI.send(form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  const contactInfo = [
    { icon: <Mail size={18} />, label: 'Email', value: 'jehu.anita@gmail.com', href: 'mailto:jehu.anita@gmail.com', color: '#E84A27' },
    { icon: <Phone size={18} />, label: 'Phone / WhatsApp', value: '+254 714 676 921', href: 'tel:+254714676921', color: '#059669' },
    { icon: <MapPin size={18} />, label: 'Location', value: 'Nairobi, Kenya', href: null, color: '#1D4ED8' },
  ];

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#0F172A', padding: '56px 0' }}>
        <div className="container" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: '#E84A27', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 4, marginBottom: 20 }}>
            Get in touch
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(30px, 5vw, 48px)', color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
            Let's talk.
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.7 }}>
            Have a question, collaboration idea, or just want to say hello? We'd love to hear from you. We reply within 24 hours.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 52, paddingBottom: 72 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, maxWidth: 960, margin: '0 auto' }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Contact details</h2>
            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
              Reach out via any of the channels below, or use the form. We're based in Nairobi and typically respond the same day.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {contactInfo.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F4F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0, border: '1.5px solid #E2E2DA' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ fontWeight: 600, fontSize: 15, color: '#0F172A', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#E84A27'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#0F172A'; }}>
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 12, padding: '20px 22px' }}>
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Quick links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'WhatsApp us directly', href: 'https://wa.me/254714676921', color: '#059669' },
                  { label: 'Send an email', href: 'mailto:jehu.anita@gmail.com', color: '#E84A27' },
                ].map((link, i) => (
                  <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: link.color, fontWeight: 600, textDecoration: 'none', padding: '8px 0', borderBottom: i === 0 ? '1px solid #F4F4F0' : 'none' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: link.color }} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 14, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#059669' }}>
                  <CheckCircle size={28} />
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Message sent!</h3>
                <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  Thanks for reaching out. We'll get back to you at <strong style={{ color: '#0F172A' }}>{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn btn-outline btn-sm">
                  Send another message
                </button>
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E2DA', borderRadius: 14, padding: '32px 28px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 20, marginBottom: 22 }}>Send a message</h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Your name <span style={{ color: '#E84A27' }}>*</span></label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Jane Doe" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email <span style={{ color: '#E84A27' }}>*</span></label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="jane@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject <span style={{ color: '#E84A27' }}>*</span></label>
                    <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="form-input" placeholder="What's it about?" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message <span style={{ color: '#E84A27' }}>*</span></label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="form-input form-textarea"
                      placeholder="Tell us everything…"
                      style={{ minHeight: 140, resize: 'vertical' }}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Send size={15} />{loading ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
