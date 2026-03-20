import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken") || null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist user/token to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  useEffect(() => {
    if (state.accessToken) {
      localStorage.setItem("accessToken", state.accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [state.accessToken]);

  // Listen for forced logout events (from axios interceptor)
  useEffect(() => {
    const handleForcedLogout = () => {
      dispatch({ type: "LOGOUT" });
    };
    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  // Auto-refresh token on app load
  useEffect(() => {
    const initAuth = async () => {
      if (!state.accessToken && !document.cookie.includes("refreshToken")) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken, user } = response.data;
        dispatch({ type: "LOGIN_SUCCESS", payload: { accessToken, user } });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };

    initAuth();
  }, []); // eslint-disable-line

  const register = useCallback(async (name, email, password, role) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const { accessToken, user } = response.data;
      dispatch({ type: "LOGIN_SUCCESS", payload: { accessToken, user } });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;
      dispatch({ type: "LOGIN_SUCCESS", payload: { accessToken, user } });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Check credentials.";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout even if request fails
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.user && !!state.accessToken,
        isAdmin: state.user?.role === "admin",
        register,
        login,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
