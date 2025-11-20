import { api } from "./api";

interface RawTraveller {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  socialLinks?: string[];
}

export interface TravellerProfile {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  socialLinks: string[];
}

function normalizeAvatar(avatar?: string) {
  if (!avatar || avatar.trim() === "") return "/icons/avatar.svg";
  return avatar;
}

export async function getTravellerById(id: string): Promise<TravellerProfile> {
  const res = await api.get<{ data?: { user?: RawTraveller } }>(`/users/${id}`);

  const user = res.data?.data?.user;
  if (!user) throw new Error("User not found");

  return {
    _id: String(user._id),
    name: user.name,
    bio: user.bio ?? "",
    avatar: normalizeAvatar(user.avatar),
    socialLinks: user.socialLinks ?? [],
  };
}
