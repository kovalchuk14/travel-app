// lib/api/travellersApi.ts

import type { Traveller } from "@/types/traveller";

interface RawTraveller {
  _id: string;
  name: string;
  avatarUrl?: string;        // ← теперь avatarUrl, а не avatar
  description?: string;      // ← у тебя в бэкенде description, а не bio
  savedArticles?: any[];
  articlesAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface TravellerProfile {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  socialLinks: string[];
}

/** Дефолтная аватарка, если ничего нет */
function normalizeAvatar(avatarUrl?: string) {
  if (!avatarUrl || avatarUrl.trim() === "") {
    return "/icons/avatar.svg";
  }
  return avatarUrl;
}

/** Главная функция — теперь использует прокси-роут и credentials */
export async function getTravellerById(id: string): Promise<TravellerProfile> {
  const res = await fetch(`/api/users/${id}`, {
    credentials: "include", // ← куки передаются → 200 OK
  });

  if (!res.ok) {
    throw new Error("Failed to fetch traveller");
  }

  const json = await res.json();
  const user: RawTraveller = json.data; // ← твой бэкенд возвращает { data: { …user } }

  if (!user) {
    throw new Error("User not found");
  }

  return {
    _id: String(user._id),
    name: user.name,
    avatar: normalizeAvatar(user.avatarUrl),          // ← avatarUrl!
    bio: user.description ?? "Мандрівник поки не додав опис.", // ← description!
    socialLinks: [], // если захочешь — добавишь позже
  };
}