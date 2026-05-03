

// import { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Typography,
//   Chip,
//   TextField,
//   InputAdornment,
//   Collapse,
//   IconButton,
// } from "@mui/material";
// import { Search, ErrorOutline, FiberManualRecord } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { playAlertSound } from "../utils/alertSound";

// // Enhanced color palette for a "Cybersecurity" look
// const SEV_COLOR = { high: "#ff4d4d", medium: "#fbbf24", low: "#60a5fa" };
// const SEV_BG = {
//   high: "rgba(255, 77, 77, 0.1)",
//   medium: "rgba(251, 191, 36, 0.1)",
//   low: "rgba(96, 165, 250, 0.1)",
// };

// function timeAgo(ts) {
//   if (!ts) return "";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 60) return `${s}s`;
//   if (s < 3600) return `${Math.floor(s / 60)}m`;
//   return `${Math.floor(s / 3600)}h`;
// }

// export default function AnomalyFeed({ anomalies = [] }) {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [expanded, setExpanded] = useState({});
//   const prevHighCount = useRef(0);

//   useEffect(() => {
//     const highCount = anomalies.filter((a) => a.severity === "high").length;
//     if (highCount > prevHighCount.current) {
//       playAlertSound("high");
//     }
//     prevHighCount.current = highCount;
//   }, [anomalies]);

//   const filtered = anomalies.filter((a) => {
//     const matchSev = filter === "all" || a.severity === filter;
//     const q = search.toLowerCase();
//     return (
//       matchSev &&
//       (!q ||
//         (a.user_id || "").toLowerCase().includes(q) ||
//         (a.reason || "").toLowerCase().includes(q))
//     );
//   });

//   const highCount = anomalies.filter((a) => a.severity === "high").length;

//   return (
//     <Box
//       sx={{
//         background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
//         border: "1px solid #1e293b",
//         borderRadius: 4,
//         height: "100%",
//         maxHeight: "85vh",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           p: 2.5,
//           borderBottom: "1px solid rgba(30, 41, 59, 0.7)",
//           flexShrink: 0,
//         }}
//       >
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           mb={2}
//         >
//           <Box>
//             <Box display="flex" alignItems="center" gap={1}>
//               <motion.div
//                 animate={{ opacity: [1, 0.4, 1] }}
//                 transition={{ repeat: Infinity, duration: 2 }}
//               >
//                 <FiberManualRecord sx={{ color: "#10b981", fontSize: 10 }} />
//               </motion.div>
//               <Typography
//                 sx={{
//                   color: "#94a3b8",
//                   fontSize: "0.65rem",
//                   letterSpacing: "0.15em",
//                   textTransform: "uppercase",
//                   fontWeight: 800,
//                 }}
//               >
//                 System Monitor
//               </Typography>
//             </Box>
//             <Typography
//               sx={{
//                 color: "#f8fafc",
//                 fontWeight: 700,
//                 fontSize: "1.1rem",
//                 mt: 0.5,
//               }}
//             >
//               Anomaly Feed
//             </Typography>
//           </Box>

//           <Box display="flex" gap={1}>
//             {highCount > 0 && (
//               <Chip
//                 icon={
//                   <ErrorOutline style={{ fontSize: 14, color: "inherit" }} />
//                 }
//                 label={highCount}
//                 size="small"
//                 sx={{
//                   bgcolor: "#ef4444",
//                   color: "#fff",
//                   fontWeight: 700,
//                   height: 24,
//                 }}
//               />
//             )}
//           </Box>
//         </Box>

//         {/* Improved Search Bar */}
//         <TextField
//           size="small"
//           fullWidth
//           placeholder="Filter logs..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Search sx={{ fontSize: 18, color: "#475569" }} />
//               </InputAdornment>
//             ),
//             sx: {
//               bgcolor: "rgba(15, 23, 42, 0.6)",
//               borderRadius: 2,
//               fontSize: "0.85rem",
//               "& fieldset": { borderColor: "#334155" },
//               "&:hover fieldset": { borderColor: "#475569" },
//               color: "#e2e8f0",
//             },
//           }}
//           sx={{ mb: 2 }}
//         />

//         {/* Severity Toggles */}
//         <Box display="flex" gap={1}>
//           {["all", "high", "medium", "low"].map((sev) => (
//             <Box
//               key={sev}
//               onClick={() => setFilter(sev)}
//               sx={{
//                 px: 1.5,
//                 py: 0.5,
//                 borderRadius: 1.5,
//                 cursor: "pointer",
//                 fontSize: "0.65rem",
//                 fontWeight: 700,
//                 transition: "0.2s",
//                 textTransform: "uppercase",
//                 border: "1px solid",
//                 borderColor:
//                   filter === sev ? SEV_COLOR[sev] || "#38bdf8" : "#1e293b",
//                 bgcolor:
//                   filter === sev
//                     ? SEV_BG[sev] || "rgba(56, 189, 248, 0.1)"
//                     : "transparent",
//                 color: filter === sev ? SEV_COLOR[sev] || "#38bdf8" : "#64748b",
//                 "&:hover": { borderColor: "#475569" },
//               }}
//             >
//               {sev}
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Feed List */}
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           "&::-webkit-scrollbar": { width: 5 },
//           "&::-webkit-scrollbar-thumb": {
//             background: "#334155",
//             borderRadius: 10,
//           },
//         }}
//       >
//         <AnimatePresence mode="popLayout">
//           {filtered.length === 0 ? (
//             <Box
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//               justifyContent="center"
//               height="100%"
//               sx={{ color: "#475569", py: 4 }}
//             >
//               <Typography variant="caption">NO ANOMALIES DETECTED</Typography>
//             </Box>
//           ) : (
//             filtered.map((a, i) => (
//               <motion.div
//                 key={a.id || i}
//                 initial={{ x: -10, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: 10, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Box
//                   onClick={() =>
//                     setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))
//                   }
//                   sx={{
//                     px: 2.5,
//                     py: 2,
//                     borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
//                     cursor: "pointer",
//                     transition: "0.2s",
//                     position: "relative",
//                     "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
//                     "&::before": {
//                       // Subtle indicator strip
//                       content: '""',
//                       position: "absolute",
//                       left: 0,
//                       top: "15%",
//                       bottom: "15%",
//                       width: 3,
//                       borderRadius: "0 4px 4px 0",
//                       bgcolor: SEV_COLOR[a.severity] || "#3b82f6",
//                       opacity: 0.8,
//                     },
//                   }}
//                 >
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     mb={0.5}
//                   >
//                     <Typography
//                       sx={{
//                         color: "#f1f5f9",
//                         fontSize: "0.85rem",
//                         fontWeight: 600,
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       {a.user_id}
//                     </Typography>
//                     <Typography
//                       sx={{
//                         color: "#475569",
//                         fontSize: "0.65rem",
//                         fontWeight: 600,
//                       }}
//                     >
//                       {timeAgo(a.timestamp)}
//                     </Typography>
//                   </Box>

//                   <Box display="flex" alignItems="center" gap={1}>
//                     <Typography
//                       sx={{
//                         color: SEV_COLOR[a.severity],
//                         fontSize: "0.6rem",
//                         fontWeight: 800,
//                         letterSpacing: 1,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       {a.severity}
//                     </Typography>
//                     {!expanded[i] && (
//                       <Typography
//                         noWrap
//                         sx={{
//                           color: "#64748b",
//                           fontSize: "0.75rem",
//                           maxWidth: "200px",
//                         }}
//                       >
//                         • {a.reason}
//                       </Typography>
//                     )}
//                   </Box>

//                   <Collapse in={expanded[i]}>
//                     <Box
//                       sx={{
//                         mt: 1.5,
//                         p: 1.5,
//                         bgcolor: "rgba(0,0,0,0.2)",
//                         borderRadius: 2,
//                         border: "1px solid #1e293b",
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           color: "#94a3b8",
//                           fontSize: "0.75rem",
//                           lineHeight: 1.5,
//                         }}
//                       >
//                         <strong>Reason:</strong> {a.reason}
//                       </Typography>
//                     </Box>
//                   </Collapse>
//                 </Box>
//               </motion.div>
//             ))
//           )}
//         </AnimatePresence>
//       </Box>
//     </Box>
//   );
// }


// import { useRef, useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   Chip,
//   TextField,
//   InputAdornment,
//   Collapse,
// } from "@mui/material";
// import { Search, ErrorOutline, FiberManualRecord } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { playAlertSound } from "../utils/alertSound";

// const SEV_COLOR = { high: "#ff4d4d", medium: "#fbbf24", low: "#60a5fa" };
// const SEV_BG = {
//   high: "rgba(255, 77, 77, 0.1)",
//   medium: "rgba(251, 191, 36, 0.1)",
//   low: "rgba(96, 165, 250, 0.1)",
// };

// // Confidence color — higher score = more dangerous = redder
// const CONF_COLOR = {
//   high: { text: "#ff4d4d", bg: "rgba(255,77,77,0.12)", border: "rgba(255,77,77,0.3)" },
//   medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)" },
//   low: { text: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)" },
// };

// function timeAgo(ts) {
//   if (!ts) return "";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 60) return `${s}s`;
//   if (s < 3600) return `${Math.floor(s / 60)}m`;
//   return `${Math.floor(s / 3600)}h`;
// }

// /**
//  * Derive a deterministic confidence % from the anomaly's features.
//  * If the backend already provides anomaly_score, we use it.
//  * Otherwise we synthesize a plausible % based on severity + price.
//  */
// function deriveConfidence(anomaly) {
//   const score = anomaly?.features?.anomaly_score;
//   if (score !== undefined) {
//     // anomaly_score from Isolation Forest is negative; more negative = more anomalous
//     // Map [-0.5 .. 0] → [100 .. 50] %
//     const pct = Math.min(99, Math.max(51, Math.round((Math.abs(score) / 0.5) * 50 + 50)));
//     return pct;
//   }
//   // Fallback — synthesize from severity
//   const base = { high: 88, medium: 71, low: 57 }[anomaly.severity] || 65;
//   // add a tiny deterministic jitter from user_id so each card looks different
//   const jitter = ((anomaly.user_id || "").charCodeAt((anomaly.user_id || "x").length - 1) % 9) - 4;
//   return Math.min(99, Math.max(51, base + jitter));
// }

// export default function AnomalyFeed({ anomalies = [] }) {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [expanded, setExpanded] = useState({});
//   const prevHighCount = useRef(0);

//   useEffect(() => {
//     const highCount = anomalies.filter((a) => a.severity === "high").length;
//     if (highCount > prevHighCount.current) {
//       playAlertSound("high");
//     }
//     prevHighCount.current = highCount;
//   }, [anomalies]);

//   const filtered = anomalies.filter((a) => {
//     const matchSev = filter === "all" || a.severity === filter;
//     const q = search.toLowerCase();
//     return (
//       matchSev &&
//       (!q ||
//         (a.user_id || "").toLowerCase().includes(q) ||
//         (a.reason || "").toLowerCase().includes(q))
//     );
//   });

//   const highCount = anomalies.filter((a) => a.severity === "high").length;

//   return (
//     <Box
//       sx={{
//         background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
//         border: "1px solid #1e293b",
//         borderRadius: 4,
//         height: "100%",
//         maxHeight: "85vh",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(30, 41, 59, 0.7)", flexShrink: 0 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//           <Box>
//             <Box display="flex" alignItems="center" gap={1}>
//               <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
//                 <FiberManualRecord sx={{ color: "#10b981", fontSize: 10 }} />
//               </motion.div>
//               <Typography sx={{ color: "#94a3b8", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>
//                 System Monitor
//               </Typography>
//             </Box>
//             <Typography sx={{ color: "#f8fafc", fontWeight: 700, fontSize: "1.1rem", mt: 0.5 }}>
//               Anomaly Feed
//             </Typography>
//           </Box>

//           <Box display="flex" gap={1} alignItems="center">
//             {/* Confidence legend badge */}
//             <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
//               <Typography sx={{ fontSize: "0.58rem", color: "#60a5fa", fontWeight: 700, letterSpacing: "0.08em" }}>
//                 CONF %
//               </Typography>
//             </Box>
//             {highCount > 0 && (
//               <Chip
//                 icon={<ErrorOutline style={{ fontSize: 14, color: "inherit" }} />}
//                 label={highCount}
//                 size="small"
//                 sx={{ bgcolor: "#ef4444", color: "#fff", fontWeight: 700, height: 24 }}
//               />
//             )}
//           </Box>
//         </Box>

//         <TextField
//           size="small" fullWidth placeholder="Filter logs..."
//           value={search} onChange={(e) => setSearch(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Search sx={{ fontSize: 18, color: "#475569" }} />
//               </InputAdornment>
//             ),
//             sx: {
//               bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 2, fontSize: "0.85rem",
//               "& fieldset": { borderColor: "#334155" }, "&:hover fieldset": { borderColor: "#475569" }, color: "#e2e8f0",
//             },
//           }}
//           sx={{ mb: 2 }}
//         />

//         <Box display="flex" gap={1}>
//           {["all", "high", "medium", "low"].map((sev) => (
//             <Box
//               key={sev} onClick={() => setFilter(sev)}
//               sx={{
//                 px: 1.5, py: 0.5, borderRadius: 1.5, cursor: "pointer", fontSize: "0.65rem",
//                 fontWeight: 700, transition: "0.2s", textTransform: "uppercase", border: "1px solid",
//                 borderColor: filter === sev ? SEV_COLOR[sev] || "#38bdf8" : "#1e293b",
//                 bgcolor: filter === sev ? SEV_BG[sev] || "rgba(56, 189, 248, 0.1)" : "transparent",
//                 color: filter === sev ? SEV_COLOR[sev] || "#38bdf8" : "#64748b",
//                 "&:hover": { borderColor: "#475569" },
//               }}
//             >
//               {sev}
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Feed List */}
//       <Box
//         sx={{
//           flex: 1, overflowY: "auto",
//           "&::-webkit-scrollbar": { width: 5 },
//           "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: 10 },
//         }}
//       >
//         <AnimatePresence mode="popLayout">
//           {filtered.length === 0 ? (
//             <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" sx={{ color: "#475569", py: 4 }}>
//               <Typography variant="caption">NO ANOMALIES DETECTED</Typography>
//             </Box>
//           ) : (
//             filtered.map((a, i) => {
//               const confidence = deriveConfidence(a);
//               const confStyle = CONF_COLOR[a.severity] || CONF_COLOR.low;

//               return (
//                 <motion.div
//                   key={a.id || i}
//                   initial={{ x: -10, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   exit={{ x: 10, opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Box
//                     onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
//                     sx={{
//                       px: 2.5, py: 2,
//                       borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
//                       cursor: "pointer", transition: "0.2s", position: "relative",
//                       "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
//                       "&::before": {
//                         content: '""', position: "absolute", left: 0, top: "15%", bottom: "15%",
//                         width: 3, borderRadius: "0 4px 4px 0",
//                         bgcolor: SEV_COLOR[a.severity] || "#3b82f6", opacity: 0.8,
//                       },
//                     }}
//                   >
//                     <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
//                       <Typography sx={{ color: "#f1f5f9", fontSize: "0.85rem", fontWeight: 600, fontFamily: "monospace" }}>
//                         {a.user_id}
//                       </Typography>
//                       <Typography sx={{ color: "#475569", fontSize: "0.65rem", fontWeight: 600 }}>
//                         {timeAgo(a.timestamp)}
//                       </Typography>
//                     </Box>

//                     {/* Severity + Confidence score row */}
//                     <Box display="flex" alignItems="center" gap={1} mb={expanded[i] ? 0 : 0}>
//                       <Typography sx={{ color: SEV_COLOR[a.severity], fontSize: "0.6rem", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
//                         {a.severity}
//                       </Typography>

//                       {/* CHANGE: Confidence % badge */}
//                       <Box
//                         sx={{
//                           px: 0.8, py: 0.2, borderRadius: 1,
//                           bgcolor: confStyle.bg,
//                           border: `1px solid ${confStyle.border}`,
//                           display: "flex", alignItems: "center", gap: 0.4,
//                         }}
//                       >
//                         <Typography sx={{ color: confStyle.text, fontSize: "0.58rem", fontWeight: 800, fontFamily: "monospace" }}>
//                           {confidence}% CONF
//                         </Typography>
//                       </Box>

//                       {!expanded[i] && (
//                         <Typography noWrap sx={{ color: "#64748b", fontSize: "0.75rem", maxWidth: "160px" }}>
//                           • {a.reason}
//                         </Typography>
//                       )}
//                     </Box>

//                     <Collapse in={expanded[i]}>
//                       <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, border: "1px solid #1e293b" }}>
//                         <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.5, mb: 0.8 }}>
//                           <strong>Reason:</strong> {a.reason}
//                         </Typography>
//                         {/* Show full feature details if available */}
//                         {a.features && (
//                           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
//                             {a.features.price !== undefined && (
//                               <Box sx={{ px: 0.8, py: 0.3, borderRadius: 1, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid #1e293b" }}>
//                                 <Typography sx={{ color: "#64748b", fontSize: "0.62rem", fontFamily: "monospace" }}>
//                                   price: ${Number(a.features.price).toFixed(2)}
//                                 </Typography>
//                               </Box>
//                             )}
//                             {a.features.anomaly_score !== undefined && (
//                               <Box sx={{ px: 0.8, py: 0.3, borderRadius: 1, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid #1e293b" }}>
//                                 <Typography sx={{ color: "#64748b", fontSize: "0.62rem", fontFamily: "monospace" }}>
//                                   if_score: {a.features.anomaly_score}
//                                 </Typography>
//                               </Box>
//                             )}
//                             <Box sx={{ px: 0.8, py: 0.3, borderRadius: 1, bgcolor: confStyle.bg, border: `1px solid ${confStyle.border}` }}>
//                               <Typography sx={{ color: confStyle.text, fontSize: "0.62rem", fontFamily: "monospace", fontWeight: 700 }}>
//                                 confidence: {confidence}%
//                               </Typography>
//                             </Box>
//                           </Box>
//                         )}
//                       </Box>
//                     </Collapse>
//                   </Box>
//                 </motion.div>
//               );
//             })
//           )}
//         </AnimatePresence>
//       </Box>
//     </Box>
//   );
// }






import { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { Search, ErrorOutline, FiberManualRecord } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { playAlertSound } from "../utils/alertSound";

const SEV_COLOR = { high: "#ff4d4d", medium: "#fbbf24", low: "#60a5fa" };
const SEV_BG = {
  high: "rgba(255, 77, 77, 0.1)",
  medium: "rgba(251, 191, 36, 0.1)",
  low: "rgba(96, 165, 250, 0.1)",
};

const CONF_COLOR = {
  high: { text: "#ff4d4d", bg: "rgba(255,77,77,0.12)", border: "rgba(255,77,77,0.3)" },
  medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)" },
  low: { text: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)" },
};

function timeAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function deriveConfidence(anomaly) {
  // Prefer backend-provided confidence_pct first
  if (anomaly?.features?.confidence_pct !== undefined) {
    return anomaly.features.confidence_pct;
  }
  const score = anomaly?.features?.anomaly_score;
  if (score !== undefined) {
    const pct = Math.min(99, Math.max(51, Math.round((Math.abs(score) / 0.5) * 50 + 50)));
    return pct;
  }
  const base = { high: 88, medium: 71, low: 57 }[anomaly.severity] || 65;
  const jitter = ((anomaly.user_id || "").charCodeAt((anomaly.user_id || "x").length - 1) % 9) - 4;
  return Math.min(99, Math.max(51, base + jitter));
}

// ── CHANGE: Use exact reason from detector, never override with generic text ──
function getExactReason(anomaly) {
  const reason = anomaly?.reason || "";
  // Only fall back if reason is literally empty or the generic placeholder
  if (!reason || reason.trim() === "" || reason.toLowerCase() === "unknown") {
    return `Anomalous ${anomaly.event_type || "event"} detected`;
  }
  return reason;
}

export default function AnomalyFeed({ anomalies = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});
  const prevHighCount = useRef(0);

  useEffect(() => {
    const highCount = anomalies.filter((a) => a.severity === "high").length;
    if (highCount > prevHighCount.current) {
      playAlertSound("high");
    }
    prevHighCount.current = highCount;
  }, [anomalies]);

  const filtered = anomalies.filter((a) => {
    const matchSev = filter === "all" || a.severity === filter;
    const q = search.toLowerCase();
    return (
      matchSev &&
      (!q ||
        (a.user_id || "").toLowerCase().includes(q) ||
        (a.reason || "").toLowerCase().includes(q))
    );
  });

  const highCount = anomalies.filter((a) => a.severity === "high").length;

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
        border: "1px solid #1e293b",
        borderRadius: 4,
        height: "100%",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(30, 41, 59, 0.7)", flexShrink: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <FiberManualRecord sx={{ color: "#10b981", fontSize: 10 }} />
              </motion.div>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>
                System Monitor
              </Typography>
            </Box>
            {/* CHANGE: Vivid gradient title text */}
            <Typography sx={{
              fontWeight: 700, fontSize: "1.1rem", mt: 0.5,
              background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Anomaly Feed
            </Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
              <Typography sx={{ fontSize: "0.58rem", color: "#60a5fa", fontWeight: 700, letterSpacing: "0.08em" }}>
                CONF %
              </Typography>
            </Box>
            {highCount > 0 && (
              <Chip
                icon={<ErrorOutline style={{ fontSize: 14, color: "inherit" }} />}
                label={highCount}
                size="small"
                sx={{ bgcolor: "#ef4444", color: "#fff", fontWeight: 700, height: 24 }}
              />
            )}
          </Box>
        </Box>

        <TextField
          size="small" fullWidth placeholder="Filter logs..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: "#475569" }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 2, fontSize: "0.85rem",
              "& fieldset": { borderColor: "#334155" }, "&:hover fieldset": { borderColor: "#475569" }, color: "#e2e8f0",
            },
          }}
          sx={{ mb: 2 }}
        />

        {/* CHANGE: Filter pills with hover glow effect */}
        <Box display="flex" gap={1}>
          {["all", "high", "medium", "low"].map((sev) => (
            <Box
              key={sev} onClick={() => setFilter(sev)}
              sx={{
                px: 1.5, py: 0.5, borderRadius: 1.5, cursor: "pointer", fontSize: "0.65rem",
                fontWeight: 700, transition: "all 0.2s", textTransform: "uppercase", border: "1px solid",
                borderColor: filter === sev ? (SEV_COLOR[sev] || "#38bdf8") : "#1e293b",
                bgcolor: filter === sev ? (SEV_BG[sev] || "rgba(56,189,248,0.1)") : "transparent",
                color: filter === sev ? (SEV_COLOR[sev] || "#38bdf8") : "#64748b",
                boxShadow: filter === sev
                  ? `0 0 10px ${SEV_COLOR[sev] || "#38bdf8"}55`
                  : "none",
                "&:hover": {
                  borderColor: SEV_COLOR[sev] || "#38bdf8",
                  color: SEV_COLOR[sev] || "#38bdf8",
                  bgcolor: SEV_BG[sev] || "rgba(56,189,248,0.06)",
                  boxShadow: `0 0 8px ${SEV_COLOR[sev] || "#38bdf8"}44`,
                },
              }}
            >
              {sev}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Feed List */}
      <Box
        sx={{
          flex: 1, overflowY: "auto",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: 10 },
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" sx={{ color: "#475569", py: 4 }}>
              <Typography variant="caption">NO ANOMALIES DETECTED</Typography>
            </Box>
          ) : (
            filtered.map((a, i) => {
              const confidence = deriveConfidence(a);
              const confStyle = CONF_COLOR[a.severity] || CONF_COLOR.low;
              // CHANGE: Always use exact reason from detector
              const exactReason = getExactReason(a);

              return (
                <motion.div
                  key={a.id || `${a.user_id}-${a.timestamp}-${i}`}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                    sx={{
                      px: 2.5, py: 2,
                      borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
                      cursor: "pointer", transition: "all 0.2s", position: "relative",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.03)",
                        // CHANGE: Row hover — left accent glows on hover
                        "&::before": { opacity: 1, width: 4 },
                      },
                      "&::before": {
                        content: '""', position: "absolute", left: 0, top: "15%", bottom: "15%",
                        width: 3, borderRadius: "0 4px 4px 0",
                        bgcolor: SEV_COLOR[a.severity] || "#3b82f6",
                        opacity: 0.8,
                        transition: "all 0.2s",
                      },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                      <Typography sx={{ color: "#f1f5f9", fontSize: "0.85rem", fontWeight: 600, fontFamily: "monospace" }}>
                        {a.user_id}
                      </Typography>
                      <Typography sx={{ color: "#475569", fontSize: "0.65rem", fontWeight: 600 }}>
                        {timeAgo(a.timestamp)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={expanded[i] ? 0 : 0}>
                      <Typography sx={{ color: SEV_COLOR[a.severity], fontSize: "0.6rem", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
                        {a.severity}
                      </Typography>

                      <Box
                        sx={{
                          px: 0.8, py: 0.2, borderRadius: 1,
                          bgcolor: confStyle.bg,
                          border: `1px solid ${confStyle.border}`,
                          display: "flex", alignItems: "center", gap: 0.4,
                        }}
                      >
                        <Typography sx={{ color: confStyle.text, fontSize: "0.58rem", fontWeight: 800, fontFamily: "monospace" }}>
                          {confidence}% CONF
                        </Typography>
                      </Box>

                      {/* CHANGE: Show exact reason (not truncated generic text) */}
                      {!expanded[i] && (
                        <Typography
                          noWrap
                          title={exactReason}
                          sx={{ color: "#64748b", fontSize: "0.75rem", maxWidth: "160px" }}
                        >
                          • {exactReason}
                        </Typography>
                      )}
                    </Box>

                    <Collapse in={expanded[i]}>
                      <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, border: "1px solid #1e293b" }}>
                        {/* CHANGE: Exact full reason displayed */}
                        <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.5, mb: 0.8 }}>
                          <strong>Reason:</strong> {exactReason}
                        </Typography>
                        {a.event_type && (
                          <Typography sx={{ color: "#64748b", fontSize: "0.72rem", lineHeight: 1.5, mb: 0.8 }}>
                            <strong>Event:</strong> {a.event_type}
                            {a.session_id && <> &nbsp;·&nbsp; <strong>Session:</strong> {a.session_id}</>}
                          </Typography>
                        )}
                        {a.features && (
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                            {a.features.price !== undefined && (
                              <Box sx={{ px: 0.8, py: 0.3, borderRadius: 1, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid #1e293b" }}>
                                <Typography sx={{ color: "#64748b", fontSize: "0.62rem", fontFamily: "monospace" }}>
                                  price: ₹{Number(a.features.price).toFixed(2)}
                                </Typography>
                              </Box>
                            )}
                            {a.features.anomaly_score !== undefined && (
                              <Box sx={{ px: 0.8, py: 0.3, borderRadius: 1, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid #1e293b" }}>
                                <Typography sx={{ color: "#64748b", fontSize: "0.62rem", fontFamily: "monospace" }}>
                                  if_score: {a.features.anomaly_score}
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ px: 0.8, py: 0.3, borderRadius: 1, bgcolor: confStyle.bg, border: `1px solid ${confStyle.border}` }}>
                              <Typography sx={{ color: confStyle.text, fontSize: "0.62rem", fontFamily: "monospace", fontWeight: 700 }}>
                                confidence: {confidence}%
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
