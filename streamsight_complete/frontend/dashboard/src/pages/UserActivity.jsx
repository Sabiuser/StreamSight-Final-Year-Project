// frontend/dashboard/src/pages/UserActivity.jsx
// Visible ONLY to Admin and Analyst roles
// Shows all ShopStream user actions stored in MongoDB raw_events

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  Collapse,
  LinearProgress,
  Grid,
  Paper,
} from "@mui/material";
import {
  Search,
  Refresh,
  ExpandMore,
  ExpandLess,
  ShoppingCart,
  Visibility,
  Payment,
  FlashOn,
  TrendingUp,
  People,
  AttachMoney,
  BugReport,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Indian names mapping (same as Dashboard)
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
function getUserInfo(userId = "") {
  const num = parseInt(userId.replace(/\D/g, "") || "0");
  return NAMES[num % NAMES.length];
}

const EVENT_ICON = {
  page_view: <Visibility sx={{ fontSize: 14 }} />,
  add_to_cart: <ShoppingCart sx={{ fontSize: 14 }} />,
  checkout: <Payment sx={{ fontSize: 14 }} />,
  purchase: <FlashOn sx={{ fontSize: 14 }} />,
  search: <Search sx={{ fontSize: 14 }} />,
  product_click: <TrendingUp sx={{ fontSize: 14 }} />,
};
const EVENT_COLOR = {
  page_view: "#64748b",
  add_to_cart: "#3b82f6",
  checkout: "#a855f7",
  purchase: "#00d4aa",
  search: "#f59e0b",
  product_click: "#06b6d4",
};
const DEVICE_ICON = { mobile: "📱", desktop: "🖥️", tablet: "📟" };
const FLAG = { IN: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", SG: "🇸🇬", DE: "🇩🇪" };

function timeAgo(ts) {
  if (!ts) return "–";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// Summary KPI card
function StatCard({ icon, label, value, color }) {
  return (
    <Box
      sx={{
        background: "#0d1117",
        border: `1px solid ${color}22`,
        borderRadius: 2,
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            color: "#475569",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: "#e2e8f0",
            fontWeight: 800,
            fontSize: "1.3rem",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// Expandable user row
function UserRow({ user, searchQ }) {
  const [open, setOpen] = useState(false);
  const info = getUserInfo(user.user_id);

  // filter individual events by search
  const filteredEvents = user.events.filter(
    (e) =>
      !searchQ ||
      (e.product_id || "").toLowerCase().includes(searchQ) ||
      (e.event_type || "").toLowerCase().includes(searchQ) ||
      (e.category || "").toLowerCase().includes(searchQ) ||
      (e.page || "").toLowerCase().includes(searchQ),
  );

  return (
    <>
      <TableRow
        onClick={() => setOpen((o) => !o)}
        sx={{
          cursor: "pointer",
          "&:hover": { background: "rgba(0,212,170,0.03)" },
          "& td": { borderBottom: "1px solid #111827", py: 1.5, px: 2.5 },
          transition: "background 0.15s",
        }}
      >
        {/* User */}
        <TableCell>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.72rem",
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
                  fontSize: "0.62rem",
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {user.user_id}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        {/* Device + Country */}
        <TableCell>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            {DEVICE_ICON[user.device] || "💻"} {user.device}
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "0.7rem", mt: 0.3 }}>
            {FLAG[user.country] || "🌐"} {user.country}
          </Typography>
        </TableCell>

        {/* Stats */}
        <TableCell>
          <Box display="flex" gap={0.8} flexWrap="wrap">
            {user.views > 0 && (
              <Chip
                label={`👁 ${user.views}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  background: "rgba(100,116,139,0.1)",
                  color: "#64748b",
                  border: "1px solid #1e293b",
                }}
              />
            )}
            {user.cartAdds > 0 && (
              <Chip
                label={`🛒 ${user.cartAdds}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  background: "rgba(59,130,246,0.1)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              />
            )}
            {user.checkouts > 0 && (
              <Chip
                label={`💳 ${user.checkouts}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  background: "rgba(168,85,247,0.1)",
                  color: "#c084fc",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}
              />
            )}
            {user.purchases > 0 && (
              <Chip
                label={`✅ ${user.purchases} bought`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  background: "rgba(0,212,170,0.1)",
                  color: "#00d4aa",
                  border: "1px solid rgba(0,212,170,0.2)",
                  fontWeight: 700,
                }}
              />
            )}
          </Box>
        </TableCell>

        {/* Total Spend */}
        <TableCell>
          <Typography
            sx={{
              color: user.totalSpend > 0 ? "#00d4aa" : "#334155",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "0.85rem",
            }}
          >
            {user.totalSpend > 0 ? `₹${user.totalSpend.toFixed(2)}` : "—"}
          </Typography>
        </TableCell>

        {/* Last Active */}
        <TableCell>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.72rem",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {timeAgo(user.lastActive)}
          </Typography>
        </TableCell>

        {/* Expand */}
        <TableCell>
          {open ? (
            <ExpandLess sx={{ color: "#475569", fontSize: 18 }} />
          ) : (
            <ExpandMore sx={{ color: "#475569", fontSize: 18 }} />
          )}
        </TableCell>
      </TableRow>

      {/* Expanded Event History */}
      <TableRow sx={{ "& td": { p: 0, border: 0 } }}>
        <TableCell colSpan={6}>
          <Collapse in={open}>
            <Box
              sx={{
                background: "#070c14",
                borderBottom: "1px solid #1e293b",
                px: 3,
                py: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Event History — {filteredEvents.length} actions
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.8,
                  maxHeight: 240,
                  overflowY: "auto",
                  "&::-webkit-scrollbar": { width: 3 },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#1e293b",
                    borderRadius: 2,
                  },
                }}
              >
                {filteredEvents.length === 0 ? (
                  <Typography
                    sx={{
                      color: "#334155",
                      fontSize: "0.75rem",
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    No matching events
                  </Typography>
                ) : (
                  filteredEvents.map((e, i) => (
                    <Box
                      key={i}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{
                        py: 0.8,
                        px: 1.5,
                        borderRadius: 1.5,
                        background: "#0d1117",
                        border: `1px solid ${e.is_anomalous ? "rgba(244,63,94,0.3)" : "#111827"}`,
                        ...(e.is_anomalous
                          ? { borderColor: "rgba(244,63,94,0.3)" }
                          : {}),
                      }}
                    >
                      {/* Event type icon + label */}
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.8}
                        sx={{ minWidth: 130 }}
                      >
                        <Box
                          sx={{ color: EVENT_COLOR[e.event_type] || "#64748b" }}
                        >
                          {EVENT_ICON[e.event_type] || "•"}
                        </Box>
                        <Typography
                          sx={{
                            color: EVENT_COLOR[e.event_type] || "#64748b",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          {e.event_type?.toUpperCase().replace(/_/g, " ")}
                        </Typography>
                      </Box>
                      {/* Product */}
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "0.72rem",
                          fontFamily: "'JetBrains Mono',monospace",
                          minWidth: 80,
                        }}
                      >
                        {e.product_id || "—"}
                      </Typography>
                      {/* Category */}
                      <Chip
                        label={e.category || "—"}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: "0.58rem",
                          background: "#111827",
                          color: "#475569",
                          border: "1px solid #1e293b",
                        }}
                      />
                      {/* Price */}
                      <Typography
                        sx={{
                          color: e.price > 0 ? "#e2e8f0" : "#334155",
                          fontSize: "0.72rem",
                          fontFamily: "'JetBrains Mono',monospace",
                          minWidth: 70,
                        }}
                      >
                        {e.price > 0 ? `₹${e.price}` : "—"}
                      </Typography>
                      {/* Page */}
                      <Typography
                        sx={{
                          color: "#334155",
                          fontSize: "0.68rem",
                          fontFamily: "'JetBrains Mono',monospace",
                          flex: 1,
                        }}
                      >
                        {e.page}
                      </Typography>
                      {/* Time */}
                      <Typography
                        sx={{
                          color: "#334155",
                          fontSize: "0.65rem",
                          fontFamily: "'JetBrains Mono',monospace",
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(e.timestamp)}
                      </Typography>
                      {/* Anomaly badge */}
                      {e.is_anomalous && (
                        <Chip
                          label="⚠ ANOMALY"
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: "0.55rem",
                            background: "rgba(244,63,94,0.12)",
                            color: "#f43f5e",
                            border: "1px solid rgba(244,63,94,0.3)",
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function UserActivity() {
  const [data, setData] = useState({ users: [], totalEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const role = localStorage.getItem("ss_role") || "admin";

  // Redirect viewers (safety net — App.jsx route also blocks them)
  if (role === "viewer") {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="60vh"
      >
        <Box textAlign="center">
          <Typography
            sx={{
              color: "#ef4444",
              fontSize: "1.2rem",
              fontWeight: 700,
              mb: 1,
            }}
          >
            🚫 Access Denied
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
            This page is only accessible to Admin and Analyst roles.
          </Typography>
        </Box>
      </Box>
    );
  }

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/user-activity?limit=300`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast.error("Failed to load user activity");
    } finally {
      setLoading(false);
      if (manual) setTimeout(() => setRefreshing(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users by search or event type
  const filteredUsers =
    data.users?.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        getUserInfo(u.user_id).name.toLowerCase().includes(q) ||
        u.user_id.toLowerCase().includes(q) ||
        (u.device || "").toLowerCase().includes(q) ||
        (u.country || "").toLowerCase().includes(q);
      const matchEvent =
        eventFilter === "all" ||
        u.events.some((e) => e.event_type === eventFilter);
      return matchSearch && matchEvent;
    }) || [];

  // Summary stats
  const totalPurchases = data.users?.reduce((s, u) => s + u.purchases, 0) || 0;
  const totalSpend = data.users?.reduce((s, u) => s + u.totalSpend, 0) || 0;
  const totalCartAdds = data.users?.reduce((s, u) => s + u.cartAdds, 0) || 0;
  const anomalousCount =
    data.rawEvents?.filter((e) => e.is_anomalous).length || 0;

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: "#e2e8f0", letterSpacing: "-0.5px", mb: 0.5 }}
            >
              👤 User Activity
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              ShopStream purchase &amp; browsing history · Admin &amp; Analyst
              only
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} alignItems="center">
            <Chip
              label={`${role.toUpperCase()} ACCESS`}
              size="small"
              sx={{
                background: "rgba(0,212,170,0.08)",
                border: "1px solid rgba(0,212,170,0.2)",
                color: "#00d4aa",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "0.65rem",
              }}
            />
            <Tooltip title="Refresh">
              <IconButton
                onClick={() => fetchData(true)}
                size="small"
                sx={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#64748b",
                  "&:hover": { color: "#00d4aa" },
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

      {/* Summary KPI Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<People />}
            label="Total Users"
            value={data.users?.length || 0}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<FlashOn />}
            label="Purchases"
            value={totalPurchases}
            color="#00d4aa"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<AttachMoney />}
            label="Total Revenue"
            value={`₹${totalSpend.toFixed(0)}`}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<BugReport />}
            label="Anomalies"
            value={anomalousCount}
            color="#f43f5e"
          />
        </Grid>
      </Grid>

      {/* Filters Row */}
      <Box display="flex" gap={2} mb={2.5} flexWrap="wrap" alignItems="center">
        <TextField
          size="small"
          placeholder="Search by name, user ID, device, country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 16, color: "#334155" }} />
              </InputAdornment>
            ),
            sx: {
              background: "#0d1117",
              fontSize: "0.82rem",
              borderRadius: 1.5,
              "& fieldset": { borderColor: "#1e293b" },
              "&:hover fieldset": { borderColor: "#334155" },
              "& .MuiInputBase-input": {
                color: "#94a3b8",
                "&::placeholder": { color: "#334155" },
              },
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            sx={{
              background: "#0d1117",
              color: "#94a3b8",
              fontSize: "0.82rem",
              borderRadius: 1.5,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#334155",
              },
              "& .MuiSvgIcon-root": { color: "#475569" },
            }}
          >
            <MenuItem value="all">All Event Types</MenuItem>
            <MenuItem value="page_view">👁 Page Views</MenuItem>
            <MenuItem value="add_to_cart">🛒 Add to Cart</MenuItem>
            <MenuItem value="checkout">💳 Checkout</MenuItem>
            <MenuItem value="purchase">✅ Purchases</MenuItem>
          </Select>
        </FormControl>
        <Typography
          sx={{
            color: "#475569",
            fontSize: "0.72rem",
            fontFamily: "'JetBrains Mono',monospace",
            ml: "auto",
          }}
        >
          {filteredUsers.length} users · {data.totalEvents} events
        </Typography>
      </Box>

      {/* Main Table */}
      <Box
        sx={{
          background: "#0d1117",
          border: "1px solid #1e293b",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {loading && (
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg,#00d4aa,#3b82f6)",
              },
            }}
          />
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    borderBottom: "1px solid #111827",
                    py: 1.5,
                    px: 2.5,
                    color: "#475569",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "#070c14",
                  },
                }}
              >
                <TableCell>User</TableCell>
                <TableCell>Device / Country</TableCell>
                <TableCell>Activity Summary</TableCell>
                <TableCell>Total Spend</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 6,
                      color: "#334155",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: "0.8rem",
                      border: 0,
                    }}
                  >
                    {search || eventFilter !== "all"
                      ? "No users match the current filter"
                      : "No activity recorded yet — start the simulator or click on ShopStream"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user.user_id}
                    user={user}
                    searchQ={search.toLowerCase()}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Info Banner */}
      <Box
        mt={2.5}
        p={2}
        sx={{
          borderRadius: 2,
          background: "rgba(59,130,246,0.05)",
          border: "1px solid rgba(59,130,246,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TrendingUp sx={{ color: "#3b82f6", flexShrink: 0, fontSize: 18 }} />
        <Typography sx={{ color: "#475569", fontSize: "0.8rem" }}>
          All data comes from{" "}
          <strong style={{ color: "#94a3b8" }}>raw_events</strong> MongoDB
          collection. Events are generated by ShopStream button clicks and the
          Python simulator. Click any user row to expand their full event
          history. ⚠️ Red-bordered events are anomalies detected by Isolation
          Forest.
        </Typography>
      </Box>
    </Box>
  );
}
