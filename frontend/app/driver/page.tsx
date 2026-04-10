"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { deliveries, authHelpers } from "../../lib/mockData";

export default function Driver() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>("DEL-001");
  const [marked, setMarked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  // POD upload state
  const [podTarget, setPodTarget] = useState<string | null>(null); // delivery id awaiting photo
  const [podPreview, setPodPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const role = authHelpers.getRole();
    if (!role) { router.push("/login"); return; }
    if (role !== "driver") {
      if (role === "dispatcher") router.push("/dashboard");
      else router.push("/track");
      return;
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  const riskColor = (s: number) => s > 75 ? "#f87171" : s > 50 ? "#fbbf24" : "#4ade80";

  // Called when driver clicks "Mark Delivered" — opens POD modal
  const handleMarkDelivered = (id: string) => {
    setPodTarget(id);
    setPodPreview(null);
  };

  // Called when file is selected in modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPodPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Confirm POD and mark as delivered
  const confirmPOD = () => {
    if (!podTarget || !podPreview) return;
    setMarked((prev) => [...prev, podTarget]);
    setPodTarget(null);
    setPodPreview(null);
  };

  const cancelPOD = () => {
    setPodTarget(null);
    setPodPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main style={{ background: "#0a1a0f", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        .del-row:hover{border-color:rgba(34,197,94,0.3) !important}
        .mark-btn:hover{background:#16a34a !important;transform:translateY(-1px)}
        .pod-confirm-btn:hover{background:#16a34a !important}
        .pod-confirm-btn:disabled{opacity:.4;cursor:not-allowed;transform:none !important}
      `}</style>

      {/* ── POD Upload Modal ── */}
      {podTarget && (
        <div
          onClick={cancelPOD}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)", zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f2214", border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: "18px", padding: "28px", width: "360px",
              animation: "modalIn .2s ease both",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
              Proof of Delivery
            </h3>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
              Upload a photo of the delivered package before confirming.
            </p>

            {/* Upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${podPreview ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "12px", padding: "20px",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "10px",
                cursor: "pointer", marginBottom: "16px",
                background: podPreview ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)",
                minHeight: "160px", transition: "all .2s",
              }}
            >
              {podPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={podPreview}
                  alt="POD preview"
                  style={{ maxHeight: "130px", maxWidth: "100%", borderRadius: "8px", objectFit: "cover" }}
                />
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                    Tap to take / upload photo
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {podPreview && (
              <button
                onClick={() => { setPodPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                style={{
                  width: "100%", padding: "8px", background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                  color: "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                Retake photo
              </button>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={cancelPOD}
                style={{
                  flex: 1, padding: "10px", background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                  color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 500, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPOD}
                disabled={!podPreview}
                className="pod-confirm-btn"
                style={{
                  flex: 2, padding: "10px", background: "#15803d",
                  border: "none", borderRadius: "10px",
                  color: "#fff", fontSize: "13px", fontWeight: 600,
                  cursor: podPreview ? "pointer" : "not-allowed",
                  transition: "background .2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Confirm Delivered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{
        padding: "0 32px", height: "60px", display: "flex", alignItems: "center",
        justifyContent: "space-between", background: "rgba(10,26,15,0.9)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(34,197,94,0.1)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <div style={{ width: "28px", height: "28px", background: "#15803d", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "16px" }}>
            <span style={{ color: "#fff" }}>Swift</span><span style={{ color: "#4ade80" }}>Lane</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { label: "Overview", href: "/driver", active: true },
            { label: "Settings", href: "/dashboard/settings", active: false },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                color: item.active ? "#4ade80" : "rgba(255,255,255,0.4)",
                background: item.active ? "rgba(34,197,94,0.1)" : "transparent",
                cursor: "pointer",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Live badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "20px", padding: "4px 12px" }}>
            <div style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%", animation: "pulse 1.5s infinite" }}/>
            <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>Live</span>
          </div>

          {/* ── Profile button — now clickable → /dashboard/profile ── */}
          <div
            onClick={() => router.push("/dashboard/profile")}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "4px 8px", borderRadius: "10px", transition: "background .15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ width: "34px", height: "34px", background: "#15803d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>AR</span>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>anwitarajendra</p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Driver</p>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{ padding: "28px 32px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px", animation: "fadeUp .4s ease both" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>My Route</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Your assigned deliveries and optimized route</p>
        </div>

        {/* Map card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "16px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(34,197,94,0.1)", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Optimized Route</p>
            </div>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", borderRadius: "6px", padding: "3px 8px" }}>Mapbox — pending</span>
          </div>
          <svg width="100%" height="160" viewBox="0 0 800 160" style={{ display: "block" }}>
            <rect width="800" height="160" fill="rgba(0,0,0,0.2)"/>
            <path d="M80 120 Q200 40 320 80 Q440 120 560 60 Q680 20 760 80" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="2" strokeDasharray="8 6"/>
            {[{ cx: 80, cy: 120 }, { cx: 320, cy: 80 }, { cx: 560, cy: 60 }, { cx: 760, cy: 80 }].map((p, i) => (
              <g key={i}>
                <circle cx={p.cx} cy={p.cy} r="10" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
                <circle cx={p.cx} cy={p.cy} r="5" fill="#4ade80"/>
                <text x={p.cx} y={p.cy - 16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="Inter,sans-serif">{`Stop ${i + 1}`}</text>
              </g>
            ))}
            <circle cx="200" cy="95" r="8" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5"/>
            <text x="200" y="99" textAnchor="middle" fontSize="8" fill="#4ade80" fontFamily="Inter,sans-serif">You</text>
            <text x="400" y="90" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.15)" fontFamily="Inter,sans-serif">Route visualization pending</text>
          </svg>
        </div>

        {/* Deliveries */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "28px", background: "rgba(34,197,94,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Active Deliveries ({deliveries.length})</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {deliveries.map((d, i) => (
              <div
                key={d.id}
                className="del-row"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  /* ── Fix: split `border` into sides so borderLeft doesn't conflict ── */
                  borderTop: `1px solid ${expanded === d.id ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRight: `1px solid ${expanded === d.id ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderBottom: `1px solid ${expanded === d.id ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderLeft: `3px solid ${riskColor(d.riskScore)}`,
                  borderRadius: "0 12px 12px 0", overflow: "hidden",
                  transition: "all .15s", animation: `fadeUp ${.2 + i * .06}s ease both`,
                }}
              >
                <div
                  onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                  style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      {d.riskScore > 75 && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        </svg>
                      )}
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{d.customer.name}</p>
                      <span style={{ fontSize: "10px", color: riskColor(d.riskScore), background: `${riskColor(d.riskScore)}15`, borderRadius: "6px", padding: "2px 7px", fontWeight: 600 }}>
                        {d.riskScore > 75 ? "at risk" : "in transit"}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{d.customer.address}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>ETA: {d.eta}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" style={{ transform: expanded === d.id ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {expanded === d.id && (
                  <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {d.whatsappLog.length > 0 && (
                      <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "8px", padding: "10px 12px", margin: "12px 0" }}>
                        <p style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600, marginBottom: "4px" }}>Customer instruction:</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{d.whatsappLog[d.whatsappLog.length - 1].message}</p>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button style={{ padding: "8px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                        Details
                      </button>

                      {!marked.includes(d.id) ? (
                        /* ── Now opens POD modal instead of marking directly ── */
                        <button
                          onClick={() => handleMarkDelivered(d.id)}
                          className="mark-btn"
                          style={{ padding: "8px 16px", background: "#15803d", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all .2s", boxShadow: "0 2px 8px rgba(21,128,61,0.3)" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                          Mark Delivered
                        </button>
                      ) : (
                        <div style={{ padding: "8px 16px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", color: "#4ade80", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9l4 4 8-8" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delivered
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
