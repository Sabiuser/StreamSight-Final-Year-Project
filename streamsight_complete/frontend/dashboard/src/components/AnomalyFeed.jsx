

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