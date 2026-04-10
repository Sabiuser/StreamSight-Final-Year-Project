import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import {
  Bolt,
  Timer,
  ShoppingCart,
  LocalFireDepartment,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const FLASH_ITEMS = [
  {
    id: 1,
    name: "Gaming Console Z",
    discount: "40% OFF",
    price: 299,
    original: 499,
    claimed: 88,
    img: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=400",
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    discount: "60% OFF",
    price: 49,
    original: 129,
    claimed: 40,
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    discount: "25% OFF",
    price: 89,
    original: 119,
    claimed: 15,
    img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
  },
];

export default function FlashSales() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });

  // Real-time Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59, h: prev.h };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => num.toString().padStart(2, "0");

  // Helper for dynamic progress colors
  const getProgressColor = (value) => {
    if (value > 80) return "#ef4444"; // Red for high urgency
    if (value > 50) return "#f59e0b"; // Orange
    return "#10b981"; // Green
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        margin: "0 auto",
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Enhanced Header */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          bgcolor: "#fff",
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderLeft: "6px solid #ef4444",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Bolt sx={{ color: "#ef4444", fontSize: 32 }} />
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1 }}
            >
              FLASH SALE
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 600 }}
            >
              Limited time, limited stock
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: "#fef2f2",
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <Timer sx={{ color: "#ef4444" }} />
          <Typography
            sx={{
              color: "#ef4444",
              fontWeight: 800,
              fontFamily: "monospace",
              fontSize: "1.2rem",
            }}
          >
            {formatTime(timeLeft.h)}:{formatTime(timeLeft.h)}:
            {formatTime(timeLeft.s)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {FLASH_ITEMS.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: "white",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                border: "1px solid #f1f5f9",
              }}
            >
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={item.img}
                  alt={item.name}
                  style={{ width: "100%", height: 240, objectFit: "cover" }}
                />
                <Chip
                  label={item.discount}
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    bgcolor: "#ef4444",
                    color: "white",
                    fontWeight: 900,
                    borderRadius: 1.5,
                    px: 1,
                  }}
                />
                {item.claimed > 80 && (
                  <Chip
                    icon={
                      <LocalFireDepartment
                        style={{ color: "white", fontSize: 16 }}
                      />
                    }
                    label="SELLING FAST"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "rgba(15, 23, 42, 0.8)",
                      color: "white",
                      fontWeight: 700,
                      backdropFilter: "blur(4px)",
                    }}
                  />
                )}
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#1e293b",
                    minHeight: "3rem",
                  }}
                >
                  {item.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, color: "#ef4444" }}
                  >
                    ${item.price}
                  </Typography>
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      color: "#94a3b8",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    ${item.original}
                  </Typography>
                </Box>

                {/* Scarcity Indicator */}
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: item.claimed > 80 ? "#ef4444" : "#64748b",
                      }}
                    >
                      {item.claimed}% SOLD
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      {100 - item.claimed} left
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.claimed}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "#f1f5f9",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getProgressColor(item.claimed),
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    bgcolor: "#0f172a",
                    color: "#fff",
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": { bgcolor: "#334155" },
                    boxShadow: "0 4px 14px 0 rgba(15, 23, 42, 0.3)",
                  }}
                >
                  Claim This Deal
                </Button>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
