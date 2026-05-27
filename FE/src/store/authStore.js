import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set) => ({
  // ─── STATE ────────────────────────────────────────────────
  user: authService.getUser(),       // User hiện tại (null nếu chưa login)
  token: authService.getToken(),     // JWT token
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // ─── ACTIONS ──────────────────────────────────────────────

  login: async (username, passwordHash) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(username, passwordHash);
      const token = data.result?.token;

      // BE không trả về user object → tự tạo từ username
      const user = { username };

      authService.saveAuth(token, user);
      set({ token, user, isAuthenticated: true, isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },
  // Đăng ký

  register: async (username, email, passwordHash) => {
    set({ isLoading: true, error: null });
    try {
      // Sửa biến truyền vào thành passwordHash
      await authService.register(username, email, passwordHash);
      set({ isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // Đăng xuất
  logout: () => {
    authService.clearAuth();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  // Xoá lỗi
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
