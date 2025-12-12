"use client";
import { Story } from "@/types/story";
import css from "./Popular.module.css";
import PopularItem from "../PopularItem/PopularItem";
import { fetchStories } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";

type Props = {
  isAuthenticated: boolean;
  showLoadMore?: boolean;
};

export default function Popular({ isAuthenticated, showLoadMore }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStories(page, 3); // page, perPage
        if (page === 1) {
          setStories(data);
        } else {
          setStories((prev) => [...prev, ...data]);
        }
      } catch (err) {
        console.error("Error loading stories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <section className={css.container}>
      <h2 className={css.title}>Популярні історії</h2>
      <ul className={css.PopularList}>
        {stories.map((story) => (
          <PopularItem
            key={story._id}
            story={story}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </ul>

      {showLoadMore && stories.length > 0 && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className={css.saveButton}
        >
          {isLoading ? "Завантаження..." : "Завантажити ще"}
        </button>
      )}
    </section>
  );
}
