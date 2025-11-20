import axios, { AxiosResponse } from "axios";
import { api } from "./api";
import type { User } from "@/types/user";

interface AuthPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function getAuthSession() {
  try {
    const res = await api.post("/auth/refresh-session");
    return res.data;
  } catch (error) {
    
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 401
    ) {
      
      return null;
    }

    
    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  const res = await api.get("/users/me");
  return res.data;
}

export async function patchUserProfile(data: Partial<User>): Promise<User> {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
}

export async function registerUser(data: RegisterPayload): Promise<User> {
  const res = await api.post("/auth/register", data);

  return res.data;
}

export async function loginUser(data: AuthPayload): Promise<User> {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}
 