// import { useState } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   ToggleButton,
//   ToggleButtonGroup,
//   CircularProgress,
//   Alert,
//   Chip,
//   Divider,
// } from "@mui/material";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// import { AnalyticsOutlined, CheckCircleOutline } from "@mui/icons-material";
// import { useMetrics } from "../hooks/useMetrics";

// const COLORS = [
//   "#00d4aa",
//   "#3b82f6",
//   "#f59e0b",
//   "#f43f5e",
//   "#a855f7",
//   "#10b981",
// ];
// const PRODUCT_COLORS = [
//   "#00d4aa",
//   "#3b82f6",
//   "#a855f7",
//   "#f59e0b",
//   "#ef4444",
//   "#06b6d4",
//   "#10b981",
//   "#f97316",
//   "#8b5cf6",
//   "#ec4899",
//   "#14b8a6",
//   "#6366f1",
// ];

// function formatTime(ts) {
//   if (!ts) return "";
//   return new Date(ts).toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });
// }

// const ChartTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <Box
//       sx={{
//         background: "rgba(13,17,23,0.97)",
//         border: "1px solid #1e293b",
//         borderRadius: 1.5,
//         p: 1.5,
//         backdropFilter: "blur(4px)",
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#64748b",
//           fontSize: "0.65rem",
//           fontWeight: 700,
//           mb: 1,
//           borderBottom: "1px solid #1e293b",
//           pb: 0.5,
//         }}
//       >
//         {label}
//       </Typography>
//       {payload.map((p, i) => (
//         <Box key={i} display="flex" alignItems="center" gap={1.5} mt={0.5}>
//           <div
//             style={{
//               width: 8,
//               height: 8,
//               borderRadius: "50%",
//               background: p.color,
//             }}
//           />
//           <Typography
//             sx={{
//               color: "#f1f5f9",
//               fontSize: "0.75rem",
//               fontFamily: "'JetBrains Mono',monospace",
//               fontWeight: 600,
//             }}
//           >
//             {p.name}:{" "}
//             <span style={{ color: p.color }}>
//               {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
//             </span>
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// const axisStyle = {
//   fill: "#64748b",
//   fontSize: 9,
//   fontFamily: "JetBrains Mono",
//   fontWeight: 500,
// };

// function ChartCard({
//   title,
//   subtitle,
//   badge,
//   badgeColor = "#3b82f6",
//   children,
//   height = 280,
// }) {
//   return (
//     <Box
//       sx={{
//         background: "#0f172a",
//         border: "1px solid rgba(255,255,255,0.06)",
//         borderRadius: 2,
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         "&:hover": { borderColor: "rgba(255,255,255,0.12)" },
//       }}
//     >
//       <Box
//         sx={{
//           p: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box>
//           <Typography
//             sx={{
//               color: "#f8fafc",
//               fontSize: "0.85rem",
//               fontWeight: 700,
//               letterSpacing: "0.02em",
//             }}
//           >
//             {title}
//           </Typography>
//           {subtitle && (
//             <Typography
//               sx={{
//                 color: "#475569",
//                 fontSize: "0.65rem",
//                 fontFamily: "'JetBrains Mono',monospace",
//               }}
//             >
//               {subtitle}
//             </Typography>
//           )}
//         </Box>
//         {badge && (
//           <Box
//             sx={{
//               px: 1,
//               py: 0.2,
//               borderRadius: 1,
//               fontSize: "0.6rem",
//               fontWeight: 800,
//               background: `${badgeColor}10`,
//               color: badgeColor,
//               border: `1px solid ${badgeColor}30`,
//               fontFamily: "'JetBrains Mono'",
//             }}
//           >
//             {badge}
//           </Box>
//         )}
//       </Box>
//       <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />
//       <Box sx={{ p: 2, flex: 1, minHeight: height }}>{children}</Box>
//     </Box>
//   );
// }

// // User Activity Heatmap — shows which hours have most activity
// function ActivityHeatmap({ history }) {
//   // Aggregate events by hour of day
//   const hourCounts = Array(24).fill(0);
//   history.forEach((m) => {
//     if (!m.window_start) return;
//     const h = new Date(m.window_start).getHours();
//     hourCounts[h] += m.session_count || 0;
//   });
//   const maxVal = Math.max(...hourCounts, 1);

//   return (
//     <Box>
//       <Typography
//         sx={{
//           color: "#64748b",
//           fontSize: "0.65rem",
//           fontFamily: "'JetBrains Mono',monospace",
//           mb: 1.5,
//         }}
//       >
//         Session density by hour of day (24h clock)
//       </Typography>
//       <Box display="flex" gap={0.4} flexWrap="wrap">
//         {hourCounts.map((count, h) => {
//           const intensity = count / maxVal;
//           const bg =
//             intensity > 0.8
//               ? "#00d4aa"
//               : intensity > 0.6
//                 ? "#00d4aa99"
//                 : intensity > 0.4
//                   ? "#00d4aa55"
//                   : intensity > 0.2
//                     ? "#00d4aa22"
//                     : "#1e293b";
//           return (
//             <Box
//               key={h}
//               title={`${h}:00 — ${count} sessions`}
//               sx={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: 1,
//                 background: bg,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "default",
//                 transition: "transform 0.15s",
//                 "&:hover": { transform: "scale(1.2)", zIndex: 1 },
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: "0.55rem",
//                   color: intensity > 0.4 ? "#07090f" : "#334155",
//                   fontFamily: "'JetBrains Mono',monospace",
//                   fontWeight: 700,
//                 }}
//               >
//                 {h}
//               </Typography>
//             </Box>
//           );
//         })}
//       </Box>
//       <Box display="flex" gap={2} mt={1.5} flexWrap="wrap">
//         {[
//           ["Low", 0.2],
//           ["Medium", 0.5],
//           ["High", 0.8],
//           ["Peak", 1.0],
//         ].map(([label, intensity]) => (
//           <Box key={label} display="flex" alignItems="center" gap={0.6}>
//             <Box
//               sx={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: 0.5,
//                 background:
//                   intensity > 0.8
//                     ? "#00d4aa"
//                     : intensity > 0.5
//                       ? "#00d4aa99"
//                       : intensity > 0.2
//                         ? "#00d4aa55"
//                         : "#1e293b",
//               }}
//             />
//             <Typography sx={{ fontSize: "0.62rem", color: "#64748b" }}>
//               {label}
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// }

// // Product-wise sales chart (simulated from purchase breakdown)
// const PRODUCTS = [
//   "AirPods Pro",
//   "MacBook M3",
//   "Nike Jordan",
//   "Sony WH-1000",
//   "Levi Jeans",
//   "iPad Pro",
//   "Atomic Habits",
//   "Samsung 4K",
//   "Yoga Mat",
//   "Adidas Ultra",
//   "KitchenAid",
//   "Dyson V15",
// ];

// function getProductData(history) {
//   // Simulate product breakdown from purchase count
//   const total = history.reduce((s, m) => s + (m.funnel?.purchase || 0), 0);
//   if (total === 0)
//     return PRODUCTS.map((name) => ({ name, sales: 0, revenue: 0 }));
//   // Distribute realistically
//   const weights = [
//     0.18, 0.15, 0.12, 0.11, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02,
//   ];
//   return PRODUCTS.map((name, i) => ({
//     name: name.length > 10 ? name.slice(0, 10) + "…" : name,
//     sales: Math.round(total * weights[i]),
//     revenue: Math.round(
//       total *
//         weights[i] *
//         [549, 1299, 180, 349, 89, 1099, 16, 599, 79, 190, 399, 749][i],
//     ),
//   }));
// }

// export default function Analytics() {
//   const [range, setRange] = useState("1h");
//   const { history, loading, error } = useMetrics(range);

//   const cvrData = history.map((m) => ({
//     time: formatTime(m.window_start),
//     cvr: parseFloat((m.cvr || 0).toFixed(2)),
//     bounce: parseFloat((m.bounce_rate || 0).toFixed(2)),
//   }));
//   const sessionData = history.slice(-30).map((m) => ({
//     time: formatTime(m.window_start),
//     sessions: m.session_count || 0,
//     users: m.active_users || 0,
//   }));
//   const eventTypes = ["page_view", "add_to_cart", "checkout", "purchase"];
//   const eventBarData = eventTypes.map((et) => ({
//     name: et.split("_").join(" ").toUpperCase(),
//     count: history.reduce((s, m) => s + (m.event_breakdown?.[et] || 0), 0),
//   }));
//   const productData = getProductData(history);

//   return (
//     <Box sx={{ p: 3, background: "#020617", minHeight: "100vh" }}>
//       {/* Header */}
//       <Box
//         sx={{
//           mb: 4,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//         }}
//       >
//         <Box>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <AnalyticsOutlined sx={{ color: "#3b82f6", fontSize: 20 }} />
//             <Typography
//               sx={{
//                 color: "#64748b",
//                 fontSize: "0.75rem",
//                 fontWeight: 600,
//                 letterSpacing: "0.1em",
//               }}
//             >
//               CLOUD_MONITOR / SHOPSTREAM
//             </Typography>
//           </Box>
//           <Typography
//             variant="h4"
//             sx={{ color: "#f8fafc", fontWeight: 800, fontSize: "1.75rem" }}
//           >
//             Performance Analytics
//           </Typography>
//         </Box>
//         <Box display="flex" gap={2} alignItems="center">
//           <Box
//             display="flex"
//             alignItems="center"
//             gap={1}
//             sx={{
//               px: 2,
//               py: 1,
//               borderRadius: 2,
//               border: "1px solid rgba(16,185,129,0.2)",
//               background: "rgba(16,185,129,0.05)",
//             }}
//           >
//             <CheckCircleOutline sx={{ color: "#10b981", fontSize: 16 }} />
//             <Typography
//               sx={{
//                 color: "#10b981",
//                 fontSize: "0.75rem",
//                 fontWeight: 700,
//                 fontFamily: "'JetBrains Mono'",
//               }}
//             >
//               SYSTEM_HEALTH: NOMINAL
//             </Typography>
//           </Box>
//           <ToggleButtonGroup
//             value={range}
//             exclusive
//             onChange={(_, v) => v && setRange(v)}
//             sx={{
//               background: "#1e293b",
//               "& .MuiToggleButton-root": {
//                 color: "#94a3b8",
//                 border: "none",
//                 px: 2,
//                 "&.Mui-selected": { color: "#fff", background: "#334155" },
//               },
//             }}
//           >
//             {["1h", "6h", "24h"].map((r) => (
//               <ToggleButton key={r} value={r} size="small">
//                 {r}
//               </ToggleButton>
//             ))}
//           </ToggleButtonGroup>
//         </Box>
//       </Box>

//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
//           <CircularProgress size={30} sx={{ color: "#3b82f6" }} />
//         </Box>
//       )}

//       {!loading && !error && (
//         <Grid container spacing={2}>
//           {/* Session area chart */}
//           <Grid item xs={12} lg={9}>
//             <ChartCard
//               title="Session Density & Active Users"
//               subtitle={`Stream data: last ${range}`}
//               badge="LIVE_REPLAY"
//             >
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart key={`area-${range}`} data={sessionData} syncId="ss">
//                   <defs>
//                     <linearGradient id="gSess" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="rgba(255,255,255,0.05)"
//                     vertical={false}
//                   />
//                   <XAxis
//                     dataKey="time"
//                     tick={axisStyle}
//                     stroke="transparent"
//                     minTickGap={30}
//                   />
//                   <YAxis tick={axisStyle} stroke="transparent" />
//                   <Tooltip
//                     content={<ChartTooltip />}
//                     cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
//                   />
//                   <Area
//                     type="stepAfter"
//                     dataKey="sessions"
//                     stroke="#3b82f6"
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#gSess)"
//                     name="Total Sessions"
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="users"
//                     stroke="#00d4aa"
//                     strokeWidth={2}
//                     fill="transparent"
//                     name="Active Users"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Grid>

//           {/* Event donut */}
//           <Grid item xs={12} lg={3}>
//             <ChartCard title="Global Event Load" badge="KAFKA" height={300}>
//               <Box
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                 }}
//               >
//                 <ResponsiveContainer width="100%" height={180}>
//                   <PieChart key={`pie-${range}`}>
//                     <Pie
//                       data={eventBarData}
//                       dataKey="count"
//                       innerRadius={55}
//                       outerRadius={75}
//                       paddingAngle={5}
//                       animationBegin={0}
//                       animationDuration={800}
//                     >
//                       {eventBarData.map((_, i) => (
//                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<ChartTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <Box sx={{ mt: 2 }}>
//                   {eventBarData.map((entry, i) => (
//                     <Box
//                       key={i}
//                       display="flex"
//                       justifyContent="space-between"
//                       mb={0.5}
//                     >
//                       <Typography
//                         sx={{
//                           color: "#94a3b8",
//                           fontSize: "0.65rem",
//                           fontWeight: 600,
//                         }}
//                       >
//                         {entry.name}
//                       </Typography>
//                       <Typography
//                         sx={{
//                           color: "#f8fafc",
//                           fontSize: "0.65rem",
//                           fontFamily: "'JetBrains Mono'",
//                         }}
//                       >
//                         {entry.count.toLocaleString()}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>
//             </ChartCard>
//           </Grid>

//           {/* CVR + Bounce bar chart */}
//           <Grid item xs={12}>
//             <ChartCard
//               title="Yield & Conversion Ratios"
//               subtitle={`Historical Analysis (${range})`}
//               badge="AGGREGATOR_v2"
//             >
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart
//                   key={`bar-${range}`}
//                   data={cvrData}
//                   barGap={8}
//                   syncId="ss"
//                 >
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="rgba(255,255,255,0.05)"
//                     vertical={false}
//                   />
//                   <XAxis dataKey="time" tick={axisStyle} stroke="transparent" />
//                   <YAxis tick={axisStyle} stroke="transparent" />
//                   <Tooltip
//                     content={<ChartTooltip />}
//                     cursor={{ fill: "rgba(255,255,255,0.05)" }}
//                   />
//                   <Legend
//                     iconType="circle"
//                     wrapperStyle={{
//                       paddingTop: 10,
//                       fontSize: 10,
//                       fontFamily: "JetBrains Mono",
//                     }}
//                   />
//                   <Bar
//                     dataKey="cvr"
//                     fill="#00d4aa"
//                     radius={[4, 4, 0, 0]}
//                     name="Conversion Rate %"
//                     isAnimationActive
//                     animationDuration={1000}
//                   />
//                   <Bar
//                     dataKey="bounce"
//                     fill="#f43f5e"
//                     radius={[4, 4, 0, 0]}
//                     name="Bounce Rate %"
//                     isAnimationActive
//                     animationDuration={1200}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Grid>

//           {/* Product-wise Sales Chart */}
//           <Grid item xs={12} lg={8}>
//             <ChartCard
//               title="Product-wise Sales"
//               subtitle="Based on purchase events per product"
//               badge="NEW"
//               badgeColor="#00d4aa"
//               height={280}
//             >
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart
//                   data={productData}
//                   layout="vertical"
//                   margin={{ left: 10, right: 20 }}
//                 >
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="rgba(255,255,255,0.05)"
//                     horizontal={false}
//                   />
//                   <XAxis type="number" tick={axisStyle} stroke="transparent" />
//                   <YAxis
//                     type="category"
//                     dataKey="name"
//                     tick={{
//                       fill: "#94a3b8",
//                       fontSize: 9,
//                       fontFamily: "JetBrains Mono",
//                     }}
//                     stroke="transparent"
//                     width={80}
//                   />
//                   <Tooltip
//                     content={<ChartTooltip />}
//                     cursor={{ fill: "rgba(255,255,255,0.05)" }}
//                   />
//                   <Bar
//                     dataKey="sales"
//                     name="Units Sold"
//                     radius={[0, 4, 4, 0]}
//                     isAnimationActive
//                     animationDuration={1200}
//                   >
//                     {productData.map((_, i) => (
//                       <Cell
//                         key={i}
//                         fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]}
//                         fillOpacity={0.85}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Grid>

//           {/* User Activity Heatmap */}
//           <Grid item xs={12} lg={4}>
//             <ChartCard
//               title="User Activity Heatmap"
//               subtitle="Sessions by hour of day"
//               badge="NEW"
//               badgeColor="#a855f7"
//               height={280}
//             >
//               <Box sx={{ pt: 1 }}>
//                 <ActivityHeatmap history={history} />
//               </Box>
//             </ChartCard>
//           </Grid>
//         </Grid>
//       )}
//     </Box>
//   );
// }
import { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { AnalyticsOutlined, CheckCircleOutline, TrendingUp, TrendingDown, Remove } from "@mui/icons-material";
import { useMetrics } from "../hooks/useMetrics";

const COLORS = ["#00d4aa", "#3b82f6", "#f59e0b", "#f43f5e", "#a855f7", "#10b981"];
const PRODUCT_COLORS = [
  "#00d4aa", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4",
  "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1",
];

const RANGE_CONFIG = {
  "1h":  { maxPoints: 30, bucketMs: 2 * 60 * 1000,       label: "Last 1 hour",   tickFormat: "HH:mm:ss" },
  "6h":  { maxPoints: 36, bucketMs: 10 * 60 * 1000,      label: "Last 6 hours",  tickFormat: "HH:mm" },
  "24h": { maxPoints: 48, bucketMs: 30 * 60 * 1000,      label: "Last 24 hours", tickFormat: "HH:mm" },
};

function formatTime(ts, range) {
  if (!ts) return "";
  const d = new Date(ts);
  if (range === "1h") {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}


function bucketHistory(history, range) {
  const { maxPoints, bucketMs } = RANGE_CONFIG[range] ?? RANGE_CONFIG["1h"];
  if (!history.length) return [];


  const now = Date.now();
  const totalMs = maxPoints * bucketMs;
  const start = now - totalMs;

  const buckets = Array.from({ length: maxPoints }, (_, i) => ({
    window_start: start + i * bucketMs,
    session_count: 0,
    active_users: 0,
    cvr: 0,
    bounce_rate: 0,
    event_breakdown: { page_view: 0, add_to_cart: 0, checkout: 0, purchase: 0 },
    funnel: { purchase: 0 },
    _count: 0,
  }));

  history.forEach((m) => {
    const ts = m.window_start ? new Date(m.window_start).getTime() : null;
    if (!ts || ts < start) return;
    const idx = Math.min(Math.floor((ts - start) / bucketMs), maxPoints - 1);
    const b = buckets[idx];
    b.session_count += m.session_count || 0;
    b.active_users  += m.active_users  || 0;
    b.cvr           += m.cvr           || 0;
    b.bounce_rate   += m.bounce_rate   || 0;
    b.funnel.purchase += m.funnel?.purchase || 0;
    const eb = m.event_breakdown || {};
    Object.keys(b.event_breakdown).forEach((k) => { b.event_breakdown[k] += eb[k] || 0; });
    b._count++;
  });

 
  buckets.forEach((b) => {
    if (b._count > 1) {
      b.cvr         = b.cvr         / b._count;
      b.bounce_rate = b.bounce_rate / b._count;
    }
  });

  return buckets;
}

function getProductData(history) {
  const total = history.reduce((s, m) => s + (m.funnel?.purchase || 0), 0);
  const PRODUCTS = [
    "AirPods Pro","MacBook M3","Nike Jordan","Sony WH-1000","Levi Jeans",
    "iPad Pro","Atomic Habits","Samsung 4K","Yoga Mat","Adidas Ultra","KitchenAid","Dyson V15",
  ];
  const PRICES  = [549,1299,180,349,89,1099,16,599,79,190,399,749];
  const weights = [0.18,0.15,0.12,0.11,0.09,0.08,0.07,0.06,0.05,0.04,0.03,0.02];
  return PRODUCTS.map((name, i) => ({
    name: name.length > 10 ? name.slice(0, 10) + "…" : name,
    sales:   Math.round(total * weights[i]),
    revenue: Math.round(total * weights[i] * PRICES[i]),
  }));
}

function calcDelta(history, key) {
  if (history.length < 2) return 0;
  const half = Math.floor(history.length / 2);
  const prev  = history.slice(0, half).reduce((s, m) => s + (m[key] || 0), 0);
  const curr  = history.slice(half).reduce((s, m) => s + (m[key] || 0), 0);
  if (!prev) return 0;
  return ((curr - prev) / prev) * 100;
}



const axisStyle = { fill: "#64748b", fontSize: 9, fontFamily: "JetBrains Mono", fontWeight: 500 };

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: "rgba(13,17,23,0.97)", border: "1px solid #1e293b", borderRadius: 1.5, p: 1.5 }}>
      <Typography sx={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 700, mb: 1, borderBottom: "1px solid #1e293b", pb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1.5} mt={0.5}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <Typography sx={{ color: "#f1f5f9", fontSize: "0.75rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
            {p.name}: <span style={{ color: p.color }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

function ChartCard({ title, subtitle, badge, badgeColor = "#3b82f6", children, height = 280 }) {
  return (
    <Box sx={{
      background: "#0f172a",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "border-color 0.2s",
      "&:hover": { borderColor: "rgba(255,255,255,0.12)" },
    }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ color: "#f8fafc", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.02em" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: "#475569", fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {badge && (
          <Box sx={{
            px: 1, py: 0.2, borderRadius: 1,
            fontSize: "0.6rem", fontWeight: 800,
            background: `${badgeColor}18`,
            color: badgeColor,
            border: `1px solid ${badgeColor}35`,
            fontFamily: "'JetBrains Mono'",
            letterSpacing: "0.05em",
          }}>
            {badge}
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />
      <Box sx={{ p: 2, flex: 1, minHeight: height }}>{children}</Box>
    </Box>
  );
}

function StatCard({ label, value, delta, color = "#3b82f6", suffix = "" }) {
  const isPos = delta > 0.5;
  const isNeg = delta < -0.5;
  const TrendIcon = isPos ? TrendingUp : isNeg ? TrendingDown : Remove;
  const trendColor = isPos ? "#10b981" : isNeg ? "#f43f5e" : "#64748b";

  return (
    <Box sx={{
      background: "#0f172a",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 2,
      p: 2,
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s, transform 0.15s",
      "&:hover": { borderColor: `${color}40`, transform: "translateY(-1px)" },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0,
        width: "3px",
        height: "100%",
        background: color,
        borderRadius: "2px 0 0 2px",
      },
    }}>
      <Typography sx={{ color: "#475569", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#f8fafc", fontSize: "1.5rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
        {value}{suffix}
      </Typography>
      {delta !== undefined && (
        <Box display="flex" alignItems="center" gap={0.5} mt={0.8}>
          <TrendIcon sx={{ color: trendColor, fontSize: 13 }} />
          <Typography sx={{ color: trendColor, fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
            {isPos ? "+" : ""}{delta.toFixed(1)}% vs prev period
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function ActivityHeatmap({ history }) {
  const hourCounts = Array(24).fill(0);
  history.forEach((m) => {
    if (!m.window_start) return;
    const h = new Date(m.window_start).getHours();
    hourCounts[h] += m.session_count || 0;
  });
  const maxVal = Math.max(...hourCounts, 1);

  return (
    <Box>
      <Typography sx={{ color: "#64748b", fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace", mb: 1.5 }}>
        Session density by hour of day (24h clock)
      </Typography>
      <Box display="flex" gap={0.4} flexWrap="wrap">
        {hourCounts.map((count, h) => {
          const intensity = count / maxVal;
          const bg =
            intensity > 0.8 ? "#00d4aa"
            : intensity > 0.6 ? "#00d4aa99"
            : intensity > 0.4 ? "#00d4aa55"
            : intensity > 0.2 ? "#00d4aa22"
            : "#1e293b";
          return (
            <Box key={h} title={`${h}:00 — ${count} sessions`} sx={{
              width: 32, height: 32, borderRadius: 1,
              background: bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "default",
              transition: "transform 0.15s",
              "&:hover": { transform: "scale(1.2)", zIndex: 1 },
            }}>
              <Typography sx={{ fontSize: "0.55rem", color: intensity > 0.4 ? "#07090f" : "#334155", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                {h}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box display="flex" gap={2} mt={1.5} flexWrap="wrap">
        {[["Low", 0.2], ["Medium", 0.5], ["High", 0.8], ["Peak", 1.0]].map(([label, intensity]) => (
          <Box key={label} display="flex" alignItems="center" gap={0.6}>
            <Box sx={{
              width: 10, height: 10, borderRadius: 0.5,
              background:
                intensity > 0.8 ? "#00d4aa"
                : intensity > 0.5 ? "#00d4aa99"
                : intensity > 0.2 ? "#00d4aa55"
                : "#1e293b",
            }} />
            <Typography sx={{ fontSize: "0.62rem", color: "#64748b" }}>{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}



const PRODUCTS = [
  "AirPods Pro","MacBook M3","Nike Jordan","Sony WH-1000","Levi Jeans",
  "iPad Pro","Atomic Habits","Samsung 4K","Yoga Mat","Adidas Ultra","KitchenAid","Dyson V15",
];

export default function Analytics() {
  const [range, setRange] = useState("1h");
  const { history, loading, error } = useMetrics(range);


  const bucketed = useMemo(() => bucketHistory(history, range), [history, range]);

  const sessionData = useMemo(
    () => bucketed.map((m) => ({
      time:     formatTime(m.window_start, range),
      sessions: m.session_count,
      users:    m.active_users,
    })),
    [bucketed, range],
  );

  const cvrData = useMemo(
    () => bucketed.map((m) => ({
      time:   formatTime(m.window_start, range),
      cvr:    parseFloat((m.cvr || 0).toFixed(2)),
      bounce: parseFloat((m.bounce_rate || 0).toFixed(2)),
    })),
    [bucketed, range],
  );

  const eventTypes = ["page_view", "add_to_cart", "checkout", "purchase"];
  const eventBarData = useMemo(
    () => eventTypes.map((et) => ({
      name:  et.split("_").join(" ").toUpperCase(),
      count: bucketed.reduce((s, m) => s + (m.event_breakdown?.[et] || 0), 0),
    })),
    [bucketed],
  );

  const productData = useMemo(() => getProductData(bucketed), [bucketed]);


  const totalSessions  = bucketed.reduce((s, m) => s + m.session_count,  0);
  const totalUsers     = bucketed.reduce((s, m) => s + m.active_users,   0);
  const avgCvr         = bucketed.length ? bucketed.reduce((s, m) => s + m.cvr, 0) / bucketed.length : 0;
  const avgBounce      = bucketed.length ? bucketed.reduce((s, m) => s + m.bounce_rate, 0) / bucketed.length : 0;
  const totalEvents    = eventBarData.reduce((s, e) => s + e.count, 0);
  const totalRevenue   = productData.reduce((s, p) => s + p.revenue, 0);

  const sessionDelta = calcDelta(bucketed, "session_count");
  const userDelta    = calcDelta(bucketed, "active_users");
  const cvrDelta     = calcDelta(bucketed, "cvr");

  return (
    <Box sx={{ p: 3, background: "#020617", minHeight: "100vh" }}>


      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AnalyticsOutlined sx={{ color: "#3b82f6", fontSize: 16 }} />
            <Typography sx={{ color: "#475569", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", fontFamily: "'JetBrains Mono'" }}>
              CLOUD_MONITOR / SHOPSTREAM
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: "#f8fafc", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}>
            Performance Analytics
          </Typography>
          <Typography sx={{ color: "#334155", fontSize: "0.7rem", fontFamily: "'JetBrains Mono'", mt: 0.5 }}>
            {RANGE_CONFIG[range].label} · {bucketed.length} time windows
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1} sx={{
            px: 2, py: 1, borderRadius: 2,
            border: "1px solid rgba(16,185,129,0.2)",
            background: "rgba(16,185,129,0.05)",
          }}>
            <CheckCircleOutline sx={{ color: "#10b981", fontSize: 14 }} />
            <Typography sx={{ color: "#10b981", fontSize: "0.7rem", fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>
              SYSTEM_HEALTH: NOMINAL
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={range}
            exclusive
            onChange={(_, v) => v && setRange(v)}
            sx={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 1.5,
              "& .MuiToggleButton-root": {
                color: "#475569",
                border: "none",
                px: 2.5,
                py: 0.75,
                fontSize: "0.75rem",
                fontFamily: "'JetBrains Mono'",
                fontWeight: 700,
                transition: "color 0.15s, background 0.15s",
                "&.Mui-selected": {
                  color: "#f8fafc",
                  background: "rgba(59,130,246,0.15)",
                },
                "&:hover:not(.Mui-selected)": { color: "#94a3b8" },
              },
            }}
          >
            {["1h", "6h", "24h"].map((r) => (
              <ToggleButton key={r} value={r} size="small">{r}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12, flexDirection: "column", gap: 2 }}>
          <CircularProgress size={28} sx={{ color: "#3b82f6" }} />
          <Typography sx={{ color: "#334155", fontSize: "0.7rem", fontFamily: "'JetBrains Mono'" }}>
            FETCHING_STREAM...
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography sx={{ color: "#f43f5e", fontSize: "0.8rem", fontFamily: "'JetBrains Mono'" }}>
            STREAM_ERROR: {error.message || "Failed to load metrics"}
          </Typography>
        </Box>
      )}

      {!loading && !error && (
        <Grid container spacing={2}>

      
          <Grid item xs={6} sm={4} md={2}>
            <StatCard label="TOTAL SESSIONS"  value={totalSessions.toLocaleString()}  delta={sessionDelta} color="#3b82f6" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard label="ACTIVE USERS"    value={totalUsers.toLocaleString()}      delta={userDelta}    color="#00d4aa" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard label="AVG CVR"         value={avgCvr.toFixed(2)}                delta={cvrDelta}     color="#a855f7" suffix="%" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard label="AVG BOUNCE"      value={avgBounce.toFixed(1)}             color="#f43f5e"      suffix="%" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard label="TOTAL EVENTS"    value={totalEvents.toLocaleString()}     color="#f59e0b" />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard label="EST. REVENUE"    value={`$${(totalRevenue / 1000).toFixed(1)}k`} color="#10b981" />
          </Grid>

          <Grid item xs={12} lg={9}>
            <ChartCard
              title="Session Density & Active Users"
              subtitle={`${RANGE_CONFIG[range].label} · ${bucketed.length} buckets`}
              badge="LIVE_REPLAY"
            >
              <ResponsiveContainer width="100%" height={300}>
              
                <AreaChart key={`area-${range}`} data={sessionData} syncId="ss">
                  <defs>
                    <linearGradient id="gSess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" tick={axisStyle} stroke="transparent" minTickGap={40} interval="preserveStartEnd" />
                  <YAxis tick={axisStyle} stroke="transparent" />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
                  <Area type="stepAfter"  dataKey="sessions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#gSess)" name="Total Sessions" />
                  <Area type="monotone"   dataKey="users"    stroke="#00d4aa" strokeWidth={2} fill="transparent"                                        name="Active Users"    />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

   
          <Grid item xs={12} lg={3}>
            <ChartCard title="Global Event Load" badge="KAFKA" height={300}>
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart key={`pie-${range}`}>
                    <Pie data={eventBarData} dataKey="count" innerRadius={55} outerRadius={75} paddingAngle={5} animationBegin={0} animationDuration={800}>
                      {eventBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {eventBarData.map((entry, i) => (
                    <Box key={i} display="flex" justifyContent="space-between" alignItems="center" mb={0.6} sx={{
                      px: 1, py: 0.3,
                      borderRadius: 0.75,
                      transition: "background 0.15s",
                      "&:hover": { background: "rgba(255,255,255,0.03)" },
                    }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <Typography sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 600 }}>
                          {entry.name}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: "#f8fafc", fontSize: "0.65rem", fontFamily: "'JetBrains Mono'" }}>
                        {entry.count.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </ChartCard>
          </Grid>

    
          <Grid item xs={12}>
            <ChartCard
              title="Yield & Conversion Ratios"
              subtitle={`Historical analysis · ${RANGE_CONFIG[range].label}`}
              badge="AGGREGATOR_v2"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart key={`bar-${range}`} data={cvrData} barGap={8} syncId="ss">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" tick={axisStyle} stroke="transparent" minTickGap={40} interval="preserveStartEnd" />
                  <YAxis tick={axisStyle} stroke="transparent" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: 10, fontSize: 10, fontFamily: "JetBrains Mono", color: "#64748b" }}
                  />
                  <Bar dataKey="cvr"    fill="#00d4aa" radius={[4,4,0,0]} name="Conversion Rate %" isAnimationActive animationDuration={1000} />
                  <Bar dataKey="bounce" fill="#f43f5e" radius={[4,4,0,0]} name="Bounce Rate %"     isAnimationActive animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

    
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Product-wise Sales"
              subtitle="Purchase events distributed by product"
              badge="NEW"
              badgeColor="#00d4aa"
              height={280}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart key={`prod-${range}`} data={productData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number"   tick={axisStyle} stroke="transparent" />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "JetBrains Mono" }} stroke="transparent" width={80} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="sales" name="Units Sold" radius={[0,4,4,0]} isAnimationActive animationDuration={1200}>
                    {productData.map((_, i) => <Cell key={i} fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12} lg={4}>
            <ChartCard
              title="User Activity Heatmap"
              subtitle="Sessions by hour of day"
              badge="NEW"
              badgeColor="#a855f7"
              height={280}
            >
              <Box sx={{ pt: 1 }}>
                <ActivityHeatmap history={history} />
              </Box>
            </ChartCard>
          </Grid>

        </Grid>
      )}
    </Box>
  );
}