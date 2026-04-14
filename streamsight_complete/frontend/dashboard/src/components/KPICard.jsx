// import { useEffect, useRef, useState } from "react";
// import { Box, Typography, Tooltip } from "@mui/material";
// import { PeopleAlt, TrendingUp, Undo, Speed } from "@mui/icons-material";
// import { motion } from "framer-motion";

// const CONFIG = {
//   sessions: { label: "Total Sessions",   color: "#00d4aa", bg: "rgba(0,212,170,0.08)",   border: "rgba(0,212,170,0.2)",   Icon: PeopleAlt, cls: "kpi-sessions", spark: "#00d4aa" },
//   cvr:      { label: "Conversion Rate",  color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)",  Icon: TrendingUp, cls: "kpi-cvr",     spark: "#3b82f6" },
//   bounce:   { label: "Bounce Rate",      color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  Icon: Undo,       cls: "kpi-bounce",  spark: "#f59e0b" },
//   users:    { label: "Active Users",     color: "#f43f5e", bg: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.2)",   Icon: Speed,      cls: "kpi-users",   spark: "#f43f5e" },
// };

// function useAnimatedNumber(target, duration = 800) {
//   const [display, setDisplay] = useState(target || 0);
//   const prevRef = useRef(target || 0);
//   const rafRef = useRef(null);
//   useEffect(() => {
//     if (target === undefined || target === null) return;
//     const start = prevRef.current || 0;
//     const end = parseFloat(target);
//     const startTime = performance.now();
//     cancelAnimationFrame(rafRef.current);
//     const tick = (now) => {
//       const progress = Math.min((now - startTime) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setDisplay(start + (end - start) * eased);
//       if (progress < 1) rafRef.current = requestAnimationFrame(tick);
//       else prevRef.current = end;
//     };
//     rafRef.current = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(rafRef.current);
//   }, [target]);
//   return display;
// }

// // Mini sparkline using SVG
// function Sparkline({ data = [], color }) {
//   if (!data.length) return null;
//   const max = Math.max(...data, 1);
//   const min = Math.min(...data, 0);
//   const range = max - min || 1;
//   const w = 80, h = 28;
//   const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
//   return (
//     <svg width={w} height={h} style={{ overflow: "visible" }}>
//       <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} opacity={0.8} />
//       <polyline fill={`${color}20`} stroke="none"
//         points={`0,${h} ${pts} ${w},${h}`} />
//     </svg>
//   );
// }

// export default function KPICard({ value, unit = "", type = "sessions", prev, history = [] }) {
//   const cfg = CONFIG[type];
//   const { Icon } = cfg;
//   const animated = useAnimatedNumber(value);
//   const [popped, setPopped] = useState(false);
//   const isLoading = value === undefined || value === null;

//   useEffect(() => {
//     if (prev !== undefined && value !== undefined && value !== prev) {
//       setPopped(true);
//       const t = setTimeout(() => setPopped(false), 500);
//       return () => clearTimeout(t);
//     }
//   }, [value]);

//   const trend = prev !== undefined && value !== undefined
//     ? value > prev ? "up" : value < prev ? "down" : "flat" : "flat";
//   const trendPct = prev && prev !== 0 ? Math.abs(((value - prev) / prev) * 100).toFixed(1) : null;

//   return (
//     <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ height: "100%" }}>
//       <Box className={`glow-card ${cfg.cls}`} sx={{ p: 3, height: "100%", cursor: "default" }}>
//         {/* Top row */}
//         <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
//           <Box>
//             <Typography className="section-label">{cfg.label}</Typography>
//           </Box>
//           <Box sx={{
//             width: 42, height: 42, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
//             background: cfg.bg, border: `1px solid ${cfg.border}`,
//             transition: "all 0.3s", "&:hover": { transform: "rotate(10deg) scale(1.1)" }
//           }}>
//             <Icon sx={{ fontSize: 20, color: cfg.color }} />
//           </Box>
//         </Box>

//         {/* Value */}
//         <Box display="flex" alignItems="baseline" gap={0.5} mb={1.5}>
//           {isLoading ? <div className="shimmer" /> : (
//             <Typography className={`mono ${popped ? "number-pop" : ""}`}
//               sx={{ fontSize: "2.4rem", fontWeight: 800, color: cfg.color, lineHeight: 1, letterSpacing: "-1px" }}>
//               {unit === "%" ? animated.toFixed(1) : Math.round(animated).toLocaleString()}
//             </Typography>
//           )}
//           {unit && !isLoading && (
//             <Typography sx={{ color: "#64748b", fontSize: "1.1rem", fontFamily: "'JetBrains Mono',monospace" }}>{unit}</Typography>
//           )}
//         </Box>

//         {/* Progress bar */}
//         <Box sx={{ height: 4, borderRadius: 2, background: `${cfg.color}15`, mb: 2, overflow: "hidden" }}>
//           <Box className="funnel-bar" sx={{
//             height: "100%", borderRadius: 2,
//             width: `${Math.min(((value || 0) / (type === "sessions" ? 100 : type === "users" ? 60 : 100)) * 100, 100)}%`,
//             background: `linear-gradient(90deg, ${cfg.color}60, ${cfg.color})`,
//           }} />
//         </Box>

//         {/* Bottom row: trend + sparkline */}
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Box>
//             {trend !== "flat" && trendPct ? (
//               <Box sx={{
//                 display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.5, py: 0.5, borderRadius: "8px",
//                 background: trend === "up" ? "rgba(0,212,170,0.1)" : "rgba(244,63,94,0.1)",
//                 border: `1px solid ${trend === "up" ? "rgba(0,212,170,0.25)" : "rgba(244,63,94,0.25)"}`,
//               }}>
//                 <Typography sx={{ color: trend === "up" ? "#00d4aa" : "#f43f5e", fontSize: "0.7rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
//                   {trend === "up" ? "▲" : "▼"} {trendPct}%
//                 </Typography>
//               </Box>
//             ) : (
//               <Typography sx={{ color: "#475569", fontSize: "0.7rem", fontFamily: "'JetBrains Mono',monospace" }}>— stable</Typography>
//             )}
//           </Box>
//           <Sparkline data={history.length ? history : [value || 0]} color={cfg.spark} />
//         </Box>
//       </Box>
//     </motion.div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { PeopleAlt, TrendingUp, Undo, Speed } from "@mui/icons-material";
import { motion } from "framer-motion";

const CONFIG = {
  sessions: { label: "TOTAL SESSIONS", color: "#00d4aa", Icon: PeopleAlt },
  cvr: { label: "CONVERSION RATE", color: "#3b82f6", Icon: TrendingUp },
  bounce: { label: "BOUNCE RATE", color: "#f59e0b", Icon: Undo },
  users: { label: "ACTIVE USERS", color: "#f43f5e", Icon: Speed },
};

function useAnimatedNumber(target, duration = 800) {
  const [display, setDisplay] = useState(target || 0);
  const prevRef = useRef(target || 0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === undefined || target === null) return;
    const start = prevRef.current || 0;
    const end = parseFloat(target);
    const startTime = performance.now();
    cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return display;
}

function MiniSparkline({ data = [], color }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100,
    h = 30;
  const pts = data
    .map(
      (v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`,
    )
    .join(" ");

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{
        overflow: "visible",
        filter: `drop-shadow(0 2px 4px ${color}30)`,
      }}
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill={`url(#grad-${color})`}
        stroke="none"
        points={`0,${h} ${pts} ${w},${h}`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

export default function KPICard({
  value,
  unit = "",
  type = "sessions",
  prev,
  history = [],
}) {
  const cfg = CONFIG[type];
  const { Icon } = cfg;
  const animated = useAnimatedNumber(value);
  const isLoading = value === undefined || value === null;

  const trend =
    prev !== undefined && value !== undefined
      ? value > prev
        ? "up"
        : value < prev
          ? "down"
          : "flat"
      : "flat";
  const trendPct =
    prev && prev !== 0
      ? Math.abs(((value - prev) / prev) * 100).toFixed(1)
      : null;

  return (
    <motion.div whileHover={{ y: -5 }} style={{ height: "100%" }}>
      <Box
        sx={{
          p: 2.5,
          height: "100%",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s ease",
          "&:hover": { borderColor: `${cfg.color}40` },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 800,
              color: "#94a3b8",
              letterSpacing: "0.1em",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {cfg.label}
          </Typography>
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              background: `${cfg.color}15`,
              color: cfg.color,
              display: "flex",
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        {/* Value Area */}
        <Box sx={{ my: 1 }}>
          <Box display="flex" alignItems="baseline" gap={0.5}>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#f8fafc",
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
              }}
            >
              {unit === "%"
                ? animated.toFixed(1)
                : Math.round(animated).toLocaleString()}
              <span
                style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  marginLeft: "2px",
                }}
              >
                {unit}
              </span>
            </Typography>
          </Box>

          {/* Trend Tag */}
          <Box mt={1}>
            {trend !== "flat" ? (
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: trend === "up" ? "#00d4aa" : "#f43f5e",
                  fontFamily: "'JetBrains Mono', monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {trend === "up" ? "↑" : "↓"} {trendPct}%
                <span style={{ color: "#475569", fontWeight: 400 }}>
                  vs prev
                </span>
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: "#475569",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                STABLE
              </Typography>
            )}
          </Box>
        </Box>

        {/* Footer Sparkline */}
        <Box sx={{ mt: 2, mx: -2.5, mb: -2.5, height: 40, opacity: 0.6 }}>
          <MiniSparkline
            data={history.length ? history : [value, value, value]}
            color={cfg.color}
          />
        </Box>
      </Box>
    </motion.div>
  );
}
