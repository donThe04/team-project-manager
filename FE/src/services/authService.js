import api from "./api";

const authService = {

  login: async (username, passwordHash) => {
    const response = await api.post("/auth/login", { username, passwordHash });
    return response.data;
  },

  register: async (username, email, passwordHash) => {
    const response = await api.post("/users", { username, email, passwordHash });
    return response.data;
  },
  // Lấy thông tin user hiện tại (dùng khi reload trang)
  getMe: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Lưu token + user vào localStorage
  saveAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Xoá auth khi logout
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Lấy token hiện tại
  getToken: () => localStorage.getItem("token"),

  // Lấy user từ localStorage
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => !!localStorage.getItem("token"),
};

export default authService;
