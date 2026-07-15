"use client";

import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  Home, Edit3, FileText, MessageSquare, AlertTriangle, CheckCircle, 
  BarChart2, Download, Bell, User, HelpCircle, LogOut, 
  FileBox, Clock, AlertCircle, Eye, ShieldCheck, Timer, EyeIcon, Star, X
} from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedWriteup, setSelectedWriteup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('डैशबोर्ड');
  const [reviewerComment, setReviewerComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingCSV, setUploadingCSV] = useState(false);

  const fetchDashboardData = () => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/writeups/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: results.data })
          });
          
          if (res.ok) {
            const json = await res.json();
            alert(`सफलतापूर्वक ${json.count} रिकॉर्ड अपलोड किए गए! (Successfully uploaded)`);
            fetchDashboardData();
          } else {
            const err = await res.json();
            alert("अपलोड में समस्या आई: " + err.error);
          }
        } catch (error) {
          alert("सर्वर से जुड़ने में समस्या आई।");
        } finally {
          setUploadingCSV(false);
          // Reset file input
          e.target.value = '';
        }
      },
      error: (error) => {
        alert("फाइल पढ़ने में समस्या आई: " + error.message);
        setUploadingCSV(false);
      }
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pieData = data?.stats ? [
    { name: 'लंबित समीक्षा', value: data.stats.pending || 0, color: '#3b82f6' },
    { name: 'सुधार हेतु लौटाए गए', value: data.stats.returned || 0, color: '#ef4444' },
    { name: 'स्वीकृत', value: data.stats.approved || 0, color: '#22c55e' },
    { name: 'इंटरव्यू चयनित', value: data.stats.interviewSelected || 0, color: '#4338ca' },
    { name: 'इंटरव्यू अस्वीकृत', value: data.stats.interviewRejected || 0, color: '#6b7280' },
  ] : [];

  const handleStatusUpdate = async (status: 'APPROVED' | 'CORRECTION' | 'INTERVIEW_SELECTED' | 'INTERVIEW_REJECTED') => {
    if (!selectedWriteup) return;
    
    if (status === 'CORRECTION' && !reviewerComment.trim()) {
      alert("सुधार के लिए लौटाते समय टिप्पणी (Comment) लिखना अनिवार्य है।");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/writeups/${selectedWriteup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comment: reviewerComment })
      });

      if (res.ok) {
        // Close modal, reset comment, and refresh data
        setSelectedWriteup(null);
        setReviewerComment("");
        fetchDashboardData();
      } else {
        alert("अपडेट करने में समस्या आई।");
      }
    } catch (err) {
      console.error(err);
      alert("सर्वर एरर।");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: '"Mukta", "Noto Sans Devanagari", Arial, sans-serif' }}>
      
      {/* REVIEWER MODAL */}
      {selectedWriteup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
              <div>
                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.4rem' }}>{selectedWriteup.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                  <span>👤 {selectedWriteup.name}</span>
                  <span>🏫 {selectedWriteup.school}</span>
                  <span>📍 {selectedWriteup.district}</span>
                </div>
              </div>
              <button onClick={() => setSelectedWriteup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>नवाचार का विस्तृत विवरण (Write-up)</h4>
                <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                  {selectedWriteup.content}
                </div>
              </div>

              {selectedWriteup.fileUrl && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>संलग्नक (Attachments)</h4>
                  <a href={selectedWriteup.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                    <Download size={16} /> डॉक्यूमेंट डाउनलोड करें
                  </a>
                </div>
              )}

              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>समीक्षक की टिप्पणी (Reviewer Comments)</h4>
                <textarea 
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="सुधार के लिए या स्वीकृति के लिए अपनी टिप्पणी यहाँ लिखें..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleStatusUpdate('CORRECTION')}
                disabled={isUpdating}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isUpdating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <AlertTriangle size={16} /> सुधार हेतु लौटाएं
              </button>
              <button 
                onClick={() => handleStatusUpdate('APPROVED')}
                disabled={isUpdating}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isUpdating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle size={16} /> स्वीकृत करें
              </button>
              <button 
                onClick={() => handleStatusUpdate('INTERVIEW_SELECTED')}
                disabled={isUpdating}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isUpdating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <Star size={16} /> इंटरव्यू चयनित
              </button>
              <button 
                onClick={() => handleStatusUpdate('INTERVIEW_REJECTED')}
                disabled={isUpdating}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isUpdating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <X size={16} /> इंटरव्यू अस्वीकृत
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <div style={{ width: '250px', backgroundColor: '#10468c', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <img src="/udgam.jpg" alt="UDGAM Logo" style={{ width: '100%', borderRadius: '4px', objectFit: 'contain' }} onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          
          <div style={{ padding: '0.5rem 0', flex: 1, overflowY: 'auto' }}>
            <SidebarItem icon={<Home size={18} />} text="डैशबोर्ड" active={activeTab === 'डैशबोर्ड'} onClick={() => setActiveTab('डैशबोर्ड')} />
            <Link href="/teacher" style={{ textDecoration: 'none' }}>
              <SidebarItem icon={<Edit3 size={18} />} text="नवाचार लेखन जमा करें" />
            </Link>
            <SidebarItem icon={<FileText size={18} />} text="मेरे जमा किए गए लेखन" active={activeTab === 'मेरे जमा किए गए लेखन'} onClick={() => setActiveTab('मेरे जमा किए गए लेखन')} />
            <SidebarItem icon={<MessageSquare size={18} />} text="समीक्षक की टिप्पणियाँ" onClick={() => alert("यह फीचर जल्द ही उपलब्ध होगा")} />
            <SidebarItem icon={<AlertTriangle size={18} />} text="आवश्यक सुधार" active={activeTab === 'आवश्यक सुधार'} onClick={() => setActiveTab('आवश्यक सुधार')} />
            <SidebarItem icon={<CheckCircle size={18} />} text="स्वीकृत लेखन" active={activeTab === 'स्वीकृत लेखन'} onClick={() => setActiveTab('स्वीकृत लेखन')} />
            <SidebarItem icon={<Star size={18} />} text="इंटरव्यू चयनित" active={activeTab === 'इंटरव्यू चयनित'} onClick={() => setActiveTab('इंटरव्यू चयनित')} />
            <SidebarItem icon={<X size={18} />} text="इंटरव्यू अस्वीकृत" active={activeTab === 'इंटरव्यू अस्वीकृत'} onClick={() => setActiveTab('इंटरव्यू अस्वीकृत')} />
            <SidebarItem icon={<BarChart2 size={18} />} text="प्रगति रिपोर्ट" onClick={() => alert("यह फीचर जल्द ही उपलब्ध होगा")} />
            <SidebarItem icon={<Download size={18} />} text="रिपोर्ट एवं निर्यात" onClick={() => alert("यह फीचर जल्द ही उपलब्ध होगा")} />
            <SidebarItem icon={<Bell size={18} />} text="संदेश / सूचनाएँ" badge="5" onClick={() => alert("यह फीचर जल्द ही उपलब्ध होगा")} />
            <SidebarItem icon={<User size={18} />} text="प्रोफाइल" onClick={() => alert("यह फीचर जल्द ही उपलब्ध होगा")} />
            <SidebarItem icon={<HelpCircle size={18} />} text="सहायता केंद्र" onClick={() => alert("यह फीचर जल्द ही उपलब्ध होगा")} />
            <Link href="/" style={{ textDecoration: 'none' }}>
              <SidebarItem icon={<LogOut size={18} />} text="लॉगआउट" />
            </Link>
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.8rem', color: '#93c5fd', lineHeight: '1.4' }}>
            &quot;नवाचार ही परिवर्तन है,<br/>परिवर्तन ही प्रगति है।&quot;
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          {/* TOP HEADER */}
          <div style={{ backgroundColor: 'white', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#1a365d', fontWeight: 'bold' }}>शिक्षक नवाचार लेखन प्रबंधन पोर्टल</h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>नवाचार साझा करें, शिक्षा को बेहतर बनाएँ</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <img src="/scert.jpg" alt="SCERT Logo" style={{ height: '65px', borderRadius: '50%' }} onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              
              {/* CSV Upload Button */}
              <div style={{ marginRight: '1rem' }}>
                <input 
                  type="file" 
                  accept=".csv" 
                  id="csv-upload" 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload}
                  disabled={uploadingCSV}
                />
                <label 
                  htmlFor="csv-upload" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    backgroundColor: '#10b981', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '6px', 
                    cursor: uploadingCSV ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    opacity: uploadingCSV ? 0.7 : 1
                  }}
                >
                  <FileBox size={18} />
                  {uploadingCSV ? 'अपलोड हो रहा है...' : 'Upload Google Form CSV'}
                </label>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '1.1rem' }}>SCERT LKO</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>एडमिन (Admin)</p>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #bfdbfe', flexShrink: 0, backgroundColor: '#f1f5f9' }}>
                <img src="/udgam.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* DASHBOARD BODY */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Content Header based on active tab */}
            <div style={{ marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>{activeTab}</h1>
              <p style={{ color: '#64748b' }}>
                {activeTab === 'डैशबोर्ड' ? 'एस.सी.ई.आर.टी नवाचार लेखन प्रणाली का अवलोकन' : 
                 activeTab === 'स्वीकृत लेखन' ? 'केवल स्वीकृत नवाचारों की सूची' : 
                 activeTab === 'आवश्यक सुधार' ? 'उन नवाचारों की सूची जिन्हें सुधार के लिए वापस भेजा गया है' : 
                 'आपके सभी नवाचारों की सूची'}
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>डेटा लोड हो रहा है (Loading...)...</div>
            ) : (
            <>
              {activeTab === 'डैशबोर्ड' && (
                <>
                  {/* 6 STAT CARDS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <StatCard icon={<FileBox size={24} color="white" />} title="कुल प्राप्त लेखन" value={data?.stats?.total || 0} bgColor="#f0f7ff" iconBg="#3b82f6" />
                    <StatCard icon={<Clock size={24} color="white" />} title="समीक्षा हेतु लंबित" value={data?.stats?.pending || 0} bgColor="#fffbeb" iconBg="#f59e0b" />
                    <StatCard icon={<AlertTriangle size={24} color="white" />} title="सुधार हेतु लौटाए गए" value={data?.stats?.returned || 0} bgColor="#fef2f2" iconBg="#ef4444" />
                    <StatCard icon={<CheckCircle size={24} color="white" />} title="स्वीकृत लेखन" value={data?.stats?.approved || 0} bgColor="#f0fdf4" iconBg="#22c55e" />
                    <StatCard icon={<Star size={24} color="white" />} title="इंटरव्यू चयनित" value={data?.stats?.interviewSelected || 0} bgColor="#e0e7ff" iconBg="#4338ca" />
                    <StatCard icon={<X size={24} color="white" />} title="इंटरव्यू अस्वीकृत" value={data?.stats?.interviewRejected || 0} bgColor="#f3f4f6" iconBg="#4b5563" />
                  </div>

                  {/* MIDDLE CHARTS ROW */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr', gap: '1rem' }}>
                    
                    {/* PIE CHART */}
                    <div className="card" style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '1rem' }}>
                        <BarChart2 size={16} /> प्रगति सारांश
                      </h3>
                      <div style={{ height: '180px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <div style={{ width: '50%', height: '100%', position: 'relative' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{data?.stats?.total || 0}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>कुल</div>
                          </div>
                        </div>
                        <div style={{ width: '50%', fontSize: '0.8rem', paddingLeft: '1rem' }}>
                          {pieData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color }}></div>
                              <span style={{ color: '#475569' }}>{d.name} ({d.value})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* BAR CHART */}
                    <div className="card" style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '1rem' }}>📍 जिला वार प्राप्त लेखन</h3>
                        <select style={{ fontSize: '0.8rem', padding: '0.2rem', border: 'none', color: '#64748b', outline: 'none' }}>
                          <option>सभी जिले</option>
                        </select>
                      </div>
                      <div style={{ height: '180px', overflowX: 'auto', overflowY: 'hidden' }}>
                        {data?.districtStats && data.districtStats.length > 0 ? (
                          <div style={{ minWidth: `${Math.max(100, data.districtStats.length * 40)}px`, height: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={data.districtStats} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8', fontSize: '0.9rem' }}>कोई डेटा उपलब्ध नहीं</div>
                        )}
                      </div>
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="card" style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '1rem' }}>🔔 सूचनाएँ</h3>
                        <span style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer' }}>सभी देखें</span>
                      </div>
                      <NotificationItem icon={<CheckCircle size={14} color="white" />} bgColor="#22c55e" text='आपका लेखन "डिजिटल उपस्थिति प्रणाली" स्वीकृत किया गया है।' time="2 घंटे पहले" />
                      <NotificationItem icon={<MessageSquare size={14} color="white" />} bgColor="#f59e0b" text="आपके लेखन में समीक्षा टिप्पणियाँ उपलब्ध हैं। कृपया देखें।" time="5 घंटे पहले" />
                      <NotificationItem icon={<Edit3 size={14} color="white" />} bgColor="#3b82f6" text="आपका नया लेखन सफलतापूर्वक जमा हुआ।" time="1 दिन पहले" />
                      <NotificationItem icon={<AlertCircle size={14} color="white" />} bgColor="#8b5cf6" text="प्रणाली सूचना: कृपया सभी लंबित लेखन की पुष्टि समय पर करें।" time="1 दिन पहले" />
                    </div>
                  </div>
                </>
              )}

              {/* BOTTOM TABLE */}
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '1rem' }}>
                    <FileText size={16} /> {activeTab === 'डैशबोर्ड' ? 'हाल ही में प्राप्त लेखन' : 'लेखन सूची'}
                  </h3>
                  <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '500px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <tr style={{ textAlign: 'left', color: '#64748b' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>आईडी</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>शिक्षक का नाम</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>विद्यालय</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>जिला</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>नवाचार का शीर्षक</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>श्रेणी</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>दस्तावेज़</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>स्थिति</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e2e8f0' }}>कार्यवाही</th>
                        </tr>
                      </thead>
                      <tbody>
                      {data?.recentWriteups && data.recentWriteups.length > 0 ? (
                        data.recentWriteups
                          .filter((w: any) => {
                            if (activeTab === 'स्वीकृत लेखन') return w.rawStatus === 'APPROVED';
                            if (activeTab === 'आवश्यक सुधार') return w.rawStatus === 'CORRECTION';
                            if (activeTab === 'इंटरव्यू चयनित') return w.rawStatus === 'INTERVIEW_SELECTED';
                            if (activeTab === 'इंटरव्यू अस्वीकृत') return w.rawStatus === 'INTERVIEW_REJECTED';
                            return true;
                          })
                          .map((w: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#94a3b8', fontSize: '0.7rem' }}>{w.id.substring(0, 5)}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{w.name}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>{w.school}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>{w.district}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#3b82f6', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                <span style={{ backgroundColor: w.catBg, color: w.catColor, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{w.category}</span>
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                {w.fileUrl ? (
                                  <a href={w.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: '500' }}>
                                    <FileBox size={14} /> लिंक
                                  </a>
                                ) : (
                                  <span style={{ color: '#94a3b8' }}>-</span>
                                )}
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                <span style={{ backgroundColor: w.statusColor, color: w.textColor, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                  {w.status}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                <button 
                                  onClick={() => setSelectedWriteup(w)}
                                  style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#eff6ff' }}>
                                  <Eye size={16} /> देखें
                                </button>
                              </td>
                            </tr>
                        ))
                      ) : (
                          <tr><td colSpan={9} style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>कोई डेटा नहीं</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
            </>
            )}
          </div>
        </div>
      </div>
      
      {/* FULL WIDTH FOOTER */}
      <div style={{ backgroundColor: '#0c356a', color: 'white', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#f59e0b" /> सुरक्षित एवं विश्वसनीय
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Timer size={16} color="#f59e0b" /> समय पर समीक्षा
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <EyeIcon size={16} color="#f59e0b" /> पारदर्शी प्रक्रिया
          </div>
        </div>
        <div style={{ color: '#93c5fd' }}>
          © 2024 शिक्षक नवाचार लेखन प्रबंधन पोर्टल | सर्वाधिकार सुरक्षित
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fcd34d', fontWeight: 'bold' }}>
          <Star size={16} fill="#fcd34d" /> बेहतर शिक्षा, बेहतर नवाचार
        </div>
      </div>
    </div>
  );
}

// Sub-components
function SidebarItem({ icon, text, active = false, badge = null, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.6rem 1.25rem', 
        backgroundColor: active ? '#2563eb' : 'transparent',
        borderLeft: active ? '4px solid #f59e0b' : '4px solid transparent',
        color: active ? 'white' : '#cbd5e1',
        cursor: 'pointer',
        transition: 'background 0.2s',
        marginBottom: '0.1rem'
      }}
      onMouseOver={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
      onMouseOut={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {icon}
        <span style={{ fontSize: '0.9rem' }}>{text}</span>
      </div>
      {badge && (
        <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '50px', fontWeight: 'bold' }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, bgColor, iconBg }: any) {
  return (
    <div style={{ backgroundColor: bgColor, borderRadius: '8px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
      <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: iconBg, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>{title}</p>
        <h2 style={{ margin: '0.1rem 0', fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>{value}</h2>
        <span style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer' }}>विवरण देखें →</span>
      </div>
    </div>
  );
}

function NotificationItem({ icon, bgColor, text, time }: any) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: bgColor, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#334155', lineHeight: '1.3' }}>{text}</p>
        <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, text, bg }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
      <div style={{ width: '50px', height: '50px', backgroundColor: bg, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        {icon}
      </div>
      <span style={{ fontSize: '0.7rem', color: '#475569', textAlign: 'center', lineHeight: '1.1' }}>{text}</span>
    </div>
  );
}
