"use client";

import Link from 'next/link';
import { Lightbulb, ShieldCheck, Users, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Mukta", "Noto Sans Devanagari", Arial, sans-serif', backgroundColor: '#f8fafc' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/udgam.jpg" alt="UDGAM" style={{ height: '50px' }} onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/login" style={{ textDecoration: 'none', color: '#1e3a8a', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            विभागीय लॉगिन <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main style={{ flex: 1 }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
          color: 'white', 
          padding: '6rem 2rem', 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '400px', height: '400px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <img src="/scert.jpg" alt="SCERT" style={{ height: '100px', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }} onError={(e) => e.currentTarget.style.display = 'none'} />
            
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', lineHeight: '1.2' }}>
              शिक्षक नवाचार लेखन प्रबंधन पोर्टल
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#bfdbfe', marginBottom: '3rem', fontWeight: '500' }}>
              SCERT, उत्तर प्रदेश द्वारा शिक्षकों के नवीन और उत्कृष्ट कार्यों को साझा करने का एक डिजिटल मंच।
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/teacher" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  backgroundColor: '#f59e0b', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1rem 2.5rem', 
                  fontSize: '1.2rem', 
                  borderRadius: '50px', 
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Lightbulb size={24} /> नया नवाचार जमा करें
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#1e293b', fontSize: '2rem', marginBottom: '3rem', fontWeight: 'bold' }}>
            पोर्टल की मुख्य विशेषताएँ
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <FeatureCard 
              icon={<ShieldCheck size={40} color="#3b82f6" />}
              title="पारदर्शी एवं सुरक्षित"
              desc="शिक्षकों का डेटा पूरी तरह से सुरक्षित है और समीक्षा प्रक्रिया में 100% पारदर्शिता है।"
            />
            <FeatureCard 
              icon={<FileText size={40} color="#f59e0b" />}
              title="डिजिटल दस्तावेजीकरण"
              desc="कागजी कार्यवाही से मुक्ति। अब सभी नवाचार डिजिटल रूप में सुरक्षित और व्यवस्थित।"
            />
            <FeatureCard 
              icon={<Users size={40} color="#10b981" />}
              title="त्वरित समीक्षा"
              desc="विशेषज्ञों द्वारा नवाचारों की त्वरित जाँच और समय पर फीडबैक।"
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '2rem', textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>राज्य शैक्षिक अनुसंधान और प्रशिक्षण परिषद (SCERT), उत्तर प्रदेश</p>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>© 2024 UDGAM Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '16px', 
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.3s, box-shadow 0.3s'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
    }}
    >
      <div style={{ 
        width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '50%', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' 
      }}>
        {icon}
      </div>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.3rem' }}>{title}</h3>
      <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
    </div>
  );
}
