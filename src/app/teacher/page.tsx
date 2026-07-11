"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const districts = [
  "Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", 
  "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", 
  "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", 
  "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", 
  "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", 
  "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Lakhimpur Kheri", 
  "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", 
  "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", 
  "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", 
  "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
].sort();

export default function TeacherDashboard() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setLoading(true);
    const formData = new FormData(formRef.current);
    
    try {
      const res = await fetch('/api/writeups', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("कुछ तकनीकी समस्या आ गई है। कृपया फिर से प्रयास करें।");
      }
    } catch (err) {
      console.error(err);
      alert("सर्वर से जुड़ने में समस्या आ रही है।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#e2e8f0", minHeight: "100vh", paddingBottom: "3rem" }}>
      {/* Official SCERT Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", 
        borderBottom: "5px solid #f59e0b", 
        padding: "1.5rem 2rem",
        color: "white",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}>
        <div className="container" style={{ padding: "0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "900", letterSpacing: "1px", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
              🏛️ SCERT, U.P. LUCKNOW
            </h1>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "1rem", color: "#e0e7ff", fontWeight: "500" }}>
              State Council of Educational Research and Training, Uttar Pradesh
            </p>
          </div>
          <Link href="/" className="btn btn-secondary" style={{ backgroundColor: "#f59e0b", color: "white", border: "none", fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}>
            लॉगआउट (Logout)
          </Link>
        </div>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {submitted ? (
          <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", background: "linear-gradient(to bottom, #ffffff, #f0fdf4)", border: "2px solid #22c55e", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
            <div className="status-badge status-approved" style={{ fontSize: "1.2rem", padding: "0.5rem 1rem", marginBottom: "1rem", backgroundColor: "#22c55e", color: "white" }}>
              सफलतापूर्वक सबमिट हो गया!
            </div>
            <h2 style={{ color: "#166534", fontSize: "2rem", marginTop: "1rem" }}>आपका राइट-अप रिव्यू के लिए भेज दिया गया है</h2>
            <p style={{ color: "#15803d", marginBottom: "2rem", fontSize: "1.1rem" }}>
              रिव्यूअर जल्द ही आपके इनोवेशन की जांच करेंगे। SCERT पोर्टल का उपयोग करने के लिए धन्यवाद।
            </p>
            <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ backgroundColor: "#1e3a8a", padding: "1rem 2rem", fontSize: "1.1rem", borderRadius: "50px" }}>
              ✨ नया इनोवेशन सबमिट करें
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: "0", overflow: "hidden", border: "none", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            
            <div style={{ background: "linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)", padding: "2rem", color: "white", textAlign: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>
                🌟 नया इनोवेशन राइट-अप सबमिट करें
              </h2>
              <p style={{ margin: "0.5rem 0 0 0", color: "#bfdbfe", fontSize: "1rem" }}>
                कृपया नीचे दिए गए रंग-बिरंगे फॉर्म में अपने इनोवेशन की जानकारी ध्यानपूर्वक भरें।
              </p>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} style={{ padding: "2.5rem", backgroundColor: "#ffffff" }}>
              
              {/* Row 1: Name and Mobile */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div style={{ backgroundColor: "#fff7ed", padding: "1.5rem", borderRadius: "12px", borderLeft: "5px solid #f97316", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <label className="form-label" style={{ color: "#9a3412", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    👤 पूरा नाम (Full Name)
                  </label>
                  <input type="text" name="name" className="input-field" placeholder="उदाहरण: रमेश कुमार" required style={{ width: "100%", marginTop: "0.5rem", border: "1px solid #fdba74" }} />
                </div>
                <div style={{ backgroundColor: "#f0fdfa", padding: "1.5rem", borderRadius: "12px", borderLeft: "5px solid #14b8a6", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <label className="form-label" style={{ color: "#115e59", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    📱 मोबाइल नंबर (Mobile Number)
                  </label>
                  <input type="tel" name="mobile" className="input-field" placeholder="10 अंकों का नंबर" required style={{ width: "100%", marginTop: "0.5rem", border: "1px solid #5eead4" }} />
                </div>
              </div>

              {/* Row 2: District and School */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div style={{ backgroundColor: "#fef2f2", padding: "1.5rem", borderRadius: "12px", borderLeft: "5px solid #ef4444", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <label className="form-label" style={{ color: "#991b1b", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    📍 जनपद (District)
                  </label>
                  <select name="district" className="input-field" required style={{ width: "100%", marginTop: "0.5rem", border: "1px solid #fca5a5" }}>
                    <option value="">जनपद चुनें (Select District)</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div style={{ backgroundColor: "#f5f3ff", padding: "1.5rem", borderRadius: "12px", borderLeft: "5px solid #8b5cf6", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <label className="form-label" style={{ color: "#4c1d95", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    🏫 विद्यालय का नाम (School Name)
                  </label>
                  <input type="text" name="school" className="input-field" placeholder="उदाहरण: प्रा. वि. रामपुर" required style={{ width: "100%", marginTop: "0.5rem", border: "1px solid #c4b5fd" }} />
                </div>
              </div>

              {/* Row 3: Innovation Title */}
              <div style={{ backgroundColor: "#fffbeb", padding: "1.5rem", borderRadius: "12px", borderLeft: "5px solid #eab308", marginBottom: "2rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <label className="form-label" style={{ color: "#854d0e", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  💡 इनोवेशन का शीर्षक (Innovation Title)
                </label>
                <input type="text" name="title" className="input-field" placeholder="अपने इनोवेशन का छोटा और आकर्षक शीर्षक यहाँ लिखें" required style={{ width: "100%", marginTop: "0.5rem", border: "1px solid #fde047", fontSize: "1.1rem", padding: "1rem" }} />
              </div>

              {/* Row 4: Detailed Write-up */}
              <div style={{ backgroundColor: "#f0f9ff", padding: "1.5rem", borderRadius: "12px", borderLeft: "5px solid #0ea5e9", marginBottom: "2rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <label className="form-label" style={{ color: "#075985", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  📝 विस्तृत राइट-अप (Detailed Write-up)
                </label>
                <textarea name="content" className="input-field" placeholder="अपने इनोवेशन का उद्देश्य, प्रक्रिया और परिणाम यहाँ विस्तार से लिखें..." required style={{ width: "100%", marginTop: "0.5rem", border: "1px solid #7dd3fc", minHeight: "150px", fontSize: "1.1rem" }}></textarea>
              </div>

              {/* Row 5: File Upload */}
              <div style={{ backgroundColor: "#fdf4ff", padding: "2rem", borderRadius: "12px", border: "2px dashed #d946ef", textAlign: "center", boxShadow: "inset 0 2px 4px 0 rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📎</div>
                <label className="form-label" style={{ color: "#86198f", fontSize: "1.2rem", fontWeight: "bold" }}>
                  डॉक्यूमेंट अपलोड करें (.docx, .pdf)
                </label>
                <div style={{ marginTop: "1rem" }}>
                  <input type="file" name="file" accept=".pdf,.doc,.docx" style={{ fontSize: "1rem", color: "#701a75" }} />
                </div>
                <p style={{ margin: "1rem 0 0 0", fontSize: "0.9rem", color: "#a21caf", backgroundColor: "#fae8ff", display: "inline-block", padding: "0.2rem 1rem", borderRadius: "20px" }}>अधिकतम फाइल साइज: 5MB</p>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: "3rem", textAlign: "center" }}>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ 
                  background: loading ? "#9ca3af" : "linear-gradient(90deg, #10b981 0%, #059669 100%)", 
                  padding: "1.2rem 4rem", 
                  fontSize: "1.3rem",
                  borderRadius: "50px",
                  boxShadow: loading ? "none" : "0 10px 15px -3px rgba(16, 185, 129, 0.4)",
                  border: "none",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "transform 0.2s"
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => !loading && (e.currentTarget.style.transform = "scale(1)")}
                >
                  {loading ? "⏳ सबमिट हो रहा है..." : "🚀 सबमिट करें (Submit Innovation)"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
