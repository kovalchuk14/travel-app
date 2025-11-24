'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import styles from './page.module.css';
import { getStoryById, getCategories } from '@/lib/api/stories';

interface StoryFromApi {
  _id: string;
  img: string;
  title: string;
  description?: string;
  article?: string;
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
        const [storyData, categoriesData] = await Promise.all([
          getStoryById(storyId),
          getCategories(),
        ]);

        setStory(storyData);
        setCategories(categoriesData);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Потрібно увійти в акаунт для редагування історії");
        } else {
          const message =
            err.response?.data?.message || err.message || "Помилка завантаження даних";
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loading}>Завантаження...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.error}>Історію не знайдено</div>
        </div>
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
            article: story.article || story.description || '',
            shortDescription: story.shortDescription || '',
            category: story.category._id,
          }}
          categories={categories}
          storyId={story._id}
          isEditMode={true}
        />
      </div>
    </div>
  );
}

