"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deliveries, stats, user, authHelpers } from "../../lib/mockData";

export default function Dashboard() {
  const router = useRouter();
  const [selected, setSelected] = useState<null | typeof deliveries[0]>(null);
  const [liveStats, setLiveStats] = useState(stats);
  const [time, setTime] = useState("");
  const [checked, setChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const role = authHelpers.getRole();
    if (!role) { router.push("/login"); return; }
    if (role !== "dispatcher") {
      if (role === "driver") router.push("/driver");
      else router.push("/track");
      return;
    }
    setDarkMode(authHelpers.getDarkMode());
    setChecked(true);
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setLiveStats((p) => ({ ...p, total: p.total + Math.floor(Math.random() * 2) }));
    }, 3000);
    setTime(new Date().toLocaleTimeString());
    return () => clearInterval(t);
  }, []);

  if (!checked) return null;

  const dark = darkMode;
  const bg = dark ? "#0a1a0f" : "#f8faf9";
  const navBg = dark ? "rgba(10,26,15,0.9)" : "#fff";
  const navBorder = dark ? "rgba(34,197,94,0.1)" : "#e5e7eb";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "#fff";
  const cardBorder = dark ? "rgba(34,197,94,0.15)" : "#e5e7eb";
  const textPrimary = dark ? "#fff" : "#111827";
  const textSecondary = dark ? "rgba(255,255,255,0.4)" : "#6b7280";
  const textMuted = dark ? "rgba(255,255,255,0.3)" : "#9ca3af";

  const riskColor = (s: number) => s > 75 ? "#f87171" : s > 50 ? "#fbbf24" : "#4ade80";
  const riskBg = (s: number) => s > 75 ? (dark ? "rgba(248,113,113,0.15)" : "#fef2f2") : s > 50 ? (dark ? "rgba(251,191,36,0.15)" : "#fffbeb") : (dark ? "rgba(74,222,128,0.15)" : "#f0fdf4");

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background .3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.12) !important}
        .risk-card:hover{border-color:rgba(34,197,94,0.4) !important;transform:translateX(-2px)}
      `}</style>

      <nav style={{ background: navBg, borderBottom: `1px solid ${navBorder}`, padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <div style={{ width: "32px", height: "32px", background: "#15803d", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "17px" }}><span style={{ color: textPrimary }}>Swift</span><span style={{ color: "#4ade80" }}>Lane</span></span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { label: "Overview", href: "/dashboard" },
            { label: "Deliveries", href: "/dashboard/deliveries" },
            { label: "Analytics", href: "/dashboard/analytics" },
            { label: "Settings", href: "/dashboard/settings" },
          ].map((item) => (
            <div key={item.href} onClick={() => router.push(item.href)} style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: item.href === "/dashboard" ? "#4ade80" : textSecondary, background: item.href === "/dashboard" ? (dark ? "rgba(34,197,94,0.1)" : "#f0fdf4") : "transparent", cursor: "pointer" }}>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: textMuted }}>{time}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: dark ? "rgba(34,197,94,0.1)" : "#f0fdf4", border: `1px solid ${dark ? "rgba(34,197,94,0.2)" : "#bbf7d0"}`, borderRadius: "20px", padding: "5px 12px" }}>
            <div style={{ width: "7px", height: "7px", background: "#16a34a", borderRadius: "50%", animation: "pulse 1.5s infinite" }}/>
            <span style={{ fontSize: "11px", color: "#15803d", fontWeight: 600 }}>Live</span>
          </div>
          <div onClick={() => router.push("/dashboard/profile")} style={{ width: "36px", height: "36px", background: "#15803d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{user.avatar}</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: "24px 32px" }}>
        <div style={{ marginBottom: "24px", animation: "fadeUp .4s ease both" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: textPrimary, letterSpacing: "-0.5px" }}>Good morning, {user.name.split(" ")[0]}</h1>
          <p style={{ fontSize: "13px", color: textSecondary, marginTop: "3px" }}>{user.company} · {user.role}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
          {[
            { label: "Total deliveries", value: liveStats.total.toString(), sub: "today", color: textPrimary },
            { label: "High risk", value: liveStats.highRisk.toString(), sub: "score > 75%", color: "#f87171" },
            { label: "Auto-resolved", value: liveStats.autoResolved.toString(), sub: "via WhatsApp", color: "#4ade80" },
            { label: "Failed", value: liveStats.failed.toString(), sub: "re-attempting", color: "#fbbf24" },
          ].map((s, i) => (
            <div key={s.label} className="stat-card" style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "14px", padding: "18px", transition: "transform .2s, box-shadow .2s", animation: `fadeUp ${.2 + i * .08}s ease both`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: "11px", color: textSecondary, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
              <p style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-1px", color: s.color }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: textMuted, marginTop: "4px" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 320px 360px" : "1fr 320px", gap: "16px" }}>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#f3f4f6"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: textPrimary }}>Live delivery map</span>
              <span style={{ fontSize: "10px", background: dark ? "rgba(34,197,94,0.1)" : "#f0fdf4", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "6px", padding: "3px 8px", fontWeight: 500 }}>Mapbox — pending</span>
            </div>
            <svg width="100%" height="380" viewBox="0 0 700 380" style={{ display: "block" }}>
              <rect width="700" height="380" fill={dark ? "#0d2010" : "#f8faf9"}/>
              <rect x="0" y="168" width="700" height="28" fill={dark ? "#1a3020" : "#e5e7eb"}/>
              <rect x="336" y="0" width="24" height="380" fill={dark ? "#1a3020" : "#e5e7eb"}/>
              <rect x="150" y="0" width="18" height="380" fill={dark ? "#162a1c" : "#f3f4f6"}/>
              <rect x="520" y="0" width="18" height="380" fill={dark ? "#162a1c" : "#f3f4f6"}/>
              {deliveries.map((d, i) => (
                <g key={d.id} onClick={() => setSelected(d)} style={{ cursor: "pointer" }}>
                  <circle cx={d.coords.x} cy={d.coords.y} r="16" fill={riskColor(d.riskScore) + "22"} stroke={riskColor(d.riskScore)} strokeWidth="1.5" style={{ animation: `pulse ${1.5 + i * .2}s infinite` }}/>
                  <circle cx={d.coords.x} cy={d.coords.y} r="7" fill={riskColor(d.riskScore)}/>
                  <text x={d.coords.x + 18} y={d.coords.y + 4} fill={riskColor(d.riskScore)} fontSize="10" fontFamily="Inter,sans-serif" fontWeight="600">{d.riskScore}%</text>
                </g>
              ))}
              <g>
                <rect x="328" y="170" width="28" height="18" rx="4" fill="#15803d"/>
                <rect x="352" y="167" width="10" height="21" rx="2" fill="#166534"/>
                <circle cx="335" cy="189" r="4" fill="#dcfce7"/>
                <circle cx="348" cy="189" r="4" fill="#dcfce7"/>
              </g>
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "11px", color: textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Delivery risk feed</p>
            {deliveries.map((d, i) => (
              <div
                key={d.id}
                onClick={() => setSelected(selected?.id === d.id ? null : d)}
                className="risk-card"
                style={{
                  background: selected?.id === d.id ? (dark ? "rgba(34,197,94,0.08)" : "#f0fdf4") : cardBg,
                  /* ── Fix: split `border` into sides so borderLeft doesn't conflict ── */
                  borderTop: `1px solid ${selected?.id === d.id ? "rgba(34,197,94,0.4)" : cardBorder}`,
                  borderRight: `1px solid ${selected?.id === d.id ? "rgba(34,197,94,0.4)" : cardBorder}`,
                  borderBottom: `1px solid ${selected?.id === d.id ? "rgba(34,197,94,0.4)" : cardBorder}`,
                  borderLeft: `3px solid ${riskColor(d.riskScore)}`,
                  borderRadius: "0 14px 14px 0", padding: "12px 14px",
                  transition: "all .15s", cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  animation: `fadeUp ${.3 + i * .08}s ease both`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: textPrimary }}>{d.customer.name}</p>
                    <p style={{ fontSize: "10px", color: textMuted, marginTop: "1px" }}>{d.id} · {d.driver.name}</p>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: riskBg(d.riskScore), color: riskColor(d.riskScore), borderRadius: "8px", padding: "3px 8px" }}>{d.riskScore}%</span>
                </div>
                <p style={{ fontSize: "11px", color: textSecondary, marginBottom: "7px" }}>{d.riskReason}</p>
                <div style={{ height: "3px", background: dark ? "rgba(255,255,255,0.08)" : "#f3f4f6", borderRadius: "2px" }}>
                  <div style={{ height: "3px", width: `${d.riskScore}%`, background: riskColor(d.riskScore), borderRadius: "2px" }}/>
                </div>
                {d.status === "whatsapp_sent" && (
                  <span style={{ fontSize: "9px", background: dark ? "rgba(34,197,94,0.1)" : "#f0fdf4", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "4px", padding: "2px 6px", marginTop: "6px", display: "inline-block", fontWeight: 500 }}>WhatsApp sent</span>
                )}
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "16px", padding: "20px", animation: "slideIn .25s ease both", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflowY: "auto", maxHeight: "520px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: textPrimary }}>{selected.id}</h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: textSecondary, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f8faf9", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", color: textSecondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Customer</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: textPrimary }}>{selected.customer.name}</p>
                <p style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>{selected.customer.phone}</p>
                <p style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>{selected.customer.address}</p>
              </div>
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f8faf9", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", color: textSecondary, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Risk breakdown</p>
                {[
                  { label: "Weather impact", value: selected.signals.weather },
                  { label: "Traffic delay", value: selected.signals.traffic },
                  { label: "Customer history", value: selected.signals.customerHistory },
                ].map((sig) => (
                  <div key={sig.label} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "12px", color: textSecondary }}>{sig.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: riskColor(sig.value) }}>{sig.value}%</span>
                    </div>
                    <div style={{ height: "4px", background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", borderRadius: "2px" }}>
                      <div style={{ height: "4px", width: `${sig.value}%`, background: riskColor(sig.value), borderRadius: "2px" }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f8faf9", borderRadius: "10px", padding: "12px" }}>
                <p style={{ fontSize: "11px", color: textSecondary, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.4px" }}>WhatsApp log</p>
                {selected.whatsappLog.length === 0 ? (
                  <p style={{ fontSize: "12px", color: textMuted }}>No messages yet</p>
                ) : (
                  selected.whatsappLog.map((msg, i) => (
                    <div key={i} style={{ marginBottom: "8px", display: "flex", flexDirection: "column", alignItems: msg.from === "bot" ? "flex-start" : "flex-end" }}>
                      <div style={{ background: msg.from === "bot" ? (dark ? "rgba(34,197,94,0.1)" : "#f0fdf4") : (dark ? "rgba(255,255,255,0.08)" : "#fff"), border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`, borderRadius: "10px", padding: "8px 10px", maxWidth: "85%" }}>
                        <p style={{ fontSize: "12px", color: textPrimary, lineHeight: 1.5 }}>{msg.message}</p>
                      </div>
                      <span style={{ fontSize: "10px", color: textMuted, marginTop: "2px" }}>{msg.from === "bot" ? "SwiftLane AI" : selected.customer.name} · {msg.time}</span>
                    </div>
                  ))
                )}
              </div>
              <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: dark ? "rgba(34,197,94,0.08)" : "#f0fdf4", borderRadius: "10px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "10px", color: textSecondary, marginBottom: "3px" }}>ETA</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#4ade80" }}>{selected.eta}</p>
                </div>
                <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f8faf9", borderRadius: "10px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "10px", color: textSecondary, marginBottom: "3px" }}>Driver</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: textPrimary }}>{selected.driver.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
