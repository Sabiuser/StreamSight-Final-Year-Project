import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Box,
  Grid,
  Typography,
  Divider,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  LocalShipping,
  VerifiedUser,
  CreditCard,
  AccountBalanceWallet,
  LocalAtm,
  CheckCircle,
  Lock,
  FlashOn,
  Timer,
  Shield,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function sendEvent(eventData) {
  const userId =
    localStorage.getItem("ss_user") ||
    `user_${Math.floor(Math.random() * 900) + 100}`;
  return fetch(`${API_URL}/api/simulate-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, ...eventData }),
  }).catch(console.error);
}

// Confetti burst on success
function Confetti() {
  const colors = [
    "#00d4aa",
    "#3b82f6",
    "#f59e0b",
    "#f43f5e",
    "#a855f7",
    "#10b981",
  ];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: Math.random() * window.innerWidth,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? "50%" : 2,
            background: colors[Math.floor(Math.random() * colors.length)],
          }}
        />
      ))}
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || null;
  const cartItems =
    location.state?.cartItems || (product ? [{ ...product, qty: 1 }] : []);

  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [step, setStep] = useState("payment"); // payment | processing | success
  const [progress, setProgress] = useState(0);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const discount = subtotal * 0.05;
  const total = subtotal + shipping - discount;

  // Countdown timer for deal
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 34 * 60 + 18);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const handlePay = () => {
    if (payMethod === "upi" && !upiId.includes("@")) {
      toast.error("Enter valid UPI ID (e.g. name@upi)");
      return;
    }
    if (payMethod === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) {
        toast.error("Enter valid 16-digit card number");
        return;
      }
      if (!cardName) {
        toast.error("Enter cardholder name");
        return;
      }
      if (!expiry) {
        toast.error("Enter card expiry");
        return;
      }
      if (cvv.length < 3) {
        toast.error("Enter valid CVV");
        return;
      }
    }

    setStep("processing");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      setProgress(Math.min(p, 95));
      if (p >= 95) {
        clearInterval(iv);
      }
    }, 200);

    // Send purchase events for all items
    cartItems.forEach((item) => {
      sendEvent({
        event_type: "purchase",
        product_id: item.id,
        price: item.price * item.qty,
        page: "/payment",
        category: item.category,
      });
    });

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setStep("success");
        toast.success("🎉 Payment successful! Order confirmed!");
      }, 400);
    }, 3000);
  };

  if (step === "success") {
    return (
      <>
        <Confetti />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f8fafc",
            p: 3,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <Box
              sx={{
                background: "#fff",
                borderRadius: 4,
                p: 6,
                maxWidth: 500,
                width: "100%",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                border: "1px solid #e2e8f0",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CheckCircle sx={{ fontSize: 80, color: "#10b981", mb: 2 }} />
              </motion.div>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: "#0f172a", mb: 1 }}
              >
                Order Confirmed! 🎉
              </Typography>
              <Typography sx={{ color: "#64748b", mb: 3 }}>
                Your payment of{" "}
                <strong style={{ color: "#059669" }}>
                  ₹{total.toFixed(2)}
                </strong>{" "}
                was successful
              </Typography>

              {/* Order summary */}
              <Box
                sx={{
                  background: "#f8fafc",
                  borderRadius: 2,
                  p: 2.5,
                  mb: 3,
                  textAlign: "left",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#94a3b8",
                    mb: 1.5,
                  }}
                >
                  ORDER SUMMARY
                </Typography>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    mb={0.8}
                  >
                    <Typography sx={{ fontSize: "0.85rem", color: "#334155" }}>
                      {item.name} × {item.qty}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#0f172a",
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      ${(item.price * item.qty).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <LocalShipping sx={{ fontSize: 16, color: "#059669" }} />
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#065f46",
                      fontWeight: 600,
                    }}
                  >
                    Delivery in 2-4 days
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <Shield sx={{ fontSize: 16, color: "#1d4ed8" }} />
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#1e40af",
                      fontWeight: 600,
                    }}
                  >
                    Buyer protection active
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={2} mt={4} justifyContent="center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/ecommerce")}
                  style={{
                    padding: "11px 24px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#334155",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continue Shopping
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/")}
                  style={{
                    padding: "11px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#00d4aa,#0088ff)",
                    color: "#0a0f1a",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View Dashboard
                </motion.button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </>
    );
  }

  if (step === "processing") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
          p: 3,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 400 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Lock sx={{ fontSize: 48, color: "#00d4aa", mb: 2 }} />
          </motion.div>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "#0f172a", mb: 1 }}
          >
            Processing Payment...
          </Typography>
          <Typography sx={{ color: "#64748b", mb: 3, fontSize: "0.9rem" }}>
            Please wait. Do not close this window.
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg,#00d4aa,#0088ff)",
                borderRadius: 4,
              },
            }}
          />
          <Typography
            sx={{
              color: "#94a3b8",
              mt: 1.5,
              fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {Math.round(progress)}% — Verifying payment
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", py: 4, px: 2 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#334155",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <ArrowBack fontSize="small" /> Back
          </motion.button>
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#0f172a", letterSpacing: "-0.3px" }}
            >
              🔒 Secure Checkout
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
              SSL encrypted · 100% secure payments
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            {["visa", "mastercard", "upi", "gpay"].map((m) => (
              <Box
                key={m}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#475569",
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {m.toUpperCase()}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Deal timer */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg,#fef3c7,#fde68a)",
            border: "1px solid #fcd34d",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Timer sx={{ color: "#92400e" }} />
          <Typography
            sx={{ color: "#78350f", fontWeight: 700, fontSize: "0.9rem" }}
          >
            🔥 Flash Deal Price ends in:
          </Typography>
          <Box sx={{ display: "flex", gap: 0.8 }}>
            {[hrs, mins, secs].map((v, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
              >
                <Box
                  sx={{
                    background: "#92400e",
                    color: "#fff",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: 1,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 700,
                    fontSize: "1rem",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  {v}
                </Box>
                {i < 2 && (
                  <Typography sx={{ color: "#92400e", fontWeight: 800 }}>
                    :
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          <Typography sx={{ color: "#92400e", fontSize: "0.8rem", ml: 1 }}>
            Hurry! Limited stock available
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left — Payment form */}
          <Grid item xs={12} lg={7}>
            <Box
              sx={{
                background: "#fff",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Delivery address */}
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: "1px solid #f1f5f9",
                  background: "#fafbfc",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalShipping sx={{ color: "#00d4aa", fontSize: 20 }} />{" "}
                  Delivery Address
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "2px solid #00d4aa",
                    background: "#f0fdf9",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0f172a",
                      fontSize: "0.9rem",
                    }}
                  >
                    {localStorage.getItem("ss_user") || "Sabinesh V"}
                  </Typography>
                  <Typography
                    sx={{ color: "#64748b", fontSize: "0.82rem", mt: 0.3 }}
                  >
                    42, Anna Nagar, Chennai — 600040, Tamil Nadu, India
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.82rem" }}>
                    📱 +91 98765 43210
                  </Typography>
                  <Chip
                    label="Default"
                    size="small"
                    sx={{
                      mt: 1,
                      height: 18,
                      fontSize: "0.6rem",
                      background: "#dcfce7",
                      color: "#166534",
                      border: "1px solid #bbf7d0",
                    }}
                  />
                </Box>
              </Box>

              {/* Payment method */}
              {/* Payment method */}
              <Box sx={{ px: 3, py: 2.5 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    mb: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CreditCard sx={{ color: "#3b82f6", fontSize: 20 }} /> Payment
                  Method
                </Typography>

                <RadioGroup
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                >
                  {/* UPI */}
                  <Box
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: `2px solid ${payMethod === "upi" ? "#00d4aa" : "#e2e8f0"}`,
                      background: payMethod === "upi" ? "#f0fdf9" : "#fafbfc",
                      transition: "all 0.2s",
                      overflow: "hidden",
                    }}
                  >
                    <FormControlLabel
                      value="upi"
                      control={
                        <Radio
                          sx={{
                            color: "#00d4aa",
                            "&.Mui-checked": { color: "#00d4aa" },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <AccountBalanceWallet
                            sx={{ color: "#00d4aa", fontSize: 20 }}
                          />
                          <Box>
                            <Typography
                              fontWeight={600}
                              fontSize="0.9rem"
                              color="#1e293b"
                            >
                              UPI / Google Pay / PhonePe
                            </Typography>
                            <Typography fontSize="0.72rem" color="#64748b">
                              Instant transfer
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ px: 2, py: 1.2, m: 0, width: "100%" }}
                    />
                    <AnimatePresence>
                      {payMethod === "upi" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {/* UPI Section Update */}
                          <Box sx={{ px: 2, pb: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="UPI ID"
                              placeholder="yourname@upi"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              InputLabelProps={{ sx: { color: "#475569" } }} // Label color
                              inputProps={{ sx: { color: "#1e293b" } }} // Color of the text you TYPE
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  background: "#fff",
                                  "& fieldset": { borderColor: "#cbd5e1" }, // Visible border
                                },
                              }}
                            />
                            <Box
                              display="flex"
                              gap={1}
                              mt={1.5}
                              flexWrap="wrap"
                            >
                              {[
                                "@okaxis",
                                "@okicici",
                                "@paytm",
                                "@ybl",
                                "@oksbi",
                              ].map((s) => (
                                <Chip
                                  key={s}
                                  label={s}
                                  size="small"
                                  onClick={() =>
                                    setUpiId(
                                      (prev) => (prev.split("@")[0] || "") + s,
                                    )
                                  }
                                  sx={{
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    fontFamily: "'JetBrains Mono',monospace",
                                    background: "#e2e8f0", // Light gray background to make it visible
                                    color: "#0f172a", // Dark text color
                                    border: "1px solid #cbd5e1",
                                    "&:hover": {
                                      background: "#dcfce7",
                                      borderColor: "#22c55e",
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>

                          {/* Card Section Update */}
                          <Box
                            sx={{
                              px: 2,
                              pb: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label="Card Number"
                              placeholder="1234 5678 9012 3456"
                              value={cardNum}
                              onChange={(e) =>
                                setCardNum(
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .replace(/(.{4})/g, "$1 ")
                                    .trim()
                                    .slice(0, 19),
                                )
                              }
                              InputLabelProps={{ sx: { color: "#475569" } }}
                              inputProps={{ sx: { color: "#1e293b" } }} // Visible typed text
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  background: "#fff",
                                },
                                "& fieldset": { borderColor: "#cbd5e1" },
                              }}
                            />

                            <TextField
                              fullWidth
                              size="small"
                              label="Cardholder Name"
                              placeholder="As on card"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              InputLabelProps={{ sx: { color: "#475569" } }}
                              inputProps={{ sx: { color: "#1e293b" } }} // Visible typed text
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  background: "#fff",
                                },
                                "& fieldset": { borderColor: "#cbd5e1" },
                              }}
                            />

                            <Box display="flex" gap={1.5}>
                              <TextField
                                size="small"
                                label="Expiry MM/YY"
                                placeholder="12/27"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                InputLabelProps={{ sx: { color: "#475569" } }}
                                inputProps={{ sx: { color: "#1e293b" } }}
                                sx={{
                                  flex: 1,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    background: "#fff",
                                  },
                                  "& fieldset": { borderColor: "#cbd5e1" },
                                }}
                              />
                              <TextField
                                size="small"
                                label="CVV"
                                placeholder="•••"
                                type="password"
                                value={cvv}
                                onChange={(e) =>
                                  setCvv(e.target.value.slice(0, 4))
                                }
                                InputLabelProps={{ sx: { color: "#475569" } }}
                                inputProps={{ sx: { color: "#1e293b" } }}
                                sx={{
                                  width: 100,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    background: "#fff",
                                  },
                                  "& fieldset": { borderColor: "#cbd5e1" },
                                }}
                              />
                            </Box>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  {/* Card */}
                  <Box
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: `2px solid ${payMethod === "card" ? "#3b82f6" : "#e2e8f0"}`,
                      background: payMethod === "card" ? "#eff6ff" : "#fafbfc",
                      transition: "all 0.2s",
                      overflow: "hidden",
                    }}
                  >
                    <FormControlLabel
                      value="card"
                      control={
                        <Radio
                          sx={{
                            color: "#3b82f6",
                            "&.Mui-checked": { color: "#3b82f6" },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <CreditCard sx={{ color: "#3b82f6", fontSize: 20 }} />
                          <Box>
                            <Typography
                              fontWeight={600}
                              fontSize="0.9rem"
                              color="#1e293b"
                            >
                              Credit / Debit Card
                            </Typography>
                            <Typography fontSize="0.72rem" color="#64748b">
                              Visa, Mastercard, Rupay
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ px: 2, py: 1.2, m: 0, width: "100%" }}
                    />
                    <AnimatePresence>
                      {payMethod === "card" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              pb: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label="Card Number"
                              placeholder="1234 5678 9012 3456"
                              value={cardNum}
                              onChange={(e) =>
                                setCardNum(
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .replace(/(.{4})/g, "$1 ")
                                    .trim()
                                    .slice(0, 19),
                                )
                              }
                              InputLabelProps={{ sx: { color: "#475569" } }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  background: "#fff",
                                  fontFamily: "'JetBrains Mono',monospace",
                                },
                                "& fieldset": { borderColor: "#cbd5e1" },
                              }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              label="Cardholder Name"
                              placeholder="As on card"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              InputLabelProps={{ sx: { color: "#475569" } }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  background: "#fff",
                                },
                                "& fieldset": { borderColor: "#cbd5e1" },
                              }}
                            />
                            <Box display="flex" gap={1.5}>
                              <TextField
                                size="small"
                                label="Expiry MM/YY"
                                placeholder="12/27"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                InputLabelProps={{ sx: { color: "#475569" } }}
                                sx={{
                                  flex: 1,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    background: "#fff",
                                    fontFamily: "'JetBrains Mono',monospace",
                                  },
                                  "& fieldset": { borderColor: "#cbd5e1" },
                                }}
                              />
                              <TextField
                                size="small"
                                label="CVV"
                                placeholder="•••"
                                type="password"
                                value={cvv}
                                onChange={(e) =>
                                  setCvv(e.target.value.slice(0, 4))
                                }
                                InputLabelProps={{ sx: { color: "#475569" } }}
                                sx={{
                                  width: 100,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    background: "#fff",
                                    fontFamily: "'JetBrains Mono',monospace",
                                  },
                                  "& fieldset": { borderColor: "#cbd5e1" },
                                }}
                              />
                            </Box>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  {/* COD */}
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: `2px solid ${payMethod === "cod" ? "#f59e0b" : "#e2e8f0"}`,
                      background: payMethod === "cod" ? "#fffbeb" : "#fafbfc",
                      transition: "all 0.2s",
                    }}
                  >
                    <FormControlLabel
                      value="cod"
                      control={
                        <Radio
                          sx={{
                            color: "#f59e0b",
                            "&.Mui-checked": { color: "#f59e0b" },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <LocalAtm sx={{ color: "#f59e0b", fontSize: 20 }} />
                          <Box>
                            <Typography
                              fontWeight={600}
                              fontSize="0.9rem"
                              color="#1e293b"
                            >
                              Cash on Delivery
                            </Typography>
                            <Typography fontSize="0.72rem" color="#64748b">
                              Pay when you receive
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ px: 2, py: 1.2, m: 0, width: "100%" }}
                    />
                  </Box>
                </RadioGroup>

                {/* Pay button */}
                <motion.button
                  whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePay}
                  style={{
                    width: "100%",
                    marginTop: 24,
                    padding: "14px",
                    borderRadius: 8,
                    border: "1px solid #a88734",
                    background: "linear-gradient(to bottom, #f7dfa5, #f0c14b)",
                    color: "#111",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,.4) inset, 0 1px 0 rgba(0,0,0,.08)",
                  }}
                >
                  <Lock style={{ fontSize: 16 }} />
                  Pay ₹{total.toFixed(2)} Securely
                </motion.button>
              </Box>
            </Box>
          </Grid>

          {/* Right — Order Summary */}
          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                background: "#fff",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                position: "sticky",
                top: 24,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: "1px solid #f1f5f9",
                  background: "#fafbfc",
                }}
              >
                <Typography
                  fontWeight={700}
                  sx={{
                    color: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  Order Summary
                  <Chip
                    label={`${cartItems.reduce((s, i) => s + i.qty, 0)} items`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                    }}
                  />
                </Typography>
              </Box>

              <Box sx={{ px: 3, py: 2, maxHeight: 280, overflowY: "auto" }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    gap={2}
                    mb={2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #f1f5f9",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.83rem",
                          color: "#1e293b",
                          lineHeight: 1.3,
                        }}
                        noWrap
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{ color: "#94a3b8", fontSize: "0.72rem" }}
                      >
                        Qty: {item.qty} · {item.category}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#059669",
                        fontFamily: "'JetBrains Mono',monospace",
                        flexShrink: 0,
                      }}
                    >
                      ${(item.price * item.qty).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <Box sx={{ px: 3, py: 2.5 }}>
                {[
                  {
                    label: "Subtotal",
                    value: `$${subtotal.toFixed(2)}`,
                    color: "#334155",
                  },
                  {
                    label: "Shipping",
                    value:
                      shipping === 0 ? "FREE 🎉" : `$${shipping.toFixed(2)}`,
                    color: shipping === 0 ? "#10b981" : "#334155",
                  },
                  {
                    label: "Discount (5%)",
                    value: `-$${discount.toFixed(2)}`,
                    color: "#10b981",
                  },
                ].map(({ label, value, color }) => (
                  <Box
                    key={label}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        color,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 1.5, borderColor: "#f1f5f9" }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={800} sx={{ color: "#0f172a" }}>
                    Total
                  </Typography>
                  <Typography
                    fontWeight={800}
                    sx={{
                      color: "#059669",
                      fontSize: "1.1rem",
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    ₹{total.toFixed(2)}
                  </Typography>
                </Box>

                {/* Coupon */}
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    borderRadius: 2,
                    background: "#fef3c7",
                    border: "1px dashed #f59e0b",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#92400e",
                      mb: 0.5,
                    }}
                  >
                    🎁 OFFER APPLIED
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#78350f" }}>
                    STREAM20 — Extra 5% off on all products
                  </Typography>
                </Box>

                {/* Delivery estimate */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    background: "#f0fdf9",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <LocalShipping sx={{ color: "#059669", fontSize: 20 }} />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#065f46",
                      }}
                    >
                      Free Delivery
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#16a34a" }}>
                      Expected:{" "}
                      {new Date(Date.now() + 3 * 86400000).toDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
