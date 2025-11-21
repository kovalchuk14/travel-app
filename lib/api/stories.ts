import { Story } from "@/types/story";
import { backendAPI } from "../backendAPI";
import { localAPI } from "../localAPI";


export async function savedArticles(articleId: string) {
  const res = await backendAPI.post<Story>(`/saved-articles/${articleId}`);
  return res.data;
}

// ===== функції для AddStoryForm / EditStoryPage =====

interface StoryFormData {
  title: string;
  category: string;
  shortDescription: string;
  article: string;
  img?: File;
  imgUrl?: string;
}

interface StoryResponse {
  status: number;
  message: string;
  data: Story;
}

export async function createStory(data: StoryFormData): Promise<Story> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('category', data.category);
  formData.append('shortDescription', data.shortDescription);
  formData.append('article', data.article);

  if (data.img) {
    formData.append('img', data.img);
  } else if (data.imgUrl) {
    formData.append('imgUrl', data.imgUrl);
  }

  const res = await localAPI.post<StoryResponse>('/stories', formData);
  return res.data.data;
}

export async function updateStory(
  storyId: string,
  data: StoryFormData
): Promise<Story> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('category', data.category);
  formData.append('shortDescription', data.shortDescription);
  formData.append('article', data.article);

  if (data.img) {
    formData.append('img', data.img);
  } else if (data.imgUrl) {
    formData.append('imgUrl', data.imgUrl);
  }

  const res = await localAPI.patch<StoryResponse>(
    `/stories/${storyId}`,
    formData
  );
  return res.data.data;
}

export async function getStoryById(storyId: string): Promise<Story> {
  const res = await localAPI.get<StoryResponse>(`/stories/${storyId}`);
  return res.data.data;
}

export async function getCategories(): Promise<Array<{ _id: string; name: string }>> {
  const res = await localAPI.get('/categories');
  return res.data.data.data;
}