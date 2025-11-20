'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface StoryFromApi {
  _id: string;
  img: string;
  title: string;
  article: string;
  shortDescription?: string;
  category: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

export default function EditStoryPage() {
  const { storyId } = useParams<{ storyId: string }>();

  const [story, setStory] = useState<StoryFromApi | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        //  Отримати історію
        const storyRes = await fetch(`${API_URL}/stories/${storyId}`);
        if (!storyRes.ok) {
          const body = await storyRes.json().catch(() => null);
          throw new Error(body?.message || 'Історію не знайдено');
        }
        const storyData = await storyRes.json();

        // Отримати категорії
        const categoriesRes = await fetch(`${API_URL}/categories`);
        if (!categoriesRes.ok) {
          const body = await categoriesRes.json().catch(() => null);
          throw new Error(
            body?.message || 'Не вдалося завантажити категорії'
          );
        }
        const categoriesData = await categoriesRes.json();

        setStory(storyData.data as StoryFromApi);
        setCategories(categoriesData.data.data as Category[]);
      } catch (err) {
       console.error('Помилка завантаження:', err);
       const message =
         err instanceof Error ? err.message : 'Помилка завантаження даних';
      setError(message);
      }finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>Історію не знайдено</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
      <h2 className={styles.title}>Редагувати історію</h2>

      <AddStoryForm
        initialValues={{
          img: story.img,
          title: story.title,
          article: story.article,                 
          shortDescription: story.shortDescription || '',
          category: story.category._id,             
        }}
        categories={categories}
        storyId={storyId}
        isEditMode={true}
        />
        </div>
    </div>
  );
}