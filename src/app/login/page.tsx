"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock Authentication Logic
    setTimeout(() => {
      if (email.toLowerCase() === 'admin' || email.includes('admin')) {
        // Successful login
        router.push('/admin');
      } else {
        // Failed login
        setError('अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें। (Invalid Credentials)');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', fontFamily: '"Mukta", "Noto Sans Devanagari", Arial, sans-serif' }}>
      
      {/* Left Side - Branding */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <img src="/udgam.jpg" alt="UDGAM Logo" style={{ height: '80px', marginBottom: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onError={(e) => e.currentTarget.style.display = 'none'} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2' }}>SCERT UDGAM<br/>पोर्टल में आपका स्वागत है</h1>
          <p style={{ fontSize: '1.1rem', color: '#bfdbfe', maxWidth: '400px', lineHeight: '1.6' }}>
            शिक्षक नवाचार लेखन प्रबंधन प्रणाली। यह पोर्टल राज्य शैक्षिक अनुसंधान और प्रशिक्षण परिषद, उत्तर प्रदेश की एक पहल है।
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem auto', color: '#3b82f6' }}>
              <Shield size={30} />
            </div>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem', fontWeight: 'bold' }}>विभागीय लॉगिन</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>कृपया अपने क्रेडेंशियल्स दर्ज करें</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500' }}>यूजर आईडी / ईमेल</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="अपना यूजर आईडी दर्ज करें (Try 'admin')" 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ color: '#334155', fontWeight: '500' }}>पासवर्ड</label>
                <span style={{ fontSize: '0.85rem', color: '#3b82f6', cursor: 'pointer' }}>पासवर्ड भूल गए?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="अपना पासवर्ड दर्ज करें" 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.875rem', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              {loading ? 'लॉगिन हो रहा है...' : <>लॉगिन करें <ArrowRight size={18} /></>}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
                ← मुख्य पृष्ठ पर वापस जाएं
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
