import axios from "axios";

// Khai báo gốc API kết nối đến Backend Spring Boot (Trello)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/trello";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
// Tự động đính kèm mã JWT Token vào Header của mọi yêu cầu nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
// Tự động kiểm tra phản hồi từ Backend, xử lý lỗi hệ thống/xác thực công khai
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu gặp lỗi 401 (Hết hạn token/Chưa đăng nhập) 
    // và request lỗi đó KHÔNG PHẢI là yêu cầu đăng nhập (/auth/login)
    if (
      error.response?.status === 401 && 
      !error.config.url.includes("/auth/login")
    ) {
      // Tiến hành dọn dẹp bộ nhớ trình duyệt
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Đá người dùng về trang đăng nhập để yêu cầu login lại
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;