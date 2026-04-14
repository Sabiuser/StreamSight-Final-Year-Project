import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  ElectricBolt,
  Email,
  Lock,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ✅ FIX: decide where to send each role after login
function getRedirectPath(role) {
  if (role === "customer") return "/shop"; // customer → ShopStream layout
  return "/"; // everyone else → Dashboard
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    toast.info("🔐 Authenticating...", { autoClose: 900 });

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Login failed");
        toast.error(`❌ ${data.error || "Login failed"}`);
        setLoading(false);
        return;
      }

      // ✅ Store all fields (role is critical for routing)
      localStorage.setItem("ss_auth", "true");
      localStorage.setItem("ss_token", data.token);
      localStorage.setItem("ss_user", data.user.name);
      localStorage.setItem("ss_email", data.user.email);
      localStorage.setItem("ss_role", data.user.role);

      const role = data.user.role;
      const redirect = getRedirectPath(role);

      toast.success(`✅ Welcome, ${data.user.name}!`, { autoClose: 1400 });
      setTimeout(() => navigate(redirect), 1500);
    } catch (err) {
      const msg =
        "Cannot connect to API server. Make sure the backend is running.";
      setApiError(msg);
      toast.error(`❌ ${msg}`);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .ss-login-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem; background: #EEF3FF; font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .ss-login-page::after {
          content: ''; position: fixed; inset: 0;
          background-image: linear-gradient(rgba(55,138,221,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(55,138,221,0.045) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none; z-index: 0;
        }
        .ss-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .ss-card {
          width: 100%; max-width: 424px; position: relative; z-index: 10;
          background: rgba(255,255,255,0.80); backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.92); border-radius: 24px;
          padding: 1.5rem 1.8rem; box-shadow: 0 4px 6px rgba(55,138,221,0.05), 0 20px 60px rgba(55,138,221,0.12);
        }
        .ss-logo-wrap { display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
        .ss-logo-icon {
          width: 58px; height: 58px; border-radius: 16px;
          background: linear-gradient(135deg,#378ADD 0%,#185FA5 100%);
          display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
          box-shadow: 0 8px 24px rgba(55,138,221,0.30); position: relative; overflow: hidden;
        }
        .ss-logo-icon::before { content:''; position:absolute; top:0; left:0; right:0; height:48%; background:rgba(255,255,255,0.13); border-radius:16px 16px 0 0; }
        .ss-brand-name { font-size:1.55rem; font-weight:600; color:#0C447C; letter-spacing:-0.035em; line-height:1; margin-bottom:0.35rem; }
        .ss-brand-sub  { font-size:0.72rem; color:#8facc0; letter-spacing:0.07em; font-family:'DM Mono',monospace; text-transform:uppercase; }
        .ss-error {
          display:flex; align-items:center; gap:8px; background:rgba(226,75,74,0.07);
          border:1px solid rgba(226,75,74,0.22); border-radius:10px; padding:10px 14px;
          font-size:0.83rem; color:#A32D2D; margin-bottom:1.1rem; animation:ss-shake 0.35s ease;
        }
        @keyframes ss-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        .ss-field { margin-bottom:1rem; }
        .ss-label { display:block; font-size:0.78rem; font-weight:500; color:#4a6080; margin-bottom:0.45rem; }
        .ss-input-wrap { position:relative; }
        .ss-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#8facc0; pointer-events:none; display:flex; align-items:center; font-size:18px !important; }
        .ss-input {
          width:100%; height:48px; padding:0 14px 0 42px;
          background:rgba(238,243,255,0.65); border:1px solid rgba(55,138,221,0.18);
          border-radius:12px; font-family:'DM Sans',sans-serif; font-size:0.9rem; color:#0f2040; outline:none; transition:all 0.2s;
        }
        .ss-input::placeholder { color:#8facc0; }
        .ss-input:focus { background:#fff; border-color:rgba(55,138,221,0.58); box-shadow:0 0 0 3px rgba(55,138,221,0.10); }
        .ss-pw-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#8facc0; padding:4px; border-radius:6px; display:flex; align-items:center; transition:color 0.2s; font-size:18px !important; }
        .ss-pw-toggle:hover { color:#378ADD; }
        .ss-forgot-row { display:flex; justify-content:flex-end; margin-top:-0.3rem; margin-bottom:1.4rem; }
        .ss-forgot { font-size:0.78rem; color:#378ADD; text-decoration:none; font-weight:500; }
        .ss-forgot:hover { color:#0C447C; }
        .ss-btn {
          width:100%; height:50px; background:linear-gradient(135deg,#378ADD 0%,#185FA5 100%);
          border:none; border-radius:12px; color:white; font-family:'DM Sans',sans-serif;
          font-size:0.95rem; font-weight:600; cursor:pointer; display:flex; align-items:center;
          justify-content:center; gap:8px; transition:all 0.2s; box-shadow:0 4px 16px rgba(55,138,221,0.30);
        }
        .ss-btn:not(:disabled):hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(55,138,221,0.40); }
        .ss-btn:disabled { opacity:0.75; cursor:not-allowed; }
        .ss-btn .ss-arrow { transition:transform 0.2s; }
        .ss-btn:not(:disabled):hover .ss-arrow { transform:translateX(3px); }
        .ss-divider { display:flex; align-items:center; gap:12px; margin:1.5rem 0; }
        .ss-divider::before,.ss-divider::after { content:''; flex:1; height:1px; background:rgba(55,138,221,0.12); }
        .ss-divider span { font-size:0.7rem; color:#8facc0; font-family:'DM Mono',monospace; letter-spacing:0.06em; }
        .ss-sso {
          width:100%; height:46px; background:rgba(255,255,255,0.72);
          border:1px solid rgba(55,138,221,0.18); border-radius:12px; color:#4a6080;
          font-family:'DM Sans',sans-serif; font-size:0.88rem; font-weight:500;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; transition:all 0.2s;
        }
        .ss-sso:hover { background:white; border-color:rgba(55,138,221,0.32); color:#0f2040; }
        /* ✅ Role hint badges at bottom */
        .ss-role-hints { margin-top:1.4rem; display:flex; flex-direction:column; gap:6px; }
        .ss-role-row { display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:8px; background:rgba(55,138,221,0.04); border:1px solid rgba(55,138,221,0.1); }
        .ss-role-badge { font-size:0.62rem; font-weight:700; padding:2px 6px; border-radius:4px; font-family:'DM Mono',monospace; white-space:nowrap; }
        .ss-role-email { font-size:0.72rem; color:#4a6080; font-family:'DM Mono',monospace; }
        @keyframes ss-spin { to { transform: rotate(360deg); } }
        @media (max-width:480px) { .ss-card { padding:2rem 1.5rem 1.5rem; border-radius:20px; } }
      `}</style>

      <div className="ss-login-page">
        {[
          { color: "rgba(55,138,221,0.12)", top: "5%", left: "10%", size: 480 },
          {
            color: "rgba(29,158,117,0.09)",
            bottom: "8%",
            right: "12%",
            size: 380,
          },
          {
            color: "rgba(96,165,250,0.08)",
            top: "45%",
            left: "55%",
            size: 280,
          },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="ss-orb"
            animate={{ x: [0, 25, -12, 0], y: [0, -20, 12, 0] }}
            transition={{
              duration: 8 + i * 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle,${b.color} 0%,transparent 70%)`,
              filter: "blur(60px)",
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: 424,
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="ss-card">
            {/* Logo */}
            <div className="ss-logo-wrap">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="ss-logo-icon">
                  <ElectricBolt
                    style={{
                      fontSize: 28,
                      color: "white",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </div>
              </motion.div>
              <div className="ss-brand-name">StreamSight</div>
              <div className="ss-brand-sub">
                Real-Time ClickStream Analytics
              </div>
            </div>

            {/* Error */}
            {apiError && (
              <div className="ss-error">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="#E24B4A"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M8 5v4M8 11v.5"
                    stroke="#E24B4A"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="ss-field">
                <label className="ss-label" htmlFor="ss-email">
                  Email Address
                </label>
                <div className="ss-input-wrap">
                  <Email className="ss-input-icon" />
                  <input
                    id="ss-email"
                    className="ss-input"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setApiError("");
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="ss-field">
                <label className="ss-label" htmlFor="ss-password">
                  Password
                </label>
                <div className="ss-input-wrap">
                  <Lock className="ss-input-icon" />
                  <input
                    id="ss-password"
                    className="ss-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setApiError("");
                    }}
                  />
                  <button
                    type="button"
                    className="ss-pw-toggle"
                    onClick={() => setShowPass((v) => !v)}
                  >
                    {showPass ? (
                      <Visibility style={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOff style={{ fontSize: 18 }} />
                    )}
                  </button>
                </div>
              </div>

              <div className="ss-forgot-row">
                <a href="#" className="ss-forgot">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="ss-btn" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ animation: "ss-spin 0.7s linear infinite" }}
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 2a6 6 0 016 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg
                      className="ss-arrow"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="ss-divider">
              <span>or continue with</span>
            </div>
            <button type="button" className="ss-sso">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14.5 8.18c0-.5-.04-.87-.12-1.25H8v2.36h3.65c-.08.6-.5 1.5-1.44 2.1l-.01.09 2.1 1.62.14.01c1.33-1.23 2.1-3.04 2.1-4.93z"
                  fill="#4285F4"
                />
                <path
                  d="M8 14.5c1.84 0 3.38-.6 4.5-1.64l-2.14-1.66c-.57.4-1.34.68-2.36.68-1.8 0-3.32-1.22-3.87-2.9l-.08.01-2.18 1.69-.03.08C2.76 13.1 5.2 14.5 8 14.5z"
                  fill="#34A853"
                />
                <path
                  d="M4.13 8.98A3.7 3.7 0 013.92 8c0-.34.06-.67.2-.98L2.1 5.3l-.07.03A6.5 6.5 0 001.5 8c0 1.05.25 2.04.69 2.92l1.94-1.94z"
                  fill="#FBBC05"
                />
                <path
                  d="M8 4.12c1.27 0 2.13.55 2.62 1.01l1.91-1.86C11.37 2.19 9.84 1.5 8 1.5 5.2 1.5 2.76 2.9 1.57 5.07l1.94 1.94C4.06 5.34 5.58 4.12 8 4.12z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            {/* ✅ Credential hints — helpful for demo */}
            {/* <div className="ss-role-hints">
              {[
                { role:"ADMIN",    email:"admin@streamsight.ai",  color:"#1D9E75", bg:"rgba(29,158,117,0.08)" },
                { role:"ANALYST",  email:"analyst@streamsight.ai",color:"#7F77DD", bg:"rgba(127,119,221,0.08)" },
                { role:"VIEWER",   email:"viewer@streamsight.ai", color:"#64748b", bg:"rgba(100,116,139,0.08)" },
                { role:"CUSTOMER", email:"arjun@shop.com",        color:"#f59e0b", bg:"rgba(245,158,11,0.08)" },
              ].map(r => (
                <div key={r.role} className="ss-role-row" 
                  onClick={() => { setEmail(r.email); setApiError(""); }}
                  title="Click to autofill email" style={{ cursor: "pointer",
       background: r.bg,
    borderColor: `${r.color}25`,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: `1px solid ${r.color}25` }}>
                  <span className="ss-role-badge" style={{ background:`${r.color}18`, color:r.color }}>{r.role}</span>
                  <span className="ss-role-email">{r.email}</span>
                  <span style={{ marginLeft:"auto", fontSize:"0.6rem", color:"#8facc0", fontFamily:"DM Mono" }}>click to fill</span>
                </div>
              ))}
            </div> */}
          </div>
        </motion.div>
      </div>
    </>
  );
}
