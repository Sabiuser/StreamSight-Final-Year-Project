
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Box, Typography, Avatar, Chip, IconButton,
  Divider, Button, TextField, Radio, RadioGroup,
  FormControlLabel, Tooltip, LinearProgress,
} from "@mui/material";
import {
  ShoppingBag, Delete, Add, Remove, FlashOn,
  LocalShipping, Shield, ArrowBack, Payment,
  CheckCircle, LocalOffer, CreditCard, AccountBalanceWallet,
  MoneyOff,
} from "@mui/icons-material";

const PRODUCT_IMGS = {
  prod_001: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  prod_002: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
  prod_003: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
  prod_004: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&h=80&fit=crop",
  prod_005: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop",
  prod_006: "https://images.unsplash.com/photo-1544244015-0df4592987d0?w=80&h=80&fit=crop",
  prod_007: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=80&fit=crop",
  prod_008: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&h=80&fit=crop",
  prod_009: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&h=80&fit=crop",
  prod_010: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&h=80&fit=crop",
  prod_011: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop",
  prod_012: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop",
};

const STEPS = ["Review Cart", "Address", "Payment"];

// ── shared TextField style so labels + input text are always visible ──────────
const inputSx = {
  "& .MuiInputLabel-root": {
    color: "#64748B",                          // label default colour
    fontSize: "0.875rem",
    "&.Mui-focused": { color: "#185FA5" },     // label when focused
  },
  "& .MuiOutlinedInput-root": {
    background: "#fff",
    borderRadius: 2,
    "& input": {
      color: "#1E293B",                        // typed text colour
      fontSize: "0.875rem",
      "&::placeholder": { color: "#CBD5E1", opacity: 1 },
    },
    "& fieldset": { borderColor: "#E2E8F0" },
    "&:hover fieldset": { borderColor: "#93C5FD" },
    "&.Mui-focused fieldset": { borderColor: "#185FA5" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────

function StepBar({ step }) {
  return (
    <Box display="flex" alignItems="center" mb={4}>
      {STEPS.map((label, i) => (
        <Box key={label} display="flex" alignItems="center" flex={i < STEPS.length - 1 ? 1 : 0}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: "50%",
              background: i < step ? "#059669" : i === step ? "linear-gradient(135deg,#378ADD,#185FA5)" : "#F1F5F9",
              border: i === step ? "2px solid #378ADD" : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: i === step ? "0 0 0 4px rgba(55,138,221,0.12)" : "none",
              transition: "all 0.3s",
            }}>
              {i < step
                ? <CheckCircle sx={{ color: "#fff", fontSize: 18 }} />
                : <Typography sx={{ color: i === step ? "#fff" : "#94A3B8", fontWeight: 700, fontSize: "0.8rem" }}>{i + 1}</Typography>
              }
            </Box>
            <Typography sx={{
              color: i === step ? "#1E293B" : "#94A3B8",
              fontSize: "0.72rem", fontWeight: i === step ? 700 : 500,
              mt: 0.5, whiteSpace: "nowrap",
            }}>
              {label}
            </Typography>
          </Box>
          {i < STEPS.length - 1 && (
            <Box sx={{
              flex: 1, height: 2, mx: 1, mb: 2.5,
              background: i < step ? "#059669" : "#E2E8F0",
              transition: "background 0.4s",
            }} />
          )}
        </Box>
      ))}
    </Box>
  );
}

// ── CartItem ──────────────────────────────────────────────────────────────────
// FIX: receives `onQty(id, absoluteNewQty)` — we compute new qty here and pass up
function CartItem({ item, onQty, onRemove }) {
  const img      = PRODUCT_IMGS[item.id] || PRODUCT_IMGS.prod_001;
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;
  const qty = item.qty || 1;

  return (
    <motion.div layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
      <Box sx={{
        display: "flex", gap: 2, py: 2, px: 2.5,
        borderRadius: 3, border: "1px solid #E8EDF3",
        background: "#FAFBFF", mb: 1.5,
        "&:hover": { borderColor: "#BFDBFE", boxShadow: "0 2px 12px rgba(55,138,221,0.07)" },
        transition: "all 0.2s",
      }}>
        {/* Image */}
        <Box sx={{ width: 80, height: 80, borderRadius: 2, overflow: "hidden", flexShrink: 0, border: "1px solid #E2E8F0" }}>
          <img src={img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>

        {/* Info */}
        <Box flex={1} minWidth={0}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
            <Box>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                {item.category}
              </Typography>
              <Typography fontWeight={700} sx={{ color: "#1E293B", fontSize: "0.92rem", lineHeight: 1.3 }}>
                {item.name}
              </Typography>
            </Box>
            <Tooltip title="Remove item">
              <IconButton
                size="small"
                onClick={() => onRemove(item.id)}
                sx={{ color: "#CBD5E1", "&:hover": { color: "#EF4444", background: "#FEF2F2" }, mt: -0.5 }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} flexWrap="wrap" gap={1}>
            {/* Price */}
            <Box display="flex" alignItems="baseline" gap={1}>
              <Typography sx={{ color: "#059669", fontWeight: 800, fontSize: "1.05rem" }}>
                ₹{(item.price * qty).toFixed(2)}
              </Typography>
              {qty > 1 && (
                <Typography sx={{ color: "#94A3B8", fontSize: "0.72rem" }}>
                  ₹{item.price.toFixed(2)} each
                </Typography>
              )}
              {discount > 0 && (
                <Chip
                  label={`-${discount}%`}
                  size="small"
                  sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700, background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
                />
              )}
            </Box>

            {/* Qty stepper — FIX: passes absolute new qty value */}
            <Box
              display="flex" alignItems="center" gap={0.5}
              sx={{ border: "1px solid #E2E8F0", borderRadius: 2, overflow: "hidden" }}
            >
              <IconButton
                size="small"
                onClick={() => onQty(item.id, qty - 1)}
                sx={{ borderRadius: 0, px: 0.8, "&:hover": { background: "#FEF2F2", color: "#EF4444" } }}
              >
                <Remove sx={{ fontSize: 14 }} />
              </IconButton>
              <Typography sx={{ px: 1.5, fontWeight: 700, fontSize: "0.85rem", color: "#1E293B", minWidth: 24, textAlign: "center" }}>
                {qty}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onQty(item.id, qty + 1)}
                sx={{ borderRadius: 0, px: 0.8, "&:hover": { background: "#EFF6FF", color: "#185FA5" } }}
              >
                <Add sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();

  const [step,      setStep]      = useState(0);
  const [coupon,    setCoupon]    = useState("");
  const [discount,  setDiscount]  = useState(0);
  const [couponOk,  setCouponOk]  = useState(false);
  const [payMethod, setPayMethod] = useState("upi");
  const [address,   setAddress]   = useState({ name: "", phone: "", pin: "", line: "", city: "" });

  // FIX: directProduct flow — seed into cart on first render so context drives state
  // If coming directly from a product page, treat it as the live cart (already added externally)
  // or fall back to location.state for the mini-preview. Either way, items always come from cartItems.
  const directProduct = location.state?.product;

  // If cart is empty but a direct product was passed, show just that product (read-only qty)
  const items = cartItems.length > 0
    ? cartItems
    : directProduct
      ? [{ ...directProduct, qty: 1 }]
      : [];

  const subtotal   = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping   = subtotal > 499 ? 0 : 49;
  const savings    = items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * (i.qty || 1), 0);
  const couponSave = discount;
  const total      = subtotal + shipping - couponSave;

  const applyCoupon = () => {
    const codes = { SAVE10: 0.10, STREAM20: 0.20, FLASH50: 0.50 };
    const key   = coupon.toUpperCase().trim();
    if (codes[key]) {
      setDiscount(subtotal * codes[key]);
      setCouponOk(true);
      toast.success(`🎉 Coupon applied! ${(codes[key] * 100).toFixed(0)}% off`);
    } else {
      toast.error("❌ Invalid coupon code");
      setCouponOk(false);
      setDiscount(0);
    }
  };

  // FIX: calls context updateQty with the new absolute qty value
  const handleQty = (id, newQty) => {
    updateQty(id, Math.max(1, newQty));
  };

  // FIX: calls context removeFromCart — now wired correctly
  const handleRemove = (id) => {
    removeFromCart(id);
    toast.info("Item removed from cart");
  };

  const handleNext = () => {
    if (step === 0) {
      if (items.length === 0) { toast.error("Your cart is empty!"); return; }
      setStep(1);
    } else if (step === 1) {
      if (!address.name || !address.phone || !address.pin || !address.line || !address.city) {
        toast.error("Please fill all address fields"); return;
      }
      setStep(2);
    } else {
      navigate("/payment", { state: { cartItems: items, total, payMethod, address, fromCheckout: true } });
    }
  };

  if (items.length === 0 && step === 0) {
    return (
      <Box sx={{ minHeight: "100vh", background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box textAlign="center">
          <Typography sx={{ fontSize: "3rem", mb: 2 }}>🛒</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#1E293B", mb: 1 }}>Your cart is empty</Typography>
          <Typography sx={{ color: "#64748B", mb: 3 }}>Add some products from ShopStream first</Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/ecommerce")}
            startIcon={<ShoppingBag />}
            sx={{
              borderRadius: 3, textTransform: "none", fontWeight: 700, px: 4,
              background: "linear-gradient(135deg,#378ADD,#185FA5)",
              boxShadow: "0 4px 14px rgba(55,138,221,0.3)",
            }}
          >
            Go to ShopStream
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#F8FAFF" }}>
      <style>{`@keyframes ss-shimmer{0%{background-position:0% 0}100%{background-position:300% 0}}`}</style>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Box sx={{
        background: "#fff", borderBottom: "1px solid #E2E8F0",
        px: { xs: 2, md: 4 }, py: 2,
        display: "flex", alignItems: "center", gap: 2,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(15,23,42,0.06)",
      }}>
        <Box sx={{
          height: 3, position: "absolute", top: 0, left: 0, right: 0,
          background: "linear-gradient(90deg,#378ADD,#1D9E75,#EF9F27,#7F77DD,#378ADD)",
          backgroundSize: "300% 100%", animation: "ss-shimmer 4s linear infinite",
        }} />
        <IconButton
          onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
          size="small"
          sx={{ border: "1px solid #E2E8F0", "&:hover": { background: "#F1F5F9" } }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        <Box>
          <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "1rem" }}>Checkout</Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "0.72rem" }}>
            {items.length} item{items.length !== 1 ? "s" : ""} · ₹{total.toFixed(2)} total
          </Typography>
        </Box>
        <Chip
          label="🔒 Secure Checkout" size="small"
          sx={{ ml: "auto", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontWeight: 600, fontSize: "0.68rem" }}
        />
      </Box>

      <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
        <StepBar step={step} />

        <Box display="flex" gap={3} flexWrap={{ xs: "wrap", md: "nowrap" }}>

          {/* ── LEFT: step content ───────────────────────────────────────────── */}
          <Box flex={1} minWidth={0}>
            <AnimatePresence mode="wait">

              {/* STEP 0 — Review Cart */}
              {step === 0 && (
                <motion.div key="cart" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #E2E8F0", p: 3, mb: 2, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
                      <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "1rem" }}>
                        🛒 Review Your Items
                      </Typography>
                      <Chip
                        label={`${items.length} items`} size="small"
                        sx={{ background: "#EFF6FF", color: "#185FA5", border: "1px solid #BFDBFE", fontWeight: 600 }}
                      />
                    </Box>
                    <AnimatePresence>
                      {items.map(item => (
                        <CartItem key={item.id} item={item} onQty={handleQty} onRemove={handleRemove} />
                      ))}
                    </AnimatePresence>
                  </Box>

                  {/* Coupon */}
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #E2E8F0", p: 3, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <LocalOffer sx={{ fontSize: 16, color: "#7C3AED" }} />
                      <Typography fontWeight={700} sx={{ color: "#1E293B", fontSize: "0.9rem" }}>Have a coupon?</Typography>
                    </Box>
                    <Box display="flex" gap={1.5}>
                      <TextField
                        size="small"
                        placeholder="Enter coupon code (try SAVE10)"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponOk(false); }}
                        sx={{
                          flex: 1,
                          // FIX: explicit input text colour so it's always visible
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "#fff",
                            "& input": {
                              color: "#1E293B",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontWeight: 600,
                              letterSpacing: 1,
                              "&::placeholder": { color: "#CBD5E1", opacity: 1 },
                            },
                            "& fieldset": { borderColor: couponOk ? "#A7F3D0" : "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#93C5FD" },
                            "&.Mui-focused fieldset": { borderColor: "#185FA5" },
                          },
                        }}
                      />
                      <Button
                        onClick={applyCoupon}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2.5,
                          borderColor: "#7C3AED", color: "#7C3AED",
                          "&:hover": { background: "#F5F3FF", borderColor: "#6D28D9" },
                        }}
                      >
                        Apply
                      </Button>
                    </Box>
                    {couponOk && (
                      <Box display="flex" alignItems="center" gap={0.8} mt={1}>
                        <CheckCircle sx={{ fontSize: 14, color: "#059669" }} />
                        <Typography sx={{ color: "#059669", fontSize: "0.78rem", fontWeight: 600 }}>
                          Coupon applied — you save ₹{couponSave.toFixed(2)}!
                        </Typography>
                      </Box>
                    )}
                    <Typography sx={{ color: "#94A3B8", fontSize: "0.68rem", mt: 1 }}>
                      Try: SAVE10 · STREAM20 · FLASH50
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* STEP 1 — Address */}
              {step === 1 && (
                <motion.div key="addr" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #E2E8F0", p: 3, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                      <LocalShipping sx={{ fontSize: 18, color: "#185FA5" }} />
                      <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "1rem" }}>Delivery Address</Typography>
                    </Box>

                    {/* FIX: all TextFields now use inputSx — labels and text are visible */}
                    <Box display="flex" flexDirection="column" gap={2}>
                      {[
                        { key: "name",  label: "Full Name",    placeholder: "Arjun Kumar" },
                        { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210" },
                        { key: "line",  label: "Address Line", placeholder: "12, MG Road, Koramangala" },
                        { key: "city",  label: "City",         placeholder: "Chennai" },
                        { key: "pin",   label: "PIN Code",     placeholder: "600001" },
                      ].map(f => (
                        <TextField
                          key={f.key}
                          size="small"
                          label={f.label}
                          placeholder={f.placeholder}
                          value={address[f.key]}
                          onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                          sx={inputSx}
                        />
                      ))}
                    </Box>

                    <Box mt={2.5} p={2} sx={{ borderRadius: 2, background: "#F0FBF8", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: 1.5 }}>
                      <LocalShipping sx={{ color: "#059669", fontSize: 18 }} />
                      <Box>
                        <Typography sx={{ color: "#065F46", fontSize: "0.8rem", fontWeight: 700 }}>
                          {shipping === 0 ? "🎉 Free Delivery!" : `Delivery: ₹${shipping}`}
                        </Typography>
                        <Typography sx={{ color: "#059669", fontSize: "0.68rem" }}>
                          {shipping === 0 ? "Order qualifies for free shipping" : "Free shipping on orders above ₹499"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* STEP 2 — Payment Method */}
              {step === 2 && (
                <motion.div key="pay" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #E2E8F0", p: 3, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                      <CreditCard sx={{ fontSize: 18, color: "#185FA5" }} />
                      <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "1rem" }}>Payment Method</Typography>
                    </Box>
                    <RadioGroup value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                      {[
                        { val: "upi",  icon: <AccountBalanceWallet sx={{ color: "#7C3AED" }} />, label: "UPI",                sub: "GPay, PhonePe, Paytm, BHIM" },
                        { val: "card", icon: <CreditCard          sx={{ color: "#185FA5" }} />, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay"      },
                        { val: "cod",  icon: <MoneyOff            sx={{ color: "#059669" }} />, label: "Cash on Delivery",    sub: "Pay when delivered"            },
                      ].map(opt => (
                        <Box
                          key={opt.val}
                          onClick={() => setPayMethod(opt.val)}
                          sx={{
                            display: "flex", alignItems: "center", gap: 2,
                            p: 2, mb: 1, borderRadius: 2, cursor: "pointer",
                            border: `1px solid ${payMethod === opt.val ? "#BFDBFE" : "#E2E8F0"}`,
                            background: payMethod === opt.val ? "#EFF6FF" : "#FAFBFF",
                            boxShadow: payMethod === opt.val ? "0 0 0 2px rgba(55,138,221,0.12)" : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          {opt.icon}
                          <Box flex={1}>
                            <Typography sx={{ color: "#1E293B", fontWeight: 700, fontSize: "0.9rem" }}>{opt.label}</Typography>
                            <Typography sx={{ color: "#94A3B8", fontSize: "0.72rem" }}>{opt.sub}</Typography>
                          </Box>
                          <Radio
                            value={opt.val}
                            checked={payMethod === opt.val}
                            size="small"
                            sx={{ color: "#185FA5", "&.Mui-checked": { color: "#185FA5" } }}
                          />
                        </Box>
                      ))}
                    </RadioGroup>

                    <Box mt={2} p={2} sx={{ borderRadius: 2, background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Shield sx={{ color: "#059669", fontSize: 18 }} />
                      <Typography sx={{ color: "#065F46", fontSize: "0.78rem", fontWeight: 600 }}>
                        100% Secure Payment · SSL Encrypted · Your card details are never stored
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}

            </AnimatePresence>
          </Box>

          {/* ── RIGHT: Order Summary ─────────────────────────────────────────── */}
          <Box sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0 }}>
            <Box sx={{
              background: "#fff", borderRadius: 3, border: "1px solid #E2E8F0",
              p: 3, position: "sticky", top: 88,
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}>
              <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "0.95rem", mb: 2 }}>
                Order Summary
              </Typography>

              {/* Mini item list */}
              <Box sx={{
                mb: 2, maxHeight: 180, overflowY: "auto",
                display: "flex", flexDirection: "column", gap: 1,
                "&::-webkit-scrollbar": { width: 3 },
                "&::-webkit-scrollbar-thumb": { background: "#E2E8F0", borderRadius: 2 },
              }}>
                {items.map(item => (
                  <Box key={item.id} display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 1.5, overflow: "hidden", flexShrink: 0, border: "1px solid #E2E8F0" }}>
                      <img
                        src={PRODUCT_IMGS[item.id] || PRODUCT_IMGS.prod_001}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Typography sx={{ color: "#1E293B", fontSize: "0.78rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ color: "#94A3B8", fontSize: "0.65rem" }}>qty {item.qty || 1}</Typography>
                    </Box>
                    <Typography sx={{ color: "#059669", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>
                      ₹{(item.price * (item.qty || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2, borderColor: "#F1F5F9" }} />

              {/* Price breakdown */}
              {[
                { label: "Subtotal", value: `₹${subtotal.toFixed(2)}`,                                    color: "#1E293B"  },
                { label: "Delivery", value: shipping === 0 ? "FREE 🎉" : `₹${shipping}`,                  color: shipping === 0 ? "#059669" : "#1E293B" },
                { label: "You save", value: `-₹${savings.toFixed(2)}`,                                    color: "#059669"  },
                ...(couponOk ? [{ label: "Coupon discount", value: `-₹${couponSave.toFixed(2)}`, color: "#7C3AED" }] : []),
              ].map(row => (
                <Box key={row.label} display="flex" justifyContent="space-between" mb={1}>
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.82rem" }}>{row.label}</Typography>
                  <Typography sx={{ color: row.color, fontWeight: 600, fontSize: "0.82rem" }}>{row.value}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />
              <Box display="flex" justifyContent="space-between" mb={2.5}>
                <Typography fontWeight={800} sx={{ color: "#1E293B" }}>Total</Typography>
                <Typography fontWeight={800} sx={{ color: "#059669", fontSize: "1.15rem" }}>₹{total.toFixed(2)}</Typography>
              </Box>

              {/* CTA button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#378ADD,#185FA5)",
                  color: "white", fontWeight: 800, fontSize: 15, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(55,138,221,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "inherit",
                }}
              >
                {step === 0
                  ? <><LocalShipping style={{ fontSize: 18 }} /> Proceed to Address</>
                  : step === 1
                    ? <><Payment style={{ fontSize: 18 }} /> Choose Payment</>
                    : <><FlashOn style={{ fontSize: 18 }} /> Confirm &amp; Pay ₹{total.toFixed(2)}</>
                }
              </motion.button>

              {step === 0 && (
                <Box mt={2} display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <Shield sx={{ fontSize: 14, color: "#94A3B8" }} />
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.68rem" }}>
                    Safe &amp; secure checkout · 30-day returns
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

