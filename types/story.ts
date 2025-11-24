export type Story = {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  ownerId: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  date: string;
  favoriteCount: number;
  isFavorite?: boolean;
};

export type StoryResponse = {
  data: Story;
  status: string;
  message: string;
};


export interface Category {
  _id: string;
  name: string;
}


export interface StoriesResponse {
  status: number;
  message: string;
  data: {
    data: Story[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}
  

export interface SavedStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  date: string;
  favoriteCount: number;
}


export interface UserSavedArticlesResponse {
  status: number;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      avatarUrl: string;
      description?: string;
      createdAt?: string;
    };
    savedStories: SavedStory[];
  };
}


export interface CategoriesResponse{
  status: number;
  message: string;
  data: {
    data: Category[];
  }
}