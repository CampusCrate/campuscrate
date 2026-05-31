"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  is_verified_student: boolean;
  university: any;
  profile_picture: string | null;
  phone_number: string;
}

interface AuthContextType {
  user: User | null;
  isPending: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsPending(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // Token might be expired, need refresh component logic, but we'll logout for now
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      } finally {
        setIsPending(false);
      }
    };

    fetchUser();
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    // Reload UI
    window.location.href = "/";
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isPending, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
