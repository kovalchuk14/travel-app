"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getAuthSession, getCurrentUser } from "@/lib/api/clientApi";

const privateRoutes = ["/profile", "/dashboard"];

export default function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    setUser,
    clearIsAuthenticated,
    loading,
    setLoading,
  } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {
        const session = await getAuthSession();

        if (session?.success) {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            return;
          }
        }

        clearIsAuthenticated();
        if (isPrivateRoute) {
          router.push("/auth");
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivateRoute) {
          router.push("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [
    pathname,
    setUser,
    clearIsAuthenticated,
    setLoading,
    isPrivateRoute,
    router,
  ]);

  useEffect(() => {
    if (!loading && isPrivateRoute && !isAuthenticated) {
      clearIsAuthenticated();
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, isPrivateRoute, loading, clearIsAuthenticated, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (isPrivateRoute && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
