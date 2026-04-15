import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Chip,
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

import { AnalyticsOutlined, CheckCircleOutline } from "@mui/icons-material";
import { useMetrics } from "../hooks/useMetrics";

const COLORS = [
  "#00d4aa",
  "#3b82f6",
  "#f59e0b",
  "#f43f5e",
  "#a855f7",
  "#10b981",
];
const PRODUCT_COLORS = [
  "#00d4aa",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
];

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: "rgba(13,17,23,0.97)",
        border: "1px solid #1e293b",
        borderRadius: 1.5,
        p: 1.5,
        backdropFilter: "blur(4px)",
      }}
    >
      <Typography
        sx={{
          color: "#64748b",
          fontSize: "0.65rem",
          fontWeight: 700,
          mb: 1,
          borderBottom: "1px solid #1e293b",
          pb: 0.5,
        }}
      >
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1.5} mt={0.5}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
            }}
          />
          <Typography
            sx={{
              color: "#f1f5f9",
              fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 600,
            }}
          >
            {p.name}:{" "}
            <span style={{ color: p.color }}>
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const axisStyle = {
  fill: "#64748b",
  fontSize: 9,
  fontFamily: "JetBrains Mono",
  fontWeight: 500,
};

function ChartCard({
  title,
  subtitle,
  badge,
  badgeColor = "#3b82f6",
  children,
  height = 280,
}) {
  return (
    <Box
      sx={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": { borderColor: "rgba(255,255,255,0.12)" },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                color: "#475569",
                fontSize: "0.65rem",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {badge && (
          <Box
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              fontSize: "0.6rem",
              fontWeight: 800,
              background: `${badgeColor}10`,
              color: badgeColor,
              border: `1px solid ${badgeColor}30`,
              fontFamily: "'JetBrains Mono'",
            }}
          >
            {badge}
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />
      <Box sx={{ p: 2, flex: 1, minHeight: height }}>{children}</Box>
    </Box>
  );
}

// User Activity Heatmap — shows which hours have most activity
function ActivityHeatmap({ history }) {
  // Aggregate events by hour of day
  const hourCounts = Array(24).fill(0);
  history.forEach((m) => {
    if (!m.window_start) return;
    const h = new Date(m.window_start).getHours();
    hourCounts[h] += m.session_count || 0;
  });
  const maxVal = Math.max(...hourCounts, 1);

  return (
    <Box>
      <Typography
        sx={{
          color: "#64748b",
          fontSize: "0.65rem",
          fontFamily: "'JetBrains Mono',monospace",
          mb: 1.5,
        }}
      >
        Session density by hour of day (24h clock)
      </Typography>
      <Box display="flex" gap={0.4} flexWrap="wrap">
        {hourCounts.map((count, h) => {
          const intensity = count / maxVal;
          const bg =
            intensity > 0.8
              ? "#00d4aa"
              : intensity > 0.6
                ? "#00d4aa99"
                : intensity > 0.4
                  ? "#00d4aa55"
                  : intensity > 0.2
                    ? "#00d4aa22"
                    : "#1e293b";
          return (
            <Box
              key={h}
              title={`${h}:00 — ${count} sessions`}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "transform 0.15s",
                "&:hover": { transform: "scale(1.2)", zIndex: 1 },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.55rem",
                  color: intensity > 0.4 ? "#07090f" : "#334155",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontWeight: 700,
                }}
              >
                {h}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box display="flex" gap={2} mt={1.5} flexWrap="wrap">
        {[
          ["Low", 0.2],
          ["Medium", 0.5],
          ["High", 0.8],
          ["Peak", 1.0],
        ].map(([label, intensity]) => (
          <Box key={label} display="flex" alignItems="center" gap={0.6}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 0.5,
                background:
                  intensity > 0.8
                    ? "#00d4aa"
                    : intensity > 0.5
                      ? "#00d4aa99"
                      : intensity > 0.2
                        ? "#00d4aa55"
                        : "#1e293b",
              }}
            />
            <Typography sx={{ fontSize: "0.62rem", color: "#64748b" }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Product-wise sales chart (simulated from purchase breakdown)
const PRODUCTS = [
  "AirPods Pro",
  "MacBook M3",
  "Nike Jordan",
  "Sony WH-1000",
  "Levi Jeans",
  "iPad Pro",
  "Atomic Habits",
  "Samsung 4K",
  "Yoga Mat",
  "Adidas Ultra",
  "KitchenAid",
  "Dyson V15",
];

function getProductData(history) {
  // Simulate product breakdown from purchase count
  const total = history.reduce((s, m) => s + (m.funnel?.purchase || 0), 0);
  if (total === 0)
    return PRODUCTS.map((name) => ({ name, sales: 0, revenue: 0 }));
  // Distribute realistically
  const weights = [
    0.18, 0.15, 0.12, 0.11, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02,
  ];
  return PRODUCTS.map((name, i) => ({
    name: name.length > 10 ? name.slice(0, 10) + "…" : name,
    sales: Math.round(total * weights[i]),
    revenue: Math.round(
      total *
        weights[i] *
        [549, 1299, 180, 349, 89, 1099, 16, 599, 79, 190, 399, 749][i],
    ),
  }));
}

export default function Analytics() {
  const [range, setRange] = useState("1h");
  const { history, loading, error } = useMetrics(range);

  const cvrData = history.map((m) => ({
    time: formatTime(m.window_start),
    cvr: parseFloat((m.cvr || 0).toFixed(2)),
    bounce: parseFloat((m.bounce_rate || 0).toFixed(2)),
  }));
  const sessionData = history.slice(-30).map((m) => ({
    time: formatTime(m.window_start),
    sessions: m.session_count || 0,
    users: m.active_users || 0,
  }));
  const eventTypes = ["page_view", "add_to_cart", "checkout", "purchase"];
  const eventBarData = eventTypes.map((et) => ({
    name: et.split("_").join(" ").toUpperCase(),
    count: history.reduce((s, m) => s + (m.event_breakdown?.[et] || 0), 0),
  }));
  const productData = getProductData(history);

  return (
    <Box sx={{ p: 3, background: "#020617", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AnalyticsOutlined sx={{ color: "#3b82f6", fontSize: 20 }} />
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              CLOUD_MONITOR / SHOPSTREAM
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{ color: "#f8fafc", fontWeight: 800, fontSize: "1.75rem" }}
          >
            Performance Analytics
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              border: "1px solid rgba(16,185,129,0.2)",
              background: "rgba(16,185,129,0.05)",
            }}
          >
            <CheckCircleOutline sx={{ color: "#10b981", fontSize: 16 }} />
            <Typography
              sx={{
                color: "#10b981",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono'",
              }}
            >
              SYSTEM_HEALTH: NOMINAL
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={range}
            exclusive
            onChange={(_, v) => v && setRange(v)}
            sx={{
              background: "#1e293b",
              "& .MuiToggleButton-root": {
                color: "#94a3b8",
                border: "none",
                px: 2,
                "&.Mui-selected": { color: "#fff", background: "#334155" },
              },
            }}
          >
            {["1h", "6h", "24h"].map((r) => (
              <ToggleButton key={r} value={r} size="small">
                {r}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={30} sx={{ color: "#3b82f6" }} />
        </Box>
      )}

      {!loading && !error && (
        <Grid container spacing={2}>
          {/* Session area chart */}
          <Grid item xs={12} lg={9}>
            <ChartCard
              title="Session Density & Active Users"
              subtitle={`Stream data: last ${range}`}
              badge="LIVE_REPLAY"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart key={`area-${range}`} data={sessionData} syncId="ss">
                  <defs>
                    <linearGradient id="gSess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={axisStyle}
                    stroke="transparent"
                    minTickGap={30}
                  />
                  <YAxis tick={axisStyle} stroke="transparent" />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="sessions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gSess)"
                    name="Total Sessions"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#00d4aa"
                    strokeWidth={2}
                    fill="transparent"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Event donut */}
          <Grid item xs={12} lg={3}>
            <ChartCard title="Global Event Load" badge="KAFKA" height={300}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart key={`pie-${range}`}>
                    <Pie
                      data={eventBarData}
                      dataKey="count"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {eventBarData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {eventBarData.map((entry, i) => (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      mb={0.5}
                    >
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {entry.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#f8fafc",
                          fontSize: "0.65rem",
                          fontFamily: "'JetBrains Mono'",
                        }}
                      >
                        {entry.count.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </ChartCard>
          </Grid>

          {/* CVR + Bounce bar chart */}
          <Grid item xs={12}>
            <ChartCard
              title="Yield & Conversion Ratios"
              subtitle={`Historical Analysis (${range})`}
              badge="AGGREGATOR_v2"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  key={`bar-${range}`}
                  data={cvrData}
                  barGap={8}
                  syncId="ss"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis dataKey="time" tick={axisStyle} stroke="transparent" />
                  <YAxis tick={axisStyle} stroke="transparent" />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: 10,
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <Bar
                    dataKey="cvr"
                    fill="#00d4aa"
                    radius={[4, 4, 0, 0]}
                    name="Conversion Rate %"
                    isAnimationActive
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="bounce"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    name="Bounce Rate %"
                    isAnimationActive
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Product-wise Sales Chart */}
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Product-wise Sales"
              subtitle="Based on purchase events per product"
              badge="NEW"
              badgeColor="#00d4aa"
              height={280}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={productData}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={axisStyle} stroke="transparent" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 9,
                      fontFamily: "JetBrains Mono",
                    }}
                    stroke="transparent"
                    width={80}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar
                    dataKey="sales"
                    name="Units Sold"
                    radius={[0, 4, 4, 0]}
                    isAnimationActive
                    animationDuration={1200}
                  >
                    {productData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* User Activity Heatmap */}
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
