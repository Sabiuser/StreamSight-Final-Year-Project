// import { useRef, useEffect, useState, useCallback } from "react";
// import { Box, Grid, Typography, Chip, IconButton, Tooltip, Table, TableBody,
//   TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
// import { Refresh, NotificationsActive, Circle, Close, Smartphone, DesktopWindows, TabletMac, Language, Speed, Bolt, Schedule } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import { useSocket } from "../hooks/useSocket";
// import KPICard from "../components/KPICard";
// import FunnelChart from "../components/FunnelChart";
// import AnomalyFeed from "../components/AnomalyFeed";
// import EventTimeline from "../components/EventTimeline";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// const DEVICE_ICONS = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
// const FLAG = { IN:"🇮🇳", US:"🇺🇸", UK:"🇬🇧", SG:"🇸🇬", DE:"🇩🇪" };

// function timeAgo(ts) {
//   if (!ts) return "–";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 5) return "just now";
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s/60)}m ago`;
//   return `${Math.floor(s/3600)}h ago`;
// }

// // UPDATED: Signal Section with Icons/Bars
// function UserStatusDot({ ts }) {
//   const diff = ts ? Date.now() - new Date(ts).getTime() : 999999;
//   const isActive = diff < 10000; // Active if less than 10s

//   return (
//     <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
//       <Box display="flex" alignItems="baseline" gap={0.4} sx={{ height: 12 }}>
//         {[1, 2, 3, 4].map((bar) => {
//           // Signal bars drop off based on time since last activity
//           const barActive = diff < (bar * 15000);
//           return (
//             <Box key={bar} sx={{
//               width: 3,
//               height: bar * 3,
//               borderRadius: "1px",
//               background: barActive ? "#00d4aa" : "rgba(255,255,255,0.1)",
//               boxShadow: barActive ? "0 0 6px #00d4aa" : "none",
//               transition: "all 0.4s ease"
//             }} />
//           );
//         })}
//       </Box>
//       <Box sx={{
//         width: 6, height: 6, borderRadius: "50%",
//         background: isActive ? "#00d4aa" : "#475569",
//         animation: isActive ? "signal-pulse 1.5s infinite ease-in-out" : "none"
//       }} />
//     </Box>
//   );
// }

// export default function Dashboard() {
//   const { metrics: liveMetrics, anomalies: liveAnomalies, events: liveEvents } = useSocket();
//   const prevMetrics = useRef(null);
//   const prevHighCount = useRef(0);

//   const [polledMetrics, setPolledMetrics] = useState(null);
//   const [polledAnomalies, setPolledAnomalies] = useState([]);
//   const [polledEvents, setPolledEvents] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [kpiHistory, setKpiHistory] = useState({ sessions: [], cvr: [], bounce: [], users: [] });

//   // New state for Popup
//   const [selectedUser, setSelectedUser] = useState(null);

//   const fetchAll = useCallback(async (manual = false) => {
//     if (manual) setRefreshing(true);
//     try {
//       const [mRes, aRes, eRes] = await Promise.all([
//         fetch(`${API_URL}/api/metrics`),
//         fetch(`${API_URL}/api/anomalies`),
//         fetch(`${API_URL}/api/events`),
//       ]);
//       const [m, a, e] = await Promise.all([mRes.json(), aRes.json(), eRes.json()]);
//       if (m?.cvr !== undefined) {
//         setPolledMetrics(m);
//         setLastUpdated(new Date());
//         setKpiHistory(prev => ({
//           sessions: [...prev.sessions.slice(-9), m.session_count || 0],
//           cvr:      [...prev.cvr.slice(-9),      m.cvr || 0],
//           bounce:   [...prev.bounce.slice(-9),   m.bounce_rate || 0],
//           users:    [...prev.users.slice(-9),    m.active_users || 0],
//         }));
//       }
//       if (Array.isArray(a)) {
//         setPolledAnomalies(a);
//         const highCount = a.filter(x => x.severity === "high").length;
//         if (highCount > prevHighCount.current) {
//           toast.error(`🚨 ${highCount - prevHighCount.current} new HIGH anomaly detected!`, { autoClose: 4000 });
//         }
//         prevHighCount.current = highCount;
//       }
//       if (Array.isArray(e)) setPolledEvents(e.slice(0, 20));
//     } catch (err) { console.error(err); }
//     finally { if (manual) setTimeout(() => setRefreshing(false), 500); }
//   }, []);

//   useEffect(() => {
//     fetchAll();
//     const iv = setInterval(fetchAll, 5000);
//     return () => clearInterval(iv);
//   }, [fetchAll]);

//   const metrics = liveMetrics || polledMetrics;
//   const anomalies = liveAnomalies.length > 0 ? liveAnomalies : polledAnomalies;
//   const events = liveEvents.length > 0 ? liveEvents : polledEvents;
//   const prev = prevMetrics.current;
//   prevMetrics.current = metrics;

//   const userMap = {};
//   events.forEach(e => {
//     if (!userMap[e.user_id]) userMap[e.user_id] = { user_id: e.user_id, events: 0, device: e.device, country: e.country, lastActive: e.timestamp, page: e.page };
//     userMap[e.user_id].events++;
//     if (new Date(e.timestamp) > new Date(userMap[e.user_id].lastActive)) userMap[e.user_id].lastActive = e.timestamp;
//   });
//   const users = Object.values(userMap).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive)).slice(0, 8);

//   const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
//   const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

//   return (
//     <Box className="page-dashboard" sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh", position: "relative", zIndex: 1 }}>
//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
//         <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
//           <Box>
//             <Typography variant="h4" fontWeight={800} sx={{ color: "#f1f5f9", letterSpacing: "-0.5px", mb: 0.5 }}>
//               Live Dashboard
//             </Typography>
//             <Typography sx={{ color: "#64748b", fontSize: "0.875rem", fontFamily: "'JetBrains Mono',monospace" }}>
//               Real-time clickstream analytics · auto-refreshes every 5s
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             {lastUpdated && (
//               <Chip size="small" label={`⟳ ${lastUpdated.toLocaleTimeString()}`}
//                 sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
//             )}
//             <Tooltip title="Refresh now">
//               <IconButton onClick={() => fetchAll(true)} size="small"
//                 sx={{ background: "#1e293b", border: "1px solid #334155", color: "#64748b", "&:hover": { color: "#00d4aa", borderColor: "rgba(0,212,170,0.4)" },
//                   ...(refreshing ? { animation: "spin 0.8s linear infinite" } : {}) }}>
//                 <Refresh fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//       </motion.div>

//       {/* KPI Cards */}
//       <motion.div variants={containerVariants} initial="hidden" animate="visible">
//         <Grid container spacing={2.5} mb={3}>
//           {[
//             { type: "sessions", value: metrics?.session_count, history: kpiHistory.sessions },
//             { type: "cvr",      value: metrics?.cvr,           unit: "%", history: kpiHistory.cvr },
//             { type: "bounce",   value: metrics?.bounce_rate,   unit: "%", history: kpiHistory.bounce },
//             { type: "users",    value: metrics?.active_users,  history: kpiHistory.users },
//           ].map((card, i) => (
//             <Grid item xs={12} sm={6} xl={3} key={card.type}>
//               <motion.div variants={itemVariants}>
//                 <KPICard {...card} prev={prev?.[["session_count","cvr","bounce_rate","active_users"][i]]} />
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>
//       </motion.div>

//       {/* Funnel + Anomaly */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//         <Grid container spacing={2.5} mb={3}>
//           <Grid item xs={12} lg={8}>
//             <FunnelChart funnel={metrics?.funnel} />
//           </Grid>
//           <Grid item xs={12} lg={4}>
//             <AnomalyFeed anomalies={anomalies} />
//           </Grid>
//         </Grid>
//       </motion.div>

//       {/* Users Live Table */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//         <Box className="glow-card" sx={{
//           mb: 3, overflow: "hidden", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)",
//           border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px"
//         }}>
//           <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid rgba(51, 65, 85, 0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Box>
//               <Typography className="section-label" sx={{ letterSpacing: "0.1em", fontSize: "0.65rem", color: "#64748b" }}>LIVE TRAFFIC</Typography>
//               <Typography sx={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.1rem", mt: 0.3 }}>Active Sessions</Typography>
//             </Box>
//             {/* <Chip
//               size="small" icon={<div className="live-dot-small" />} label={`${users.length} online`}
//               sx={{ background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)", color: "#00d4aa", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", pl: 1 }} /> */}
//           </Box>

//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{ "& th": { borderBottom: "1px solid rgba(30, 41, 59, 0.5)", py: 2 } }}>
//                   {["User Identity", "Device", "Location", "Entry Point", "Activity", "Last Seen", "Signal"].map(h => (
//                     <TableCell key={h} sx={{ color: "#475569", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", px: 2 }}>{h}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 <AnimatePresence>
//                   {users.length === 0 ? (
//                     <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: "#475569", fontFamily: "'JetBrains Mono',monospace" }}>📡 Scanning for connections...</TableCell></TableRow>
//                   ) : users.map((u) => (
//                     <TableRow key={u.user_id} onClick={() => setSelectedUser(u)} className="live-user-row"
//                       sx={{ cursor: "pointer", "& td": { borderBottom: "1px solid rgba(30, 41, 59, 0.5)", py: 2, px: 2 }, transition: "all 0.2s ease" }}>
//                       <TableCell>
//                         <Box display="flex" alignItems="center" gap={2}>
//                           <Avatar sx={{ width: 32, height: 32, fontSize: "0.7rem", fontWeight: 800, border: "2px solid rgba(255,255,255,0.1)",
//                             background: `linear-gradient(135deg, hsl(${(u.user_id.charCodeAt(5) || 0) * 20}, 60%, 45%), #0f172a)` }}>
//                             {u.user_id.slice(-2).toUpperCase()}
//                           </Avatar>
//                           <Typography sx={{ color: "#f8fafc", fontSize: "0.85rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{u.user_id}</Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell><Typography sx={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{DEVICE_ICONS[u.device] || "💻"} {u.device}</Typography></TableCell>
//                       <TableCell><Typography sx={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{FLAG[u.country] || "🌐"} {u.country}</Typography></TableCell>
//                       <TableCell>
//                         <Box sx={{ background: "rgba(30, 41, 59, 0.5)", px: 1.5, py: 0.5, borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)", display: "inline-block" }}>
//                           <Typography sx={{ color: "#60a5fa", fontSize: "0.72rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.page}</Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <div className="activity-bar-bg"><div className="activity-bar-fill" style={{ width: `${Math.min(u.events * 10, 100)}%` }} /></div>
//                           <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700 }}>{u.events}</Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.lastActive)}</Typography></TableCell>
//                       <TableCell><UserStatusDot ts={u.lastActive} /></TableCell>
//                     </TableRow>
//                   ))}
//                 </AnimatePresence>
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </motion.div>

//       {/* Detail Popup Modal */}
//       <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}
//         BackdropProps={{ sx: { backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" } }}
//         PaperProps={{ sx: { background: "#1e293b", color: "#f8fafc", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", width: "100%", maxWidth: "420px" } }}>
//         <DialogTitle sx={{ p: 3, pb: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748b", letterSpacing: "0.2em" }}>NODE INVESTIGATOR</Typography>
//           <IconButton onClick={() => setSelectedUser(null)} sx={{ color: "#64748b" }}><Close fontSize="small" /></IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           {selectedUser && (
//             <Box>
//               <Box display="flex" alignItems="center" gap={2.5} mb={4}>
//                 <Avatar sx={{ width: 64, height: 64, fontSize: "1.4rem", fontWeight: 800, background: "linear-gradient(135deg, #3b82f6, #1e3a8a)" }}>
//                   {selectedUser.user_id.slice(-2).toUpperCase()}
//                 </Avatar>
//                 <Box>
//                   <Typography sx={{ fontWeight: 800, fontSize: "1.2rem" }}>{selectedUser.user_id}</Typography>
//                   <Typography sx={{ color: "#00d4aa", fontSize: "0.75rem", fontWeight: 700 }}>SESSION ACTIVE</Typography>
//                 </Box>
//               </Box>
//               <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
//                 {[
//                   { label: "Location", value: selectedUser.country, icon: <Language sx={{ fontSize: 14 }} /> },
//                   { label: "Device", value: selectedUser.device, icon: <Speed sx={{ fontSize: 14 }} /> },
//                   { label: "Events", value: selectedUser.events, icon: <Bolt sx={{ fontSize: 14 }} /> },
//                   { label: "Sync", value: timeAgo(selectedUser.lastActive), icon: <Schedule sx={{ fontSize: 14 }} /> }
//                 ].map((item, i) => (
//                   <Box key={i} sx={{ p: 2, background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
//                     <Typography sx={{ color: "#64748b", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", display: 'flex', gap: 0.5 }}>{item.icon}{item.label}</Typography>
//                     <Typography sx={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 600 }}>{item.value}</Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Event Timeline */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//         <EventTimeline events={events} />
//       </motion.div>

//       <style>{`
//         .live-user-row:hover { background: rgba(255, 255, 255, 0.04) !important; transform: scale(1.002); }
//         .live-dot-small { width: 6px; height: 6px; background: #00d4aa; border-radius: 50%; margin-right: 4px; animation: blink 1.5s infinite; }
//         .activity-bar-bg { width: 40px; height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
//         .activity-bar-fill { height: 100%; background: #60a5fa; border-radius: 10px; box-shadow: 0 0 8px #60a5fa; }
//         @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
//         @keyframes signal-pulse {
//           0% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.7); }
//           70% { box-shadow: 0 0 0 8px rgba(0, 212, 170, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); }
//         }
//       `}</style>
//     </Box>
//   );
// }

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Refresh, PictureAsPdf, Circle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSocket } from "../hooks/useSocket";
import KPICard from "../components/KPICard";
import FunnelChart from "../components/FunnelChart";
import AnomalyFeed from "../components/AnomalyFeed";
import EventTimeline from "../components/EventTimeline";
import { getUserName, getUserColor, getUserInitials } from "../utils/userNames";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const DEVICE_ICON = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
const FLAG = {
  IN: "🇮🇳",
  US: "🇺🇸",
  UK: "🇬🇧",
  SG: "🇸🇬",
  DE: "🇩🇪",
  default: "🌐",
};

function timeAgo(ts) {
  if (!ts) return "–";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function StatusDot({ ts }) {
  const s = ts ? Math.floor((Date.now() - new Date(ts)) / 1000) : 999;
  const color = s < 10 ? "#00d4aa" : s < 60 ? "#f59e0b" : "#475569";
  const label = s < 10 ? "Active" : s < 60 ? "Idle" : "Offline";
  return (
    <Box display="flex" alignItems="center" gap={0.8}>
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
          ...(s < 10 ? { animation: "livePulse 2s ease-in-out infinite" } : {}),
        }}
      />
      <Typography
        sx={{
          color,
          fontSize: "0.68rem",
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// PDF export using browser print (no library needed)
function exportPDF(metrics, anomalies) {
  const win = window.open("", "_blank");
  const high = anomalies.filter((a) => a.severity === "high").length;
  win.document.write(`
    <html><head><title>StreamSight Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:800px;margin:0 auto}
      h1{color:#1a5276;border-bottom:3px solid #00d4aa;padding-bottom:10px}
      h2{color:#1f618d;margin-top:24px}
      .kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:16px 0}
      .kpi-card{border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center}
      .kpi-val{font-size:2rem;font-weight:800;color:#1D9E75}
      .kpi-lbl{font-size:0.75rem;color:#64748b;margin-top:4px}
      .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700}
      .high{background:#fee2e2;color:#991b1b}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th{background:#1a5276;color:white;padding:8px 12px;text-align:left;font-size:0.8rem}
      td{padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:0.8rem}
      tr:nth-child(even){background:#f8fafc}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:0.75rem;text-align:center}
    </style></head><body>
    <h1>⚡ StreamSight — Live Analytics Report</h1>
    <p style="color:#64748b;font-size:0.85rem">Generated: ${new Date().toLocaleString()} | Role: ${localStorage.getItem("ss_role") || "admin"}</p>
    <h2>KPI Summary</h2>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-val">${metrics?.session_count || 0}</div><div class="kpi-lbl">Total Sessions</div></div>
      <div class="kpi-card"><div class="kpi-val">${(metrics?.cvr || 0).toFixed(1)}%</div><div class="kpi-lbl">Conversion Rate</div></div>
      <div class="kpi-card"><div class="kpi-val">${(metrics?.bounce_rate || 0).toFixed(1)}%</div><div class="kpi-lbl">Bounce Rate</div></div>
      <div class="kpi-card"><div class="kpi-val">${metrics?.active_users || 0}</div><div class="kpi-lbl">Active Users</div></div>
    </div>
    <h2>Conversion Funnel</h2>
    <table><tr><th>Stage</th><th>Count</th></tr>
      ${["page_view", "add_to_cart", "checkout", "purchase"].map((k) => `<tr><td>${k.replace(/_/g, " ")}</td><td>${metrics?.funnel?.[k] || 0}</td></tr>`).join("")}
    </table>
    <h2>Anomalies (${anomalies.length} total, ${high} HIGH)</h2>
    <table><tr><th>User</th><th>Severity</th><th>Reason</th><th>Time</th></tr>
      ${anomalies
        .slice(0, 10)
        .map(
          (a) =>
            `<tr><td>${a.user_id}</td><td><span class="badge ${a.severity}">${a.severity?.toUpperCase()}</span></td><td>${a.reason}</td><td>${timeAgo(a.timestamp)}</td></tr>`,
        )
        .join("")}
    </table>
    <div class="footer">StreamSight v2.0 · Kafka · Spark · MongoDB · React · ${new Date().getFullYear()}</div>
    </body></html>
  `);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

export default function Dashboard() {
  const {
    metrics: liveMetrics,
    anomalies: liveAnomalies,
    events: liveEvents,
  } = useSocket();
  const prevMetrics = useRef(null);
  const prevHighCount = useRef(0);

  const [polledMetrics, setPolledMetrics] = useState(null);
  const [polledAnomalies, setPolledAnomalies] = useState([]);
  const [polledEvents, setPolledEvents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [kpiHistory, setKpiHistory] = useState({
    sessions: [],
    cvr: [],
    bounce: [],
    users: [],
  });

  const fetchAll = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [mRes, aRes, eRes] = await Promise.all([
        fetch(`${API_URL}/api/metrics`),
        fetch(`${API_URL}/api/anomalies`),
        fetch(`${API_URL}/api/events`),
      ]);
      const [m, a, e] = await Promise.all([
        mRes.json(),
        aRes.json(),
        eRes.json(),
      ]);
      if (m?.cvr !== undefined) {
        setPolledMetrics(m);
        setLastUpdated(new Date());
        setKpiHistory((prev) => ({
          sessions: [...prev.sessions.slice(-9), m.session_count || 0],
          cvr: [...prev.cvr.slice(-9), m.cvr || 0],
          bounce: [...prev.bounce.slice(-9), m.bounce_rate || 0],
          users: [...prev.users.slice(-9), m.active_users || 0],
        }));
      }
      if (Array.isArray(a)) {
        setPolledAnomalies(a);
        // Toast on new HIGH
        const high = a.filter((x) => x.severity === "high").length;
        if (high > prevHighCount.current) {
          toast.error(
            `🚨 ${high - prevHighCount.current} new HIGH anomaly detected!`,
            { autoClose: 4000 },
          );
        }
        prevHighCount.current = high;
      }
      if (Array.isArray(e)) setPolledEvents(e.slice(0, 20));
    } catch (err) {
      console.error(err);
    } finally {
      if (manual) setTimeout(() => setRefreshing(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 5000);
    return () => clearInterval(iv);
  }, [fetchAll]);

  const metrics = liveMetrics || polledMetrics;
  const anomalies = liveAnomalies.length > 0 ? liveAnomalies : polledAnomalies;
  const events = liveEvents.length > 0 ? liveEvents : polledEvents;
  const prev = prevMetrics.current;
  prevMetrics.current = metrics;

  // Build users table from events
  const userMap = {};
  events.forEach((e) => {
    if (!userMap[e.user_id])
      userMap[e.user_id] = {
        user_id: e.user_id,
        events: 0,
        device: e.device,
        country: e.country,
        lastActive: e.timestamp,
        page: e.page,
      };
    userMap[e.user_id].events++;
    if (new Date(e.timestamp) > new Date(userMap[e.user_id].lastActive))
      userMap[e.user_id].lastActive = e.timestamp;
  });
  const users = Object.values(userMap)
    .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
    .slice(0, 8);

  const role = localStorage.getItem("ss_role") || "admin";

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: "#e2e8f0", letterSpacing: "-0.5px", mb: 0.5 }}
            >
              Live Dashboard
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              Real-time clickstream analytics · auto-refreshes every 5s
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            {lastUpdated && (
              <Chip
                size="small"
                label={`⟳ ${lastUpdated.toLocaleTimeString()}`}
                sx={{
                  background: "rgba(0,212,170,0.08)",
                  border: "1px solid rgba(0,212,170,0.2)",
                  color: "#00d4aa",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "0.68rem",
                }}
              />
            )}
            {/* PDF Export — Admin/Analyst only */}
            {role !== "viewer" && (
              <Tooltip title="Export as PDF">
                <IconButton
                  onClick={() => exportPDF(metrics, anomalies)}
                  size="small"
                  sx={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#ef4444",
                    "&:hover": { background: "rgba(239,68,68,0.15)" },
                  }}
                >
                  <PictureAsPdf fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Refresh now">
              <IconButton
                onClick={() => fetchAll(true)}
                size="small"
                sx={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#64748b",
                  "&:hover": {
                    color: "#00d4aa",
                    borderColor: "rgba(0,212,170,0.4)",
                  },
                  ...(refreshing
                    ? { animation: "spin 0.8s linear infinite" }
                    : {}),
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* KPI Cards */}
      <Grid container spacing={2.5} mb={3}>
        {[
          {
            type: "sessions",
            value: metrics?.session_count,
            history: kpiHistory.sessions,
          },
          {
            type: "cvr",
            value: metrics?.cvr,
            unit: "%",
            history: kpiHistory.cvr,
          },
          {
            type: "bounce",
            value: metrics?.bounce_rate,
            unit: "%",
            history: kpiHistory.bounce,
          },
          {
            type: "users",
            value: metrics?.active_users,
            history: kpiHistory.users,
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} xl={3} key={card.type}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <KPICard
                {...card}
                prev={
                  prev?.[
                    ["session_count", "cvr", "bounce_rate", "active_users"][i]
                  ]
                }
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Funnel + Anomaly */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} lg={8}>
            <FunnelChart funnel={metrics?.funnel} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <AnomalyFeed anomalies={anomalies} />
          </Grid>
        </Grid>
      </motion.div>

      {/* Live Users Table — with REAL NAMES */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Box
          sx={{
            background: "#0d1117",
            border: "1px solid #1e293b",
            borderRadius: 3,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Live Users
              </Typography>
              <Typography
                sx={{
                  color: "#e2e8f0",
                  fontWeight: 700,
                  fontSize: "1rem",
                  mt: 0.3,
                }}
              >
                Active Sessions
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={
                <Circle
                  sx={{
                    fontSize: "8px !important",
                    color: "#00d4aa !important",
                  }}
                />
              }
              label={`${users.length} online`}
              sx={{
                background: "rgba(0,212,170,0.08)",
                border: "1px solid rgba(0,212,170,0.2)",
                color: "#00d4aa",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "0.7rem",
              }}
            />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      borderBottom: "1px solid #111827",
                      py: 1.5,
                      color: "#475569",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    },
                  }}
                >
                  {[
                    "User",
                    "Device",
                    "Country",
                    "Current Page",
                    "Events",
                    "Last Active",
                    "Status",
                  ].map((h) => (
                    <TableCell key={h} sx={{ px: 2.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{
                        py: 4,
                        color: "#334155",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "0.8rem",
                        border: 0,
                      }}
                    >
                      No active users yet...
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, i) => {
                    const info = getUserInfo_safe(u.user_id);
                    return (
                      <TableRow
                        key={u.user_id}
                        sx={{
                          "&:hover": { background: "rgba(0,212,170,0.02)" },
                          "& td": {
                            borderBottom: "1px solid #111827",
                            py: 1.5,
                            px: 2.5,
                          },
                          "&:last-child td": { borderBottom: 0 },
                          transition: "background 0.15s",
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                background: info.color,
                                flexShrink: 0,
                              }}
                            >
                              {info.initials}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#e2e8f0",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  lineHeight: 1.2,
                                }}
                              >
                                {info.name}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#334155",
                                  fontSize: "0.65rem",
                                  fontFamily: "'JetBrains Mono',monospace",
                                }}
                              >
                                {u.user_id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: "0.82rem", color: "#94a3b8" }}
                          >
                            {DEVICE_ICON[u.device] || "💻"} {u.device}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontSize: "0.82rem", color: "#94a3b8" }}
                          >
                            {FLAG[u.country] || FLAG.default} {u.country}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.75rem",
                              fontFamily: "'JetBrains Mono',monospace",
                            }}
                          >
                            {u.page}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.events}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              background: "rgba(59,130,246,0.08)",
                              color: "#60a5fa",
                              border: "1px solid rgba(59,130,246,0.2)",
                              fontFamily: "'JetBrains Mono',monospace",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.72rem",
                              fontFamily: "'JetBrains Mono',monospace",
                            }}
                          >
                            {timeAgo(u.lastActive)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusDot ts={u.lastActive} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </motion.div>

      {/* Event Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <EventTimeline events={events} />
      </motion.div>
    </Box>
  );
}

// Safe helper — avoids import error if userNames.js not yet in place
function getUserInfo_safe(userId) {
  const NAMES = [
    { name: "Arjun Kumar", initials: "AK", color: "#1D9E75" },
    { name: "Priya Sharma", initials: "PS", color: "#3b82f6" },
    { name: "Rahul Mehta", initials: "RM", color: "#a855f7" },
    { name: "Sneha Patel", initials: "SP", color: "#f59e0b" },
    { name: "Vikram Singh", initials: "VS", color: "#ef4444" },
    { name: "Ananya Iyer", initials: "AI", color: "#06b6d4" },
    { name: "Karan Gupta", initials: "KG", color: "#8b5cf6" },
    { name: "Divya Nair", initials: "DN", color: "#ec4899" },
    { name: "Rohan Das", initials: "RD", color: "#10b981" },
    { name: "Meera Reddy", initials: "MR", color: "#f97316" },
    { name: "Aditya Joshi", initials: "AJ", color: "#14b8a6" },
    { name: "Pooja Verma", initials: "PV", color: "#6366f1" },
    { name: "Sanjay Rao", initials: "SR", color: "#0ea5e9" },
    { name: "Kavya Menon", initials: "KM", color: "#84cc16" },
    { name: "Nikhil Shah", initials: "NS", color: "#f43f5e" },
    { name: "Lakshmi Nair", initials: "LN", color: "#22d3ee" },
    { name: "Amit Pandey", initials: "AP", color: "#fb923c" },
    { name: "Riya Jain", initials: "RJ", color: "#c084fc" },
    { name: "Suresh Babu", initials: "SB", color: "#34d399" },
    { name: "Deepa Krishna", initials: "DK", color: "#60a5fa" },
  ];
  const num = parseInt((userId || "").replace(/\D/g, "") || "0");
  return NAMES[num % NAMES.length];
}
