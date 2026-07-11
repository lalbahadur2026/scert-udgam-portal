"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReviewerDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("PENDING");

  return (
    <div className="container">
      <nav className="nav-bar" style={{ marginBottom: "2rem", borderRadius: "8px" }}>
        <div className="nav-brand">SCERT Reviewer Panel</div>
        <Link href="/" className="btn btn-secondary">Logout</Link>
      </nav>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="card-title">Pending Write-ups (77)</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span className="status-badge status-pending">45 Pending</span>
            <span className="status-badge status-approved">20 Approved</span>
            <span className="status-badge status-correction">12 Correction</span>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>District</th>
                <th>Innovation Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ramesh Kumar</td>
                <td>Lucknow</td>
                <td>Joyful Learning in Math</td>
                <td>
                  <span className={`status-badge status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.9rem" }} onClick={() => setShowModal(true)}>
                    Review
                  </button>
                </td>
              </tr>
              <tr>
                <td>Suresh Singh</td>
                <td>Agra</td>
                <td>Science with Waste Material</td>
                <td><span className="status-badge status-approved">APPROVED</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.9rem" }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 50 }}>
          <div className="card" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 className="card-title" style={{ marginBottom: "1rem" }}>Review Write-up</h2>
            <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "var(--bg-color)", borderRadius: "8px" }}>
              <p><strong>Teacher:</strong> Ramesh Kumar (Lucknow)</p>
              <p><strong>Title:</strong> Joyful Learning in Math</p>
              <hr style={{ margin: "1rem 0", borderColor: "var(--border-color)" }} />
              <p>I have used local stones and leaves to teach counting to grade 1 students...</p>
            </div>

            <div className="form-group">
              <label className="form-label">Reviewer Comments</label>
              <textarea className="input-field" placeholder="e.g. Please improve the objective and add photos." rows={3}></textarea>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Close</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: "var(--danger)", color: "white" }} onClick={() => { setStatus("CORRECTION"); setShowModal(false); }}>
                Needs Correction
              </button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: "var(--success)", color: "white" }} onClick={() => { setStatus("APPROVED"); setShowModal(false); }}>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
