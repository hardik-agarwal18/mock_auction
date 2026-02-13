import { createContext, useContext, useState, useEffect } from "react";
import axios from "../lib/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (
        token &&
        savedUser &&
        savedUser !== "undefined" &&
        savedUser !== "null"
      ) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });

      if (!response.data.token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", response.data.token);

      // Fetch user data after login
      const userResponse = await axios.get("/auth/me");

      if (!userResponse.data.user) {
        throw new Error("Failed to fetch user data");
      }

      const userData = userResponse.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return response.data;
    } catch (error) {
      // Clean up on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw error;
    }
  };

  const register = async (email, password, username) => {
    try {
      await axios.post("/auth/register", {
        email,
        password,
        username,
      });

      // Auto login after registration
      const loginResponse = await axios.post("/auth/login", {
        email,
        password,
      });

      if (!loginResponse.data.token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", loginResponse.data.token);

      // Fetch user data
      const userResponse = await axios.get("/auth/me");

      if (!userResponse.data.user) {
        throw new Error("Failed to fetch user data");
      }

      const userData = userResponse.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return loginResponse.data;
    } catch (error) {
      // Clean up on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
