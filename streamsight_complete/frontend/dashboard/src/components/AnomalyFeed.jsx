



// import { useState, useEffect, useRef } from "react";
// import { Box, Typography, Chip, TextField, InputAdornment, Select, MenuItem, Collapse } from "@mui/material";
// import { Search, ExpandMore, ExpandLess } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { playAlertSound } from "../utils/alertSound";

// const SEV_COLOR = { high:"#f43f5e", medium:"#f59e0b", low:"#3b82f6" };
// const SEV_BG    = { high:"rgba(244,63,94,0.08)", medium:"rgba(245,158,11,0.08)", low:"rgba(59,130,246,0.08)" };

// function timeAgo(ts) {
//   if (!ts) return "";
//   const s = Math.floor((Date.now() - new Date(ts)) / 1000);
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s/60)}m ago`;
//   return `${Math.floor(s/3600)}h ago`;
// }

// export default function AnomalyFeed({ anomalies = [] }) {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [expanded, setExpanded] = useState({});
//   const prevHighCount = useRef(0);

//   // Play alert sound on new HIGH anomalies
//   useEffect(() => {
//     const highCount = anomalies.filter(a => a.severity === "high").length;
//     if (highCount > prevHighCount.current) {
//       playAlertSound("high");
//     }
//     prevHighCount.current = highCount;
//   }, [anomalies]);

//   const filtered = anomalies.filter(a => {
//     const matchSev = filter === "all" || a.severity === filter;
//     const q = search.toLowerCase();
//     const matchSearch = !q
//       || (a.user_id||"").toLowerCase().includes(q)
//       || (a.reason||"").toLowerCase().includes(q)
//       || (a.severity||"").toLowerCase().includes(q);
//     return matchSev && matchSearch;
//   });

//   const highCount = anomalies.filter(a => a.severity === "high").length;

//   return (
//     <Box sx={{
//       background:"#0d1117", border:"1px solid #1e293b", borderRadius:3,
//       height:"100%", display:"flex", flexDirection:"column", overflow:"hidden"
//     }}>
//       {/* Header */}
//       <Box sx={{ px:2.5, py:2, borderBottom:"1px solid #1e293b" }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
//           <Box>
//             <Typography sx={{ color:"#475569",fontSize:"0.65rem",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:700 }}>
//               Anomaly Feed
//             </Typography>
//             <Typography sx={{ color:"#e2e8f0",fontWeight:700,fontSize:"0.9rem",mt:0.2 }}>ML Detection Active</Typography>
//           </Box>
//           <Box display="flex" gap={1}>
//             {highCount > 0 && (
//               <Chip label={`${highCount} HIGH`} size="small"
//                 sx={{ background:"rgba(244,63,94,0.15)",color:"#f43f5e",border:"1px solid rgba(244,63,94,0.3)",
//                   fontSize:"0.65rem",height:20,fontWeight:700,animation:"glowPulse 2s ease-in-out infinite" }} />
//             )}
//             <Chip label={`${anomalies.length} total`} size="small"
//               sx={{ background:"#111827",color:"#64748b",border:"1px solid #1e293b",fontSize:"0.65rem",height:20 }} />
//           </Box>
//         </Box>

//         {/* Search */}
//         <TextField
//           size="small" fullWidth placeholder="Search user, reason..."
//           value={search} onChange={e => setSearch(e.target.value)}
//           InputProps={{
//             startAdornment: <InputAdornment position="start"><Search sx={{ fontSize:16,color:"#334155" }} /></InputAdornment>,
//             sx: { fontSize:"0.8rem",background:"#111827",borderRadius:1.5,
//               "& fieldset":{borderColor:"#1e293b"},"&:hover fieldset":{borderColor:"#334155"},
//               "& .MuiInputBase-input":{color:"#94a3b8","&::placeholder":{color:"#334155"}} }
//           }}
//           sx={{ mb:1 }}
//         />

//         {/* Severity filter */}
//         <Box display="flex" gap={0.8} flexWrap="wrap">
//           {["all","high","medium","low"].map(sev => (
//             <Chip key={sev} label={sev.toUpperCase()} size="small" onClick={() => setFilter(sev)}
//               sx={{
//                 cursor:"pointer", fontSize:"0.6rem", height:18,fontWeight:700,
//                 background: filter===sev ? (SEV_BG[sev]||"rgba(0,212,170,0.1)") : "transparent",
//                 color: filter===sev ? (SEV_COLOR[sev]||"#00d4aa") : "#334155",
//                 border:`1px solid ${filter===sev ? (SEV_COLOR[sev]||"#00d4aa")+"50" : "#1e293b"}`,
//               }} />
//           ))}
//         </Box>
//       </Box>

//       {/* List */}
//       <Box sx={{ flex:1, overflowY:"auto", "&::-webkit-scrollbar":{width:4},"&::-webkit-scrollbar-thumb":{background:"#1e293b",borderRadius:2} }}>
//         {filtered.length === 0 ? (
//           <Box display="flex" alignItems="center" justifyContent="center" height="100%" sx={{ color:"#334155",fontSize:"0.8rem",fontFamily:"'JetBrains Mono',monospace" }}>
//             {search||filter!=="all" ? "No matches found" : "No anomalies yet..."}
//           </Box>
//         ) : (
//           <AnimatePresence>
//             {filtered.map((a, i) => {
//               const c = SEV_COLOR[a.severity] || "#3b82f6";
//               const bg = SEV_BG[a.severity] || "rgba(59,130,246,0.06)";
//               const isOpen = expanded[i];
//               return (
//                 <motion.div key={i} initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.03 }}>
//                   <Box
//                     onClick={() => setExpanded(prev => ({ ...prev, [i]:!prev[i] }))}
//                     sx={{ px:2.5,py:1.5,borderBottom:"1px solid #111827",cursor:"pointer",
//                       "&:hover":{ background:bg }, transition:"background 0.2s" }}>
//                     <Box display="flex" alignItems="flex-start" gap={1.5}>
//                       <Box sx={{ width:7,height:7,borderRadius:"50%",background:c,mt:0.6,flexShrink:0,
//                         ...(a.severity==="high" ? { boxShadow:`0 0 6px ${c}`,animation:"glowPulse 2s infinite" } : {}) }} />
//                       <Box flex={1} minWidth={0}>
//                         <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.3}>
//                           <Box display="flex" alignItems="center" gap={0.8}>
//                             <Typography sx={{ color:c,fontSize:"0.7rem",fontWeight:800,fontFamily:"'JetBrains Mono',monospace" }}>
//                               {a.severity?.toUpperCase()}
//                             </Typography>
//                             <Typography sx={{ color:"#e2e8f0",fontSize:"0.78rem",fontWeight:600 }}>
//                               {a.user_id}
//                             </Typography>
//                           </Box>
//                           <Box display="flex" alignItems="center" gap={0.5}>
//                             <Typography sx={{ color:"#334155",fontSize:"0.65rem",fontFamily:"'JetBrains Mono',monospace" }}>
//                               {timeAgo(a.timestamp)}
//                             </Typography>
//                             {isOpen ? <ExpandLess sx={{ fontSize:14,color:"#334155" }} /> : <ExpandMore sx={{ fontSize:14,color:"#334155" }} />}
//                           </Box>
//                         </Box>
//                         <Typography sx={{ color:"#64748b",fontSize:"0.75rem",lineHeight:1.4 }}>
//                           {a.reason}
//                         </Typography>
//                         <Typography sx={{ color:"#1e293b",fontSize:"0.65rem",fontFamily:"'JetBrains Mono',monospace",mt:0.3 }}>
//                           {a.event_type} · click to expand
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {/* Expanded details */}
//                     <Collapse in={isOpen}>
//                       <Box sx={{ mt:1.5,ml:2.5,p:1.5,borderRadius:1.5,background:"#111827",border:"1px solid #1e293b" }}>
//                         {[
//                           ["User",    a.user_id],
//                           ["Event",   a.event_type],
//                           ["Severity",a.severity?.toUpperCase()],
//                           ["Price",   a.features?.price ? `₹${a.features.price}` : "—"],
//                           ["Score",   a.features?.anomaly_score?.toFixed(3) || "—"],
//                         ].map(([k,v]) => (
//                           <Box key={k} display="flex" justifyContent="space-between" mb={0.4}>
//                             <Typography sx={{ color:"#475569",fontSize:"0.68rem",fontFamily:"'JetBrains Mono',monospace" }}>{k}</Typography>
//                             <Typography sx={{ color:"#94a3b8",fontSize:"0.68rem",fontFamily:"'JetBrains Mono',monospace" }}>{v}</Typography>
//                           </Box>
//                         ))}
//                       </Box>
//                     </Collapse>
//                   </Box>
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         )}
//       </Box>
//     </Box>
//   );
// }





import { useState, useEffect, useRef } from "react";
import { Box, Typography, Chip, TextField, InputAdornment, Collapse, IconButton } from "@mui/material";
import { Search, ErrorOutline, FiberManualRecord } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { playAlertSound } from "../utils/alertSound";

// Enhanced color palette for a "Cybersecurity" look
const SEV_COLOR = { high: "#ff4d4d", medium: "#fbbf24", low: "#60a5fa" };
const SEV_BG = { high: "rgba(255, 77, 77, 0.1)", medium: "rgba(251, 191, 36, 0.1)", low: "rgba(96, 165, 250, 0.1)" };

function timeAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

export default function AnomalyFeed({ anomalies = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});
  const prevHighCount = useRef(0);

  useEffect(() => {
    const highCount = anomalies.filter(a => a.severity === "high").length;
    if (highCount > prevHighCount.current) {
      playAlertSound("high");
    }
    prevHighCount.current = highCount;
  }, [anomalies]);

  const filtered = anomalies.filter(a => {
    const matchSev = filter === "all" || a.severity === filter;
    const q = search.toLowerCase();
    return matchSev && (!q || 
      (a.user_id || "").toLowerCase().includes(q) || 
      (a.reason || "").toLowerCase().includes(q));
  });

  const highCount = anomalies.filter(a => a.severity === "high").length;

  return (
    <Box sx={{
      background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
      border: "1px solid #1e293b",
      borderRadius: 4,
      height: "100%",
      maxHeight: "85vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
    }}>
      
      {/* Header Section */}
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
            <Typography sx={{ color: "#f8fafc", fontWeight: 700, fontSize: "1.1rem", mt: 0.5 }}>
              Anomaly Feed
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            {highCount > 0 && (
              <Chip 
                icon={<ErrorOutline style={{ fontSize: 14, color: 'inherit' }} />}
                label={highCount} 
                size="small" 
                sx={{ bgcolor: "#ef4444", color: "#fff", fontWeight: 700, height: 24 }} 
              />
            )}
          </Box>
        </Box>

        {/* Improved Search Bar */}
        <TextField
          size="small"
          fullWidth
          placeholder="Filter logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "#475569" }} /></InputAdornment>,
            sx: {
              bgcolor: "rgba(15, 23, 42, 0.6)",
              borderRadius: 2,
              fontSize: "0.85rem",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#475569" },
              color: "#e2e8f0"
            }
          }}
          sx={{ mb: 2 }}
        />

        {/* Severity Toggles */}
        <Box display="flex" gap={1}>
          {["all", "high", "medium", "low"].map(sev => (
            <Box
              key={sev}
              onClick={() => setFilter(sev)}
              sx={{
                px: 1.5, py: 0.5, borderRadius: 1.5, cursor: "pointer", fontSize: "0.65rem", fontWeight: 700,
                transition: "0.2s",
                textTransform: "uppercase",
                border: "1px solid",
                borderColor: filter === sev ? (SEV_COLOR[sev] || "#38bdf8") : "#1e293b",
                bgcolor: filter === sev ? (SEV_BG[sev] || "rgba(56, 189, 248, 0.1)") : "transparent",
                color: filter === sev ? (SEV_COLOR[sev] || "#38bdf8") : "#64748b",
                "&:hover": { borderColor: "#475569" }
              }}
            >
              {sev}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Feed List */}
      <Box sx={{
        flex: 1, overflowY: "auto",
        "&::-webkit-scrollbar": { width: 5 },
        "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: 10 }
      }}>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" sx={{ color: "#475569", py: 4 }}>
              <Typography variant="caption">NO ANOMALIES DETECTED</Typography>
            </Box>
          ) : (
            filtered.map((a, i) => (
              <motion.div
                key={a.id || i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                  sx={{
                    px: 2.5, py: 2,
                    borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
                    cursor: "pointer",
                    transition: "0.2s",
                    position: "relative",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                    "&::before": { // Subtle indicator strip
                      content: '""', position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3,
                      borderRadius: "0 4px 4px 0",
                      bgcolor: SEV_COLOR[a.severity] || "#3b82f6",
                      opacity: 0.8
                    }
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

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{ 
                      color: SEV_COLOR[a.severity], 
                      fontSize: "0.6rem", 
                      fontWeight: 800, 
                      letterSpacing: 1,
                      textTransform: "uppercase" 
                    }}>
                      {a.severity}
                    </Typography>
                    {!expanded[i] && (
                       <Typography noWrap sx={{ color: "#64748b", fontSize: "0.75rem", maxWidth: "200px" }}>
                        • {a.reason}
                       </Typography>
                    )}
                  </Box>

                  <Collapse in={expanded[i]}>
                    <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, border: "1px solid #1e293b" }}>
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.5 }}>
                        <strong>Reason:</strong> {a.reason}
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}