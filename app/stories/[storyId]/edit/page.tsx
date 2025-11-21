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

interface StoryResponseFromBackend {
  status: number;
  message: string;
  data: StoryFromApi;
}

interface CategoriesResponseFromBackend {
  status: number;
  message: string;
  data: {
    data: Category[];
  };
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
        const url = `${API_URL}/stories/${storyId}`;

        const storyRes = await fetch(url, {
          credentials: 'include',
        });

        const rawText = await storyRes.text();
        let storyBody: StoryResponseFromBackend | null = null;

        try {
          storyBody = JSON.parse(rawText);
        } catch (e) {
          throw new Error('Не вдалося розпарсити відповідь від сервера');
        }

        if (!storyRes.ok || !storyBody?.data) {
          if (storyRes.status === 401) {
            throw new Error('Потрібно увійти в акаунт для редагування історії');
          }
          throw new Error(
            storyBody?.message || 'Історію не знайдено або помилка бекенда'
          );
        }

        setStory(storyBody.data);

        // Завантажуємо категорії
        const categoriesRes = await fetch(`${API_URL}/categories`, {
          credentials: 'include',
        });
        const categoriesJson: CategoriesResponseFromBackend =
          await categoriesRes.json();

        if (!categoriesRes.ok || !categoriesJson?.data?.data) {
          throw new Error('Не вдалося завантажити категорії');
        }

        setCategories(categoriesJson.data.data);
      } catch (err) {
        console.error('Помилка завантаження:', err);
        const message =
          err instanceof Error ? err.message : 'Помилка завантаження даних';
        setError(message);
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
            article: story.article,
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
