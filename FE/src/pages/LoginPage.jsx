import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({ username: "", passwordHash: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.username, form.passwordHash);
    if (result.success) {
      navigate("/projects");
    }
  };

  return (
    <div style={styles.container}>
      {/* Left panel — branding */}
      <div style={styles.leftPanel}>
        <div style={styles.brandContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>TaskFlow</span>
          </div>
          <h1 style={styles.tagline}>
            Quản lý dự án nhóm <br />
            <span style={styles.taglineAccent}>thời gian thực.</span>
          </h1>
          <p style={styles.taglineSub}>
            Kanban board · Rich text editor · WebSocket collaboration
          </p>
          <div style={styles.featureList}>
            {["Kéo thả task tức thì", "Cộng tác realtime", "Phân quyền thành viên"].map((f) => (
              <div key={f} style={styles.featureItem}>
                <span style={styles.featureDot}>●</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Đăng nhập</h2>
          <p style={styles.formSub}>
            Chưa có tài khoản?{" "}
            <Link to="/register" style={styles.link}>Đăng ký ngay</Link>
          </p>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="dongthe"
                required
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Mật khẩu</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="passwordHash"
                  value={form.passwordHash}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{ ...styles.input, paddingRight: "44px" }}
                  onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "44px" })}
                  onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: "44px" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={isLoading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
            >
              {isLoading ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} /> Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#0f1117",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #1a1f2e 0%, #0f1117 50%, #1a1f2e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    borderRight: "1px solid #2a2d3a",
  },
  brandContent: { maxWidth: "400px" },
  logo: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" },
  logoIcon: { fontSize: "32px", color: "#4f7ef8" },
  logoText: { fontSize: "24px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.5px" },
  tagline: { fontSize: "40px", fontWeight: "800", color: "#ffffff", lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-1px" },
  taglineAccent: { color: "#4f7ef8" },
  taglineSub: { fontSize: "14px", color: "#6b7280", marginBottom: "40px", lineHeight: 1.6 },
  featureList: { display: "flex", flexDirection: "column", gap: "12px" },
  featureItem: { fontSize: "14px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "10px" },
  featureDot: { color: "#4f7ef8", fontSize: "8px" },
  rightPanel: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    backgroundColor: "#0f1117",
  },
  formCard: { width: "100%", maxWidth: "380px" },
  formTitle: { fontSize: "28px", fontWeight: "700", color: "#ffffff", marginBottom: "8px", letterSpacing: "-0.5px" },
  formSub: { fontSize: "14px", color: "#6b7280", marginBottom: "32px" },
  link: { color: "#4f7ef8", textDecoration: "none", fontWeight: "500" },
  errorBox: {
    backgroundColor: "#2d1515",
    border: "1px solid #5c2626",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    color: "#f87171",
    fontSize: "13px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#9ca3af", letterSpacing: "0.3px" },
  input: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#1a1f2e",
    border: "1px solid #2a2d3a",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#1a1f2e",
    border: "1px solid #4f7ef8",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#4f7ef8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
};

export default LoginPage;
