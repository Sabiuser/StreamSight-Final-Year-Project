
// import { useState, useEffect, useCallback } from "react";
// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   List,
//   ListItemIcon,
//   ListItemText,
//   ListItemButton,
//   Typography,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import {
//   Dashboard,
//   Analytics,
//   StorefrontOutlined,
//   ElectricBolt,
//   ChevronLeft,
//   ChevronRight,
//   LogoutOutlined,
//   LocalOfferOutlined,
//   ShoppingBagOutlined,
//   PeopleOutlined,
//   CreditCard,
// } from "@mui/icons-material";
// import { toast } from "react-toastify";

// const DRAWER_W = 260;
// const COLLAPSED_W = 72;

// const NAV_ITEMS = [
//   { to: "/", label: "Dashboard", icon: <Dashboard />, color: "#1D9E75" },
//   {
//     to: "/analytics",
//     label: "Insights",
//     icon: <Analytics />,
//     color: "#7F77DD",
//   },
//   {
//     to: "/ecommerce",
//     label: "ShopStream",
//     icon: <StorefrontOutlined />,
//     color: "#EF9F27",
//   },
//   {
//     to: "/user-activity",
//     label: "User Activity",
//     icon: <PeopleOutlined />,
//     color: "#3b82f6",
//   },
// ];

// const QUICK_LINKS = [
//   {
//     to: "/flash-sales",
//     label: "Flash Sales",
//     icon: LocalOfferOutlined,
//     color: "#F43F5E",
//   },
//   {
//     to: "/orders",
//     label: "My Orders",
//     icon: ShoppingBagOutlined,
//     color: "#3B82F6",
//   },
// ];

// const ROLE_ACCESS = {
//   admin: ["/", "/analytics", "/user-activity"],
//   analyst: ["/", "/analytics"],
//   viewer: ["/", "/analytics"],
//   customer: ["/ecommerce", "/flash-sales", "/orders"],
// };

// export default function Navbar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const user = localStorage.getItem("ss_user") || "User";
//   const role = (localStorage.getItem("ss_role") || "viewer").toLowerCase();
//   const width = collapsed ? COLLAPSED_W : DRAWER_W;

//   const allowedPaths = ROLE_ACCESS[role] || [];
//   const visibleNav = NAV_ITEMS.filter((item) => allowedPaths.includes(item.to));
//   const visibleQuick = QUICK_LINKS.filter((link) =>
//     allowedPaths.includes(link.to),
//   );

//   const handleLogout = useCallback(() => {
//     localStorage.clear();
//     toast.info("👋 Logged out");
//     navigate("/login");
//   }, [navigate]);

//   return (
//     <Box
//       component="nav"
//       sx={{
//         width,
//         flexShrink: 0,
//         position: "sticky",
//         top: 0,
//         height: "100vh",
//         transition: "width 0.3s",
//         background: "#0a0f1a",
//         borderRight: "1px solid rgba(255,255,255,0.08)",
//         display: "flex",
//         flexDirection: "column",
//         zIndex: 100,
//         overflowX: "hidden",
//       }}
//     >
//       <Box
//         sx={{
//           px: 2,
//           py: 2.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box display="flex" alignItems="center" gap={1.5}>
//           <ElectricBolt sx={{ color: "#10B981" }} />
//           {!collapsed && (
//             <Typography sx={{ color: "white", fontWeight: 700 }}>
//               StreamSight
//             </Typography>
//           )}
//         </Box>
//         <IconButton
//           size="small"
//           onClick={() => setCollapsed(!collapsed)}
//           sx={{ color: "#64748B" }}
//         >
//           {collapsed ? <ChevronRight /> : <ChevronLeft />}
//         </IconButton>
//       </Box>

//       <Box sx={{ flex: 1, px: collapsed ? 1 : 2 }}>
//         {!collapsed && (
//           <Typography
//             sx={{
//               px: 1,
//               mt: 2,
//               mb: 1,
//               color: "#475569",
//               fontSize: 10,
//               fontWeight: 700,
//               textTransform: "uppercase",
//             }}
//           >
//             Navigation
//           </Typography>
//         )}
//         <List dense>
//           {visibleNav.map((item) => (
//             <ListItemButton
//               key={item.to}
//               component={NavLink}
//               to={item.to}
//               sx={{
//                 borderRadius: 2,
//                 mb: 0.5,
//                 "&.active": {
//                   bgcolor: "rgba(16, 185, 129, 0.1)",
//                   color: "#10B981",
//                 },
//                 color: "#94A3B8",
//               }}
//             >
//               <ListItemIcon
//                 sx={{ minWidth: collapsed ? 0 : 35, color: "inherit" }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               {!collapsed && (
//                 <ListItemText
//                   primary={item.label}
//                   primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
//                 />
//               )}
//             </ListItemButton>
//           ))}
//         </List>

//         {visibleQuick.length > 0 && !collapsed && (
//           <>
//             <Typography
//               sx={{
//                 px: 1,
//                 mt: 3,
//                 mb: 1,
//                 color: "#475569",
//                 fontSize: 10,
//                 fontWeight: 700,
//                 textTransform: "uppercase",
//               }}
//             >
//               Services
//             </Typography>
//             <List dense>
//               {visibleQuick.map((link) => (
//                 <ListItemButton
//                   key={link.to}
//                   component={NavLink}
//                   to={link.to}
//                   sx={{
//                     borderRadius: 2,
//                     mb: 0.5,
//                     color: "#94A3B8",
//                     "&.active": {
//                       bgcolor: "rgba(59, 130, 246, 0.1)",
//                       color: "#3B82F6",
//                     },
//                   }}
//                 >
//                   <ListItemIcon sx={{ minWidth: 35, color: "inherit" }}>
//                     <link.icon sx={{ fontSize: 18 }} />
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={link.label}
//                     primaryTypographyProps={{ fontSize: 13 }}
//                   />
//                 </ListItemButton>
//               ))}
//             </List>
//           </>
//         )}
//       </Box>

//       <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
//       <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
//         <Box
//           sx={{
//             width: 32,
//             height: 32,
//             borderRadius: "50%",
//             bgcolor: "#10B981",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "white",
//             fontWeight: 700,
//           }}
//         >
//           {user[0].toUpperCase()}
//         </Box>
//         {!collapsed && (
//           <Box sx={{ flex: 1, overflow: "hidden" }}>
//             <Typography
//               noWrap
//               sx={{ color: "white", fontSize: 12, fontWeight: 600 }}
//             >
//               {user}
//             </Typography>
//             <Typography
//               sx={{
//                 color: "#10B981",
//                 fontSize: 10,
//                 textTransform: "uppercase",
//               }}
//             >
//               {role}
//             </Typography>
//           </Box>
//         )}
//         <IconButton
//           size="small"
//           onClick={handleLogout}
//           sx={{ color: "#64748B" }}
//         >
//           <LogoutOutlined fontSize="small" />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// }


import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Divider,
  Badge,
} from "@mui/material";
import {
  Dashboard,
  Analytics,
  StorefrontOutlined,
  ElectricBolt,
  ChevronLeft,
  ChevronRight,
  LogoutOutlined,
  LocalOfferOutlined,
  ShoppingBagOutlined,
  PeopleOutlined,
  CreditCard,
  Shield,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const DRAWER_W = 260;
const COLLAPSED_W = 72;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: <Dashboard />, color: "#1D9E75" },
  { to: "/analytics", label: "Insights", icon: <Analytics />, color: "#7F77DD" },
  { to: "/ecommerce", label: "ShopStream", icon: <StorefrontOutlined />, color: "#EF9F27" },
  { to: "/user-activity", label: "User Activity", icon: <PeopleOutlined />, color: "#3b82f6" },
];

const QUICK_LINKS = [
  { to: "/flash-sales", label: "Flash Sales", icon: LocalOfferOutlined, color: "#F43F5E" },
  { to: "/orders", label: "My Orders", icon: ShoppingBagOutlined, color: "#3B82F6" },
];

const ROLE_ACCESS = {
  admin: ["/", "/analytics", "/user-activity"],
  analyst: ["/", "/analytics"],
  viewer: ["/", "/analytics"],
  customer: ["/ecommerce", "/flash-sales", "/orders"],
};

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Live threat count — poll anomalies to show badge on Dashboard nav item
  const [threatCount, setThreatCount] = useState(0);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/anomalies`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setThreatCount(data.length);
        }
      } catch (_) {}
    };
    fetchThreats();
    const iv = setInterval(fetchThreats, 8000);
    return () => clearInterval(iv);
  }, []);
  

  const user = localStorage.getItem("ss_user") || "User";
  const role = (localStorage.getItem("ss_role") || "viewer").toLowerCase();
  const width = collapsed ? COLLAPSED_W : DRAWER_W;

  const allowedPaths = ROLE_ACCESS[role] || [];
  const visibleNav = NAV_ITEMS.filter((item) => allowedPaths.includes(item.to));
  const visibleQuick = QUICK_LINKS.filter((link) => allowedPaths.includes(link.to));

  const isAdmin = role === "admin" || role === "analyst";

  const handleLogout = useCallback(() => {
    localStorage.clear();
    toast.info("👋 Logged out");
    navigate("/login");
  }, [navigate]);

  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        transition: "width 0.3s",
        background: "#0a0f1a",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <ElectricBolt sx={{ color: "#10B981" }} />
          {!collapsed && (
            <Typography sx={{ color: "white", fontWeight: 700 }}>StreamSight</Typography>
          )}
        </Box>
        <IconButton size="small" onClick={() => setCollapsed(!collapsed)} sx={{ color: "#64748B" }}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, px: collapsed ? 1 : 2 }}>
        {!collapsed && (
          <Typography sx={{ px: 1, mt: 2, mb: 1, color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
            Navigation
          </Typography>
        )}
        <List dense>
          {visibleNav.map((item) => {
            // Show threat badge on Dashboard item for admin/analyst
            const showThreatBadge = isAdmin && item.to === "/" && threatCount > 0;
            return (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                sx={{
                  borderRadius: 2, mb: 0.5,
                  "&.active": { bgcolor: "rgba(16, 185, 129, 0.1)", color: "#10B981" },
                  color: "#94A3B8",
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 35, color: "inherit" }}>
                  {showThreatBadge ? (
                    <Badge
                      badgeContent={threatCount > 9 ? "9+" : threatCount}
                      sx={{ "& .MuiBadge-badge": { bgcolor: "#ef4444", color: "white", fontSize: 9, minWidth: 16, height: 16, padding: "0 3px" } }}
                    >
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                  />
                )}
                {/* Threat indicator dot on right when not collapsed */}
                {!collapsed && showThreatBadge && (
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#ef4444", flexShrink: 0, animation: "navPulse 2s ease-in-out infinite", "@keyframes navPulse": { "0%,100%": { opacity: 1, transform: "scale(1)" }, "50%": { opacity: 0.5, transform: "scale(0.7)" } } }} />
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* Threat Security section — admin only, not collapsed */}
        {isAdmin && !collapsed && (
          <>
            <Typography sx={{ px: 1, mt: 3, mb: 1, color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
              Security
            </Typography>
            <ListItemButton
              component={NavLink}
              to="/"
              onClick={() => {
                // Scroll to threat panel on dashboard
                setTimeout(() => {
                  const el = document.getElementById("threat-panel");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              sx={{
                borderRadius: 2, mb: 0.5, color: "#94A3B8",
                "&:hover": { bgcolor: "rgba(239,68,68,0.06)", color: "#f87171" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 35, color: "inherit" }}>
                <Badge
                  badgeContent={threatCount || null}
                  sx={{ "& .MuiBadge-badge": { bgcolor: "#ef4444", color: "white", fontSize: 9, minWidth: 16, height: 16, padding: "0 3px" } }}
                >
                  <Shield sx={{ fontSize: 20 }} />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Threat Center"
                secondary={threatCount > 0 ? `${threatCount} active threat${threatCount !== 1 ? "s" : ""}` : "No active threats"}
                primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                secondaryTypographyProps={{ fontSize: 10, color: threatCount > 0 ? "#ef4444" : "#334155" }}
              />
            </ListItemButton>
          </>
        )}

        {visibleQuick.length > 0 && !collapsed && (
          <>
            <Typography sx={{ px: 1, mt: 3, mb: 1, color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
              Services
            </Typography>
            <List dense>
              {visibleQuick.map((link) => (
                <ListItemButton
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    borderRadius: 2, mb: 0.5, color: "#94A3B8",
                    "&.active": { bgcolor: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 35, color: "inherit" }}>
                    <link.icon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: 13 }} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}
        >
          {user[0].toUpperCase()}
        </Box>
        {!collapsed && (
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <Typography noWrap sx={{ color: "white", fontSize: 12, fontWeight: 600 }}>{user}</Typography>
            <Typography sx={{ color: "#10B981", fontSize: 10, textTransform: "uppercase" }}>{role}</Typography>
          </Box>
        )}
        <IconButton size="small" onClick={handleLogout} sx={{ color: "#64748B" }}>
          <LogoutOutlined fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
