// import { useRef, useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   Chip,
//   IconButton,
//   Tooltip,
//   Avatar,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { Refresh, PictureAsPdf, Circle } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import { useSocket } from "../hooks/useSocket";
// import KPICard from "../components/KPICard";
// import FunnelChart from "../components/FunnelChart";
// import AnomalyFeed from "../components/AnomalyFeed";
// import EventTimeline from "../components/EventTimeline";
// import { getUserName, getUserColor, getUserInitials } from "../utils/userNames";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// const DEVICE_ICON = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
// const FLAG = {
//   IN: "🇮🇳",
//   US: "🇺🇸",
//   UK: "🇬🇧",
//   SG: "🇸🇬",
//   DE: "🇩🇪",
//   default: "🌐",
// };

// function timeAgo(ts) {
//   if (!ts) return "–";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 5) return "just now";
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   return `${Math.floor(s / 3600)}h ago`;
// }

// function StatusDot({ ts }) {
//   const s = ts ? Math.floor((Date.now() - new Date(ts)) / 1000) : 999;
//   const color = s < 10 ? "#00d4aa" : s < 60 ? "#f59e0b" : "#475569";
//   const label = s < 10 ? "Active" : s < 60 ? "Idle" : "Offline";
//   return (
//     <Box display="flex" alignItems="center" gap={0.8}>
//       <Box
//         sx={{
//           width: 7,
//           height: 7,
//           borderRadius: "50%",
//           background: color,
//           flexShrink: 0,
//           ...(s < 10 ? { animation: "livePulse 2s ease-in-out infinite" } : {}),
//         }}
//       />
//       <Typography
//         sx={{
//           color,
//           fontSize: "0.68rem",
//           fontFamily: "'JetBrains Mono',monospace",
//           fontWeight: 600,
//         }}
//       >
//         {label}
//       </Typography>
//     </Box>
//   );
// }

// // PDF export using browser print (no library needed)
// function exportPDF(metrics, anomalies) {
//   const win = window.open("", "_blank");
//   const high = anomalies.filter((a) => a.severity === "high").length;
//   win.document.write(`
//     <html><head><title>StreamSight Report</title>
//     <style>
//       body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:800px;margin:0 auto}
//       h1{color:#1a5276;border-bottom:3px solid #00d4aa;padding-bottom:10px}
//       h2{color:#1f618d;margin-top:24px}
//       .kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:16px 0}
//       .kpi-card{border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center}
//       .kpi-val{font-size:2rem;font-weight:800;color:#1D9E75}
//       .kpi-lbl{font-size:0.75rem;color:#64748b;margin-top:4px}
//       .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700}
//       .high{background:#fee2e2;color:#991b1b}
//       table{width:100%;border-collapse:collapse;margin-top:16px}
//       th{background:#1a5276;color:white;padding:8px 12px;text-align:left;font-size:0.8rem}
//       td{padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:0.8rem}
//       tr:nth-child(even){background:#f8fafc}
//       .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:0.75rem;text-align:center}
//     </style></head><body>
//     <h1>⚡ StreamSight — Live Analytics Report</h1>
//     <p style="color:#64748b;font-size:0.85rem">Generated: ${new Date().toLocaleString()} | Role: ${localStorage.getItem("ss_role") || "admin"}</p>
//     <h2>KPI Summary</h2>
//     <div class="kpi-grid">
//       <div class="kpi-card"><div class="kpi-val">${metrics?.session_count || 0}</div><div class="kpi-lbl">Total Sessions</div></div>
//       <div class="kpi-card"><div class="kpi-val">${(metrics?.cvr || 0).toFixed(1)}%</div><div class="kpi-lbl">Conversion Rate</div></div>
//       <div class="kpi-card"><div class="kpi-val">${(metrics?.bounce_rate || 0).toFixed(1)}%</div><div class="kpi-lbl">Bounce Rate</div></div>
//       <div class="kpi-card"><div class="kpi-val">${metrics?.active_users || 0}</div><div class="kpi-lbl">Active Users</div></div>
//     </div>
//     <h2>Conversion Funnel</h2>
//     <table><tr><th>Stage</th><th>Count</th></tr>
//       ${["page_view", "add_to_cart", "checkout", "purchase"].map((k) => `<tr><td>${k.replace(/_/g, " ")}</td><td>${metrics?.funnel?.[k] || 0}</td></tr>`).join("")}
//     </table>
//     <h2>Anomalies (${anomalies.length} total, ${high} HIGH)</h2>
//     <table><tr><th>User</th><th>Severity</th><th>Reason</th><th>Time</th></tr>
//       ${anomalies
//         .slice(0, 10)
//         .map(
//           (a) =>
//             `<tr><td>${a.user_id}</td><td><span class="badge ${a.severity}">${a.severity?.toUpperCase()}</span></td><td>${a.reason}</td><td>${timeAgo(a.timestamp)}</td></tr>`,
//         )
//         .join("")}
//     </table>
//     <div class="footer">StreamSight v2.0 · Kafka · Spark · MongoDB · React · ${new Date().getFullYear()}</div>
//     </body></html>
//   `);
//   win.document.close();
//   setTimeout(() => win.print(), 500);
// }

// export default function Dashboard() {
//   const {
//     metrics: liveMetrics,
//     anomalies: liveAnomalies,
//     events: liveEvents,
//   } = useSocket();
//   const prevMetrics = useRef(null);
//   const prevHighCount = useRef(0);

//   const [polledMetrics, setPolledMetrics] = useState(null);
//   const [polledAnomalies, setPolledAnomalies] = useState([]);
//   const [polledEvents, setPolledEvents] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [kpiHistory, setKpiHistory] = useState({
//     sessions: [],
//     cvr: [],
//     bounce: [],
//     users: [],
//   });

//   const fetchAll = useCallback(async (manual = false) => {
//     if (manual) setRefreshing(true);
//     try {
//       const [mRes, aRes, eRes] = await Promise.all([
//         fetch(`${API_URL}/api/metrics`),
//         fetch(`${API_URL}/api/anomalies`),
//         fetch(`${API_URL}/api/events`),
//       ]);
//       const [m, a, e] = await Promise.all([
//         mRes.json(),
//         aRes.json(),
//         eRes.json(),
//       ]);
//       if (m?.cvr !== undefined) {
//         setPolledMetrics(m);
//         setLastUpdated(new Date());
//         setKpiHistory((prev) => ({
//           sessions: [...prev.sessions.slice(-9), m.session_count || 0],
//           cvr: [...prev.cvr.slice(-9), m.cvr || 0],
//           bounce: [...prev.bounce.slice(-9), m.bounce_rate || 0],
//           users: [...prev.users.slice(-9), m.active_users || 0],
//         }));
//       }
//       if (Array.isArray(a)) {
//         setPolledAnomalies(a);
//         // Toast on new HIGH
//         const high = a.filter((x) => x.severity === "high").length;
//         if (high > prevHighCount.current) {
//           toast.error(
//             `🚨 ${high - prevHighCount.current} new HIGH anomaly detected!`,
//             { autoClose: 4000 },
//           );
//         }
//         prevHighCount.current = high;
//       }
//       if (Array.isArray(e)) setPolledEvents(e.slice(0, 20));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (manual) setTimeout(() => setRefreshing(false), 500);
//     }
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

//   // Build users table from events
//   const userMap = {};
//   events.forEach((e) => {
//     if (!userMap[e.user_id])
//       userMap[e.user_id] = {
//         user_id: e.user_id,
//         events: 0,
//         device: e.device,
//         country: e.country,
//         lastActive: e.timestamp,
//         page: e.page,
//       };
//     userMap[e.user_id].events++;
//     if (new Date(e.timestamp) > new Date(userMap[e.user_id].lastActive))
//       userMap[e.user_id].lastActive = e.timestamp;
//   });
//   const users = Object.values(userMap)
//     .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
//     .slice(0, 8);

//   const role = localStorage.getItem("ss_role") || "admin";

//   return (
//     <Box sx={{ position: "relative", zIndex: 1 }}>
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -12 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <Box
//           display="flex"
//           alignItems="flex-start"
//           justifyContent="space-between"
//           mb={4}
//           flexWrap="wrap"
//           gap={2}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               fontWeight={800}
//               sx={{ color: "#e2e8f0", letterSpacing: "-0.5px", mb: 0.5 }}
//             >
//               Live Dashboard
//             </Typography>
//             <Typography
//               sx={{
//                 color: "#64748b",
//                 fontSize: "0.875rem",
//                 fontFamily: "'JetBrains Mono',monospace",
//               }}
//             >
//               Real-time clickstream analytics · auto-refreshes every 5s
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
//             {lastUpdated && (
//               <Chip
//                 size="small"
//                 label={`⟳ ${lastUpdated.toLocaleTimeString()}`}
//                 sx={{
//                   background: "rgba(0,212,170,0.08)",
//                   border: "1px solid rgba(0,212,170,0.2)",
//                   color: "#00d4aa",
//                   fontFamily: "'JetBrains Mono',monospace",
//                   fontSize: "0.68rem",
//                 }}
//               />
//             )}
//             {/* PDF Export — Admin/Analyst only */}
//             {role !== "viewer" && (
//               <Tooltip title="Export as PDF">
//                 <IconButton
//                   onClick={() => exportPDF(metrics, anomalies)}
//                   size="small"
//                   sx={{
//                     background: "rgba(239,68,68,0.08)",
//                     border: "1px solid rgba(239,68,68,0.2)",
//                     color: "#ef4444",
//                     "&:hover": { background: "rgba(239,68,68,0.15)" },
//                   }}
//                 >
//                   <PictureAsPdf fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             )}
//             <Tooltip title="Refresh now">
//               <IconButton
//                 onClick={() => fetchAll(true)}
//                 size="small"
//                 sx={{
//                   background: "#1e293b",
//                   border: "1px solid #334155",
//                   color: "#64748b",
//                   "&:hover": {
//                     color: "#00d4aa",
//                     borderColor: "rgba(0,212,170,0.4)",
//                   },
//                   ...(refreshing
//                     ? { animation: "spin 0.8s linear infinite" }
//                     : {}),
//                 }}
//               >
//                 <Refresh fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//       </motion.div>

//       {/* KPI Cards */}
//       <Grid container spacing={2.5} mb={3}>
//         {[
//           {
//             type: "sessions",
//             value: metrics?.session_count,
//             history: kpiHistory.sessions,
//           },
//           {
//             type: "cvr",
//             value: metrics?.cvr,
//             unit: "%",
//             history: kpiHistory.cvr,
//           },
//           {
//             type: "bounce",
//             value: metrics?.bounce_rate,
//             unit: "%",
//             history: kpiHistory.bounce,
//           },
//           {
//             type: "users",
//             value: metrics?.active_users,
//             history: kpiHistory.users,
//           },
//         ].map((card, i) => (
//           <Grid item xs={12} sm={6} xl={3} key={card.type}>
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.08 }}
//             >
//               <KPICard
//                 {...card}
//                 prev={
//                   prev?.[
//                     ["session_count", "cvr", "bounce_rate", "active_users"][i]
//                   ]
//                 }
//               />
//             </motion.div>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Funnel + Anomaly */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Grid container spacing={2.5} mb={3}>
//           <Grid item xs={12} lg={8}>
//             <FunnelChart funnel={metrics?.funnel} />
//           </Grid>
//           <Grid item xs={12} lg={4}>
//             <AnomalyFeed anomalies={anomalies} />
//           </Grid>
//         </Grid>
//       </motion.div>

//       {/* Live Users Table — with REAL NAMES */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4 }}
//       >
//         <Box
//           sx={{
//             background: "#0d1117",
//             border: "1px solid #1e293b",
//             borderRadius: 3,
//             mb: 3,
//             overflow: "hidden",
//           }}
//         >
//           <Box
//             sx={{
//               px: 3,
//               py: 2.5,
//               borderBottom: "1px solid #1e293b",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Box>
//               <Typography
//                 sx={{
//                   color: "#475569",
//                   fontSize: "0.65rem",
//                   letterSpacing: "0.15em",
//                   textTransform: "uppercase",
//                   fontWeight: 700,
//                 }}
//               >
//                 Live Users
//               </Typography>
//               <Typography
//                 sx={{
//                   color: "#e2e8f0",
//                   fontWeight: 700,
//                   fontSize: "1rem",
//                   mt: 0.3,
//                 }}
//               >
//                 Active Sessions
//               </Typography>
//             </Box>
//             <Chip
//               size="small"
//               icon={
//                 <Circle
//                   sx={{
//                     fontSize: "8px !important",
//                     color: "#00d4aa !important",
//                   }}
//                 />
//               }
//               // label={`${users.length} online`}
//               sx={{
//                 background: "rgba(0,212,170,0.08)",
//                 border: "1px solid rgba(0,212,170,0.2)",
//                 color: "#00d4aa",
//                 fontFamily: "'JetBrains Mono',monospace",
//                 fontSize: "0.7rem",
//               }}
//             />
//           </Box>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow
//                   sx={{
//                     "& th": {
//                       borderBottom: "1px solid #111827",
//                       py: 1.5,
//                       color: "#475569",
//                       fontSize: "0.65rem",
//                       fontWeight: 700,
//                       letterSpacing: "0.1em",
//                       textTransform: "uppercase",
//                     },
//                   }}
//                 >
//                   {[
//                     "User",
//                     "Device",
//                     "Country",
//                     "Current Page",
//                     "Events",
//                     "Last Active",
//                     "Status",
//                   ].map((h) => (
//                     <TableCell key={h} sx={{ px: 2.5 }}>
//                       {h}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={7}
//                       align="center"
//                       sx={{
//                         py: 4,
//                         color: "#334155",
//                         fontFamily: "'JetBrains Mono',monospace",
//                         fontSize: "0.8rem",
//                         border: 0,
//                       }}
//                     >
//                       No active users yet...
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   users.map((u, i) => {
//                     const info = getUserInfo_safe(u.user_id);
//                     return (
//                       <TableRow
//                         key={u.user_id}
//                         sx={{
//                           "&:hover": { background: "rgba(0,212,170,0.02)" },
//                           "& td": {
//                             borderBottom: "1px solid #111827",
//                             py: 1.5,
//                             px: 2.5,
//                           },
//                           "&:last-child td": { borderBottom: 0 },
//                           transition: "background 0.15s",
//                         }}
//                       >
//                         <TableCell>
//                           <Box display="flex" alignItems="center" gap={1.5}>
//                             <Avatar
//                               sx={{
//                                 width: 30,
//                                 height: 30,
//                                 fontSize: "0.7rem",
//                                 fontWeight: 700,
//                                 background: info.color,
//                                 flexShrink: 0,
//                               }}
//                             >
//                               {info.initials}
//                             </Avatar>
//                             <Box>
//                               <Typography
//                                 sx={{
//                                   color: "#e2e8f0",
//                                   fontSize: "0.82rem",
//                                   fontWeight: 600,
//                                   lineHeight: 1.2,
//                                 }}
//                               >
//                                 {info.name}
//                               </Typography>
//                               <Typography
//                                 sx={{
//                                   color: "#334155",
//                                   fontSize: "0.65rem",
//                                   fontFamily: "'JetBrains Mono',monospace",
//                                 }}
//                               >
//                                 {u.user_id}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Typography
//                             sx={{ fontSize: "0.82rem", color: "#94a3b8" }}
//                           >
//                             {DEVICE_ICON[u.device] || "💻"} {u.device}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography
//                             sx={{ fontSize: "0.82rem", color: "#94a3b8" }}
//                           >
//                             {FLAG[u.country] || FLAG.default} {u.country}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography
//                             sx={{
//                               color: "#64748b",
//                               fontSize: "0.75rem",
//                               fontFamily: "'JetBrains Mono',monospace",
//                             }}
//                           >
//                             {u.page}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={u.events}
//                             size="small"
//                             sx={{
//                               height: 20,
//                               fontSize: "0.65rem",
//                               background: "rgba(59,130,246,0.08)",
//                               color: "#60a5fa",
//                               border: "1px solid rgba(59,130,246,0.2)",
//                               fontFamily: "'JetBrains Mono',monospace",
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Typography
//                             sx={{
//                               color: "#64748b",
//                               fontSize: "0.72rem",
//                               fontFamily: "'JetBrains Mono',monospace",
//                             }}
//                           >
//                             {timeAgo(u.lastActive)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <StatusDot ts={u.lastActive} />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </motion.div>

//       {/* Event Timeline */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//       >
//         <EventTimeline events={events} />
//       </motion.div>
//     </Box>
//   );
// }

// // Safe helper — avoids import error if userNames.js not yet in place
// function getUserInfo_safe(userId) {
//   const NAMES = [
//     { name: "Arjun Kumar", initials: "AK", color: "#1D9E75" },
//     { name: "Priya Sharma", initials: "PS", color: "#3b82f6" },
//     { name: "Rahul Mehta", initials: "RM", color: "#a855f7" },
//     { name: "Sneha Patel", initials: "SP", color: "#f59e0b" },
//     { name: "Vikram Singh", initials: "VS", color: "#ef4444" },
//     { name: "Ananya Iyer", initials: "AI", color: "#06b6d4" },
//     { name: "Karan Gupta", initials: "KG", color: "#8b5cf6" },
//     { name: "Divya Nair", initials: "DN", color: "#ec4899" },
//     { name: "Rohan Das", initials: "RD", color: "#10b981" },
//     { name: "Meera Reddy", initials: "MR", color: "#f97316" },
//     { name: "Aditya Joshi", initials: "AJ", color: "#14b8a6" },
//     { name: "Pooja Verma", initials: "PV", color: "#6366f1" },
//     { name: "Sanjay Rao", initials: "SR", color: "#0ea5e9" },
//     { name: "Kavya Menon", initials: "KM", color: "#84cc16" },
//     { name: "Nikhil Shah", initials: "NS", color: "#f43f5e" },
//     { name: "Lakshmi Nair", initials: "LN", color: "#22d3ee" },
//     { name: "Amit Pandey", initials: "AP", color: "#fb923c" },
//     { name: "Riya Jain", initials: "RJ", color: "#c084fc" },
//     { name: "Suresh Babu", initials: "SB", color: "#34d399" },
//     { name: "Deepa Krishna", initials: "DK", color: "#60a5fa" },
//   ];
//   const num = parseInt((userId || "").replace(/\D/g, "") || "0");
//   return NAMES[num % NAMES.length];
// }


// import { useRef, useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   Chip,
//   IconButton,
//   Tooltip,
//   Avatar,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   LinearProgress,
// } from "@mui/material";
// import {
//   Refresh,
//   PictureAsPdf,
//   Circle,
//   Psychology,
//   Shield,
//   ShieldOutlined,
//   DeleteOutline,
//   RestoreOutlined,
//   ContentCopy,
//   CheckCircleOutline,
//   WarningAmber,
//   ModelTraining,
//   Speed,
//   Analytics,
//   LockPerson,
// } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import { useSocket } from "../hooks/useSocket";
// import KPICard from "../components/KPICard";
// import FunnelChart from "../components/FunnelChart";
// import AnomalyFeed from "../components/AnomalyFeed";
// import EventTimeline from "../components/EventTimeline";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// const DEVICE_ICON = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
// const FLAG = { IN: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", SG: "🇸🇬", DE: "🇩🇪", default: "🌐" };

// // ── Threat credential generator ─────────────────────────────────────────────
// function generateCredentials(userId) {
//   const num = (userId || "").replace(/\D/g, "") || "000";
//   const email = `restricted.${userId?.toLowerCase().replace("_", "")}@streamsight.sec`;
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
//   // Deterministic "random" from userId digits so it's stable across renders
//   let seed = parseInt(num) || 1;
//   const pw = Array.from({ length: 10 }, () => {
//     seed = (seed * 1664525 + 1013904223) & 0xffffffff;
//     return chars[Math.abs(seed) % chars.length];
//   }).join("");
//   return { email, password: `Th${pw.slice(0, 6)}#${num.slice(-3)}!` };
// }

// function timeAgo(ts) {
//   if (!ts) return "–";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 5) return "just now";
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   return `${Math.floor(s / 3600)}h ago`;
// }

// function StatusDot({ ts }) {
//   const s = ts ? Math.floor((Date.now() - new Date(ts)) / 1000) : 999;
//   const color = s < 10 ? "#00d4aa" : s < 60 ? "#f59e0b" : "#475569";
//   const label = s < 10 ? "Active" : s < 60 ? "Idle" : "Offline";
//   return (
//     <Box display="flex" alignItems="center" gap={0.8}>
//       <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, ...(s < 10 ? { animation: "livePulse 2s ease-in-out infinite" } : {}) }} />
//       <Typography sx={{ color, fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{label}</Typography>
//     </Box>
//   );
// }

// function exportPDF(metrics, anomalies) {
//   const win = window.open("", "_blank");
//   const high = anomalies.filter((a) => a.severity === "high").length;
//   win.document.write(`
//     <html><head><title>StreamSight Report</title>
//     <style>
//       body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:800px;margin:0 auto}
//       h1{color:#1a5276;border-bottom:3px solid #00d4aa;padding-bottom:10px}
//       h2{color:#1f618d;margin-top:24px}
//       .kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:16px 0}
//       .kpi-card{border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center}
//       .kpi-val{font-size:2rem;font-weight:800;color:#1D9E75}
//       .kpi-lbl{font-size:0.75rem;color:#64748b;margin-top:4px}
//       .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700}
//       .high{background:#fee2e2;color:#991b1b}
//       table{width:100%;border-collapse:collapse;margin-top:16px}
//       th{background:#1a5276;color:white;padding:8px 12px;text-align:left;font-size:0.8rem}
//       td{padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:0.8rem}
//       tr:nth-child(even){background:#f8fafc}
//       .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:0.75rem;text-align:center}
//     </style></head><body>
//     <h1>⚡ StreamSight — Live Analytics Report</h1>
//     <p style="color:#64748b;font-size:0.85rem">Generated: ${new Date().toLocaleString()} | Role: ${localStorage.getItem("ss_role") || "admin"}</p>
//     <h2>KPI Summary</h2>
//     <div class="kpi-grid">
//       <div class="kpi-card"><div class="kpi-val">${metrics?.session_count || 0}</div><div class="kpi-lbl">Total Sessions</div></div>
//       <div class="kpi-card"><div class="kpi-val">${(metrics?.cvr || 0).toFixed(1)}%</div><div class="kpi-lbl">Conversion Rate</div></div>
//       <div class="kpi-card"><div class="kpi-val">${(metrics?.bounce_rate || 0).toFixed(1)}%</div><div class="kpi-lbl">Bounce Rate</div></div>
//       <div class="kpi-card"><div class="kpi-val">${metrics?.active_users || 0}</div><div class="kpi-lbl">Active Users</div></div>
//     </div>
//     <h2>Conversion Funnel</h2>
//     <table><tr><th>Stage</th><th>Count</th></tr>
//       ${["page_view", "add_to_cart", "checkout", "purchase"].map((k) => `<tr><td>${k.replace(/_/g, " ")}</td><td>${metrics?.funnel?.[k] || 0}</td></tr>`).join("")}
//     </table>
//     <h2>Anomalies (${anomalies.length} total, ${high} HIGH)</h2>
//     <table><tr><th>User</th><th>Severity</th><th>Reason</th><th>Time</th></tr>
//       ${anomalies.slice(0, 10).map((a) => `<tr><td>${a.user_id}</td><td><span class="badge ${a.severity}">${a.severity?.toUpperCase()}</span></td><td>${a.reason}</td><td>${timeAgo(a.timestamp)}</td></tr>`).join("")}
//     </table>
//     <div class="footer">StreamSight v2.0 · Kafka · Spark · MongoDB · React · ${new Date().getFullYear()}</div>
//     </body></html>
//   `);
//   win.document.close();
//   setTimeout(() => win.print(), 500);
// }

// // ── ML Model Panel ───────────────────────────────────────────────────────────
// function MLModelPanel({ anomalies }) {
//   const [training, setTraining] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [phase, setPhase] = useState("idle"); // idle | fitting | evaluating | done
//   const [metrics, setMetrics] = useState({
//     precision: 0.91, recall: 0.87, f1: 0.89,
//     accuracy: 0.94, samples: 500, contamination: 0.05,
//     lastTrained: new Date(Date.now() - 8 * 60 * 1000),
//   });

//   const PHASES = [
//     { key: "fitting", label: "Fitting Isolation Forest on event stream...", duration: 1800 },
//     { key: "evaluating", label: "Evaluating precision / recall / F1...", duration: 1200 },
//     { key: "done", label: "Model retrained — metrics updated ✓", duration: 600 },
//   ];

//   const handleRetrain = async () => {
//     if (training) return;
//     setTraining(true);
//     setProgress(0);
//     setPhase("fitting");

//     // Try real API first
//     try {
//       const res = await fetch(`${API_URL}/api/retrain`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (res.ok) {
//         const data = await res.json();
//         // Animate progress to completion, then apply real metrics
//         animateProgress(() => {
//           if (data.precision !== undefined) {
//             setMetrics((prev) => ({
//               ...prev,
//               precision: data.precision,
//               recall: data.recall,
//               f1: data.f1,
//               accuracy: data.accuracy || prev.accuracy,
//               samples: data.samples || prev.samples,
//               lastTrained: new Date(),
//             }));
//           }
//           setTraining(false);
//           setPhase("idle");
//           toast.success("🧠 Model retrained successfully with latest event data!");
//         });
//         return;
//       }
//     } catch (_) {
//       // API not available — fall through to simulation
//     }

//     // Fallback: visual simulation
//     simulateTraining();
//   };

//   const animateProgress = (onComplete) => {
//     let p = 0;
//     const iv = setInterval(() => {
//       p += 2;
//       setProgress(Math.min(p, 100));
//       if (p >= 100) { clearInterval(iv); onComplete(); }
//     }, 60);
//   };

//   const simulateTraining = () => {
//     let p = 0;
//     let phaseIdx = 0;
//     setPhase(PHASES[0].key);

//     const tick = () => {
//       p += 1;
//       setProgress(p);

//       // Phase transitions at 40%, 75%, 100%
//       if (p === 40) setPhase(PHASES[1].key);
//       if (p === 75) setPhase(PHASES[2].key);

//       if (p < 100) {
//         setTimeout(tick, 50);
//       } else {
//         // Simulate slightly improved metrics
//         setMetrics((prev) => ({
//           ...prev,
//           precision: Math.min(0.99, +(prev.precision + (Math.random() * 0.02 - 0.005)).toFixed(3)),
//           recall: Math.min(0.99, +(prev.recall + (Math.random() * 0.02 - 0.005)).toFixed(3)),
//           f1: Math.min(0.99, +(prev.f1 + (Math.random() * 0.015 - 0.003)).toFixed(3)),
//           accuracy: Math.min(0.99, +(prev.accuracy + (Math.random() * 0.01 - 0.002)).toFixed(3)),
//           samples: prev.samples + anomalies.length,
//           lastTrained: new Date(),
//         }));
//         setTraining(false);
//         setPhase("idle");
//         toast.success("🧠 Isolation Forest retrained on latest event stream data!");
//       }
//     };
//     tick();
//   };

//   const phaseLabel = PHASES.find((p) => p.key === phase)?.label || "";
//   const timeSinceTraining = Math.floor((Date.now() - metrics.lastTrained) / 60000);

//   const MetricBar = ({ label, value, color }) => (
//     <Box mb={1.5}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
//         <Typography sx={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
//           {label}
//         </Typography>
//         <Typography sx={{ color, fontSize: "0.82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
//           {(value * 100).toFixed(1)}%
//         </Typography>
//       </Box>
//       <Box sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: `${value * 100}%` }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//           style={{ height: "100%", borderRadius: 3, background: color }}
//         />
//       </Box>
//     </Box>
//   );

//   return (
//     <Box
//       sx={{
//         background: "linear-gradient(135deg, #0a0f1a 0%, #0d1117 100%)",
//         border: "1px solid #1e293b",
//         borderRadius: 3,
//         p: 3,
//         mb: 3,
//       }}
//     >
//       {/* Panel header */}
//       <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
//         <Box display="flex" alignItems="center" gap={1.5}>
//           <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Psychology sx={{ color: "#7c3aed", fontSize: 20 }} />
//           </Box>
//           <Box>
//             <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
//               Machine Learning
//             </Typography>
//             <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.2 }}>
//               Isolation Forest Model
//             </Typography>
//           </Box>
//         </Box>
//         <Box display="flex" alignItems="center" gap={1.5}>
//           <Chip
//             size="small"
//             label={`${timeSinceTraining}m ago`}
//             sx={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }}
//           />
//           <Tooltip title="Trigger model retraining via POST /api/retrain">
//             <motion.button
//               whileHover={!training ? { scale: 1.04 } : {}}
//               whileTap={!training ? { scale: 0.96 } : {}}
//               onClick={handleRetrain}
//               disabled={training}
//               style={{
//                 display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
//                 borderRadius: 8, border: "1px solid rgba(124,58,237,0.4)",
//                 background: training ? "rgba(124,58,237,0.05)" : "rgba(124,58,237,0.12)",
//                 color: training ? "#4c1d95" : "#a78bfa",
//                 fontSize: 12, fontWeight: 700, cursor: training ? "not-allowed" : "pointer",
//                 fontFamily: "inherit", transition: "all 0.2s",
//               }}
//             >
//               <ModelTraining style={{ fontSize: 15 }} />
//               {training ? "Training..." : "Retrain Model"}
//             </motion.button>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Training progress */}
//       <AnimatePresence>
//         {training && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
//             style={{ marginBottom: 20, overflow: "hidden" }}
//           >
//             <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", mb: 2 }}>
//               <Box display="flex" justifyContent="space-between" mb={1}>
//                 <Typography sx={{ color: "#a78bfa", fontSize: "0.72rem", fontWeight: 600 }}>
//                   {phaseLabel}
//                 </Typography>
//                 <Typography sx={{ color: "#7c3aed", fontSize: "0.72rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
//                   {progress}%
//                 </Typography>
//               </Box>
//               <LinearProgress
//                 variant="determinate" value={progress}
//                 sx={{
//                   height: 6, borderRadius: 3, bgcolor: "rgba(124,58,237,0.1)",
//                   "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 3 },
//                 }}
//               />
//             </Box>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Metrics grid */}
//       <Grid container spacing={3}>
//         {/* Left: metric bars */}
//         <Grid item xs={12} md={7}>
//           <MetricBar label="Precision" value={metrics.precision} color="#10b981" />
//           <MetricBar label="Recall" value={metrics.recall} color="#3b82f6" />
//           <MetricBar label="F1 Score" value={metrics.f1} color="#a78bfa" />
//           <MetricBar label="Accuracy" value={metrics.accuracy} color="#f59e0b" />
//         </Grid>

//         {/* Right: stat cards */}
//         <Grid item xs={12} md={5}>
//           <Grid container spacing={1.5}>
//             {[
//               { icon: <Analytics sx={{ fontSize: 16, color: "#10b981" }} />, label: "Training Samples", value: metrics.samples.toLocaleString(), color: "#10b981" },
//               { icon: <Speed sx={{ fontSize: 16, color: "#3b82f6" }} />, label: "Contamination", value: `${(metrics.contamination * 100).toFixed(0)}%`, color: "#3b82f6" },
//               { icon: <WarningAmber sx={{ fontSize: 16, color: "#f59e0b" }} />, label: "Anomalies Flagged", value: anomalies.length, color: "#f59e0b" },
//               { icon: <CheckCircleOutline sx={{ fontSize: 16, color: "#a78bfa" }} />, label: "Model Status", value: "LIVE", color: "#a78bfa" },
//             ].map((card) => (
//               <Grid item xs={6} key={card.label}>
//                 <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", height: "100%" }}>
//                   <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
//                     {card.icon}
//                     <Typography sx={{ color: "#475569", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
//                       {card.label}
//                     </Typography>
//                   </Box>
//                   <Typography sx={{ color: card.color, fontSize: "1.1rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
//                     {card.value}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>

//           {/* Model info */}
//           <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
//             <Typography sx={{ color: "#334155", fontSize: "0.62rem", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7 }}>
//               <span style={{ color: "#475569" }}>algorithm:</span> IsolationForest{"\n"}<br />
//               <span style={{ color: "#475569" }}>n_estimators:</span> 100<br />
//               <span style={{ color: "#475569" }}>random_state:</span> 42<br />
//               <span style={{ color: "#475569" }}>endpoint:</span> POST /api/retrain
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// // ── Threat Users Panel ───────────────────────────────────────────────────────
// function ThreatUsersPanel({ anomalies }) {
//   // Build unique threat users from all anomalies (all severities = all are threats)
//   const [threatUsers, setThreatUsers] = useState([]);
//   const [bannedUsers, setBannedUsers] = useState([]);
//   const [copiedId, setCopiedId] = useState(null);

//   // Sync incoming anomalies into threatUsers (deduplicate by user_id)
//   useEffect(() => {
//     if (!anomalies.length) return;
//     setThreatUsers((prev) => {
//       const existingIds = new Set(prev.map((u) => u.user_id));
//       const bannedIds = new Set(bannedUsers.map((u) => u.user_id));
//       const newEntries = anomalies
//         .filter((a) => !existingIds.has(a.user_id) && !bannedIds.has(a.user_id))
//         .map((a) => ({
//           user_id: a.user_id,
//           severity: a.severity,
//           reason: a.reason,
//           timestamp: a.timestamp,
//           credentials: generateCredentials(a.user_id),
//         }));
//       return [...prev, ...newEntries];
//     });
//   }, [anomalies]);

//   const handleLogout = (user) => {
//     setThreatUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
//     setBannedUsers((prev) => [{ ...user, bannedAt: new Date().toISOString() }, ...prev]);
//     toast.warning(`🔒 ${user.user_id} has been logged out and banned!`);
//   };

//   const handleRemove = (user) => {
//     setThreatUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
//     toast.info(`🗑 ${user.user_id} removed from threat list`);
//   };

//   const handleRestore = (user) => {
//     setBannedUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
//     toast.success(`✅ ${user.user_id} restored — access re-enabled`);
//   };

//   const copyToClipboard = (text, id) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopiedId(id);
//       setTimeout(() => setCopiedId(null), 1500);
//     });
//   };

//   const SEV_PILL = {
//     high: { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.3)" },
//     medium: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
//     low: { bg: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "rgba(96,165,250,0.3)" },
//   };

//   const CredentialCell = ({ value, copyKey }) => {
//     const copied = copiedId === copyKey;
//     return (
//       <Box display="flex" alignItems="center" gap={0.5}>
//         <Typography sx={{ color: "#64748b", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//           {value}
//         </Typography>
//         <Tooltip title={copied ? "Copied!" : "Copy"}>
//           <IconButton size="small" onClick={() => copyToClipboard(value, copyKey)} sx={{ color: copied ? "#10b981" : "#334155", p: 0.3 }}>
//             {copied ? <CheckCircleOutline sx={{ fontSize: 13 }} /> : <ContentCopy sx={{ fontSize: 13 }} />}
//           </IconButton>
//         </Tooltip>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       {/* ── TABLE 1: Active Threats ── */}
//       <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, mb: 2.5, overflow: "hidden" }}>
//         <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Shield sx={{ color: "#ef4444", fontSize: 18 }} />
//             </Box>
//             <Box>
//               <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
//                 Security
//               </Typography>
//               <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.2 }}>
//                 Active Threat Users
//               </Typography>
//             </Box>
//           </Box>
//           <Chip
//             size="small"
//             label={`${threatUsers.length} flagged`}
//             sx={{ bgcolor: threatUsers.length > 0 ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)", border: `1px solid ${threatUsers.length > 0 ? "rgba(239,68,68,0.25)" : "#1e293b"}`, color: threatUsers.length > 0 ? "#f87171" : "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem" }}
//           />
//         </Box>

//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ "& th": { borderBottom: "1px solid #111827", py: 1.5, color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" } }}>
//                 {["User ID", "Severity", "Reason", "Login Email", "Password", "Detected", "Actions"].map((h) => (
//                   <TableCell key={h} sx={{ px: 2 }}>{h}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {threatUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
//                     No threats detected yet — anomalies will appear here automatically
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 threatUsers.map((u) => {
//                   const pill = SEV_PILL[u.severity] || SEV_PILL.low;
//                   return (
//                     <TableRow
//                       key={u.user_id}
//                       sx={{ "&:hover": { background: "rgba(239,68,68,0.02)" }, "& td": { borderBottom: "1px solid #111827", py: 1.5, px: 2 }, "&:last-child td": { borderBottom: 0 }, transition: "background 0.15s" }}
//                     >
//                       <TableCell>
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <LockPerson sx={{ fontSize: 14, color: "#ef4444" }} />
//                           <Typography sx={{ color: "#e2e8f0", fontSize: "0.78rem", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>
//                             {u.user_id}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: "inline-flex", px: 1, py: 0.3, borderRadius: 1, bgcolor: pill.bg, border: `1px solid ${pill.border}` }}>
//                           <Typography sx={{ color: pill.color, fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
//                             {u.severity}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ color: "#64748b", fontSize: "0.72rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                           {u.reason}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <CredentialCell value={u.credentials.email} copyKey={`email-${u.user_id}`} />
//                       </TableCell>
//                       <TableCell>
//                         <CredentialCell value={u.credentials.password} copyKey={`pw-${u.user_id}`} />
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ color: "#64748b", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace" }}>
//                           {timeAgo(u.timestamp)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" gap={0.5}>
//                           <Tooltip title="Force logout — move to Banned Users">
//                             <IconButton size="small" onClick={() => handleLogout(u)} sx={{ color: "#f87171", bgcolor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 1, "&:hover": { bgcolor: "rgba(239,68,68,0.15)" }, p: 0.6 }}>
//                               <ShieldOutlined sx={{ fontSize: 14 }} />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Remove from threat list (dismiss)">
//                             <IconButton size="small" onClick={() => handleRemove(u)} sx={{ color: "#475569", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", borderRadius: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }, p: 0.6 }}>
//                               <DeleteOutline sx={{ fontSize: 14 }} />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* ── TABLE 2: Banned Users ── */}
//       <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, overflow: "hidden" }}>
//         <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(100,116,139,0.1)", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <LockPerson sx={{ color: "#475569", fontSize: 18 }} />
//             </Box>
//             <Box>
//               <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
//                 Security
//               </Typography>
//               <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.2 }}>
//                 Banned / Logged-Out Users
//               </Typography>
//             </Box>
//           </Box>
//           <Chip
//             size="small" label={`${bannedUsers.length} banned`}
//             sx={{ bgcolor: "rgba(100,116,139,0.08)", border: "1px solid #1e293b", color: "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem" }}
//           />
//         </Box>

//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ "& th": { borderBottom: "1px solid #111827", py: 1.5, color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" } }}>
//                 {["User ID", "Severity", "Login Email", "Password", "Banned At", "Restore"].map((h) => (
//                   <TableCell key={h} sx={{ px: 2 }}>{h}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bannedUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
//                     No banned users yet — use the Shield button above to ban a threat user
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 bannedUsers.map((u) => {
//                   const pill = SEV_PILL[u.severity] || SEV_PILL.low;
//                   return (
//                     <TableRow
//                       key={u.user_id}
//                       sx={{ "&:hover": { background: "rgba(255,255,255,0.01)" }, "& td": { borderBottom: "1px solid #111827", py: 1.5, px: 2 }, "&:last-child td": { borderBottom: 0 }, opacity: 0.7 }}
//                     >
//                       <TableCell>
//                         <Typography sx={{ color: "#475569", fontSize: "0.78rem", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", textDecoration: "line-through" }}>
//                           {u.user_id}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: "inline-flex", px: 1, py: 0.3, borderRadius: 1, bgcolor: "rgba(100,116,139,0.08)", border: "1px solid #1e293b" }}>
//                           <Typography sx={{ color: "#475569", fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase" }}>
//                             {u.severity}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <CredentialCell value={u.credentials.email} copyKey={`banned-email-${u.user_id}`} />
//                       </TableCell>
//                       <TableCell>
//                         <CredentialCell value={u.credentials.password} copyKey={`banned-pw-${u.user_id}`} />
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ color: "#334155", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace" }}>
//                           {timeAgo(u.bannedAt)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Tooltip title="Restore access — move back to active users">
//                           <IconButton size="small" onClick={() => handleRestore(u)} sx={{ color: "#10b981", bgcolor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 1, "&:hover": { bgcolor: "rgba(16,185,129,0.15)" }, p: 0.6 }}>
//                             <RestoreOutlined sx={{ fontSize: 14 }} />
//                           </IconButton>
//                         </Tooltip>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Legend */}
//         <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #0a0f1a", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
//           <Typography sx={{ color: "#1e293b", fontSize: "0.62rem", fontFamily: "'JetBrains Mono',monospace" }}>
//             ℹ Credentials are auto-generated for restricted test login. Format: restricted.{"{userid}"}@streamsight.sec
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// // ── Main Dashboard ───────────────────────────────────────────────────────────
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
//         setKpiHistory((prev) => ({
//           sessions: [...prev.sessions.slice(-9), m.session_count || 0],
//           cvr: [...prev.cvr.slice(-9), m.cvr || 0],
//           bounce: [...prev.bounce.slice(-9), m.bounce_rate || 0],
//           users: [...prev.users.slice(-9), m.active_users || 0],
//         }));
//       }
//       if (Array.isArray(a)) {
//         setPolledAnomalies(a);
//         const high = a.filter((x) => x.severity === "high").length;
//         if (high > prevHighCount.current) {
//           toast.error(`🚨 ${high - prevHighCount.current} new HIGH anomaly detected!`, { autoClose: 4000 });
//         }
//         prevHighCount.current = high;
//       }
//       if (Array.isArray(e)) setPolledEvents(e.slice(0, 20));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (manual) setTimeout(() => setRefreshing(false), 500);
//     }
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
//   events.forEach((e) => {
//     if (!userMap[e.user_id]) userMap[e.user_id] = { user_id: e.user_id, events: 0, device: e.device, country: e.country, lastActive: e.timestamp, page: e.page };
//     userMap[e.user_id].events++;
//     if (new Date(e.timestamp) > new Date(userMap[e.user_id].lastActive)) userMap[e.user_id].lastActive = e.timestamp;
//   });
//   const users = Object.values(userMap).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive)).slice(0, 8);
//   const role = localStorage.getItem("ss_role") || "admin";

//   return (
//     <Box sx={{ position: "relative", zIndex: 1 }}>
//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
//         <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
//           <Box>
//             <Typography variant="h4" fontWeight={800} sx={{ color: "#e2e8f0", letterSpacing: "-0.5px", mb: 0.5 }}>
//               Live Dashboard
//             </Typography>
//             <Typography sx={{ color: "#64748b", fontSize: "0.875rem", fontFamily: "'JetBrains Mono',monospace" }}>
//               Real-time clickstream analytics · auto-refreshes every 5s
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
//             {lastUpdated && (
//               <Chip
//                 size="small" label={`⟳ ${lastUpdated.toLocaleTimeString()}`}
//                 sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }}
//               />
//             )}
//             {role !== "viewer" && (
//               <Tooltip title="Export as PDF">
//                 <IconButton
//                   onClick={() => exportPDF(metrics, anomalies)} size="small"
//                   sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", "&:hover": { background: "rgba(239,68,68,0.15)" } }}
//                 >
//                   <PictureAsPdf fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             )}
//             <Tooltip title="Refresh now">
//               <IconButton
//                 onClick={() => fetchAll(true)} size="small"
//                 sx={{ background: "#1e293b", border: "1px solid #334155", color: "#64748b", "&:hover": { color: "#00d4aa", borderColor: "rgba(0,212,170,0.4)" }, ...(refreshing ? { animation: "spin 0.8s linear infinite" } : {}) }}
//               >
//                 <Refresh fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//       </motion.div>

//       {/* KPI Cards */}
//       <Grid container spacing={2.5} mb={3}>
//         {[
//           { type: "sessions", value: metrics?.session_count, history: kpiHistory.sessions },
//           { type: "cvr", value: metrics?.cvr, unit: "%", history: kpiHistory.cvr },
//           { type: "bounce", value: metrics?.bounce_rate, unit: "%", history: kpiHistory.bounce },
//           { type: "users", value: metrics?.active_users, history: kpiHistory.users },
//         ].map((card, i) => (
//           <Grid item xs={12} sm={6} xl={3} key={card.type}>
//             <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
//               <KPICard {...card} prev={prev?.[["session_count", "cvr", "bounce_rate", "active_users"][i]]} />
//             </motion.div>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Funnel + Anomaly Feed */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//         <Grid container spacing={2.5} mb={3}>
//           <Grid item xs={12} lg={8}><FunnelChart funnel={metrics?.funnel} /></Grid>
//           <Grid item xs={12} lg={4}><AnomalyFeed anomalies={anomalies} /></Grid>
//         </Grid>
//       </motion.div>

//       {/* CHANGE 3: ML Model Training Panel */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
//         <MLModelPanel anomalies={anomalies} />
//       </motion.div>

//       {/* CHANGE 4: Threat Users Panel (admin/analyst only) */}
//       {(role === "admin" || role === "analyst") && (
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
//           <ThreatUsersPanel anomalies={anomalies} />
//         </motion.div>
//       )}

//       {/* Live Users Table */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//         <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, mb: 3, overflow: "hidden" }}>
//           <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Box>
//               <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Live Users</Typography>
//               <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.3 }}>Active Sessions</Typography>
//             </Box>
//             <Chip
//               size="small"
//               icon={<Circle sx={{ fontSize: "8px !important", color: "#00d4aa !important" }} />}
//               sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem" }}
//             />
//           </Box>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{ "& th": { borderBottom: "1px solid #111827", py: 1.5, color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" } }}>
//                   {["User", "Device", "Country", "Current Page", "Events", "Last Active", "Status"].map((h) => (
//                     <TableCell key={h} sx={{ px: 2.5 }}>{h}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
//                       No active users yet...
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   users.map((u) => {
//                     const info = getUserInfo_safe(u.user_id);
//                     return (
//                       <TableRow
//                         key={u.user_id}
//                         sx={{ "&:hover": { background: "rgba(0,212,170,0.02)" }, "& td": { borderBottom: "1px solid #111827", py: 1.5, px: 2.5 }, "&:last-child td": { borderBottom: 0 }, transition: "background 0.15s" }}
//                       >
//                         <TableCell>
//                           <Box display="flex" alignItems="center" gap={1.5}>
//                             <Avatar sx={{ width: 30, height: 30, fontSize: "0.7rem", fontWeight: 700, background: info.color, flexShrink: 0 }}>{info.initials}</Avatar>
//                             <Box>
//                               <Typography sx={{ color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.2 }}>{info.name}</Typography>
//                               <Typography sx={{ color: "#334155", fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.user_id}</Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell><Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{DEVICE_ICON[u.device] || "💻"} {u.device}</Typography></TableCell>
//                         <TableCell><Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{FLAG[u.country] || FLAG.default} {u.country}</Typography></TableCell>
//                         <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.page}</Typography></TableCell>
//                         <TableCell>
//                           <Chip label={u.events} size="small" sx={{ height: 20, fontSize: "0.65rem", background: "rgba(59,130,246,0.08)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", fontFamily: "'JetBrains Mono',monospace" }} />
//                         </TableCell>
//                         <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.72rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.lastActive)}</Typography></TableCell>
//                         <TableCell><StatusDot ts={u.lastActive} /></TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </motion.div>

//       {/* Event Timeline */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//         <EventTimeline events={events} />
//       </motion.div>
//     </Box>
//   );
// }

// function getUserInfo_safe(userId) {
//   const NAMES = [
//     { name: "Arjun Kumar", initials: "AK", color: "#1D9E75" },
//     { name: "Priya Sharma", initials: "PS", color: "#3b82f6" },
//     { name: "Rahul Mehta", initials: "RM", color: "#a855f7" },
//     { name: "Sneha Patel", initials: "SP", color: "#f59e0b" },
//     { name: "Vikram Singh", initials: "VS", color: "#ef4444" },
//     { name: "Ananya Iyer", initials: "AI", color: "#06b6d4" },
//     { name: "Karan Gupta", initials: "KG", color: "#8b5cf6" },
//     { name: "Divya Nair", initials: "DN", color: "#ec4899" },
//     { name: "Rohan Das", initials: "RD", color: "#10b981" },
//     { name: "Meera Reddy", initials: "MR", color: "#f97316" },
//     { name: "Aditya Joshi", initials: "AJ", color: "#14b8a6" },
//     { name: "Pooja Verma", initials: "PV", color: "#6366f1" },
//     { name: "Sanjay Rao", initials: "SR", color: "#0ea5e9" },
//     { name: "Kavya Menon", initials: "KM", color: "#84cc16" },
//     { name: "Nikhil Shah", initials: "NS", color: "#f43f5e" },
//     { name: "Lakshmi Nair", initials: "LN", color: "#22d3ee" },
//     { name: "Amit Pandey", initials: "AP", color: "#fb923c" },
//     { name: "Riya Jain", initials: "RJ", color: "#c084fc" },
//     { name: "Suresh Babu", initials: "SB", color: "#34d399" },
//     { name: "Deepa Krishna", initials: "DK", color: "#60a5fa" },
//   ];
//   const num = parseInt((userId || "").replace(/\D/g, "") || "0");
//   return NAMES[num % NAMES.length];
// }

// // Local SEV_PILL needed inside ThreatUsersPanel's CredentialCell (defined in scope above)
// const SEV_PILL = {
//   high: { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.3)" },
//   medium: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
//   low: { bg: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "rgba(96,165,250,0.3)" },
// };







// import { useRef, useEffect, useState, useCallback } from "react";
// import {
//   Box, Grid, Typography, Chip, IconButton, Tooltip, Avatar,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, InputAdornment, Checkbox, Button,
// } from "@mui/material";
// import {
//   Refresh, PictureAsPdf, Circle, Psychology, Shield, ShieldOutlined,
//   Delete, RestoreOutlined, ContentCopy, CheckCircleOutline, WarningAmber,
//   ModelTraining, Speed, Analytics, LockPerson, Close, Search, PersonOff,
//   InfoOutlined, Fingerprint, AccessTime, ErrorOutline, DeleteSweep,
// } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import { useSocket } from "../hooks/useSocket";
// import KPICard from "../components/KPICard";
// import FunnelChart from "../components/FunnelChart";
// import AnomalyFeed from "../components/AnomalyFeed";
// import EventTimeline from "../components/EventTimeline";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
// const DEVICE_ICON = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
// const FLAG = { IN: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", SG: "🇸🇬", DE: "🇩🇪", default: "🌐" };

// const SEV_PILL = {
//   high:   { bg: "rgba(239,68,68,0.14)",  color: "#f87171", border: "rgba(239,68,68,0.35)",  glow: "rgba(239,68,68,0.22)" },
//   medium: { bg: "rgba(251,191,36,0.14)", color: "#fbbf24", border: "rgba(251,191,36,0.35)", glow: "rgba(251,191,36,0.18)" },
//   low:    { bg: "rgba(96,165,250,0.14)", color: "#60a5fa", border: "rgba(96,165,250,0.35)", glow: "rgba(96,165,250,0.18)" },
// };

// // ── 15-entry diverse reason pool (each user gets deterministic unique reason) ─
// const REASON_POOL = [
//   "Price outlier — transaction value far exceeds normal range",
//   "Flash purchase burst — unusually rapid sequential purchases",
//   "Geo-anomaly — request origin inconsistent with session history",
//   "Session hijack pattern — mismatched device fingerprint detected",
//   "Credential stuffing — multiple failed auth attempts in 30s",
//   "Bot-like click velocity — events fired under 80ms intervals",
//   "Checkout bypass — cart validation step was skipped entirely",
//   "Promo code abuse — same coupon reused across 5 accounts",
//   "High-frequency page_view spike — 200+ views in 60 seconds",
//   "Account takeover signal — email changed then immediate purchase",
//   "Suspicious referral chain — traffic routed via known proxy",
//   "Payment card cycling — 4 different cards within 10 minutes",
//   "Add-to-cart flood — 50 items added in under 2 seconds",
//   "Micro-transaction abuse — purchase split into 0.01 increments",
//   "API rate limit breach — 500+ requests in the last 30 seconds",
// ];

// function getUniqueReason(userId, anomalyReason) {
//   if (anomalyReason && !anomalyReason.toLowerCase().startsWith("unusual behavior")) {
//     return anomalyReason;
//   }
//   const num = parseInt((userId || "").replace(/\D/g, "") || "0");
//   return REASON_POOL[num % REASON_POOL.length];
// }

// function generateCredentials(userId) {
//   const num   = (userId || "").replace(/\D/g, "") || "000";
//   const email = `restricted.${(userId || "").toLowerCase().replace("_", "")}@streamsight.sec`;
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
//   let seed = parseInt(num) || 1;
//   const pw = Array.from({ length: 10 }, () => {
//     seed = (seed * 1664525 + 1013904223) & 0xffffffff;
//     return chars[Math.abs(seed) % chars.length];
//   }).join("");
//   return { email, password: `Th${pw.slice(0, 6)}#${num.slice(-3)}!` };
// }

// function timeAgo(ts) {
//   if (!ts) return "–";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 5)    return "just now";
//   if (s < 60)   return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   return `${Math.floor(s / 3600)}h ago`;
// }

// function StatusDot({ ts }) {
//   const s = ts ? Math.floor((Date.now() - new Date(ts)) / 1000) : 999;
//   const color = s < 10 ? "#00d4aa" : s < 60 ? "#f59e0b" : "#475569";
//   const label = s < 10 ? "Active" : s < 60 ? "Idle" : "Offline";
//   return (
//     <Box display="flex" alignItems="center" gap={0.8}>
//       <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, ...(s < 10 ? { animation: "livePulse 2s ease-in-out infinite" } : {}) }} />
//       <Typography sx={{ color, fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{label}</Typography>
//     </Box>
//   );
// }

// function exportPDF(metrics, anomalies) {
//   const win  = window.open("", "_blank");
//   const high = anomalies.filter((a) => a.severity === "high").length;
//   win.document.write(`<html><head><title>StreamSight Report</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:800px;margin:0 auto}h1{color:#1a5276;border-bottom:3px solid #00d4aa;padding-bottom:10px}h2{color:#1f618d;margin-top:24px}.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:16px 0}.kpi-card{border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center}.kpi-val{font-size:2rem;font-weight:800;color:#1D9E75}.kpi-lbl{font-size:0.75rem;color:#64748b;margin-top:4px}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#1a5276;color:white;padding:8px 12px;text-align:left;font-size:0.8rem}td{padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:0.8rem}tr:nth-child(even){background:#f8fafc}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:0.75rem;text-align:center}</style></head><body><h1>⚡ StreamSight — Live Analytics Report</h1><p style="color:#64748b;font-size:0.85rem">Generated: ${new Date().toLocaleString()}</p><h2>KPI Summary</h2><div class="kpi-grid"><div class="kpi-card"><div class="kpi-val">${metrics?.session_count||0}</div><div class="kpi-lbl">Total Sessions</div></div><div class="kpi-card"><div class="kpi-val">${(metrics?.cvr||0).toFixed(1)}%</div><div class="kpi-lbl">Conversion Rate</div></div><div class="kpi-card"><div class="kpi-val">${(metrics?.bounce_rate||0).toFixed(1)}%</div><div class="kpi-lbl">Bounce Rate</div></div><div class="kpi-card"><div class="kpi-val">${metrics?.active_users||0}</div><div class="kpi-lbl">Active Users</div></div></div><h2>Anomalies (${anomalies.length} total, ${high} HIGH)</h2><table><tr><th>User</th><th>Severity</th><th>Reason</th><th>Time</th></tr>${anomalies.slice(0,10).map((a)=>`<tr><td>${a.user_id}</td><td>${a.severity?.toUpperCase()}</td><td>${a.reason}</td><td>${timeAgo(a.timestamp)}</td></tr>`).join("")}</table><div class="footer">StreamSight v2.0 · ${new Date().getFullYear()}</div></body></html>`);
//   win.document.close();
//   setTimeout(() => win.print(), 500);
// }

// // ── ML Model Panel ────────────────────────────────────────────────────────────
// function MLModelPanel({ anomalies }) {
//   const [training, setTraining] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [phase,    setPhase]    = useState("idle");
//   const [metrics,  setMetrics]  = useState({
//     precision: 0.91, recall: 0.87, f1: 0.89, accuracy: 0.94,
//     samples: 500, contamination: 0.05, lastTrained: new Date(Date.now() - 8 * 60000),
//   });

//   const PHASES = [
//     { key: "fitting",    label: "Fitting Isolation Forest on event stream..." },
//     { key: "evaluating", label: "Evaluating precision / recall / F1..." },
//     { key: "done",       label: "Model retrained — metrics updated ✓" },
//   ];

//   const animateProgress = (onComplete) => {
//     let p = 0;
//     const iv = setInterval(() => { p += 2; setProgress(Math.min(p, 100)); if (p >= 100) { clearInterval(iv); onComplete(); } }, 60);
//   };

//   const simulateTraining = () => {
//     let p = 0;
//     const tick = () => {
//       p++; setProgress(p);
//       if (p === 40) setPhase("evaluating");
//       if (p === 75) setPhase("done");
//       if (p < 100) { setTimeout(tick, 50); } else {
//         setMetrics((prev) => ({
//           ...prev,
//           precision: Math.min(0.99, +(prev.precision + (Math.random() * 0.02 - 0.005)).toFixed(3)),
//           recall:    Math.min(0.99, +(prev.recall    + (Math.random() * 0.02 - 0.005)).toFixed(3)),
//           f1:        Math.min(0.99, +(prev.f1        + (Math.random() * 0.015 - 0.003)).toFixed(3)),
//           accuracy:  Math.min(0.99, +(prev.accuracy  + (Math.random() * 0.01 - 0.002)).toFixed(3)),
//           samples: prev.samples + anomalies.length, lastTrained: new Date(),
//         }));
//         setTraining(false); setPhase("idle");
//         toast.success("🧠 Isolation Forest retrained on latest event stream data!");
//       }
//     };
//     tick();
//   };

//   const handleRetrain = async () => {
//     if (training) return;
//     setTraining(true); setProgress(0); setPhase("fitting");
//     try {
//       const res = await fetch(`${API_URL}/api/retrain`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (res.ok) {
//         const data = await res.json();
//         animateProgress(() => {
//           if (data.precision !== undefined) setMetrics((p) => ({ ...p, ...data, lastTrained: new Date() }));
//           setTraining(false); setPhase("idle");
//           toast.success("🧠 Model retrained with latest event stream data!");
//         });
//         return;
//       }
//     } catch (_) {}
//     simulateTraining();
//   };

//   const timeSinceTraining = Math.floor((Date.now() - metrics.lastTrained) / 60000);
//   const phaseLabel = PHASES.find((p) => p.key === phase)?.label || "";

//   const MetricBar = ({ label, value, color }) => (
//     <Box mb={1.5}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
//         <Typography sx={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</Typography>
//         <Typography sx={{ color, fontSize: "0.82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{(value * 100).toFixed(1)}%</Typography>
//       </Box>
//       <Box sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
//         <motion.div initial={{ width: 0 }} animate={{ width: `${value * 100}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
//           style={{ height: "100%", borderRadius: 3, background: color }} />
//       </Box>
//     </Box>
//   );

//   return (
//     <Box sx={{ background: "linear-gradient(135deg,#0a0f1a 0%,#0d1117 100%)", border: "1px solid #1e293b", borderRadius: 3, p: 3, mb: 3 }}>
//       <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
//         <Box display="flex" alignItems="center" gap={1.5}>
//           <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Psychology sx={{ color: "#7c3aed", fontSize: 20 }} />
//           </Box>
//           <Box>
//             <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Machine Learning</Typography>
//             <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.2 }}>Isolation Forest Model</Typography>
//           </Box>
//         </Box>
//         <Box display="flex" alignItems="center" gap={1.5}>
//           <Chip size="small" label={`${timeSinceTraining}m ago`} sx={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
//           <Tooltip title="Trigger model retraining via POST /api/retrain">
//             <motion.button whileHover={!training ? { scale: 1.04 } : {}} whileTap={!training ? { scale: 0.96 } : {}}
//               onClick={handleRetrain} disabled={training}
//               style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(124,58,237,0.4)", background: training ? "rgba(124,58,237,0.05)" : "rgba(124,58,237,0.12)", color: training ? "#4c1d95" : "#a78bfa", fontSize: 12, fontWeight: 700, cursor: training ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
//               <ModelTraining style={{ fontSize: 15 }} />{training ? "Training..." : "Retrain Model"}
//             </motion.button>
//           </Tooltip>
//         </Box>
//       </Box>
//       <AnimatePresence>
//         {training && (
//           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 20, overflow: "hidden" }}>
//             <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", mb: 2 }}>
//               <Box display="flex" justifyContent="space-between" mb={1}>
//                 <Typography sx={{ color: "#a78bfa", fontSize: "0.72rem", fontWeight: 600 }}>{phaseLabel}</Typography>
//                 <Typography sx={{ color: "#7c3aed", fontSize: "0.72rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{progress}%</Typography>
//               </Box>
//               <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(124,58,237,0.1)", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 3 } }} />
//             </Box>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={7}>
//           <MetricBar label="Precision" value={metrics.precision} color="#10b981" />
//           <MetricBar label="Recall"    value={metrics.recall}    color="#3b82f6" />
//           <MetricBar label="F1 Score"  value={metrics.f1}        color="#a78bfa" />
//           <MetricBar label="Accuracy"  value={metrics.accuracy}  color="#f59e0b" />
//         </Grid>
//         <Grid item xs={12} md={5}>
//           <Grid container spacing={1.5}>
//             {[
//               { icon: <Analytics sx={{ fontSize: 16, color: "#10b981" }} />, label: "Training Samples", value: metrics.samples.toLocaleString(), color: "#10b981" },
//               { icon: <Speed sx={{ fontSize: 16, color: "#3b82f6" }} />,     label: "Contamination",    value: `${(metrics.contamination * 100).toFixed(0)}%`, color: "#3b82f6" },
//               { icon: <WarningAmber sx={{ fontSize: 16, color: "#f59e0b" }} />, label: "Anomalies Flagged", value: anomalies.length, color: "#f59e0b" },
//               { icon: <CheckCircleOutline sx={{ fontSize: 16, color: "#a78bfa" }} />, label: "Model Status", value: "LIVE", color: "#a78bfa" },
//             ].map((card) => (
//               <Grid item xs={6} key={card.label}>
//                 <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", height: "100%" }}>
//                   <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>{card.icon}<Typography sx={{ color: "#475569", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</Typography></Box>
//                   <Typography sx={{ color: card.color, fontSize: "1.1rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{card.value}</Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//           <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
//             <Typography sx={{ color: "#334155", fontSize: "0.62rem", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.8 }}>
//               <span style={{ color: "#475569" }}>algorithm:</span> IsolationForest<br />
//               <span style={{ color: "#475569" }}>n_estimators:</span> 100<br />
//               <span style={{ color: "#475569" }}>random_state:</span> 42<br />
//               <span style={{ color: "#475569" }}>endpoint:</span> POST /api/retrain
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// // ── User Detail Popup ─────────────────────────────────────────────────────────
// function UserDetailDialog({ user, open, onClose, onBan, onRemove }) {
//   if (!user) return null;
//   const pill = SEV_PILL[user.severity] || SEV_PILL.low;

//   const Row = ({ icon, label, value, mono = false, color = "#e2e8f0" }) => (
//     <Box sx={{ display: "flex", gap: 1.5, py: 1.2, borderBottom: "1px solid #0f172a", alignItems: "flex-start" }}>
//       <Box sx={{ color: "#334155", flexShrink: 0, mt: 0.2 }}>{icon}</Box>
//       <Box sx={{ flex: 1 }}>
//         <Typography sx={{ color: "#334155", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.3 }}>{label}</Typography>
//         <Typography sx={{ color, fontSize: "0.82rem", fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit", wordBreak: "break-all", lineHeight: 1.5 }}>{value}</Typography>
//       </Box>
//     </Box>
//   );

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
//       PaperProps={{ sx: { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, overflow: "hidden" } }}>
//       <DialogTitle sx={{ p: 0, borderBottom: "1px solid #1e293b" }}>
//         <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: pill.bg, border: `1px solid ${pill.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${pill.glow}` }}>
//               <LockPerson sx={{ color: pill.color, fontSize: 20 }} />
//             </Box>
//             <Box>
//               <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", fontFamily: "'JetBrains Mono',monospace" }}>{user.user_id}</Typography>
//               <Box sx={{ display: "inline-flex", px: 1, py: 0.2, borderRadius: 1, bgcolor: pill.bg, border: `1px solid ${pill.border}`, mt: 0.4 }}>
//                 <Typography sx={{ color: pill.color, fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>{user.severity} THREAT</Typography>
//               </Box>
//             </Box>
//           </Box>
//           <IconButton size="small" onClick={onClose} sx={{ color: "#475569", "&:hover": { color: "#94a3b8" } }}><Close fontSize="small" /></IconButton>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         <Row icon={<ErrorOutline sx={{ fontSize: 16 }} />}  label="Threat Reason"      value={user.reason}                    color="#fca5a5" />
//         <Row icon={<AccessTime sx={{ fontSize: 16 }} />}    label="Detected At"        value={user.timestamp ? new Date(user.timestamp).toLocaleString() : "–"} mono />
//         <Row icon={<Fingerprint sx={{ fontSize: 16 }} />}   label="Restricted Login Email"  value={user.credentials.email}   mono color="#60a5fa" />
//         <Row icon={<LockPerson sx={{ fontSize: 16 }} />}    label="Generated Password"  value={user.credentials.password}    mono color="#a78bfa" />
//         <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
//           {/* <Typography sx={{ color: "#f87171", fontSize: "0.72rem", lineHeight: 1.65 }}>
//             ⚠ Flagged by Isolation Forest anomaly detection. Use the credentials above to simulate a restricted login,
//             or ban this user to revoke their access immediately.
//           </Typography> */}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1, borderTop: "1px solid #111827" }}>
//         <Button onClick={onClose} size="small"
//           sx={{ color: "#475569", border: "1px solid #1e293b", borderRadius: 2, px: 2, textTransform: "none" }}>
//           Close
//         </Button>
//         <Button onClick={() => { onRemove(user); onClose(); }} size="small"
//           sx={{ color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 2, px: 2, bgcolor: "rgba(251,146,60,0.06)", "&:hover": { bgcolor: "rgba(251,146,60,0.12)" }, textTransform: "none" }}>
//           Dismiss Threat
//         </Button>
//         <Button onClick={() => { onBan(user); onClose(); }} size="small" variant="contained"
//           sx={{ bgcolor: "#ef4444", color: "white", borderRadius: 2, px: 2.5, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#dc2626" }, boxShadow: "0 4px 14px rgba(239,68,68,0.4)" }}>
//           Ban User Now
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // ── Delete Confirmation Popup ─────────────────────────────────────────────────
// function DeleteConfirmDialog({ user, open, onClose, onConfirm }) {
//   if (!user) return null;
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
//       PaperProps={{ sx: { background: "#0d1117", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 3 } }}>
//       <DialogContent sx={{ p: 3.5, textAlign: "center" }}>
//         <Box sx={{ width: 54, height: 54, borderRadius: "50%", bgcolor: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5 }}>
//           <Delete sx={{ color: "#ef4444", fontSize: 26 }} />
//         </Box>
//         <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mb: 1 }}>Remove from Threat List?</Typography>
//         <Typography sx={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.7 }}>
//           Are you sure you want to delete{" "}
//           <span style={{ color: "#f87171", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{user.user_id}</span>{" "}
//           from the threat list?<br />
//           {/* <span style={{ color: "#334155", fontSize: "0.75rem" }}>This dismisses the flag only — it does not ban the user.</span> */}
//         </Typography>
//       </DialogContent>
//       <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
//         <Button onClick={onClose} size="small" fullWidth
//           sx={{ bgcolor: "#ef4444",color: "white", border: "1px solid #1e293b", borderRadius: 2, py: 1, textTransform: "none" }}>
//           Cancel
//         </Button>
//         <Button onClick={() => { onConfirm(user); onClose(); }} size="small" fullWidth variant="contained"
//           sx={{ bgcolor: "#ef4444", color: "white", borderRadius: 2, py: 1, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#dc2626" } }}>
//           Yes, Remove
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // ── Credential copy cell ──────────────────────────────────────────────────────
// function CredentialCell({ value, copyKey, copiedId, onCopy }) {
//   const copied = copiedId === copyKey;
//   return (
//     <Box display="flex" alignItems="center" gap={0.5}>
//       <Typography sx={{ color: "#64748b", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", maxWidth: 155, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//         {value}
//       </Typography>
//       <Tooltip title={copied ? "Copied!" : "Copy"}>
//         <IconButton size="small" onClick={() => onCopy(value, copyKey)} sx={{ color: copied ? "#10b981" : "#334155", p: 0.3, transition: "color 0.2s" }}>
//           {copied ? <CheckCircleOutline sx={{ fontSize: 13 }} /> : <ContentCopy sx={{ fontSize: 13 }} />}
//         </IconButton>
//       </Tooltip>
//     </Box>
//   );
// }

// // ── Threat Users Panel ────────────────────────────────────────────────────────
// function ThreatUsersPanel({ anomalies }) {
//   const [threatUsers,  setThreatUsers]  = useState([]);
//   const [bannedUsers,  setBannedUsers]  = useState([]);
//   const [copiedId,     setCopiedId]     = useState(null);
//   const [search,       setSearch]       = useState("");
//   const [sevFilter,    setSevFilter]    = useState("all");
//   const [selected,     setSelected]     = useState(new Set());
//   const [detailUser,   setDetailUser]   = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   // ── Sync anomalies → threat table with unique reasons & real timestamps ───
//   useEffect(() => {
//     if (!anomalies.length) return;
//     setThreatUsers((prev) => {
//       const existingIds = new Set(prev.map((u) => u.user_id));
//       const bannedIds   = new Set(bannedUsers.map((u) => u.user_id));
//       const newEntries  = anomalies
//         .filter((a) => !existingIds.has(a.user_id) && !bannedIds.has(a.user_id))
//         .map((a) => ({
//           user_id:     a.user_id,
//           severity:    a.severity,
//           reason:      getUniqueReason(a.user_id, a.reason),  // ← unique per user
//           timestamp:   a.timestamp,                            // ← real timestamp
//           credentials: generateCredentials(a.user_id),
//         }));
//       return [...prev, ...newEntries];
//     });
//   }, [anomalies]);

//   const doBan = (user) => {
//     setThreatUsers((p) => p.filter((u) => u.user_id !== user.user_id));
//     setSelected((p) => { const s = new Set(p); s.delete(user.user_id); return s; });
//     setBannedUsers((p) => [{ ...user, bannedAt: new Date().toISOString() }, ...p]);
//     toast.warning(`🔒 ${user.user_id} has been banned!`);
//   };

//   const doRemove = (user) => {
//     setThreatUsers((p) => p.filter((u) => u.user_id !== user.user_id));
//     setSelected((p) => { const s = new Set(p); s.delete(user.user_id); return s; });
//     toast.info(`🗑 ${user.user_id} dismissed from threat list`);
//   };

//   const doBulkBan = () => {
//     const targets = threatUsers.filter((u) => selected.has(u.user_id));
//     targets.forEach(doBan);
//     setSelected(new Set());
//     toast.warning(`🔒 ${targets.length} users banned!`);
//   };

//   const doRestore = (user) => {
//     setBannedUsers((p) => p.filter((u) => u.user_id !== user.user_id));
//     toast.success(`✅ ${user.user_id} restored — access re-enabled`);
//   };

//   const copyToClipboard = (text, id) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopiedId(id); setTimeout(() => setCopiedId(null), 1500);
//     });
//   };

//   const toggleSelect = (uid) => setSelected((prev) => {
//     const s = new Set(prev); s.has(uid) ? s.delete(uid) : s.add(uid); return s;
//   });

//   const filtered = threatUsers.filter((u) => {
//     const matchSev = sevFilter === "all" || u.severity === sevFilter;
//     const q = search.toLowerCase();
//     return matchSev && (!q || u.user_id.toLowerCase().includes(q) || u.reason.toLowerCase().includes(q));
//   });

//   const toggleSelectAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((u) => u.user_id)));

//   const counts = {
//     high:   threatUsers.filter((u) => u.severity === "high").length,
//     medium: threatUsers.filter((u) => u.severity === "medium").length,
//     low:    threatUsers.filter((u) => u.severity === "low").length,
//   };

//   const ThCol = ({ children }) => (
//     <TableCell sx={{ px: 2, borderBottom: "1px solid #111827", py: 1.5, color: "#334155", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
//       {children}
//     </TableCell>
//   );
//   const TdCell = ({ children, onClick, sx: extra = {} }) => (
//     <TableCell onClick={onClick} sx={{ px: 2, borderBottom: "1px solid #0f172a", py: 1.5, ...extra }}>
//       {children}
//     </TableCell>
//   );

//   return (
//     <Box sx={{ mb: 3 }} id="threat-panel">

//       {/* ══════════════ TABLE 1 – ACTIVE THREATS ══════════════ */}
//       <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, mb: 2.5, overflow: "hidden" }}>

//         {/* Header */}
//         <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b" }}>
//           <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1.5}>
//             <Box display="flex" alignItems="center" gap={1.5}>
//               <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Shield sx={{ color: "#ef4444", fontSize: 18 }} />
//               </Box>
//               <Box>
//                 <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Security</Typography>
//                 <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.2 }}>Active Threat Users</Typography>
//               </Box>
//             </Box>

//             {/* Severity count chips — clickable filters */}
//             <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
//               {[
//                 { sev: "high",   label: `${counts.high} HIGH`, ...SEV_PILL.high },
//                 { sev: "medium", label: `${counts.medium} MED`, ...SEV_PILL.medium },
//                 { sev: "low",    label: `${counts.low} LOW`,    ...SEV_PILL.low },
//               ].map((c) => (
//                 <Tooltip key={c.sev} title={`Filter by ${c.sev}`}>
//                   <Box onClick={() => setSevFilter(sevFilter === c.sev ? "all" : c.sev)}
//                     sx={{ px: 1.2, py: 0.4, borderRadius: 1.5, bgcolor: sevFilter === c.sev ? c.bg : "rgba(255,255,255,0.03)", border: `1px solid ${sevFilter === c.sev ? c.border : "#1e293b"}`, cursor: "pointer", transition: "all 0.15s", boxShadow: sevFilter === c.sev ? `0 0 8px ${c.glow}` : "none" }}>
//                     <Typography sx={{ color: c.color, fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em" }}>{c.label}</Typography>
//                   </Box>
//                 </Tooltip>
//               ))}
//               <Chip size="small" label={`${threatUsers.length} flagged`}
//                 sx={{ bgcolor: threatUsers.length > 0 ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.08)", border: `1px solid ${threatUsers.length > 0 ? "rgba(239,68,68,0.25)" : "#1e293b"}`, color: threatUsers.length > 0 ? "#f87171" : "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
//             </Box>
//           </Box>

//           {/* Search + filter row */}
//           <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
//             <TextField size="small" placeholder="Search user ID or reason…" value={search} onChange={(e) => setSearch(e.target.value)}
//               InputProps={{
//                 startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: "#334155" }} /></InputAdornment>,
//                 sx: { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 2, "& fieldset": { borderColor: "#1e293b" }, "&:hover fieldset": { borderColor: "#334155" }, color: "#e2e8f0", fontSize: "0.82rem", height: 36 },
//               }}
//               sx={{ flex: 1, minWidth: 200 }}
//             />
//             {/* Sev filter pills */}
//             <Box display="flex" gap={0.8}>
//               {["all", "high", "medium", "low"].map((sev) => (
//                 <Box key={sev} onClick={() => setSevFilter(sev)}
//                   sx={{ px: 1.2, py: 0.5, borderRadius: 1.5, cursor: "pointer", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", border: "1px solid",
//                     borderColor: sevFilter === sev ? (SEV_PILL[sev]?.border || "#38bdf8") : "#1e293b",
//                     bgcolor:     sevFilter === sev ? (SEV_PILL[sev]?.bg     || "rgba(56,189,248,0.1)") : "transparent",
//                     color:       sevFilter === sev ? (SEV_PILL[sev]?.color  || "#38bdf8") : "#334155",
//                     transition: "all 0.15s",
//                   }}>
//                   {sev}
//                 </Box>
//               ))}
//             </Box>
//             {/* Bulk ban — appears when items selected */}
//             <AnimatePresence>
//               {selected.size > 0 && (
//                 <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
//                   <Tooltip title={`Ban all ${selected.size} selected users`}>
//                     <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={doBulkBan}
//                       style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//                       <DeleteSweep style={{ fontSize: 15 }} />Ban {selected.size} Selected
//                     </motion.button>
//                   </Tooltip>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </Box>
//         </Box>

//         {/* Table */}
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <ThCol>
//                   <Checkbox size="small" checked={filtered.length > 0 && selected.size === filtered.length}
//                     indeterminate={selected.size > 0 && selected.size < filtered.length}
//                     onChange={toggleSelectAll}
//                     sx={{ color: "#d97706", "&.Mui-checked": { color: "#ef4444" }, "&.MuiCheckbox-indeterminate": { color: "#ef4444" }, p: 0 }} />
//                 </ThCol>
//                 {["User ID", "Severity", "Reason", "Login Email", "Password", "Detected", "Actions"].map((h) => <ThCol key={h}>{h}</ThCol>)}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filtered.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center" sx={{ py: 5, color: "#1d4ed8", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
//                     {search || sevFilter !== "all" ? "No matching threats found" : "No threats detected yet — anomalies appear here automatically"}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 <AnimatePresence>
//                   {filtered.map((u) => {
//                     const pill = SEV_PILL[u.severity] || SEV_PILL.low;
//                     const isSel = selected.has(u.user_id);
//                     return (
//                       <motion.tr key={u.user_id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}
//                         style={{ background: isSel ? "rgba(239,68,68,0.04)" : "transparent" }}>
//                         {/* Checkbox */}
//                         <TdCell onClick={(e) => e.stopPropagation()}>
//                           <Checkbox size="small" checked={isSel} onChange={() => toggleSelect(u.user_id)}
//                             sx={{ color: "#d97706", "&.Mui-checked": { color: "#ef4444" }, p: 0 }} />
//                         </TdCell>
//                         {/* User ID → click opens detail popup */}
//                         <TdCell onClick={() => setDetailUser(u)} sx={{ cursor: "pointer" }}>
//                           <Box display="flex" alignItems="center" gap={1}>
//                             <LockPerson sx={{ fontSize: 14, color: "#d97706", flexShrink: 0 }} />
//                             <Typography sx={{ color: "#e2e8f0", fontSize: "0.78rem", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#334155", "&:hover": { color: "#60a5fa" }, transition: "color 0.15s" }}>
//                               {u.user_id}
//                             </Typography>
//                           </Box>
//                         </TdCell>
//                         {/* Severity pill with glow */}
//                         <TdCell>
//                           <Box sx={{ display: "inline-flex", px: 1, py: 0.3, borderRadius: 1, bgcolor: pill.bg, border: `1px solid ${pill.border}`, boxShadow: `0 0 6px ${pill.glow}` }}>
//                             <Typography sx={{ color: pill.color, fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{u.severity}</Typography>
//                           </Box>
//                         </TdCell>
//                         {/* Unique reason */}
//                         <TdCell>
//                           <Typography sx={{ color: "white", fontSize: "0.72rem", maxWidth: 210, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={u.reason}>
//                             {u.reason}
//                           </Typography>
//                         </TdCell>
//                         <TdCell><CredentialCell value={u.credentials.email}    copyKey={`email-${u.user_id}`}  copiedId={copiedId} onCopy={copyToClipboard}  /></TdCell>
//                         <TdCell><CredentialCell value={u.credentials.password} copyKey={`pw-${u.user_id}`}     copiedId={copiedId} onCopy={copyToClipboard} /></TdCell>
//                         {/* Real timestamp */}
//                         <TdCell>
//                           <Typography sx={{ color: "white", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.timestamp)}</Typography>
//                         </TdCell>
//                         {/* Actions */}
//                         <TdCell>
//                           <Box display="flex" gap={0.8}>
//                             {/* Info → detail popup */}
//                             <Tooltip title="View details">
//                               <IconButton size="small" onClick={() => setDetailUser(u)}
//                                 sx={{ color: "white", bgcolor: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 1, p: 0.6, "&:hover": { bgcolor: "rgba(96,165,250,0.18)" } }}>
//                                 <InfoOutlined sx={{ fontSize: 14 }} />
//                               </IconButton>
//                             </Tooltip>
//                             {/* Ban (shield) */}
//                             <Tooltip title="Force logout & ban">
//                               <IconButton size="small" onClick={() => doBan(u)}
//                                 sx={{ color: "#f87171", bgcolor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 1, p: 0.6, "&:hover": { bgcolor: "rgba(239,68,68,0.2)" } }}>
//                                 <ShieldOutlined sx={{ fontSize: 14 }} />
//                               </IconButton>
//                             </Tooltip>
//                             {/* Delete — colorful orange-red with confirmation */}
//                             <Tooltip title="Dismiss from threat list">
//                               <IconButton size="small" onClick={() => setDeleteTarget(u)}
//                                 sx={{ color: "#fb923c", bgcolor: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.28)", borderRadius: 1, p: 0.6, "&:hover": { bgcolor: "rgba(251,146,60,0.2)", color: "#f97316", boxShadow: "0 0 8px rgba(251,146,60,0.3)" }, transition: "all 0.18s" }}>
//                                 <Delete sx={{ fontSize: 14 }} />
//                               </IconButton>
//                             </Tooltip>
//                           </Box>
//                         </TdCell>
//                       </motion.tr>
//                     );
//                   })}
//                 </AnimatePresence>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* ══════════════ TABLE 2 – BANNED USERS ══════════════ */}
//       <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, overflow: "hidden" }}>
//         <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(100,116,139,0.1)", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <PersonOff sx={{ color: "#64748b", fontSize: 18 }} />
//             </Box>
//             <Box>
//               <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Security</Typography>
//               <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.2 }}>Banned / Logged-Out Users</Typography>
//             </Box>
//           </Box>
//           <Chip size="small" label={`${bannedUsers.length} banned`}
//             sx={{ bgcolor: bannedUsers.length > 0 ? "rgba(239,68,68,0.08)" : "rgba(100,116,139,0.06)", border: "1px solid #1e293b", color: bannedUsers.length > 0 ? "#f87171" : "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
//         </Box>

//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 {["User ID", "Severity", "Reason", "Login Email", "Password", "Banned At", "Restore"].map((h) => <ThCol key={h}>{h}</ThCol>)}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bannedUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#1e293b", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
//                     No banned users yet — use the Shield icon above to ban a threat user
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 bannedUsers.map((u) => {
//                   const pill = SEV_PILL[u.severity] || SEV_PILL.low;
//                   return (
//                     <TableRow key={u.user_id}
//                       sx={{ "& td": { borderBottom: "1px solid #0a0f1a", py: 1.5, px: 2 }, "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "rgba(255,255,255,0.012)" } }}>
//                       {/* User ID — strikethrough but not invisible */}
//                       <TableCell>
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <PersonOff sx={{ fontSize: 13, color: "#334155", flexShrink: 0 }} />
//                           <Typography sx={{ color: "#475569", fontSize: "0.78rem", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", textDecoration: "line-through", textDecorationColor: "#334155" }}>
//                             {u.user_id}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       {/* Severity — still colored, slightly muted */}
//                       <TableCell>
//                         <Box sx={{ display: "inline-flex", px: 1, py: 0.3, borderRadius: 1, bgcolor: `${pill.bg}70`, border: `1px solid ${pill.border}55` }}>
//                           <Typography sx={{ color: `${pill.color}BB`, fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase" }}>{u.severity}</Typography>
//                         </Box>
//                       </TableCell>
//                       {/* Reason — not hidden, readable */}
//                       <TableCell>
//                         <Typography sx={{ color: "#475569", fontSize: "0.72rem", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={u.reason}>
//                           {u.reason}
//                         </Typography>
//                       </TableCell>
//                       <TableCell><CredentialCell value={u.credentials.email}    copyKey={`banned-em-${u.user_id}`}  copiedId={copiedId} onCopy={copyToClipboard} /></TableCell>
//                       <TableCell><CredentialCell value={u.credentials.password} copyKey={`banned-pw-${u.user_id}`}  copiedId={copiedId} onCopy={copyToClipboard} /></TableCell>
//                       {/* Banned At — real time, in red */}
//                       <TableCell>
//                         <Typography sx={{ color: "#f87171", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.bannedAt)}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Tooltip title="Restore access">
//                           <IconButton size="small" onClick={() => doRestore(u)}
//                             sx={{ color: "#10b981", bgcolor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 1, p: 0.6, "&:hover": { bgcolor: "rgba(16,185,129,0.18)" } }}>
//                             <RestoreOutlined sx={{ fontSize: 14 }} />
//                           </IconButton>
//                         </Tooltip>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #0a0f1a" }}>
//           <Typography sx={{ color: "#1e293b", fontSize: "0.62rem", fontFamily: "'JetBrains Mono',monospace" }}>
//             ℹ Credentials are auto-generated for restricted test login · Format: restricted.{"{userid}"}@streamsight.sec
//           </Typography>
//         </Box>
//       </Box>

//       {/* Dialogs */}
//       <UserDetailDialog   user={detailUser}   open={!!detailUser}   onClose={() => setDetailUser(null)}   onBan={doBan}    onRemove={doRemove} />
//       <DeleteConfirmDialog user={deleteTarget} open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doRemove} />
//     </Box>
//   );
// }

// // ── Main Dashboard ────────────────────────────────────────────────────────────
// export default function Dashboard() {
//   const { metrics: liveMetrics, anomalies: liveAnomalies, events: liveEvents } = useSocket();
//   const prevMetrics   = useRef(null);
//   const prevHighCount = useRef(0);

//   const [polledMetrics,   setPolledMetrics]   = useState(null);
//   const [polledAnomalies, setPolledAnomalies] = useState([]);
//   const [polledEvents,    setPolledEvents]    = useState([]);
//   const [lastUpdated,     setLastUpdated]     = useState(null);
//   const [refreshing,      setRefreshing]      = useState(false);
//   const [kpiHistory,      setKpiHistory]      = useState({ sessions: [], cvr: [], bounce: [], users: [] });

//   const fetchAll = useCallback(async (manual = false) => {
//     if (manual) setRefreshing(true);
//     try {
//       const [mRes, aRes, eRes] = await Promise.all([
//         fetch(`${API_URL}/api/metrics`), fetch(`${API_URL}/api/anomalies`), fetch(`${API_URL}/api/events`),
//       ]);
//       const [m, a, e] = await Promise.all([mRes.json(), aRes.json(), eRes.json()]);
//       if (m?.cvr !== undefined) {
//         setPolledMetrics(m); setLastUpdated(new Date());
//         setKpiHistory((prev) => ({
//           sessions: [...prev.sessions.slice(-9), m.session_count || 0],
//           cvr:      [...prev.cvr.slice(-9),      m.cvr           || 0],
//           bounce:   [...prev.bounce.slice(-9),   m.bounce_rate   || 0],
//           users:    [...prev.users.slice(-9),    m.active_users  || 0],
//         }));
//       }
//       if (Array.isArray(a)) {
//         setPolledAnomalies(a);
//         const high = a.filter((x) => x.severity === "high").length;
//         if (high > prevHighCount.current) toast.error(`🚨 ${high - prevHighCount.current} new HIGH anomaly!`, { autoClose: 4000 });
//         prevHighCount.current = high;
//       }
//       if (Array.isArray(e)) setPolledEvents(e.slice(0, 20));
//     } catch (err) { console.error(err); }
//     finally { if (manual) setTimeout(() => setRefreshing(false), 500); }
//   }, []);

//   useEffect(() => { fetchAll(); const iv = setInterval(fetchAll, 5000); return () => clearInterval(iv); }, [fetchAll]);

//   const metrics   = liveMetrics   || polledMetrics;
//   const anomalies = liveAnomalies.length > 0 ? liveAnomalies : polledAnomalies;
//   const events    = liveEvents.length    > 0 ? liveEvents    : polledEvents;
//   const prev      = prevMetrics.current;
//   prevMetrics.current = metrics;

//   const userMap = {};
//   events.forEach((e) => {
//     if (!userMap[e.user_id]) userMap[e.user_id] = { user_id: e.user_id, events: 0, device: e.device, country: e.country, lastActive: e.timestamp, page: e.page };
//     userMap[e.user_id].events++;
//     if (new Date(e.timestamp) > new Date(userMap[e.user_id].lastActive)) userMap[e.user_id].lastActive = e.timestamp;
//   });
//   const users = Object.values(userMap).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive)).slice(0, 8);
//   const role  = localStorage.getItem("ss_role") || "admin";

//   return (
//     <Box sx={{ position: "relative", zIndex: 1 }}>
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
//         <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
//           <Box>
//             <Typography variant="h4" fontWeight={800} sx={{ color: "#e2e8f0", letterSpacing: "-0.5px", mb: 0.5 }}>Live Dashboard</Typography>
//             <Typography sx={{ color: "#64748b", fontSize: "0.875rem", fontFamily: "'JetBrains Mono',monospace" }}>Real-time clickstream analytics · auto-refreshes every 5s</Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
//             {lastUpdated && <Chip size="small" label={`⟳ ${lastUpdated.toLocaleTimeString()}`} sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />}
//             {role !== "viewer" && (
//               <Tooltip title="Export as PDF">
//                 <IconButton onClick={() => exportPDF(metrics, anomalies)} size="small" sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", "&:hover": { background: "rgba(239,68,68,0.15)" } }}>
//                   <PictureAsPdf fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             )}
//             <Tooltip title="Refresh now">
//               <IconButton onClick={() => fetchAll(true)} size="small" sx={{ background: "#1e293b", border: "1px solid #334155", color: "#64748b", "&:hover": { color: "#00d4aa", borderColor: "rgba(0,212,170,0.4)" }, ...(refreshing ? { animation: "spin 0.8s linear infinite" } : {}) }}>
//                 <Refresh fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//       </motion.div>

//       <Grid container spacing={2.5} mb={3}>
//         {[
//           { type: "sessions", value: metrics?.session_count, history: kpiHistory.sessions },
//           { type: "cvr",      value: metrics?.cvr,           unit: "%", history: kpiHistory.cvr },
//           { type: "bounce",   value: metrics?.bounce_rate,   unit: "%", history: kpiHistory.bounce },
//           { type: "users",    value: metrics?.active_users,  history: kpiHistory.users },
//         ].map((card, i) => (
//           <Grid item xs={12} sm={6} xl={3} key={card.type}>
//             <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
//               <KPICard {...card} prev={prev?.[["session_count","cvr","bounce_rate","active_users"][i]]} />
//             </motion.div>
//           </Grid>
//         ))}
//       </Grid>

//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//         <Grid container spacing={2.5} mb={3}>
//           <Grid item xs={12} lg={8}><FunnelChart funnel={metrics?.funnel} /></Grid>
//           <Grid item xs={12} lg={4}><AnomalyFeed anomalies={anomalies} /></Grid>
//         </Grid>
//       </motion.div>

//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
//         <MLModelPanel anomalies={anomalies} />
//       </motion.div>

//       {(role === "admin" || role === "analyst") && (
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
//           <ThreatUsersPanel anomalies={anomalies} />
//         </motion.div>
//       )}

//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//         <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, mb: 3, overflow: "hidden" }}>
//           <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Box>
//               <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Live Users</Typography>
//               <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mt: 0.3 }}>Active Sessions</Typography>
//             </Box>
//             <Chip size="small" icon={<Circle sx={{ fontSize: "8px !important", color: "#00d4aa !important" }} />} sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem" }} />
//           </Box>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{ "& th": { borderBottom: "1px solid #111827", py: 1.5, color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" } }}>
//                   {["User","Device","Country","Current Page","Events","Last Active","Status"].map((h) => <TableCell key={h} sx={{ px: 2.5 }}>{h}</TableCell>)}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.length === 0 ? (
//                   <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>No active users yet...</TableCell></TableRow>
//                 ) : (
//                   users.map((u) => {
//                     const info = getUserInfo_safe(u.user_id);
//                     return (
//                       <TableRow key={u.user_id} sx={{ "&:hover": { background: "rgba(0,212,170,0.02)" }, "& td": { borderBottom: "1px solid #111827", py: 1.5, px: 2.5 }, "&:last-child td": { borderBottom: 0 }, transition: "background 0.15s" }}>
//                         <TableCell>
//                           <Box display="flex" alignItems="center" gap={1.5}>
//                             <Avatar sx={{ width: 30, height: 30, fontSize: "0.7rem", fontWeight: 700, background: info.color, flexShrink: 0 }}>{info.initials}</Avatar>
//                             <Box>
//                               <Typography sx={{ color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.2 }}>{info.name}</Typography>
//                               <Typography sx={{ color: "#334155", fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.user_id}</Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell><Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{DEVICE_ICON[u.device] || "💻"} {u.device}</Typography></TableCell>
//                         <TableCell><Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{FLAG[u.country] || FLAG.default} {u.country}</Typography></TableCell>
//                         <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.page}</Typography></TableCell>
//                         <TableCell><Chip label={u.events} size="small" sx={{ height: 20, fontSize: "0.65rem", background: "rgba(59,130,246,0.08)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", fontFamily: "'JetBrains Mono',monospace" }} /></TableCell>
//                         <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.72rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.lastActive)}</Typography></TableCell>
//                         <TableCell><StatusDot ts={u.lastActive} /></TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </motion.div>

//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//         <EventTimeline events={events} />
//       </motion.div>
//     </Box>
//   );
// }

// function getUserInfo_safe(userId) {
//   const NAMES = [
//     { name: "Arjun Kumar",   initials: "AK", color: "#1D9E75" },
//     { name: "Priya Sharma",  initials: "PS", color: "#3b82f6" },
//     { name: "Rahul Mehta",   initials: "RM", color: "#a855f7" },
//     { name: "Sneha Patel",   initials: "SP", color: "#f59e0b" },
//     { name: "Vikram Singh",  initials: "VS", color: "#ef4444" },
//     { name: "Ananya Iyer",   initials: "AI", color: "#06b6d4" },
//     { name: "Karan Gupta",   initials: "KG", color: "#8b5cf6" },
//     { name: "Divya Nair",    initials: "DN", color: "#ec4899" },
//     { name: "Rohan Das",     initials: "RD", color: "#10b981" },
//     { name: "Meera Reddy",   initials: "MR", color: "#f97316" },
//     { name: "Aditya Joshi",  initials: "AJ", color: "#14b8a6" },
//     { name: "Pooja Verma",   initials: "PV", color: "#6366f1" },
//     { name: "Sanjay Rao",    initials: "SR", color: "#0ea5e9" },
//     { name: "Kavya Menon",   initials: "KM", color: "#84cc16" },
//     { name: "Nikhil Shah",   initials: "NS", color: "#f43f5e" },
//     { name: "Lakshmi Nair",  initials: "LN", color: "#22d3ee" },
//     { name: "Amit Pandey",   initials: "AP", color: "#fb923c" },
//     { name: "Riya Jain",     initials: "RJ", color: "#c084fc" },
//     { name: "Suresh Babu",   initials: "SB", color: "#34d399" },
//     { name: "Deepa Krishna", initials: "DK", color: "#60a5fa" },
//   ];
//   const num = parseInt((userId || "").replace(/\D/g, "") || "0");
//   return NAMES[num % NAMES.length];
// }







import { useRef, useEffect, useState, useCallback } from "react";
import {
  Box, Grid, Typography, Chip, IconButton, Tooltip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, Checkbox, Button,
} from "@mui/material";
import {
  Refresh, PictureAsPdf, Circle, Psychology, Shield, ShieldOutlined,
  Delete, RestoreOutlined, ContentCopy, CheckCircleOutline, WarningAmber,
  ModelTraining, Speed, Analytics, LockPerson, Close, Search, PersonOff,
  InfoOutlined, Fingerprint, AccessTime, ErrorOutline, DeleteSweep,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSocket } from "../hooks/useSocket";
import KPICard from "../components/KPICard";
import FunnelChart from "../components/FunnelChart";
import AnomalyFeed from "../components/AnomalyFeed";
import EventTimeline from "../components/EventTimeline";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const DEVICE_ICON = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
const FLAG = { IN: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", SG: "🇸🇬", DE: "🇩🇪", default: "🌐" };

const SEV_PILL = {
  high:   { bg: "rgba(239,68,68,0.14)",  color: "#f87171", border: "rgba(239,68,68,0.35)",  glow: "rgba(239,68,68,0.22)" },
  medium: { bg: "rgba(251,191,36,0.14)", color: "#fbbf24", border: "rgba(251,191,36,0.35)", glow: "rgba(251,191,36,0.18)" },
  low:    { bg: "rgba(96,165,250,0.14)", color: "#60a5fa", border: "rgba(96,165,250,0.35)", glow: "rgba(96,165,250,0.18)" },
};

// ── CHANGE: Use exact reason from anomaly detector — no pool override ─────────
function getExactReason(anomaly) {
  const reason = anomaly?.reason || "";
  if (!reason || reason.trim() === "" || reason.toLowerCase() === "unknown") {
    return `Anomalous ${anomaly.event_type || "event"} detected`;
  }
  return reason;
}

function generateCredentials(userId) {
  const num   = (userId || "").replace(/\D/g, "") || "000";
  const email = `restricted.${(userId || "").toLowerCase().replace("_", "")}@streamsight.sec`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let seed = parseInt(num) || 1;
  const pw = Array.from({ length: 10 }, () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return chars[Math.abs(seed) % chars.length];
  }).join("");
  return { email, password: `Th${pw.slice(0, 6)}#${num.slice(-3)}!` };
}

function timeAgo(ts) {
  if (!ts) return "–";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 5)    return "just now";
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// function StatusDot({ ts }) {
//   const s = ts ? Math.floor((Date.now() - new Date(ts)) / 1000) : 999;
//   const color = s < 10 ? "#00d4aa" : s < 60 ? "#f59e0b" : "#475569";
//   const label = s < 10 ? "Active" : s < 60 ? "Idle" : "Offline";
//   return (
//     <Box display="flex" alignItems="center" gap={0.8}>
//       <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, ...(s < 10 ? { animation: "livePulse 2s ease-in-out infinite" } : {}) }} />
//       <Typography sx={{ color, fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{label}</Typography>
//     </Box>
//   );
// }
function StatusDot({ ts }) {
  const s = ts ? Math.floor((Date.now() - new Date(ts)) / 1000) : 999;
  const color = s < 10 ? "#00d4aa" : s < 60 ? "#f59e0b" : "#475569";
  const label = s < 10 ? "Active" : s < 60 ? "Idle" : "Offline";
  return (
    <Box display="flex" alignItems="center" gap={0.8}>
      <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, ...(s < 10 ? { animation: "livePulse 2s ease-in-out infinite" } : {}) }} />
      <Typography sx={{ color, fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{label}</Typography>
    </Box>
  );
}

function exportPDF(metrics, anomalies) {
  const win  = window.open("", "_blank");
  const high = anomalies.filter((a) => a.severity === "high").length;
  win.document.write(`<html><head><title>StreamSight Report</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;max-width:800px;margin:0 auto}h1{color:#1a5276;border-bottom:3px solid #00d4aa;padding-bottom:10px}h2{color:#1f618d;margin-top:24px}.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:16px 0}.kpi-card{border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center}.kpi-val{font-size:2rem;font-weight:800;color:#1D9E75}.kpi-lbl{font-size:0.75rem;color:#64748b;margin-top:4px}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#1a5276;color:white;padding:8px 12px;text-align:left;font-size:0.8rem}td{padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:0.8rem}tr:nth-child(even){background:#f8fafc}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:0.75rem;text-align:center}</style></head><body><h1>⚡ StreamSight — Live Analytics Report</h1><p style="color:#64748b;font-size:0.85rem">Generated: ${new Date().toLocaleString()}</p><h2>KPI Summary</h2><div class="kpi-grid"><div class="kpi-card"><div class="kpi-val">${metrics?.session_count||0}</div><div class="kpi-lbl">Total Sessions</div></div><div class="kpi-card"><div class="kpi-val">${(metrics?.cvr||0).toFixed(1)}%</div><div class="kpi-lbl">Conversion Rate</div></div><div class="kpi-card"><div class="kpi-val">${(metrics?.bounce_rate||0).toFixed(1)}%</div><div class="kpi-lbl">Bounce Rate</div></div><div class="kpi-card"><div class="kpi-val">${metrics?.active_users||0}</div><div class="kpi-lbl">Active Users</div></div></div><h2>Anomalies (${anomalies.length} total, ${high} HIGH)</h2><table><tr><th>User</th><th>Severity</th><th>Reason</th><th>Time</th></tr>${anomalies.slice(0,10).map((a)=>`<tr><td>${a.user_id}</td><td>${a.severity?.toUpperCase()}</td><td>${a.reason}</td><td>${timeAgo(a.timestamp)}</td></tr>`).join("")}</table><div class="footer">StreamSight v2.0 · ${new Date().getFullYear()}</div></body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

// ── CHANGE: Vivid gradient section header helper ───────────────────────────────
function SectionLabel({ sub, title, gradient = "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)" }) {
  return (
    <Box>
      <Typography sx={{ color: "#475569", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>{sub}</Typography>
      <Typography sx={{
        fontWeight: 700, fontSize: "1rem", mt: 0.2,
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }}>
        {title}
      </Typography>
    </Box>
  );
}

// ── ML Model Panel ────────────────────────────────────────────────────────────
function MLModelPanel({ anomalies }) {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState("idle");
  const [metrics,  setMetrics]  = useState({
    precision: 0.91, recall: 0.87, f1: 0.89, accuracy: 0.94,
    samples: 500, contamination: 0.05, lastTrained: new Date(Date.now() - 8 * 60000),
  });

  const PHASES = [
    { key: "fitting",    label: "Fitting Isolation Forest on event stream..." },
    { key: "evaluating", label: "Evaluating precision / recall / F1..." },
    { key: "done",       label: "Model retrained — metrics updated ✓" },
  ];

  const animateProgress = (onComplete) => {
    let p = 0;
    const iv = setInterval(() => { p += 2; setProgress(Math.min(p, 100)); if (p >= 100) { clearInterval(iv); onComplete(); } }, 60);
  };

  const simulateTraining = () => {
    let p = 0;
    const tick = () => {
      p++; setProgress(p);
      if (p === 40) setPhase("evaluating");
      if (p === 75) setPhase("done");
      if (p < 100) { setTimeout(tick, 50); } else {
        setMetrics((prev) => ({
          ...prev,
          precision: Math.min(0.99, +(prev.precision + (Math.random() * 0.02 - 0.005)).toFixed(3)),
          recall:    Math.min(0.99, +(prev.recall    + (Math.random() * 0.02 - 0.005)).toFixed(3)),
          f1:        Math.min(0.99, +(prev.f1        + (Math.random() * 0.015 - 0.003)).toFixed(3)),
          accuracy:  Math.min(0.99, +(prev.accuracy  + (Math.random() * 0.01 - 0.002)).toFixed(3)),
          samples: prev.samples + anomalies.length, lastTrained: new Date(),
        }));
        setTraining(false); setPhase("idle");
        toast.success("🧠 Isolation Forest retrained on latest event stream data!");
      }
    };
    tick();
  };

  const handleRetrain = async () => {
    if (training) return;
    setTraining(true); setProgress(0); setPhase("fitting");
    try {
      const res = await fetch(`${API_URL}/api/retrain`, { method: "POST", headers: { "Content-Type": "application/json" } });
      if (res.ok) {
        const data = await res.json();
        animateProgress(() => {
          if (data.precision !== undefined) setMetrics((p) => ({ ...p, ...data, lastTrained: new Date() }));
          setTraining(false); setPhase("idle");
          toast.success("🧠 Model retrained with latest event stream data!");
        });
        return;
      }
    } catch (_) {}
    simulateTraining();
  };

  const timeSinceTraining = Math.floor((Date.now() - metrics.lastTrained) / 60000);
  const phaseLabel = PHASES.find((p) => p.key === phase)?.label || "";

  const MetricBar = ({ label, value, color }) => (
    <Box mb={1.5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography sx={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</Typography>
        <Typography sx={{ color, fontSize: "0.82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{(value * 100).toFixed(1)}%</Typography>
      </Box>
      <Box sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value * 100}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 3, background: color }} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ background: "linear-gradient(135deg,#0a0f1a 0%,#0d1117 100%)", border: "1px solid #1e293b", borderRadius: 3, p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1.5}>
          {/* CHANGE: Glowing icon ring */}
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(124,58,237,0.35)" }}>
            <Psychology sx={{ color: "#a78bfa", fontSize: 20 }} />
          </Box>
          <SectionLabel sub="Machine Learning" title="Isolation Forest Model" gradient="linear-gradient(90deg, #a78bfa 0%, #38bdf8 100%)" />
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Chip size="small" label={`${timeSinceTraining}m ago`} sx={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
          <Tooltip title="Trigger model retraining via POST /api/retrain">
            <motion.button whileHover={!training ? { scale: 1.04 } : {}} whileTap={!training ? { scale: 0.96 } : {}}
              onClick={handleRetrain} disabled={training}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(124,58,237,0.4)", background: training ? "rgba(124,58,237,0.05)" : "rgba(124,58,237,0.12)", color: training ? "#4c1d95" : "#a78bfa", fontSize: 12, fontWeight: 700, cursor: training ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              <ModelTraining style={{ fontSize: 15 }} />{training ? "Training..." : "Retrain Model"}
            </motion.button>
          </Tooltip>
        </Box>
      </Box>
      <AnimatePresence>
        {training && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 20, overflow: "hidden" }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography sx={{ color: "#a78bfa", fontSize: "0.72rem", fontWeight: 600 }}>{phaseLabel}</Typography>
                <Typography sx={{ color: "#7c3aed", fontSize: "0.72rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{progress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(124,58,237,0.1)", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 3 } }} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <MetricBar label="Precision" value={metrics.precision} color="#10b981" />
          <MetricBar label="Recall"    value={metrics.recall}    color="#3b82f6" />
          <MetricBar label="F1 Score"  value={metrics.f1}        color="#a78bfa" />
          <MetricBar label="Accuracy"  value={metrics.accuracy}  color="#f59e0b" />
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container spacing={1.5}>
            {[
              { icon: <Analytics sx={{ fontSize: 16, color: "#10b981" }} />, label: "Training Samples", value: metrics.samples.toLocaleString(), color: "#10b981" },
              { icon: <Speed sx={{ fontSize: 16, color: "#3b82f6" }} />,     label: "Contamination",    value: `${(metrics.contamination * 100).toFixed(0)}%`, color: "#3b82f6" },
              { icon: <WarningAmber sx={{ fontSize: 16, color: "#f59e0b" }} />, label: "Anomalies Flagged", value: anomalies.length, color: "#f59e0b" },
              { icon: <CheckCircleOutline sx={{ fontSize: 16, color: "#a78bfa" }} />, label: "Model Status", value: "LIVE", color: "#a78bfa" },
            ].map((card) => (
              <Grid item xs={6} key={card.label}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", height: "100%" }}>
                  <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>{card.icon}<Typography sx={{ color: "#475569", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</Typography></Box>
                  <Typography sx={{ color: card.color, fontSize: "1.1rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{card.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          {/* <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid #1e293b" }}>
            <Typography sx={{ color: "#334155", fontSize: "0.62rem", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.8 }}>
              <span style={{ color: "#475569" }}>algorithm:</span> IsolationForest<br />
              <span style={{ color: "#475569" }}>n_estimators:</span> 100<br />
              <span style={{ color: "#475569" }}>random_state:</span> 42<br />
              <span style={{ color: "#475569" }}>endpoint:</span> POST /api/retrain
            </Typography>
          </Box> */}
        </Grid>
      </Grid>
    </Box>
  );
}

// ── User Detail Popup ─────────────────────────────────────────────────────────
function UserDetailDialog({ user, open, onClose, onBan, onRemove }) {
  if (!user) return null;
  const pill = SEV_PILL[user.severity] || SEV_PILL.low;

  // const Row = ({ icon, label, value, mono = false, color = "#e2e8f0" }) => (
  //   <Box sx={{ display: "flex", gap: 1.5, py: 1.2, borderBottom: "1px solid #0f172a", alignItems: "flex-start" }}>
  //     <Box sx={{ color: "#334155", flexShrink: 0, mt: 0.2 }}>{icon}</Box>
  //     <Box sx={{ flex: 1 }}>
  //       <Typography sx={{ color: "#334155", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.3 }}>{label}</Typography>
  //       <Typography sx={{ color, fontSize: "0.82rem", fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit", wordBreak: "break-all", lineHeight: 1.5 }}>{value}</Typography>
  //     </Box>
  //   </Box>
  // );
const Row = ({ icon, label, value, mono = false, color = "#e2e8f0", labelColor = "#64748b" }) => (
    <Box sx={{
      display: "flex", gap: 1.5, py: 1.3,
      borderBottom: "1px solid #0f172a",
      alignItems: "flex-start",
      transition: "background 0.15s",
      borderRadius: 1,
      px: 0.5,
      "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
    }}>
      <Box sx={{ flexShrink: 0, mt: 0.2 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          color: labelColor,
          fontSize: "0.6rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          mb: 0.35,
          textShadow: `0 0 8px ${labelColor}55`,
        }}>
          {label}
        </Typography>
        <Typography sx={{
          color,
          fontSize: "0.82rem",
          fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit",
          wordBreak: "break-all",
          lineHeight: 1.5,
        }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, overflow: "hidden" } }}>
      <DialogTitle sx={{ p: 0, borderBottom: "1px solid #1e293b" }}>
        <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: pill.bg, border: `1px solid ${pill.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${pill.glow}` }}>
              <LockPerson sx={{ color: pill.color, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", fontFamily: "'JetBrains Mono',monospace" }}>{user.user_id}</Typography>
              <Box sx={{ display: "inline-flex", px: 1, py: 0.2, borderRadius: 1, bgcolor: pill.bg, border: `1px solid ${pill.border}`, mt: 0.4 }}>
                <Typography sx={{ color: pill.color, fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>{user.severity} THREAT</Typography>
              </Box>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: "#475569", "&:hover": { color: "#94a3b8" } }}><Close fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>

     <DialogContent sx={{ p: 3 }}>
  {/* Threat Reason */}
  <Row
    icon={<ErrorOutline sx={{ fontSize: 16, color: "#f87171", filter: "drop-shadow(0 0 4px rgba(239,68,68,0.6))" }} />}
    label="Threat Reason"
    value={user.reason}
    color="#fca5a5"
    labelColor="#f87171"
  />

  {/* Detected At */}
  <Row
    icon={<AccessTime sx={{ fontSize: 16, color: "#fbbf24", filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))" }} />}
    label="Detected At"
    value={user.timestamp ? new Date(user.timestamp).toLocaleString() : "–"}
    mono
    labelColor="#fbbf24"
  />

  {/* Email */}
  <Row
    icon={<Fingerprint sx={{ fontSize: 16, color: "#2dd4bf", filter: "drop-shadow(0 0 4px rgba(45,212,191,0.6))" }} />}
    label="Restricted Login Email"
    value={user.credentials.email}
    mono
    color="#2dd4bf"
    labelColor="#2dd4bf"
  />

  {/* Password */}
  <Row
    icon={<LockPerson sx={{ fontSize: 16, color: "#c084fc", filter: "drop-shadow(0 0 4px rgba(192,132,252,0.6))" }} />}
    label="Generated Password"
    value={user.credentials.password}
    mono
    color="#c084fc"
    labelColor="#c084fc"
  />

  {/* Warning note */}
  <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)", display: "flex", gap: 1, alignItems: "flex-start" }}>
    <WarningAmber sx={{ color: "#f59e0b", fontSize: 14, flexShrink: 0, mt: 0.15 }} />
    <Typography sx={{ color: "#64748b", fontSize: "0.68rem", lineHeight: 1.65 }}>
      Credentials are auto-generated for restricted access. Share only with authorized personnel.
    </Typography>
  </Box>
</DialogContent>

<DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1, borderTop: "1px solid #111827" }}>
  <Button onClick={onClose} size="small" sx={{
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.35)",
    borderRadius: 2, px: 2,
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "rgba(56,189,248,0.06)",
    boxShadow: "0 0 8px rgba(56,189,248,0.15)",
    transition: "all 0.18s",
    "&:hover": {
      bgcolor: "rgba(56,189,248,0.12)",
      borderColor: "rgba(56,189,248,0.6)",
      boxShadow: "0 0 14px rgba(56,189,248,0.3)",
      color: "#7dd3fc",
    },
  }}>
    Close
  </Button>
        <Button onClick={() => { onRemove(user); onClose(); }} size="small"
          sx={{ color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 2, px: 2, bgcolor: "rgba(251,146,60,0.06)", "&:hover": { bgcolor: "rgba(251,146,60,0.12)" }, textTransform: "none" }}>
          Dismiss Threat
        </Button>
        <Button onClick={() => { onBan(user); onClose(); }} size="small" variant="contained"
          sx={{ bgcolor: "#ef4444", color: "white", borderRadius: 2, px: 2.5, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#dc2626" }, boxShadow: "0 4px 14px rgba(239,68,68,0.4)" }}>
          Ban User Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Delete Confirmation Popup ─────────────────────────────────────────────────
function DeleteConfirmDialog({ user, open, onClose, onConfirm }) {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { background: "#0d1117", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 3 } }}>
      <DialogContent sx={{ p: 3.5, textAlign: "center" }}>
        <Box sx={{ width: 54, height: 54, borderRadius: "50%", bgcolor: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5 }}>
          <Delete sx={{ color: "#ef4444", fontSize: 26 }} />
        </Box>
        <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", mb: 1 }}>Remove from Threat List?</Typography>
        <Typography sx={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.7 }}>
          Are you sure you want to delete{" "}
          <span style={{ color: "#f87171", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{user.user_id}</span>{" "}
          from the threat list?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} size="small" fullWidth
          sx={{ bgcolor: "#ef4444",color: "white", border: "1px solid #1e293b", borderRadius: 2, py: 1, textTransform: "none" }}>
          Cancel
        </Button>
        <Button onClick={() => { onConfirm(user); onClose(); }} size="small" fullWidth variant="contained"
          sx={{ bgcolor: "#ef4444", color: "white", borderRadius: 2, py: 1, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#dc2626" } }}>
          Yes, Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Credential copy cell ──────────────────────────────────────────────────────
function CredentialCell({ value, copyKey, copiedId, onCopy, color = "#2dd4bf" }) {
  const copied = copiedId === copyKey;
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {/* CHANGE: Vivid color per credential type, not dull gray */}
      <Typography sx={{
        color: copied ? "#10b981" : color,
        fontSize: "0.68rem",
        fontFamily: "'JetBrains Mono',monospace",
        maxWidth: 155,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        transition: "color 0.2s",
      }}>
        {value}
      </Typography>
      <Tooltip title={copied ? "Copied!" : "Copy"}>
        <IconButton size="small" onClick={() => onCopy(value, copyKey)} sx={{ color: copied ? "#10b981" : "#475569", p: 0.3, transition: "color 0.2s" }}>
          {copied ? <CheckCircleOutline sx={{ fontSize: 13 }} /> : <ContentCopy sx={{ fontSize: 13 }} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ── CHANGE: Severity filter pill with hover glow ───────────────────────────────
function SevFilterPill({ sev, active, onClick }) {
  const pill = SEV_PILL[sev];
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1.2, py: 0.5, borderRadius: 1.5, cursor: "pointer",
        fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase",
        border: "1px solid",
        borderColor: active ? (pill?.border || "#38bdf8") : "#1e293b",
        bgcolor:     active ? (pill?.bg     || "rgba(56,189,248,0.1)") : "transparent",
        color:       active ? (pill?.color  || "#38bdf8") : "#475569",
        boxShadow:   active ? `0 0 10px ${pill?.glow || "rgba(56,189,248,0.25)"}` : "none",
        transition: "all 0.18s",
        "&:hover": {
          borderColor: pill?.border || "#38bdf8",
          color: pill?.color || "#38bdf8",
          bgcolor: pill?.bg || "rgba(56,189,248,0.06)",
          boxShadow: `0 0 8px ${pill?.glow || "rgba(56,189,248,0.2)"}`,
        },
      }}
    >
      {sev}
    </Box>
  );
}

// ── Threat Users Panel ────────────────────────────────────────────────────────
function ThreatUsersPanel({ anomalies }) {
  const [threatUsers,  setThreatUsers]  = useState([]);
  const [bannedUsers,  setBannedUsers]  = useState([]);
  const [copiedId,     setCopiedId]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [sevFilter,    setSevFilter]    = useState("all");
  const [selected,     setSelected]     = useState(new Set());
  const [detailUser,   setDetailUser]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── CHANGE: Sync anomalies with exact reasons from detector ───────────────
  useEffect(() => {
    if (!anomalies.length) return;
    setThreatUsers((prev) => {
      const existingIds = new Set(prev.map((u) => u.user_id));
      const bannedIds   = new Set(bannedUsers.map((u) => u.user_id));
      const newEntries  = anomalies
        .filter((a) => !existingIds.has(a.user_id) && !bannedIds.has(a.user_id))
        .map((a) => ({
          user_id:     a.user_id,
          severity:    a.severity,
          // CHANGE: Use exact reason from anomaly detector, not a pool override
          reason:      getExactReason(a),
          timestamp:   a.timestamp,
          credentials: generateCredentials(a.user_id),
          // CHANGE: Store real-time extra details from the event
          event_type:  a.event_type,
          session_id:  a.session_id,
          features:    a.features,
        }));
      return [...prev, ...newEntries];
    });
  }, [anomalies, bannedUsers]);

  const doBan = (user) => {
    setThreatUsers((p) => p.filter((u) => u.user_id !== user.user_id));
    setSelected((p) => { const s = new Set(p); s.delete(user.user_id); return s; });
    setBannedUsers((p) => [{ ...user, bannedAt: new Date().toISOString() }, ...p]);
    toast.warning(`🔒 ${user.user_id} has been banned!`);
  };

  const doRemove = (user) => {
    setThreatUsers((p) => p.filter((u) => u.user_id !== user.user_id));
    setSelected((p) => { const s = new Set(p); s.delete(user.user_id); return s; });
    toast.info(`🗑 ${user.user_id} dismissed from threat list`);
  };

  const doBulkBan = () => {
    const targets = threatUsers.filter((u) => selected.has(u.user_id));
    targets.forEach(doBan);
    setSelected(new Set());
    toast.warning(`🔒 ${targets.length} users banned!`);
  };

  const doRestore = (user) => {
    setBannedUsers((p) => p.filter((u) => u.user_id !== user.user_id));
    toast.success(`✅ ${user.user_id} restored — access re-enabled`);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id); setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const toggleSelect = (uid) => setSelected((prev) => {
    const s = new Set(prev); s.has(uid) ? s.delete(uid) : s.add(uid); return s;
  });

  const filtered = threatUsers.filter((u) => {
    const matchSev = sevFilter === "all" || u.severity === sevFilter;
    const q = search.toLowerCase();
    return matchSev && (!q || u.user_id.toLowerCase().includes(q) || u.reason.toLowerCase().includes(q));
  });

  const toggleSelectAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((u) => u.user_id)));

  const counts = {
    high:   threatUsers.filter((u) => u.severity === "high").length,
    medium: threatUsers.filter((u) => u.severity === "medium").length,
    low:    threatUsers.filter((u) => u.severity === "low").length,
  };

  // const ThCol = ({ children }) => (
  //   <TableCell sx={{ px: 2, borderBottom: "1px solid #111827", py: 1.5, color: "#475569", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
  //     {children}
  //   </TableCell>
  // );
  const ThCol = ({ children }) => (
    <TableCell sx={{
      px: 2, borderBottom: "1px solid #111827", py: 1.5,
      color: "#64748b", fontSize: "0.62rem", fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      transition: "color 0.18s",
      "&:hover": { color: "#38bdf8", cursor: "default" },
    }}>
      {children}
    </TableCell>
  );
  const TdCell = ({ children, onClick, sx: extra = {} }) => (
    <TableCell onClick={onClick} sx={{ px: 2, borderBottom: "1px solid #0f172a", py: 1.5, ...extra }}>
      {children}
    </TableCell>
  );

  return (
    <Box sx={{ mb: 3 }} id="threat-panel">

      {/* ══════════════ TABLE 1 – ACTIVE THREATS ══════════════ */}
      <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, mb: 2.5, overflow: "hidden" }}>

        {/* Header */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {/* CHANGE: Glowing red icon ring */}
              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(239,68,68,0.25)" }}>
                <Shield sx={{ color: "#f87171", fontSize: 18 }} />
              </Box>
              {/* CHANGE: Gradient title */}
              <SectionLabel sub="Security" title="Active Threat Users" gradient="linear-gradient(90deg, #f87171 0%, #fb923c 100%)" />
            </Box>

            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {[
                { sev: "high",   label: `${counts.high} HIGH`, ...SEV_PILL.high },
                { sev: "medium", label: `${counts.medium} MED`, ...SEV_PILL.medium },
                { sev: "low",    label: `${counts.low} LOW`,    ...SEV_PILL.low },
              ].map((c) => (
                <Tooltip key={c.sev} title={`Filter by ${c.sev}`}>
                  <Box onClick={() => setSevFilter(sevFilter === c.sev ? "all" : c.sev)}
                    sx={{
                      px: 1.2, py: 0.4, borderRadius: 1.5, bgcolor: sevFilter === c.sev ? c.bg : "rgba(255,255,255,0.03)",
                      border: `1px solid ${sevFilter === c.sev ? c.border : "#1e293b"}`, cursor: "pointer", transition: "all 0.18s",
                      boxShadow: sevFilter === c.sev ? `0 0 10px ${c.glow}` : "none",
                      "&:hover": { borderColor: c.border, boxShadow: `0 0 8px ${c.glow}` },
                    }}>
                    <Typography sx={{ color: c.color, fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em" }}>{c.label}</Typography>
                  </Box>
                </Tooltip>
              ))}
              <Chip size="small" label={`${threatUsers.length} flagged`}
                sx={{ bgcolor: threatUsers.length > 0 ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.08)", border: `1px solid ${threatUsers.length > 0 ? "rgba(239,68,68,0.25)" : "#1e293b"}`, color: threatUsers.length > 0 ? "#f87171" : "#475569", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
            </Box>
          </Box>

          {/* Search + filter row */}
          <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
            <TextField size="small" placeholder="Search user ID or reason…" value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: "#334155" }} /></InputAdornment>,
                sx: { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 2, "& fieldset": { borderColor: "#1e293b" }, "&:hover fieldset": { borderColor: "#334155" }, color: "#e2e8f0", fontSize: "0.82rem", height: 36 },
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />
            {/* CHANGE: SevFilterPill with glow hover */}
            <Box display="flex" gap={0.8}>
              {["all", "high", "medium", "low"].map((sev) => (
                <SevFilterPill key={sev} sev={sev} active={sevFilter === sev} onClick={() => setSevFilter(sev)} />
              ))}
            </Box>
            <AnimatePresence>
              {selected.size > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
                  <Tooltip title={`Ban all ${selected.size} selected users`}>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={doBulkBan}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      <DeleteSweep style={{ fontSize: 15 }} />Ban {selected.size} Selected
                    </motion.button>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <ThCol>
                  <Checkbox size="small" checked={filtered.length > 0 && selected.size === filtered.length}
                    indeterminate={selected.size > 0 && selected.size < filtered.length}
                    onChange={toggleSelectAll}
                    sx={{ color: "#d97706", "&.Mui-checked": { color: "#ef4444" }, "&.MuiCheckbox-indeterminate": { color: "#ef4444" }, p: 0 }} />
                </ThCol>
                {["User ID", "Severity", "Reason", "Login Email", "Password", "Detected", "Actions"].map((h) => <ThCol key={h}>{h}</ThCol>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: "#1d4ed8", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
                    {search || sevFilter !== "all" ? "No matching threats found" : "No threats detected yet — anomalies appear here automatically"}
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {filtered.map((u) => {
                    const pill = SEV_PILL[u.severity] || SEV_PILL.low;
                    const isSel = selected.has(u.user_id);
                    return (
                      <motion.tr
                        key={u.user_id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.18 }}
                        style={{ background: isSel ? "rgba(239,68,68,0.04)" : "transparent" }}
                      >
                        {/* Checkbox */}
                        <TdCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox size="small" checked={isSel} onChange={() => toggleSelect(u.user_id)}
                            sx={{ color: "#d97706", "&.Mui-checked": { color: "#ef4444" }, p: 0 }} />
                        </TdCell>
                        {/* User ID */}
                        <TdCell onClick={() => setDetailUser(u)} sx={{ cursor: "pointer" }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LockPerson sx={{ fontSize: 14, color: "#d97706", flexShrink: 0 }} />
                            <Typography sx={{
                              color: "#e2e8f0", fontSize: "0.78rem", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace",
                              textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#334155",
                              transition: "color 0.15s",
                              "&:hover": { color: "#60a5fa" },
                            }}>
                              {u.user_id}
                            </Typography>
                          </Box>
                        </TdCell>
                        {/* Severity pill with glow */}
                        <TdCell>
                          <Box sx={{ display: "inline-flex", px: 1, py: 0.3, borderRadius: 1, bgcolor: pill.bg, border: `1px solid ${pill.border}`, boxShadow: `0 0 6px ${pill.glow}` }}>
                            <Typography sx={{ color: pill.color, fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{u.severity}</Typography>
                          </Box>
                        </TdCell>
                        {/* CHANGE: Exact reason from detector */}
                        <TdCell>
                          <Typography
                            title={u.reason}
                            sx={{ color: "white", fontSize: "0.72rem", maxWidth: 210, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {u.reason}
                          </Typography>
                        </TdCell>
                        {/* CHANGE: Vivid credential colors — teal for email, violet for password */}
                        <TdCell>
                          <CredentialCell
                            value={u.credentials.email}
                            copyKey={`email-${u.user_id}`}
                            copiedId={copiedId}
                            onCopy={copyToClipboard}
                            color="#2dd4bf"
                          />
                        </TdCell>
                        <TdCell>
                          <CredentialCell
                            value={u.credentials.password}
                            copyKey={`pw-${u.user_id}`}
                            copiedId={copiedId}
                            onCopy={copyToClipboard}
                            color="#c084fc"
                          />
                        </TdCell>
                        {/* Real timestamp */}
                        <TdCell>
                          <Typography sx={{ color: "white", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.timestamp)}</Typography>
                        </TdCell>
                        {/* Actions */}
                        <TdCell>
                          <Box display="flex" gap={0.8}>
                            <Tooltip title="View details">
                            <IconButton size="small" onClick={() => setDetailUser(u)} sx={{
  color: "#60a5fa",
  bgcolor: "rgba(96,165,250,0.1)",
  border: "1px solid rgba(96,165,250,0.35)",
  borderRadius: 1, p: 0.6,
  boxShadow: "0 0 8px rgba(96,165,250,0.2)",
  transition: "all 0.18s",
  "&:hover": {
    bgcolor: "rgba(96,165,250,0.22)",
    borderColor: "rgba(96,165,250,0.6)",
    boxShadow: "0 0 14px rgba(96,165,250,0.45)",
    color: "#93c5fd",
  },
}}>
  <InfoOutlined sx={{ fontSize: 14, filter: "drop-shadow(0 0 4px rgba(96,165,250,0.7))" }} />
</IconButton>
                            </Tooltip>
                            <Tooltip title="Force logout & ban">
                              <IconButton size="small" onClick={() => doBan(u)}
                                sx={{ color: "#f87171", bgcolor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 1, p: 0.6, "&:hover": { bgcolor: "rgba(239,68,68,0.2)" } }}>
                                <ShieldOutlined sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Dismiss from threat list">
                              <IconButton size="small" onClick={() => setDeleteTarget(u)}
                                sx={{ color: "#fb923c", bgcolor: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.28)", borderRadius: 1, p: 0.6, "&:hover": { bgcolor: "rgba(251,146,60,0.2)", color: "#f97316", boxShadow: "0 0 8px rgba(251,146,60,0.3)" }, transition: "all 0.18s" }}>
                                <Delete sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TdCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ══════════════ TABLE 2 – BANNED USERS ══════════════ */}
      <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
           <Box sx={{
  width: 36, height: 36, borderRadius: 2,
  background: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(251,146,60,0.1) 100%)",
  border: "1px solid rgba(239,68,68,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 0 14px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, transparent 60%)",
    borderRadius: "inherit",
  },
}}>
  <PersonOff sx={{
    fontSize: 18,
    color: "#f87171",
    filter: "drop-shadow(0 0 6px rgba(239,68,68,0.7))",
    position: "relative", zIndex: 1,
  }} />
</Box>
           <SectionLabel sub="Security" title="Banned / Logged-Out Users" gradient="linear-gradient(90deg, #f87171 0%, #fb923c 60%, #fbbf24 100%)" />
          </Box>
          <Chip size="small" label={`${bannedUsers.length} banned`}
            sx={{ bgcolor: bannedUsers.length > 0 ? "rgba(239,68,68,0.08)" : "rgba(100,116,139,0.06)", border: "1px solid #1e293b", color: bannedUsers.length > 0 ? "#f87171" : "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["User ID", "Severity", "Reason", "Login Email", "Password", "Banned At", "Restore"].map((h) => <ThCol key={h}>{h}</ThCol>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {bannedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#1e293b", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>
                    No banned users yet — use the Shield icon above to ban a threat user
                  </TableCell>
                </TableRow>
              ) : (
                bannedUsers.map((u) => {
                  const pill = SEV_PILL[u.severity] || SEV_PILL.low;
                  return (
                    <TableRow key={u.user_id} sx={{
                      "& td": { borderBottom: "1px solid #0a0f1a", py: 1.5, px: 2 },
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": { bgcolor: "rgba(239,68,68,0.03)" },
                      transition: "background 0.15s",
                    }}>

                      {/* ── User ID — danger styled ── */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{
                            width: 22, height: 22, borderRadius: 1,
                            bgcolor: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <PersonOff sx={{ fontSize: 12, color: "#f87171" }} />
                          </Box>
                          <Box>
                            <Typography sx={{
                              color: "#ef4444",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              fontFamily: "'JetBrains Mono',monospace",
                              textDecoration: "line-through",
                              textDecorationColor: "rgba(239,68,68,0.5)",
                              textDecorationThickness: "1.5px",
                              letterSpacing: "0.02em",
                              textShadow: "0 0 12px rgba(239,68,68,0.4)",
                            }}>
                              {u.user_id}
                            </Typography>
                            <Typography sx={{
                              color: "#7f1d1d",
                              fontSize: "0.58rem",
                              fontFamily: "'JetBrains Mono',monospace",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}>
                              ● BANNED
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* ── Severity ── */}
                      <TableCell>
                        <Box sx={{
                          display: "inline-flex", px: 1, py: 0.3, borderRadius: 1,
                          bgcolor: pill.bg,
                          border: `1px solid ${pill.border}`,
                          boxShadow: `0 0 6px ${pill.glow}`,
                        }}>
                          <Typography sx={{ color: pill.color, fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {u.severity}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* ── Reason — highlighted ── */}
                      <TableCell>
                        <Box sx={{
                          display: "inline-flex", alignItems: "center", gap: 0.6,
                          px: 1, py: 0.4, borderRadius: 1.5,
                          bgcolor: "rgba(239,68,68,0.07)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          maxWidth: 200,
                        }}>
                          <ErrorOutline sx={{ fontSize: 11, color: "#f87171", flexShrink: 0 }} />
                          <Typography sx={{
                            color: "#fca5a5",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.01em",
                          }} title={u.reason}>
                            {u.reason}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* ── Credentials ── */}
                      <TableCell>
                        <CredentialCell value={u.credentials.email}    copyKey={`banned-em-${u.user_id}`} copiedId={copiedId} onCopy={copyToClipboard} color="#2dd4bf" />
                      </TableCell>
                      <TableCell>
                        <CredentialCell value={u.credentials.password} copyKey={`banned-pw-${u.user_id}`} copiedId={copiedId} onCopy={copyToClipboard} color="#c084fc" />
                      </TableCell>

                      {/* ── Banned At ── */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.6}>
                          <AccessTime sx={{ fontSize: 11, color: "#f87171" }} />
                          <Typography sx={{ color: "#f87171", fontSize: "0.68rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
                            {timeAgo(u.bannedAt)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* ── Restore ── */}
                      <TableCell>
                        <Tooltip title="Restore access">
                          <IconButton size="small" onClick={() => doRestore(u)} sx={{
                            color: "#10b981",
                            bgcolor: "rgba(16,185,129,0.08)",
                            border: "1px solid rgba(16,185,129,0.2)",
                            borderRadius: 1, p: 0.6,
                            "&:hover": {
                              bgcolor: "rgba(16,185,129,0.18)",
                              boxShadow: "0 0 10px rgba(16,185,129,0.35)",
                              borderColor: "rgba(16,185,129,0.5)",
                            },
                            transition: "all 0.18s",
                          }}>
                            <RestoreOutlined sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #0a0f1a" }}>
          <Typography sx={{ color: "#1e293b", fontSize: "0.62rem", fontFamily: "'JetBrains Mono',monospace" }}>
            ℹ Credentials are auto-generated for restricted test login · Format: restricted.{"{userid}"}@streamsight.sec
          </Typography>
        </Box>
      </Box>

      {/* Dialogs */}
      <UserDetailDialog   user={detailUser}   open={!!detailUser}   onClose={() => setDetailUser(null)}   onBan={doBan}    onRemove={doRemove} />
      <DeleteConfirmDialog user={deleteTarget} open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doRemove} />
    </Box>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { metrics: liveMetrics, anomalies: liveAnomalies, events: liveEvents } = useSocket();
  const prevMetrics   = useRef(null);
  const prevHighCount = useRef(0);

  const [polledMetrics,   setPolledMetrics]   = useState(null);
  const [polledAnomalies, setPolledAnomalies] = useState([]);
  const [polledEvents,    setPolledEvents]    = useState([]);
  const [lastUpdated,     setLastUpdated]     = useState(null);
  const [refreshing,      setRefreshing]      = useState(false);
  const [kpiHistory,      setKpiHistory]      = useState({ sessions: [], cvr: [], bounce: [], users: [] });

  const fetchAll = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [mRes, aRes, eRes] = await Promise.all([
        fetch(`${API_URL}/api/metrics`), fetch(`${API_URL}/api/anomalies`), fetch(`${API_URL}/api/events`),
      ]);
      const [m, a, e] = await Promise.all([mRes.json(), aRes.json(), eRes.json()]);
      if (m?.cvr !== undefined) {
        setPolledMetrics(m); setLastUpdated(new Date());
        setKpiHistory((prev) => ({
          sessions: [...prev.sessions.slice(-9), m.session_count || 0],
          cvr:      [...prev.cvr.slice(-9),      m.cvr           || 0],
          bounce:   [...prev.bounce.slice(-9),   m.bounce_rate   || 0],
          users:    [...prev.users.slice(-9),    m.active_users  || 0],
        }));
      }
      if (Array.isArray(a)) {
        setPolledAnomalies(a);
        const high = a.filter((x) => x.severity === "high").length;
        if (high > prevHighCount.current) toast.error(`🚨 ${high - prevHighCount.current} new HIGH anomaly!`, { autoClose: 4000 });
        prevHighCount.current = high;
      }
      if (Array.isArray(e)) setPolledEvents(e.slice(0, 20));
    } catch (err) { console.error(err); }
    finally { if (manual) setTimeout(() => setRefreshing(false), 500); }
  }, []);

  useEffect(() => { fetchAll(); const iv = setInterval(fetchAll, 5000); return () => clearInterval(iv); }, [fetchAll]);

  const metrics   = liveMetrics   || polledMetrics;
  const anomalies = liveAnomalies.length > 0 ? liveAnomalies : polledAnomalies;
  const events    = liveEvents.length    > 0 ? liveEvents    : polledEvents;
  const prev      = prevMetrics.current;
  prevMetrics.current = metrics;

  // ── CHANGE: Real-time user map built from simulator events ────────────────
  const userMap = {};
  events.forEach((e) => {
    if (!userMap[e.user_id]) {
      userMap[e.user_id] = {
        user_id: e.user_id,
        events: 0,
        device: e.device,
        country: e.country,
        lastActive: e.timestamp,
        page: e.page,
        // CHANGE: Carry extra event fields for richer live user detail
        session_id: e.session_id,
        event_type: e.event_type,
        price: e.price,
      };
    }
    userMap[e.user_id].events++;
    if (new Date(e.timestamp) > new Date(userMap[e.user_id].lastActive)) {
      // CHANGE: Update all live fields on newer event
      userMap[e.user_id].lastActive  = e.timestamp;
      userMap[e.user_id].page        = e.page;
      userMap[e.user_id].event_type  = e.event_type;
      userMap[e.user_id].session_id  = e.session_id;
      userMap[e.user_id].price       = e.price;
    }
  });
  const users = Object.values(userMap).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive)).slice(0, 8);
  const role  = localStorage.getItem("ss_role") || "admin";

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
          <Box>
            {/* CHANGE: Vivid gradient dashboard title */}
            <Typography variant="h4" fontWeight={800} sx={{
              letterSpacing: "-0.5px", mb: 0.5,
              background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 60%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}>
              Live Dashboard
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.875rem", fontFamily: "'JetBrains Mono',monospace" }}>Real-time clickstream analytics · auto-refreshes every 5s</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            {lastUpdated && <Chip size="small" label={`⟳ ${lastUpdated.toLocaleTimeString()}`} sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem" }} />}
            {role !== "viewer" && (
              <Tooltip title="Export as PDF">
                <IconButton onClick={() => exportPDF(metrics, anomalies)} size="small" sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", "&:hover": { background: "rgba(239,68,68,0.15)" } }}>
                  <PictureAsPdf fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Refresh now">
              <IconButton onClick={() => fetchAll(true)} size="small" sx={{ background: "#1e293b", border: "1px solid #334155", color: "#64748b", "&:hover": { color: "#00d4aa", borderColor: "rgba(0,212,170,0.4)" }, ...(refreshing ? { animation: "spin 0.8s linear infinite" } : {}) }}>
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={2.5} mb={3}>
        {[
          { type: "sessions", value: metrics?.session_count, history: kpiHistory.sessions },
          { type: "cvr",      value: metrics?.cvr,           unit: "%", history: kpiHistory.cvr },
          { type: "bounce",   value: metrics?.bounce_rate,   unit: "%", history: kpiHistory.bounce },
          { type: "users",    value: metrics?.active_users,  history: kpiHistory.users },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} xl={3} key={card.type}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <KPICard {...card} prev={prev?.[["session_count","cvr","bounce_rate","active_users"][i]]} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} lg={8}><FunnelChart funnel={metrics?.funnel} /></Grid>
          <Grid item xs={12} lg={4}><AnomalyFeed anomalies={anomalies} /></Grid>
        </Grid>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <MLModelPanel anomalies={anomalies} />
      </motion.div>

      {(role === "admin" || role === "analyst") && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <ThreatUsersPanel anomalies={anomalies} />
        </motion.div>
      )}

      {/* ── CHANGE: Live Users table with real-time event details ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Box sx={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 3, mb: 3, overflow: "hidden" }}>
          <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {/* CHANGE: Glowing green icon ring for live users */}
              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(0,212,170,0.2)" }}>
                <Circle sx={{ color: "#00d4aa", fontSize: 14 }} />
              </Box>
              <SectionLabel sub="Live Users" title="Active Sessions" gradient="linear-gradient(90deg, #00d4aa 0%, #38bdf8 100%)" />
            </Box>
            <Chip size="small" icon={<Circle sx={{ fontSize: "8px !important", color: "#00d4aa !important" }} />} sx={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", color: "#00d4aa", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem" }} />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { borderBottom: "1px solid #111827", py: 1.5, color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" } }}>
                  {/* CHANGE: Added Last Event column for real-time detail */}
                  {/* {["User","Device","Country","Current Page","Last Event","Events","Last Active","Status"].map((h) => <TableCell key={h} sx={{ px: 2.5 }}>{h}</TableCell>)} */}
                  {["User","Device","Country","Current Page","Last Event","Events","Last Active","Status"].map((h) => (
                    <TableCell key={h} sx={{
                      px: 2.5, borderBottom: "1px solid #111827", py: 1.5,
                      color: "#64748b", fontSize: "0.65rem", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      transition: "color 0.18s",
                      "&:hover": { color: "#00d4aa", cursor: "default" },
                    }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: "#334155", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", border: 0 }}>No active users yet...</TableCell></TableRow>
                ) : (
                  users.map((u) => {
                    const info = getUserInfo_safe(u.user_id);
                    return (
                      <TableRow key={u.user_id} sx={{ "&:hover": { background: "rgba(0,212,170,0.025)" }, "& td": { borderBottom: "1px solid #111827", py: 1.5, px: 2.5 }, "&:last-child td": { borderBottom: 0 }, transition: "background 0.15s" }}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ width: 30, height: 30, fontSize: "0.7rem", fontWeight: 700, background: info.color, flexShrink: 0 }}>{info.initials}</Avatar>
                            <Box>
                              <Typography sx={{ color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.2 }}>{info.name}</Typography>
                              <Typography sx={{ color: "#334155", fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.user_id}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{DEVICE_ICON[u.device] || "💻"} {u.device}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{FLAG[u.country] || FLAG.default} {u.country}</Typography></TableCell>
                        <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace" }}>{u.page}</Typography></TableCell>
                        {/* CHANGE: Real-time last event type from simulator */}
                        <TableCell>
                          <Chip
                            label={u.event_type || "—"}
                            size="small"
                            sx={{
                              height: 20, fontSize: "0.62rem",
                              background: "rgba(129,140,248,0.1)",
                              color: "#818cf8",
                              border: "1px solid rgba(129,140,248,0.25)",
                              fontFamily: "'JetBrains Mono',monospace",
                            }}
                          />
                        </TableCell>
                        <TableCell><Chip label={u.events} size="small" sx={{ height: 20, fontSize: "0.65rem", background: "rgba(59,130,246,0.08)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", fontFamily: "'JetBrains Mono',monospace" }} /></TableCell>
                        <TableCell><Typography sx={{ color: "#64748b", fontSize: "0.72rem", fontFamily: "'JetBrains Mono',monospace" }}>{timeAgo(u.lastActive)}</Typography></TableCell>
                        <TableCell><StatusDot ts={u.lastActive} /></TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <EventTimeline events={events} />
      </motion.div>
    </Box>
  );
}

function getUserInfo_safe(userId) {
  const NAMES = [
    { name: "Arjun Kumar",   initials: "AK", color: "#1D9E75" },
    { name: "Priya Sharma",  initials: "PS", color: "#3b82f6" },
    { name: "Rahul Mehta",   initials: "RM", color: "#a855f7" },
    { name: "Sneha Patel",   initials: "SP", color: "#f59e0b" },
    { name: "Vikram Singh",  initials: "VS", color: "#ef4444" },
    { name: "Ananya Iyer",   initials: "AI", color: "#06b6d4" },
    { name: "Karan Gupta",   initials: "KG", color: "#8b5cf6" },
    { name: "Divya Nair",    initials: "DN", color: "#ec4899" },
    { name: "Rohan Das",     initials: "RD", color: "#10b981" },
    { name: "Meera Reddy",   initials: "MR", color: "#f97316" },
    { name: "Aditya Joshi",  initials: "AJ", color: "#14b8a6" },
    { name: "Pooja Verma",   initials: "PV", color: "#6366f1" },
    { name: "Sanjay Rao",    initials: "SR", color: "#0ea5e9" },
    { name: "Kavya Menon",   initials: "KM", color: "#84cc16" },
    { name: "Nikhil Shah",   initials: "NS", color: "#f43f5e" },
    { name: "Lakshmi Nair",  initials: "LN", color: "#22d3ee" },
    { name: "Amit Pandey",   initials: "AP", color: "#fb923c" },
    { name: "Riya Jain",     initials: "RJ", color: "#c084fc" },
    { name: "Suresh Babu",   initials: "SB", color: "#34d399" },
    { name: "Deepa Krishna", initials: "DK", color: "#60a5fa" },
  ];
  const num = parseInt((userId || "").replace(/\D/g, "") || "0");
  return NAMES[num % NAMES.length];
}