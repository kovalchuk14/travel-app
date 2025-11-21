
import { localAPI } from "../localAPI";
import { backendAPI} from "../backendAPI";
import { Story, Category,StoriesResponse, CategoriesResponse } from "@/types/story";
import { cookies } from "next/headers";
import type { User } from "@/types/user";

export async function getAuthSessionServer() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await localAPI.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
}

export async function getUserServer(): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await localAPI.get("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
}

export async function patchUserProfileServer(
  data: Partial<User>
): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await localAPI.patch<User>("/users/me", data, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function checkServerSession() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await localAPI.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res;
}

export const getServerCurrentStory = async (
  storyId: string
): Promise<Story> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await localAPI.get<Story>(`/stories/${storyId}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
};



// ================ Історії Мандрівників ========
export async function getStoriesServer(
  page: number = 1,
  perPage: number = 10
): Promise<Story[]> {
  const res = await backendAPI.get<StoriesResponse>("/stories", {
    params: { page, perPage, sort: 'favoriteCount' },
  });
  return res.data?.data.data || [];
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await backendAPI.get<CategoriesResponse>('/categories');
  return  res.data.data.data;
}

export async function fetchStoriesServer(
  page: number = 1,
  perPage: number = 10,

  excludeId?: string
): Promise<Story[]> {
  const response = await backendAPI.get<StoriesResponse>(`/stories`, {
    params: { page, perPage, sort: 'favoriteCount', excludeId },
  });

  return response.data?.data?.data || [];
}