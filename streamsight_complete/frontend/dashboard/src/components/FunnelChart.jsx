import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  {
    key: "page_view",
    label: "Page Views",
    color: "#1D9E75",
    iconBg: "#E1F5EE",
    icon: "👁",
  },
  {
    key: "add_to_cart",
    label: "Add to Cart",
    color: "#378ADD",
    iconBg: "#E6F1FB",
    icon: "🛒",
  },
  {
    key: "checkout",
    label: "Checkout",
    color: "#7F77DD",
    iconBg: "#EEEDFE",
    icon: "💳",
  },
  {
    key: "purchase",
    label: "Purchase",
    color: "#1D9E75",
    iconBg: "#E1F5EE",
    icon: "✅",
  },
];

export default function FunnelChart({ funnel }) {
  const [hovered, setHovered] = useState(null);

  // ── All logic — unchanged ─────────────────────────────────────────────────
  const values = STAGES.map((s) => funnel?.[s.key] || 0);
  const max = Math.max(...values, 1);
  const isEmpty = values.every((v) => v === 0);
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        background: "#111927",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "22px 24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "'DM Mono',monospace",
            }}
          >
            Conversion Funnel
          </div>
          <div style={{ color: "#475569", fontSize: 12, marginTop: 3 }}>
            Real-time user journey
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            borderRadius: 20,
            background: "rgba(29,158,117,0.08)",
            border: "1px solid rgba(29,158,117,0.22)",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#1D9E75",
              animation: "fc-pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono',monospace",
              color: "#1D9E75",
              fontWeight: 600,
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {isEmpty ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(29,158,117,0.08)",
              border: "1px solid rgba(29,158,117,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ⟳
          </div>
          <span style={{ color: "#475569", fontSize: 13 }}>
            Waiting for events...
          </span>
        </div>
      ) : (
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}
        >
          {STAGES.map((stage, i) => {
            const val = values[i];
            const pct = (val / max) * 100;
            const isHovered = hovered === i;
            const dropoff =
              i < STAGES.length - 1 && values[i] > 0
                ? ((1 - values[i + 1] / values[i]) * 100).toFixed(1)
                : null;
            const cvr =
              i > 0 && values[i - 1] > 0
                ? ((val / values[i - 1]) * 100).toFixed(1)
                : null;

            return (
              <div
                key={stage.key}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "default" }}
              >
                {/* Label row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {/* Icon */}
                    <motion.div
                      animate={{ scale: isHovered ? 1.15 : 1 }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: isHovered
                          ? stage.iconBg
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isHovered ? stage.color + "40" : "rgba(255,255,255,0.07)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        transition: "all 0.18s",
                      }}
                    >
                      {stage.icon}
                    </motion.div>

                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isHovered ? 600 : 500,
                        color: isHovered ? "#F1F5F9" : "#94A3B8",
                        transition: "all 0.18s",
                      }}
                    >
                      {stage.label}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {dropoff && (
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'DM Mono',monospace",
                          color: "#E24B4A",
                          opacity: 0.8,
                        }}
                      >
                        ↓ {dropoff}% drop
                      </span>
                    )}
                    <motion.span
                      animate={{ color: isHovered ? stage.color : "#E2E8F0" }}
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {val.toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                {/* Bar track */}
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    overflow: "hidden",
                    background: `${stage.color}12`,
                    position: "relative",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.7,
                      ease: "easeOut",
                      delay: i * 0.08,
                    }}
                    style={{
                      height: "100%",
                      borderRadius: 5,
                      background: `linear-gradient(90deg, ${stage.color}70, ${stage.color})`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* shine sweep on hover */}
                    <motion.div
                      animate={
                        isHovered ? { x: ["−100%", "200%"] } : { x: "-100%" }
                      }
                      transition={
                        isHovered ? { duration: 0.65, ease: "easeInOut" } : {}
                      }
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",
                      }}
                    />
                  </motion.div>
                </div>

                {/* CVR from previous */}
                <AnimatePresence>
                  {cvr && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{ marginTop: 5, textAlign: "right" }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'DM Mono',monospace",
                          color: `${stage.color}90`,
                        }}
                      >
                        {cvr}% conversion from previous
                      </span>
                    </motion.div>
                  )}
                  {cvr && !isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ marginTop: 5, textAlign: "right" }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "'DM Mono',monospace",
                          color: `${stage.color}55`,
                        }}
                      >
                        {cvr}% conversion from previous
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* ── Overall CVR ── */}
          {values[0] > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: 4,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Mono',monospace",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                Overall CVR
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    height: 4,
                    width: 60,
                    borderRadius: 2,
                    background: "rgba(29,158,117,0.15)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${((values[3] / values[0]) * 100).toFixed(1)}%`,
                      background: "#1D9E75",
                      borderRadius: 2,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1D9E75",
                    fontFamily: "'DM Sans',sans-serif",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {((values[3] / values[0]) * 100).toFixed(2)}%
                </span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <style>{`@keyframes fc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.82)} }`}</style>
    </div>
  );
}
