import {
  Story,
  SavedStory,
  StoriesResponse,
  UserSavedArticlesResponse,
  StoryResponse,
} from "@/types/story";
import axios, { AxiosResponse } from "axios";
import { localAPI } from "../localAPI";
import type { User } from "@/types/user";
import { backendAPI } from "../backendAPI";
import { CreateStoryFormData } from "@/types/createStoryFormData";

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
    const res = await localAPI.post("/auth/refresh-session");
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
  const res = await localAPI.get("/users/me");
  return res.data.data;
}

export async function patchUserProfile(data: Partial<User>): Promise<User> {
  const res = await localAPI.patch<User>("/users/me", data);
  return res.data;
}

export async function registerUser(data: RegisterPayload): Promise<User> {
  const res = await localAPI.post("/auth/register", data);

  return res.data;
}

export async function loginUser(data: AuthPayload): Promise<User> {
  const res = await localAPI.post<User>("/auth/login", data);
  return res.data;
}

export async function logoutUser(): Promise<void> {
  await localAPI.post("/auth/logout");
}

// export async function savedArticles(articleId: string): Promise<Story> {
//   const res = await api.post<Story>(`/saved-articles/${articleId}`);
//   return res.data;
// }

export async function getCurrentStory(storyId: string): Promise<StoryResponse> {
  const res = await backendAPI.get<StoryResponse>(`/stories/${storyId}`);
  return res.data;
}

export async function postNewStory(params: CreateStoryFormData) {
  const response = await localAPI.post("/stories", params);
  return response.data.data;
}

// ================ Історії Мандрівників ========
export async function fetchStories(
  page = 1,
  perPage = 3,
  categoryId?: string
): Promise<Story[]> {
  const res = await backendAPI.get<StoriesResponse>("/stories", {
    params: { page, perPage, sort: "favoriteCount", category: categoryId },
  });
  return res.data?.data?.data || [];
}

export async function fetchSavedStoriesByUserId(
  userId: string
): Promise<SavedStory[]> {
  const res = await backendAPI.get<UserSavedArticlesResponse>(
    `/users/${userId}/saved-articles`
  );
  return res.data.data.savedStories;
}

// ================ для зберігання історії при натисканні на іконку ========
export async function addStoryToFavorites(storyId: string): Promise<void> {
  await backendAPI.post(`/users/me/saved/${storyId}`);
}

export async function deleteStoryFromFavorites(storyId: string): Promise<void> {
  await backendAPI.delete(`/users/me/saved/${storyId}`);
}
