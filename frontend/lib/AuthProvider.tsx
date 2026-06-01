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
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  isPending: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
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
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/v1/auth/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            });
            
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem("accessToken", refreshData.access);
              
              // Second attempt to fetch /me/
              const retryRes = await fetch(`${API_URL}/api/v1/auth/me/`, {
                headers: { Authorization: `Bearer ${refreshData.access}` },
              });
              
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                setUser(retryData);
                setIsPending(false);
                return; // Early return to avoid wiping tokens in the fallthrough
              }
            }
          }
          // If token was invalid or missing, expire session
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      } finally {
        setIsPending(false);
      }
    };

    fetchUser();
  }, []);

  const login = (access: string, refresh: string, redirectRoute: string = "/") => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    // Reload UI
    window.location.href = redirectRoute;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider value={{ user, isPending, login, logout, updateUser }}>
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
