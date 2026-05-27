import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    clearError();
    setValidationError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.passwordHash !== form.confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (form.passwordHash.length < 8) {
      setValidationError("Mật khẩu phải ít nhất 8 ký tự");
      return;
    }

    const result = await register(form.username, form.email, form.passwordHash);
    if (result.success) {
      setSuccessMsg("Đăng ký thành công! Đang chuyển về trang đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  const displayError = validationError || error;

  return (
    <div style={styles.container}>
      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.brandContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>TaskFlow</span>
          </div>
          <h1 style={styles.tagline}>
            Bắt đầu cộng tác <br />
            <span style={styles.taglineAccent}>ngay hôm nay.</span>
          </h1>
          <p style={styles.taglineSub}>
            Tạo tài khoản miễn phí và mời nhóm của bạn vào làm việc cùng nhau.
          </p>
          <div style={styles.steps}>
            {[
              { n: "01", t: "Tạo tài khoản" },
              { n: "02", t: "Tạo project & board" },
              { n: "03", t: "Mời thành viên & làm việc" },
            ].map((s) => (
              <div key={s.n} style={styles.stepItem}>
                <span style={styles.stepNum}>{s.n}</span>
                <span style={styles.stepText}>{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Tạo tài khoản</h2>
          <p style={styles.formSub}>
            Đã có tài khoản?{" "}
            <Link to="/login" style={styles.link}>Đăng nhập</Link>
          </p>

          {displayError && (
            <div style={styles.errorBox}>⚠ {displayError}</div>
          )}
          {successMsg && (
            <div style={styles.successBox}>✓ {successMsg}</div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Username */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="nguyenvana"
                required
                minLength={3}
                maxLength={50}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vana@gmail.com"
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
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  style={{ ...styles.input, paddingRight: "44px" }}
                  onFocus={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.inputFocus,
                      paddingRight: "44px",
                    })
                  }
                  onBlur={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.input,
                      paddingRight: "44px",
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {/* Password strength bar */}
              {form.passwordHash && (
                <div style={styles.strengthBar}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.strengthSegment,
                        backgroundColor:
                          form.passwordHash.length >= i * 4
                            ? i <= 1
                              ? "#ef4444"
                              : i <= 2
                              ? "#f59e0b"
                              : i <= 3
                              ? "#3b82f6"
                              : "#22c55e"
                            : "#2a2d3a",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  ...styles.input,
                  borderColor:
                    form.confirmPassword &&
                    form.confirmPassword !== form.passwordHash
                      ? "#ef4444"
                      : form.confirmPassword &&
                        form.confirmPassword === form.passwordHash
                      ? "#22c55e"
                      : undefined,
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={
                isLoading
                  ? { ...styles.submitBtn, opacity: 0.7 }
                  : styles.submitBtn
              }
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
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
    background:
      "linear-gradient(135deg, #1a1f2e 0%, #0f1117 50%, #1a1f2e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    borderRight: "1px solid #2a2d3a",
  },
  brandContent: { maxWidth: "400px" },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "48px",
  },
  logoIcon: { fontSize: "32px", color: "#4f7ef8" },
  logoText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.5px",
  },
  tagline: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 1.2,
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  taglineAccent: { color: "#4f7ef8" },
  taglineSub: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "40px",
    lineHeight: 1.6,
  },
  steps: { display: "flex", flexDirection: "column", gap: "16px" },
  stepItem: { display: "flex", alignItems: "center", gap: "16px" },
  stepNum: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#4f7ef8",
    letterSpacing: "1px",
    minWidth: "24px",
  },
  stepText: { fontSize: "14px", color: "#9ca3af" },
  rightPanel: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    backgroundColor: "#0f1117",
  },
  formCard: { width: "100%", maxWidth: "380px" },
  formTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  formSub: { fontSize: "14px", color: "#6b7280", marginBottom: "28px" },
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
  successBox: {
    backgroundColor: "#0f2a1a",
    border: "1px solid #166534",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    color: "#4ade80",
    fontSize: "13px",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#9ca3af",
    letterSpacing: "0.3px",
  },
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
  strengthBar: { display: "flex", gap: "4px", marginTop: "6px" },
  strengthSegment: {
    height: "3px",
    flex: 1,
    borderRadius: "2px",
    transition: "background-color 0.3s",
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
    marginTop: "4px",
  },
};

export default RegisterPage;
