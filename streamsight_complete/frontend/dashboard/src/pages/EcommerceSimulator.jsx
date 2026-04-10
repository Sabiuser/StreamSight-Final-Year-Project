import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  AddShoppingCart,
  Payment,
  FlashOn,
  ExitToApp,
  BugReport,
  ShoppingCart,
  Close,
  Star,
  NavigateNext,
  NavigateBefore,
  TrendingUp,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Verified,
  RemoveRedEye,
  Timer,
  Bolt,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../hooks/useSocket";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ── PRODUCTS ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "prod_001",
    name: "AirPods Pro Max",
    category: "Electronics",
    price: 549.99,
    originalPrice: 699.99,
    rating: 4.8,
    reviews: 2341,
    stock: 12,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    id: "prod_002",
    name: "MacBook Air M3",
    category: "Electronics",
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.9,
    reviews: 1876,
    stock: 5,
    badge: "Hot",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
  },
  {
    id: "prod_003",
    name: "Nike Air Jordan 1",
    category: "Fashion",
    price: 180.0,
    originalPrice: 220.0,
    rating: 4.7,
    reviews: 5432,
    stock: 23,
    badge: "New Arrival",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  },
  {
    id: "prod_004",
    name: "Sony WH-1000XM5",
    category: "Electronics",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 3210,
    stock: 18,
    badge: "Top Pick",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
  },
  {
    id: "prod_005",
    name: "Levi's 501 Jeans",
    category: "Fashion",
    price: 89.99,
    originalPrice: 120.0,
    rating: 4.5,
    reviews: 8765,
    stock: 45,
    badge: "Classic",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
  },
  {
    id: "prod_006",
    name: 'iPad Pro 12.9"',
    category: "Electronics",
    price: 1099.99,
    originalPrice: 1199.99,
    rating: 4.9,
    reviews: 2098,
    stock: 8,
    badge: "Premium",
    img: "https://images.unsplash.com/photo-1544244015-0df4592987d0?w=400&h=300&fit=crop",
  },
  {
    id: "prod_007",
    name: "Atomic Habits",
    category: "Books",
    price: 16.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviews: 45621,
    stock: 100,
    badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
  },
  {
    id: "prod_008",
    name: "Samsung 4K Monitor",
    category: "Electronics",
    price: 599.99,
    originalPrice: 749.99,
    rating: 4.6,
    reviews: 1234,
    stock: 7,
    badge: "Deal",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
  },
  {
    id: "prod_009",
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 3456,
    stock: 34,
    badge: "Popular",
    img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop",
  },
  {
    id: "prod_010",
    name: "Adidas Ultraboost",
    category: "Sports",
    price: 190.0,
    originalPrice: 230.0,
    rating: 4.8,
    reviews: 7654,
    stock: 15,
    badge: "Top Seller",
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
  },
  {
    id: "prod_011",
    name: "KitchenAid Mixer",
    category: "Home",
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.9,
    reviews: 9876,
    stock: 6,
    badge: "Premium",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  },
  {
    id: "prod_012",
    name: "Dyson V15 Vacuum",
    category: "Home",
    price: 749.99,
    originalPrice: 849.99,
    rating: 4.7,
    reviews: 4321,
    stock: 11,
    badge: "Trending",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];

const CAROUSEL_ITEMS = PRODUCTS.slice(0, 4);
const CATEGORIES = ["All", "Electronics", "Fashion", "Books", "Sports", "Home"];

// ── Hashed avatar palette ────────────────────────────────────────────────────
const FAKE_USERS = [
  { name: "Priya", bg: "#E1F5EE", fg: "#0F6E56" },
  { name: "Rahul", bg: "#E6F1FB", fg: "#185FA5" },
  { name: "Sneha", bg: "#EEEDFE", fg: "#534AB7" },
  { name: "Arjun", bg: "#FAEEDA", fg: "#854F0B" },
  { name: "Divya", bg: "#FBEAF0", fg: "#993556" },
  { name: "Karan", bg: "#FAECE7", fg: "#993C1D" },
  { name: "Ananya", bg: "#EAF3DE", fg: "#3B6D11" },
  { name: "Vijay", bg: "#FCEBEB", fg: "#A32D2D" },
];

// ── Badge color map ──────────────────────────────────────────────────────────
const BADGE_MAP = {
  "Best Seller": { bg: "#FEF3C7", fg: "#92400E", border: "#FDE68A" },
  Hot: { bg: "#FEE2E2", fg: "#991B1B", border: "#FECACA" },
  "New Arrival": { bg: "#DCFCE7", fg: "#166534", border: "#BBF7D0" },
  "Top Pick": { bg: "#EDE9FE", fg: "#5B21B6", border: "#DDD6FE" },
  Classic: { bg: "#F1F5F9", fg: "#475569", border: "#E2E8F0" },
  Premium: { bg: "#FDF4FF", fg: "#7E22CE", border: "#F3E8FF" },
  Bestseller: { bg: "#FEF3C7", fg: "#92400E", border: "#FDE68A" },
  Deal: { bg: "#ECFDF5", fg: "#065F46", border: "#A7F3D0" },
  Popular: { bg: "#EFF6FF", fg: "#1E40AF", border: "#BFDBFE" },
  "Top Seller": { bg: "#FFF7ED", fg: "#9A3412", border: "#FED7AA" },
  Trending: { bg: "#FDF2F8", fg: "#9D174D", border: "#FBCFE8" },
};

// ── sendEvent ────────────────────────────────────────────────────────────────
function sendEvent(eventData) {
  const userId = `user_${Math.floor(Math.random() * 900) + 100}`;
  return fetch(`${API_URL}/api/simulate-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, ...eventData }),
  }).catch((err) => console.error("[simulate-event]", err));
}

// ── UserAvatar ───────────────────────────────────────────────────────────────
function UserAvatar({ user, size = 28 }) {
  return (
    <Tooltip title={user.name} placement="top">
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: user.bg,
          color: user.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.round(size * 0.35),
          fontWeight: 700,
          border: "2px solid white",
          flexShrink: 0,
          letterSpacing: "-0.01em",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          cursor: "default",
        }}
      >
        {user.name.slice(0, 2).toUpperCase()}
      </div>
    </Tooltip>
  );
}

// ── WatcherAvatars ───────────────────────────────────────────────────────────
function WatcherAvatars({ count }) {
  const visible = FAKE_USERS.slice(0, Math.min(4, count));
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((u, i) => (
        <div
          key={u.name}
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: visible.length - i }}
        >
          <UserAvatar user={u} size={26} />
        </div>
      ))}
      {count > 4 && (
        <div
          style={{
            marginLeft: -8,
            zIndex: 0,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#EEF3FF",
            color: "#185FA5",
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          +{count - 4}
        </div>
      )}
    </div>
  );
}

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{
            fontSize: size,
            color: i <= Math.round(rating) ? "#F59E0B" : "#E2E8F0",
          }}
        />
      ))}
    </span>
  );
}

// ── Carousel ─────────────────────────────────────────────────────────────────
function Carousel({ onEventSent }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(
      (p) => (p + dir + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length,
    );
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 4000);
    return () => clearInterval(t);
  }, []);

  const p = CAROUSEL_ITEMS[current];
  const discount = Math.round(
    ((p.originalPrice - p.price) / p.originalPrice) * 100,
  );
  const bs = BADGE_MAP[p.badge] || BADGE_MAP["Classic"];

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        height: 300,
        marginBottom: 32,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
      }}
    >
      {/* Animated rainbow top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg,#378ADD,#1D9E75,#EF9F27,#7F77DD,#378ADD)",
          backgroundSize: "300% 100%",
          animation: "ss-shimmer 4s linear infinite",
          zIndex: 5,
        }}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 60 }}
          transition={{ duration: 0.38, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "0 56px 0 48px",
              gap: 36,
            }}
          >
            {/* Left — text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: bs.bg,
                    color: bs.fg,
                    border: `1px solid ${bs.border}`,
                  }}
                >
                  {p.badge}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "#FEE2E2",
                    color: "#991B1B",
                    border: "1px solid #FECACA",
                  }}
                >
                  -{discount}% OFF
                </span>
              </div>
              <h2
                style={{
                  color: "#F1F5F9",
                  fontSize: 26,
                  fontWeight: 700,
                  margin: "0 0 4px",
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                }}
              >
                {p.name}
              </h2>
              <p style={{ color: "#94A3B8", margin: "0 0 14px", fontSize: 14 }}>
                {p.category}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#34D399",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ${p.price.toFixed(2)}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    color: "#475569",
                    textDecoration: "line-through",
                  }}
                >
                  ${p.originalPrice.toFixed(2)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#059669",
                    background: "#ECFDF5",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  Save ${(p.originalPrice - p.price).toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 22,
                }}
              >
                <Stars rating={p.rating} size={14} />
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#F59E0B" }}
                >
                  {p.rating}
                </span>
                <span style={{ fontSize: 12, color: "#64748B" }}>
                  ({p.reviews.toLocaleString()} reviews)
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sendEvent({
                      event_type: "purchase",
                      product_id: p.id,
                      price: p.price,
                      page: `/product/${p.id}`,
                      category: p.category,
                    });
                    navigate("/payment", { state: { product: p } });
                    onEventSent();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 22px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#1D9E75,#0F6E56)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(29,158,117,0.4)",
                  }}
                >
                  <FlashOn style={{ fontSize: 16 }} /> Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sendEvent({
                      event_type: "add_to_cart",
                      product_id: p.id,
                      price: p.price,
                      page: `/product/${p.id}`,
                      category: p.category,
                    });
                    addToCart(p);
                    toast.success("🛒 Added to cart!");
                    onEventSent();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 22px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#E2E8F0",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <AddShoppingCart style={{ fontSize: 16 }} /> Add to Cart
                </motion.button>
              </div>
            </div>

            {/* Right — image */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                width: 210,
                height: 210,
                borderRadius: 14,
                overflow: "hidden",
                flexShrink: 0,
                border: "2px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      {[
        { icon: <NavigateBefore />, dir: -1, side: "left" },
        { icon: <NavigateNext />, dir: 1, side: "right" },
      ].map((btn) => (
        <motion.button
          key={btn.side}
          whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.18)" }}
          whileTap={{ scale: 0.92 }}
          onClick={() => go(btn.dir)}
          style={{
            position: "absolute",
            top: "50%",
            [btn.side]: 14,
            transform: "translateY(-50%)",
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#CBD5E1",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4,
            transition: "background 0.2s",
          }}
        >
          {btn.icon}
        </motion.button>
      ))}

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
        }}
      >
        {CAROUSEL_ITEMS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            animate={{ width: i === current ? 24 : 7 }}
            style={{
              height: 7,
              borderRadius: 4,
              background: i === current ? "#34D399" : "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product, onEventSent }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [cartFlash, setCartFlash] = useState(false);

  // Live qty from cart context (replaces old local cartCount)
  const cartQty = cartItems.find((i) => i.id === product.id)?.qty || 0;

  const action = (type, extra = {}) =>
    sendEvent({
      event_type: type,
      product_id: product.id,
      price: product.price,
      page: `/product/${product.id}`,
      category: product.category,
      ...extra,
    });

  const handleView = () => {
    action("page_view");
    setDialogOpen(true);
    toast.info(`👁 Viewing ${product.name}`);
  };
  const handleCart = () => {
    action("add_to_cart");
    addToCart(product);
    setCartFlash(true);
    setTimeout(() => setCartFlash(false), 700);
    toast.success("🛒 Added to cart!");
    onEventSent();
  };
  const handleCheckout = () => {
    action("checkout");
    navigate("/payment", { state: { product } });
    onEventSent();
  };
  const handleBuy = () => {
    action("purchase");
    navigate("/payment", { state: { product } });
    onEventSent();
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const lowStock = product.stock <= 8;
  const bs = BADGE_MAP[product.badge] || BADGE_MAP["Classic"];

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1px solid #E8EDF3",
          boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.2s",
        }}
      >
        {/* ── Image ── */}
        <div
          style={{
            position: "relative",
            height: 200,
            overflow: "hidden",
            background: "#F8FAFC",
            flexShrink: 0,
          }}
        >
          <motion.img
            src={product.img}
            alt={product.name}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.38 }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Badges top-left */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                background: bs.bg,
                color: bs.fg,
                border: `1px solid ${bs.border}`,
              }}
            >
              {product.badge}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                background: "#FEE2E2",
                color: "#991B1B",
                border: "1px solid #FECACA",
              }}
            >
              -{discount}%
            </span>
          </div>

          {/* Wishlist top-right */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setWishlist((v) => !v);
              toast.info(
                wishlist ? "Removed from wishlist" : "❤️ Added to wishlist!",
              );
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {wishlist ? (
              <Favorite style={{ fontSize: 16, color: "#E24B4A" }} />
            ) : (
              <FavoriteBorder style={{ fontSize: 16, color: "#94A3B8" }} />
            )}
          </motion.button>

          {/* Cart qty badge (live from context) */}
          {cartQty > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: "absolute",
                top: 46,
                right: 10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: cartFlash ? "#1D9E75" : "#EEF3FF",
                border: `2px solid ${cartFlash ? "#1D9E75" : "#378ADD"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: cartFlash ? "white" : "#185FA5",
                }}
              >
                {cartQty}
              </span>
            </motion.div>
          )}

          {/* Low stock bar — LinearProgress from old code restored */}
          {lowStock && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "6px 10px",
                background: "rgba(255,255,255,0.94)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span
                  style={{ fontSize: 10, color: "#D97706", fontWeight: 600 }}
                >
                  Only {product.stock} left!
                </span>
                <span style={{ fontSize: 10, color: "#94A3B8" }}>
                  Selling fast 🔥
                </span>
              </div>
              <LinearProgress
                variant="determinate"
                value={(product.stock / 20) * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#FEF3C7",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#F59E0B",
                    borderRadius: 2,
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div
          style={{
            padding: "14px 16px 16px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#94A3B8",
              fontWeight: 500,
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {product.category}
          </span>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#1E293B",
              margin: "0 0 8px",
              lineHeight: 1.35,
            }}
          >
            {product.name}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <Stars rating={product.rating} size={12} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#F59E0B" }}>
              {product.rating}
            </span>
            <span style={{ fontSize: 11, color: "#CBD5E1" }}>
              ({product.reviews.toLocaleString()})
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#059669",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${product.price.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#CBD5E1",
                textDecoration: "line-through",
              }}
            >
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 14,
            }}
          >
            <LocalShipping style={{ fontSize: 13, color: "#1D9E75" }} />
            <span style={{ fontSize: 11, color: "#1D9E75", fontWeight: 500 }}>
              Free delivery
            </span>
            <Verified
              style={{ fontSize: 13, color: "#378ADD", marginLeft: 6 }}
            />
            <span style={{ fontSize: 11, color: "#378ADD", fontWeight: 500 }}>
              Verified seller
            </span>
          </div>

          {/* 4 Action buttons — with ss-action-btn class from old code */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              marginTop: "auto",
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              <Tooltip title="View product details">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleView}
                  className="ss-action-btn"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    color: "#64748B",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <Visibility style={{ fontSize: 14 }} /> View
                </motion.button>
              </Tooltip>
              <Tooltip title="Add to cart">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCart}
                  className="ss-action-btn"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid #BFDBFE",
                    background: "#EFF6FF",
                    color: "#185FA5",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <AddShoppingCart style={{ fontSize: 14 }} /> Cart{" "}
                  {cartQty > 0 && `(${cartQty})`}
                </motion.button>
              </Tooltip>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <Tooltip title="Go to checkout — review cart and pay">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="ss-action-btn"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid #DDD6FE",
                    background: "#F5F3FF",
                    color: "#5B21B6",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <Payment style={{ fontSize: 14 }} /> Checkout
                </motion.button>
              </Tooltip>
              <Tooltip title="Buy Now — skip cart, go directly to payment">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuy}
                  className="ss-action-btn"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    height: 34,
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg,#1D9E75,#0F6E56)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(29,158,117,0.28)",
                  }}
                >
                  <FlashOn style={{ fontSize: 14 }} /> Buy Now
                </motion.button>
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Product Detail Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid #E2E8F0",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #F1F5F9",
            pb: 1.5,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1E293B" }}>
            {product.name}
          </span>
          <IconButton
            onClick={() => setDialogOpen(false)}
            size="small"
            sx={{ color: "#94A3B8", "&:hover": { background: "#F1F5F9" } }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <div
            style={{
              height: 220,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <img
              src={product.img}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 20,
                background: bs.bg,
                color: bs.fg,
                border: `1px solid ${bs.border}`,
              }}
            >
              {product.badge}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 20,
                background: "#F1F5F9",
                color: "#475569",
                border: "1px solid #E2E8F0",
              }}
            >
              {product.category}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 20,
                background: lowStock ? "#FEF3C7" : "#DCFCE7",
                color: lowStock ? "#92400E" : "#166534",
                border: `1px solid ${lowStock ? "#FDE68A" : "#BBF7D0"}`,
              }}
            >
              Stock: {product.stock}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 800, color: "#059669" }}>
              ${product.price.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 15,
                color: "#CBD5E1",
                textDecoration: "line-through",
              }}
            >
              ${product.originalPrice.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#059669",
                background: "#ECFDF5",
                padding: "2px 8px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              -{discount}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Stars rating={product.rating} size={15} />
            <span style={{ fontWeight: 700, color: "#F59E0B", fontSize: 14 }}>
              {product.rating}
            </span>
            <span style={{ color: "#94A3B8", fontSize: 13 }}>
              · {product.reviews.toLocaleString()} reviews
            </span>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, borderTop: "1px solid #F1F5F9" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCart}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 9,
              border: "1px solid #BFDBFE",
              background: "#EFF6FF",
              color: "#185FA5",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <AddShoppingCart style={{ fontSize: 16 }} /> Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              handleBuy();
              setDialogOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 9,
              border: "none",
              background: "linear-gradient(135deg,#1D9E75,#0F6E56)",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(29,158,117,0.3)",
            }}
          >
            <FlashOn style={{ fontSize: 16 }} /> Buy Now
          </motion.button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ── Main EcommerceSimulator ───────────────────────────────────────────────────
export default function EcommerceSimulator() {
  const { metrics } = useSocket();
  const { totalItems, cartItems } = useCart();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState(0);
  const [sessionEvents, setSessionEvents] = useState(0);
  const [filter, setFilter] = useState("All");

  // Flash sale countdown
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 34 * 60 + 18);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  // Socket sync
  useEffect(() => {
    if (metrics?.active_users) setActiveUsers(metrics.active_users);
  }, [metrics]);

  // Auto-fluctuate active users
  useEffect(() => {
    const iv = setInterval(() => {
      setActiveUsers((v) => Math.max(8, v + Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const handleEventSent = () => setSessionEvents((v) => v + 1);

  const handleLeave = () => {
    sendEvent({
      event_type: "page_view",
      page: "/exit",
      product_id: "none",
      price: 0,
      is_anomalous: false,
    });
    toast.warning("👋 User left the website — bounce event sent!", {
      autoClose: 2500,
    });
    handleEventSent();
  };

  const handleHack = () => {
    sendEvent({
      event_type: "purchase",
      page: "/checkout",
      product_id: "prod_hack",
      price: 9999.99,
      is_anomalous: true,
      category: "Exploit",
    });
    toast.error("🔴 Attack simulated! ML model detecting anomaly...", {
      autoClose: 3500,
    });
    handleEventSent();
  };

  const filtered =
    filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <>
      <style>{`
        @keyframes ss-shimmer { 0%{background-position:0% 0} 100%{background-position:300% 0} }
        @keyframes ss-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.82)} }
        .ss-cat-chip  { transition: all 0.18s; }
        .ss-cat-chip:hover { transform: translateY(-1px); }
        .ss-action-btn { transition: all 0.15s; }
        .ss-action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Flash Sale Banner ── */}
        <div
          style={{
            marginBottom: 20,
            padding: "12px 20px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#7f1d1d,#991b1b,#b91c1c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Bolt
              style={{
                color: "#fbbf24",
                fontSize: 28,
                animation: "ss-pulse 1s ease-in-out infinite",
              }}
            />
            <div>
              <div
                style={{
                  color: "#fbbf24",
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                }}
              >
                ⚡ FLASH SALE — Up to 50% OFF
              </div>
              <div style={{ color: "#fca5a5", fontSize: 12 }}>
                Hurry! Limited stock · Deal ends soon
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Timer style={{ color: "#fbbf24", fontSize: 18 }} />
            <span style={{ color: "#fca5a5", fontSize: 13, fontWeight: 500 }}>
              Ends in:
            </span>
            {[hrs, mins, secs].map((v, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    background: "#7f1d1d",
                    border: "1px solid #ef4444",
                    color: "#fbbf24",
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 800,
                    fontSize: 16,
                    minWidth: 42,
                    textAlign: "center",
                  }}
                >
                  {v}
                </div>
                {i < 2 && (
                  <span style={{ color: "#fbbf24", fontWeight: 800 }}>:</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* Title + subtitle */}
            <div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#E11D48",
                  margin: 0,
                  letterSpacing: "-0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>🛍</span> ShopStream
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  {PRODUCTS.length} Products
                </span>
              </h1>
              <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
                Live e-commerce simulation · Every action sends real events to
                the pipeline
              </p>
            </div>

            {/* Live stats chips */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Active users with avatar stack */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#F0FBF8",
                  border: "1px solid #A7F3D0",
                  borderRadius: 24,
                  padding: "6px 14px 6px 8px",
                }}
              >
                <WatcherAvatars count={Math.min(activeUsers, 8)} />
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#1D9E75",
                      animation: "ss-pulse 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#065F46" }}
                  >
                    {activeUsers} Active Users
                  </span>
                </div>
              </div>

              {/* Events sent */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 24,
                  padding: "6px 14px",
                }}
              >
                <TrendingUp style={{ fontSize: 16, color: "#1D4ED8" }} />
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}
                >
                  {sessionEvents} Events Sent
                </span>
              </div>

              {/* Cart checkout button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (cartItems.length > 0)
                    navigate("/payment", { state: { cartItems } });
                  else toast.info("Cart is empty — add some products first!");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background:
                    totalItems > 0
                      ? "linear-gradient(135deg,#059669,#047857)"
                      : "#f1f5f9",
                  color: totalItems > 0 ? "white" : "#64748b",
                  border: `1px solid ${totalItems > 0 ? "#10b981" : "#e2e8f0"}`,
                  borderRadius: 24,
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow:
                    totalItems > 0 ? "0 4px 12px rgba(5,150,105,0.3)" : "none",
                }}
              >
                <ShoppingCart style={{ fontSize: 18 }} />
                {totalItems > 0
                  ? `Checkout (${totalItems} items)`
                  : "Cart Empty"}
              </motion.button>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Tooltip title="Simulate user leaving website (triggers bounce event in Kafka)">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLeave}
                className="ss-action-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: "1px solid #FDE68A",
                  background: "#FFFBEB",
                  color: "#92400E",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ExitToApp style={{ fontSize: 16, color: "#D97706" }} /> Leave
                Website
              </motion.button>
            </Tooltip>

            <Tooltip title="Simulate fraud — price $9999 triggers Isolation Forest ML detection">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleHack}
                className="ss-action-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  color: "#991B1B",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <BugReport style={{ fontSize: 16, color: "#EF4444" }} />{" "}
                Simulate Attack
              </motion.button>
            </Tooltip>

            {/* Watching Now — restored from old code */}
            <Tooltip title="Real-time viewers on this page">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: "1px solid #DDD6FE",
                  background: "#F5F3FF",
                  color: "#5B21B6",
                  fontSize: 13,
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                <RemoveRedEye style={{ fontSize: 16, color: "#7C3AED" }} />
                {activeUsers} Watching Now
              </div>
            </Tooltip>
          </div>
        </div>

        {/* ── Carousel ── */}
        <Carousel onEventSent={handleEventSent} />

        {/* ── Category filter — with ss-cat-chip class from old code ── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter(cat)}
                className="ss-cat-chip"
                style={{
                  padding: "7px 18px",
                  borderRadius: 24,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  border: active ? "none" : "1px solid #E2E8F0",
                  background: active
                    ? "linear-gradient(135deg,#378ADD,#185FA5)"
                    : "#FFFFFF",
                  color: active ? "white" : "#64748B",
                  cursor: "pointer",
                  boxShadow: active
                    ? "0 4px 12px rgba(55,138,221,0.28)"
                    : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {cat}
              </motion.button>
            );
          })}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              color: "#94a3b8",
              paddingLeft: 8,
            }}
          >
            Showing {filtered.length} of {PRODUCTS.length} products
          </span>
        </div>

        {/* ── Products Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              style={{ height: "100%" }}
            >
              <ProductCard product={product} onEventSent={handleEventSent} />
            </motion.div>
          ))}
        </div>

        {/* ── Info banner ── */}
        <div
          style={{
            marginTop: 32,
            padding: "16px 20px",
            borderRadius: 12,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <TrendingUp
            style={{ color: "#1D4ED8", fontSize: 22, flexShrink: 0 }}
          />
          <p
            style={{
              color: "#1E40AF",
              fontSize: 13,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Every button click sends a real clickstream event → Kafka → Spark →
            MongoDB → Dashboard updates in real-time. Click{" "}
            <strong>Buy Now</strong> to navigate to the Payment page, or{" "}
            <strong>Simulate Attack</strong> to trigger ML anomaly detection.
          </p>
        </div>
      </div>
    </>
  );
}
