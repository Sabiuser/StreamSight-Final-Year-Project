
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tooltip, Box, Typography, Dialog, DialogTitle, 
  DialogContent, IconButton, Divider 
} from "@mui/material"; 
import {
  Visibility, AddShoppingCart, Payment, CheckCircleOutline,
  Search, MouseOutlined, DesktopMacOutlined, SmartphoneOutlined, 
  TabletMacOutlined, Close, Person, Language, Schedule, Public
} from "@mui/icons-material";

// ── CONFIGURATIONS ─────────────────────────────────────────────────────────
const EVENT_CONFIG = {
  page_view:     { Icon: Visibility,          color: "#94a3b8", bg: "#F1F5F9", label: "Page View"     },
  add_to_cart:   { Icon: AddShoppingCart,     color: "#3b82f6", bg: "#E6F1FB", label: "Add to Cart"   },
  checkout:      { Icon: Payment,             color: "#8b5cf6", bg: "#EEEDFE", label: "Checkout"      },
  purchase:      { Icon: CheckCircleOutline,  color: "#10b981", bg: "#E1F5EE", label: "Purchase"      },
  search:        { Icon: Search,              color: "#f59e0b", bg: "#FAEEDA", label: "Search"         },
  product_click: { Icon: MouseOutlined,       color: "#ef4444", bg: "#FAECE7", label: "Product Click"  },
};

const DEVICE_CONFIG = {
  mobile:  { Icon: SmartphoneOutlined,  label: "Mobile"  },
  desktop: { Icon: DesktopMacOutlined,  label: "Desktop" },
  tablet:  { Icon: TabletMacOutlined,   label: "Tablet"  },
};

const USER_COLORS = [
  { bg: "#E1F5EE", fg: "#0F6E56" },
  { bg: "#E6F1FB", fg: "#185FA5" },
  { bg: "#EEEDFE", fg: "#534AB7" },
  { bg: "#FAEEDA", fg: "#854F0B" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return USER_COLORS[Math.abs(h) % USER_COLORS.length];
}

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

function UserAvatar({ userId, showStatus = false }) {
  const c = hashColor(userId || "");
  const initials = userId?.replace("user_", "U").toUpperCase().slice(0, 2) || "??";
  return (
    <Tooltip title={userId} placement="top">
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: c.bg, color: c.fg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, border: `2px solid ${c.fg}40`,
        }}>{initials}</div>
        {showStatus && (
          <div style={{
            position: "absolute", bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: "50%",
            background: "#10b981", border: "2px solid #111927",
            boxShadow: "0 0 8px #10b981"
          }} />
        )}
      </div>
    </Tooltip>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function EventTimeline({ events = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch = e.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || e.event_type === filterType;
      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, filterType]);

  return (
    <Box sx={{ 
      background: "#111927", border: "1px solid rgba(255,255,255,0.07)", 
      borderRadius: "20px", padding: "24px", fontFamily: "'DM Sans', sans-serif" 
    }}>

      {/* Header with Streaming Indicator */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>
            LIVE ACTIVITY STREAM
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: 12 }}>
            Monitoring {filteredEvents.length} active sessions
          </Typography>
        </Box>
        <Box sx={{ 
          display: "flex", alignItems: "center", gap: 1, px: 2, py: 0.8, 
          borderRadius: "20px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)"
        }}>
          <Box className="pulse-dot" />
          <Typography sx={{ fontSize: 11, color: "#10b981", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>LIVE</Typography>
        </Box>
      </Box> */}
      {/* Header with Command Center Styling */}
<Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} sx={{ position: "relative" }}>
  <Box>
    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
      {/* Animated Signal Icon */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ 
          width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", 
          boxShadow: "0 0 10px #3b82f6", zIndex: 2 
        }} />
        <Box sx={{ 
          position: "absolute", width: 20, height: 20, borderRadius: "50%", 
          border: "1px solid #3b82f6", animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" 
        }} />
      </Box>
      
      <Typography sx={{ 
        fontSize: 12, fontWeight: 800, color: "#f8fafc", 
        letterSpacing: "0.2em", fontFamily: "'DM Mono', monospace",
        textTransform: "uppercase" 
      }}>
        Network Activity Node
      </Typography>
    </Box>

    <Box display="flex" alignItems="center" gap={1}>
      <Typography sx={{ color: "#475569", fontSize: 13, fontWeight: 500 }}>
        Active Sessions: 
      </Typography>
      <Typography sx={{ 
        color: "#3b82f6", fontSize: 13, fontWeight: 700, 
        fontFamily: "'DM Mono', monospace", background: "rgba(59, 130, 246, 0.1)",
        px: 1, borderRadius: "4px"
      }}>
        {filteredEvents.length.toString().padStart(3, '0')}
      </Typography>
    </Box>
  </Box>

  {/* High-Contrast Live Status */}
  <Box sx={{ 
    display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1, 
    borderRadius: "12px", 
    background: "rgba(16, 185, 129, 0.05)", 
    border: "1px solid rgba(16, 185, 129, 0.2)",
    backdropFilter: "blur(4px)",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)"
  }}>
    <Box sx={{ position: "relative", display: "flex" }}>
       <Box className="pulse-dot" sx={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
       <Box sx={{ 
         position: "absolute", inset: -4, borderRadius: "50%", 
         border: "2px solid #10b981", opacity: 0.4, animation: "ripple 1.5s infinite" 
       }} />
    </Box>
    <Typography sx={{ 
      fontSize: 11, color: "#10b981", fontWeight: 800, 
      fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" 
    }}>
      LIVE FEED
    </Typography>
  </Box>

  {/* CSS Animations */}
  <style>{`
    @keyframes ping {
      0% { transform: scale(1); opacity: 1; }
      70%, 100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes ripple {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .pulse-dot {
      box-shadow: 0 0 10px #10b981;
    }
  `}</style>
</Box>

      {/* Search & Filter Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ position: "relative", flex: 1 }}>
          <Search sx={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 20 }} />
          <input
            type="text" placeholder="Search user ID..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", padding: "12px 12px 12px 44px", background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f8fafc", fontSize: "0.9rem", outline: "none"
            }}
          />
        </Box>
        <select
          value={filterType} onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: "0 16px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", color: "#f8fafc", fontSize: "0.85rem", cursor: "pointer", outline: "none"
          }}
        >
          <option value="all">All Events</option>
          {Object.keys(EVENT_CONFIG).map(key => <option key={key} value={key}>{EVENT_CONFIG[key].label}</option>)}
        </select>
      </Box>

      {/* Events Table */}
      <Box sx={{ overflowX: "auto", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
          <thead>
            <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
              {["Event", "User Session", "Page", "Device", "Country", "Time"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "16px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {filteredEvents.map((e, i) => {
                const cfg = EVENT_CONFIG[e.event_type] || EVENT_CONFIG.page_view;
                const devCfg = DEVICE_CONFIG[e.device] || DEVICE_CONFIG.desktop;
                return (
                  <motion.tr
                    key={e.id || i} layout
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedUser(e)}
                    style={{ background: "rgba(255, 255, 255, 0.02)", cursor: "pointer", transition: "0.2s" }}
                    onMouseEnter={(e2) => e2.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                    onMouseLeave={(e2) => e2.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "8px", background: `${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${cfg.color}40` }}>
                          <cfg.Icon style={{ fontSize: 16, color: cfg.color }} />
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: "#f8fafc", fontSize: 13 }}>{cfg.label}</Typography>
                      </Box>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <UserAvatar userId={e.user_id} showStatus={true} />
                        <Typography sx={{ color: "#cbd5e1", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{e.user_id}</Typography>
                      </Box>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <code style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)", padding: "4px 8px", borderRadius: "6px", fontSize: 11 }}>{e.page}</code>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Box display="flex" alignItems="center" gap={1} color="#94a3b8">
                        <devCfg.Icon sx={{ fontSize: 18 }} />
                        <Typography variant="caption">{devCfg.label}</Typography>
                      </Box>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Typography sx={{ color: "#f8fafc", fontWeight: 600, fontSize: 12 }}>{e.country}</Typography>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Typography sx={{ color: "#64748b", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{formatTime(e.timestamp)}</Typography>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </Box>

      {/* User Detail Popup */}
      <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} PaperProps={{ sx: { background: "#1e293b", color: "#f8fafc", borderRadius: "20px", minWidth: "380px" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Session Details</Typography>
          <IconButton onClick={() => setSelectedUser(null)} sx={{ color: "#94a3b8" }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {selectedUser && (
            <Box py={1}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <UserAvatar userId={selectedUser.user_id} />
                <Box>
                  <Typography fontWeight={700} fontSize="1.1rem">{selectedUser.user_id}</Typography>
                  <Typography fontSize="0.75rem" color="#10b981">● Currently Active</Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                {[
                  { label: "Current Event", value: EVENT_CONFIG[selectedUser.event_type]?.label, icon: <Public sx={{ fontSize: 16 }} />, color: EVENT_CONFIG[selectedUser.event_type]?.color },
                  { label: "Location", value: selectedUser.country, icon: <Language sx={{ fontSize: 16 }} /> },
                  { label: "Path", value: selectedUser.page, icon: <Visibility sx={{ fontSize: 16 }} /> },
                  { label: "Time", value: formatTime(selectedUser.timestamp), icon: <Schedule sx={{ fontSize: 16 }} /> }
                ].map((item, idx) => (
                  <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 1 }}>{item.icon} {item.label}</Typography>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: item.color || "#f8fafc" }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
      `}</style>
    </Box>
  );
}