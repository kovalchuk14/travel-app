export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}



// export type GetArticlesResponse = {
//   user: User;
//   articles: ArticlesWithPagination;
//   totalArticles: number;
// };

// export interface ArticlesWithPagination {
//   items: BackendArticleFromUser[];
//   pagination: PaginationData;
// }

// export interface PaginationData {
//   currentPage: number;
//   perPage: number;
//   totalItems: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

// export interface BackendArticleFromUser {
//   _id: string;
//   title: string;
//   article: string;
//   img: string;
//   date: string;
//   favoriteCount: number;
//   authorId?: string;
// }