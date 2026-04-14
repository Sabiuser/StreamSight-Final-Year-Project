import { useState, useCallback } from "react";
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
} from "@mui/icons-material";
import { toast } from "react-toastify";

const DRAWER_W = 260;
const COLLAPSED_W = 72;

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: <Dashboard />, color: "#1D9E75" },
  {
    to: "/analytics",
    label: "Insights",
    icon: <Analytics />,
    color: "#7F77DD",
  },
  {
    to: "/ecommerce",
    label: "ShopStream",
    icon: <StorefrontOutlined />,
    color: "#EF9F27",
  },
  {
    to: "/user-activity",
    label: "User Activity",
    icon: <PeopleOutlined />,
    color: "#3b82f6",
  },
];

const QUICK_LINKS = [
  {
    to: "/flash-sales",
    label: "Flash Sales",
    icon: LocalOfferOutlined,
    color: "#F43F5E",
  },
  {
    to: "/orders",
    label: "My Orders",
    icon: ShoppingBagOutlined,
    color: "#3B82F6",
  },
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

  const user = localStorage.getItem("ss_user") || "User";
  const role = (localStorage.getItem("ss_role") || "viewer").toLowerCase();
  const width = collapsed ? COLLAPSED_W : DRAWER_W;

  const allowedPaths = ROLE_ACCESS[role] || [];
  const visibleNav = NAV_ITEMS.filter((item) => allowedPaths.includes(item.to));
  const visibleQuick = QUICK_LINKS.filter((link) =>
    allowedPaths.includes(link.to),
  );

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
      <Box
        sx={{
          px: 2,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <ElectricBolt sx={{ color: "#10B981" }} />
          {!collapsed && (
            <Typography sx={{ color: "white", fontWeight: 700 }}>
              StreamSight
            </Typography>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "#64748B" }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, px: collapsed ? 1 : 2 }}>
        {!collapsed && (
          <Typography
            sx={{
              px: 1,
              mt: 2,
              mb: 1,
              color: "#475569",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Navigation
          </Typography>
        )}
        <List dense>
          {visibleNav.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.active": {
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "#10B981",
                },
                color: "#94A3B8",
              }}
            >
              <ListItemIcon
                sx={{ minWidth: collapsed ? 0 : 35, color: "inherit" }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                />
              )}
            </ListItemButton>
          ))}
        </List>

        {visibleQuick.length > 0 && !collapsed && (
          <>
            <Typography
              sx={{
                px: 1,
                mt: 3,
                mb: 1,
                color: "#475569",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Services
            </Typography>
            <List dense>
              {visibleQuick.map((link) => (
                <ListItemButton
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: "#94A3B8",
                    "&.active": {
                      bgcolor: "rgba(59, 130, 246, 0.1)",
                      color: "#3B82F6",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 35, color: "inherit" }}>
                    <link.icon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontSize: 13 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
          }}
        >
          {user[0].toUpperCase()}
        </Box>
        {!collapsed && (
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <Typography
              noWrap
              sx={{ color: "white", fontSize: 12, fontWeight: 600 }}
            >
              {user}
            </Typography>
            <Typography
              sx={{
                color: "#10B981",
                fontSize: 10,
                textTransform: "uppercase",
              }}
            >
              {role}
            </Typography>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={handleLogout}
          sx={{ color: "#64748B" }}
        >
          <LogoutOutlined fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
