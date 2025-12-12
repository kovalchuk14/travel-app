'use client'

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Story } from "@/types/story";
import { fetchStories } from "@/lib/api/clientApi";
import TravellersStories from "../TravellersStories/TravellersStories";
import css from './PopularClient.module.css'

interface PopularClientProps{
    firstStories: Story[],
    withPagination?: boolean
}

export default function PopularClient({
    firstStories,
    withPagination=true
  }: PopularClientProps) {

    const isFetchingRef = useRef(false);
    const [perPage, setPerPage] = useState(3);
    const [visibleCount, setVisibleCount] = useState<number>(3);
    const [stories, setStories] = useState<Story[]>(firstStories ||[]);
   const [hasMore, setHasMore] = useState(true);
  
  const router = useRouter();

    useEffect(() => {
    const updatePerPage = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth < 768) setPerPage(3);
      else if (windowWidth < 1440) setPerPage(4);
      else setPerPage(3);
    };

    updatePerPage();

    window.addEventListener("resize", updatePerPage);

    return () => window.removeEventListener("resize", updatePerPage);
    }, []);

    useEffect(() => {
    setVisibleCount(perPage);
    }, [perPage]);
    
    const visibleStories =(stories || []).slice(0, visibleCount);
    
    
    const handleLoadMore = async () => {
    if (!withPagination || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;

    try {
      const offset = stories.length;
      const page = Math.floor(offset / perPage) + 1;

      const newStories = await fetchStories(page, perPage);

      setStories(prev => {
        const existing = new Set(prev.map(s => s._id));
        return [...prev, ...newStories.filter(s => !existing.has(s._id))];
      });

      setHasMore(newStories.length === perPage);

      setVisibleCount(prev => prev + perPage);
    } catch (err) {
      console.error('Помилка завантаження:', err);
    } finally {
      isFetchingRef.current = false;
    }
  };



    return (
        <section className="stories">
      <div className="container">
        <h2 className={css.stories_title}>Популярні історії</h2>

        <TravellersStories
             stories={visibleStories}
        />

        {withPagination && hasMore && (
          <div className={css.wraper_btn}>
              <button onClick={() => router.push(`/stories`)}
            className={css.stories_btn}>Переглянути всі</button>
          </div>
        )}
      </div>
    </section>
    )
}