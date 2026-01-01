import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchMe = async () => {
      try {
        const user = await api.me();
        setUser(user);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const signin = async (email, password) => {
    const data = await api.signin({ email, password });
    localStorage.setItem("token", data.token);
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    });
    return data;
  };

  const signup = async (userData) => {
    const data = await api.signup(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
