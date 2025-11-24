"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import TravellersStories from "../TravellersStories/TravellersStories";
import CategoriesMenu from "../CategoriesMenu/CategoriesMenu";

import { fetchStories, fetchSavedStoriesByUserId } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./StoriesPageClient.module.css";
import type { Category, Story, SavedStory } from "@/types/story";

interface Props {
  firstStories: Story[];
  categories: Category[];
}

export default function StoriesPageClient({ firstStories, categories }: Props) {
  const [stories, setStories] = useState<Story[]>(firstStories ?? []);
  const [categoryId, setCategoryId] = useState("all");
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const userId = user?._id || null;
  const isAuthenticated = !!userId;

  const { data: savedStories = [] } = useQuery<SavedStory[]>({
    queryKey: ["savedStoriesByUser", userId],
    queryFn: () => fetchSavedStoriesByUserId(userId as string),
    enabled: isAuthenticated,
  });

  const savedIds = isAuthenticated
    ? savedStories.map((story) => story._id)
    : [];

  const mergedStories: Story[] = Array.isArray(stories)
    ? stories.map((story) => ({
        ...story,
        isFavorite: isAuthenticated ? savedIds.includes(story._id) : false,
      }))
    : [];

  useEffect(() => {
    const updateScreen = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1440);
    };
    updateScreen();
    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, []);

  const STORIES_PER_PAGE = isTablet ? 8 : 9;

  useEffect(() => {
    const safeStories = Array.isArray(firstStories) ? firstStories : [];

    setStories(safeStories.slice(0, STORIES_PER_PAGE));
    setPage(1);
    setCanLoadMore(safeStories.length >= STORIES_PER_PAGE);
  }, [firstStories, isTablet, STORIES_PER_PAGE]);

  const updateCategory = async (newCategory: string) => {
    setCategoryId(newCategory);
    setLoading(true);
    try {
      const categoryParam = newCategory === "all" ? undefined : newCategory;
      const data = await fetchStories(1, STORIES_PER_PAGE, categoryParam);
      setStories(data);
      setPage(1);
      setCanLoadMore(data.length === STORIES_PER_PAGE);
    } catch (error) {
      console.error(
        "Виникла помилка при отриманні історій за категорією:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!canLoadMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const categoryParam = categoryId === "all" ? undefined : categoryId;
      const newStories = await fetchStories(
        nextPage,
        STORIES_PER_PAGE,
        categoryParam
      );
      setStories((prev) => [...prev, ...newStories]);
      setPage(newStories.length === STORIES_PER_PAGE ? nextPage : page);
      if (newStories.length < STORIES_PER_PAGE) setCanLoadMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={css.title}>Історії Мандрівників</h1>

      <CategoriesMenu
        categories={categories}
        value={categoryId}
        onChange={updateCategory}
      />

      <TravellersStories
        stories={mergedStories}
        className={css.storiesList}
        isAuthenticated={isAuthenticated}
      />

      {canLoadMore && mergedStories.length > 0 && (
        <div className={css.loadMoreWrapper}>
          <button
            className={`${css.traveller__btn__more} ${css.stories__more}`}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Завантаження..." : "Переглянути ще"}
          </button>
        </div>
      )}
    </>
  );
}
