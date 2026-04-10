"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deliveries, authHelpers } from "../../lib/mockData";

export default function Track() {
  const router = useRouter();
  const [selected, setSelected] = useState<typeof deliveries[0] | null>(null);
  const [checked, setChecked] = useState(false);
  const myDeliveries = deliveries.slice(0, 4);

  useEffect(() => {
    const role = authHelpers.getRole();
    if (!role) { router.push("/login"); return; }
    if (role !== "customer") {
      if (role === "dispatcher") router.push("/dashboard");
      else router.push("/driver");
      return;
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  const riskColor = (s: number) => s > 75 ? "#f87171" : s > 50 ? "#fbbf24" : "#4ade80";
  const statusColor = (s: string) => s === "delivered" ? "#4ade80" : s === "failed" ? "#f87171" : "#fbbf24";
  const statusLabel = (s: string) => s === "in_transit" ? "in transit" : s === "delivered" ? "delivered" : s === "failed" ? "failed" : s;

  return (
    <main style={{ background: "#0a1a0f", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        .del-card:hover{border-color:rgba(34,197,94,0.4) !important;transform:translateY(-1px)}
      `}</style>

      <nav style={{ padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,26,15,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(34,197,94,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <div style={{ width: "28px", height: "28px", background: "#15803d", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "16px" }}><span style={{ color: "#fff" }}>Swift</span><span style={{ color: "#4ade80" }}>Lane</span></span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { label: "My Deliveries", href: "/track", active: true },
            { label: "Settings", href: "/dashboard/settings", active: false },
          ].map((item) => (
            <div key={item.label} onClick={() => router.push(item.href)} style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: item.active ? "#4ade80" : "rgba(255,255,255,0.4)", background: item.active ? "rgba(34,197,94,0.1)" : "transparent", cursor: "pointer" }}>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "20px", padding: "4px 12px" }}>
            <div style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%", animation: "pulse 1.5s infinite" }}/>
            <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>Live</span>
          </div>
          <div onClick={() => router.push("/dashboard/settings")} style={{ width: "34px", height: "34px", background: "#15803d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>AR</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: "28px 32px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px", animation: "fadeUp .4s ease both" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>My Deliveries</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Track your orders and manage delivery preferences</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: "16px" }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "28px", background: "rgba(34,197,94,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Active Deliveries</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {myDeliveries.map((d, i) => (
                  <div
                    key={d.id}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)}
                    className="del-card"
                    style={{
                      background: selected?.id === d.id ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                      /* ── Fix: split `border` into sides so borderLeft doesn't conflict ── */
                      borderTop: `1px solid ${selected?.id === d.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                      borderRight: `1px solid ${selected?.id === d.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                      borderBottom: `1px solid ${selected?.id === d.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                      borderLeft: `3px solid ${riskColor(d.riskScore)}`,
                      borderRadius: "0 12px 12px 0", padding: "14px 16px",
                      cursor: "pointer", transition: "all .15s",
                      animation: `fadeUp ${.2 + i * .08}s ease both`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{d.id}</p>
                          <span style={{ fontSize: "10px", fontWeight: 600, color: statusColor(d.status), background: `${statusColor(d.status)}15`, border: `1px solid ${statusColor(d.status)}30`, borderRadius: "6px", padding: "2px 7px" }}>{statusLabel(d.status)}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ETA {d.eta} · Driver: {d.driver.name}</p>
                        {d.riskScore > 75 && (
                          <p style={{ fontSize: "11px", color: "#fbbf24", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                            Delivery at risk — you may receive a WhatsApp notification
                          </p>
                        )}
                        {d.whatsappLog.length > 0 && (
                          <p style={{ fontSize: "11px", color: "#4ade80", marginTop: "3px" }}>💬 {d.whatsappLog.length} messages</p>
                        )}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: riskColor(d.riskScore) }}>{d.riskScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(34,197,94,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Live Tracking</p>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", borderRadius: "6px", padding: "3px 8px" }}>Mapbox — pending</span>
              </div>
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>Real-time tracking will appear here</p>
              </div>
            </div>
          </div>

          {selected && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "20px", animation: "slideIn .25s ease both", overflowY: "auto", maxHeight: "600px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{selected.id}</h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>×</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Delivery address</p>
                <p style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{selected.customer.address}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>ETA: {selected.eta}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Risk breakdown</p>
                {[
                  { label: "Weather", value: selected.signals.weather },
                  { label: "Traffic", value: selected.signals.traffic },
                  { label: "History", value: selected.signals.customerHistory },
                ].map((sig) => (
                  <div key={sig.label} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{sig.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: riskColor(sig.value) }}>{sig.value}%</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                      <div style={{ height: "3px", width: `${sig.value}%`, background: riskColor(sig.value), borderRadius: "2px" }}/>
                    </div>
                  </div>
                ))}
              </div>
              {selected.whatsappLog.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.4px" }}>WhatsApp log</p>
                  {selected.whatsappLog.map((msg, i) => (
                    <div key={i} style={{ marginBottom: "8px", display: "flex", flexDirection: "column", alignItems: msg.from === "bot" ? "flex-start" : "flex-end" }}>
                      <div style={{ background: msg.from === "bot" ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.08)", border: `1px solid ${msg.from === "bot" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "8px 10px", maxWidth: "85%" }}>
                        <p style={{ fontSize: "12px", color: "#fff", lineHeight: 1.5 }}>{msg.message}</p>
                      </div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{msg.from === "bot" ? "SwiftLane AI" : "You"} · {msg.time}</span>
                    </div>
                  ))}
                </div>
              )}
              {selected.status === "failed" && (
                <button style={{ width: "100%", padding: "12px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#f87171", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                  Request Refund
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
