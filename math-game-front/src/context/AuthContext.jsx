import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [avatarLabel, setAvatarLabel] = useState(localStorage.getItem("avatarLabel") || null);

  const login = (newToken, avatar) => {
    console.log("🔐 Login: storing token in context");
    setToken(newToken);
    setAvatarLabel(avatar);
    localStorage.setItem("token", newToken);
    localStorage.setItem("avatarLabel", avatar);
  };

  const logout = () => {
    console.log("🚪 Logout: clearing data");
    setToken(null);
    setAvatarLabel(null);
    localStorage.removeItem("token");
    localStorage.removeItem("avatarLabel");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, avatarLabel, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
