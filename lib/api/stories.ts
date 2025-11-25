export const __testStoriesModule = true;

import { Story, StoryResponse } from "@/types/story";
import { backendAPI } from "../backendAPI";
import { localAPI } from "../localAPI";


export async function savedArticles(articleId: string) {
  const res = await backendAPI.post<Story>(`/saved-articles/${articleId}`);
  return res.data;
}

export async function updateStory(storyId: string, formData: FormData): Promise<Story> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await localAPI.patch(`/stories/${storyId}`, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data.data;
}

export async function getStoryById(storyId: string): Promise<Story> {
  const res = await localAPI.get<StoryResponse>(`/stories/${storyId}`);
  return res.data.data;
}

export async function getCategories(): Promise<Array<{ _id: string; name: string }>> {
  const res = await backendAPI.get('/categories');
  return res.data.data.data;
}