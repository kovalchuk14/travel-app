import { api } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { Story as BaseStory } from "@/types/story";
import Link from "next/link";
import styles from "./page.module.css";

type TravellerUser = User & {
  username?: string;
  bio?: string;
  avatarUrl?: string;
};

type Story = BaseStory & {
  storyImage?: string;
  createdAt?: string;
  category?: { name?: string };
};

type StoriesResponse = {
  status: number;
  message: string;
  data: {
    total: number;
    page: number;
    totalPages: number;
    stories: Story[];
  };
};

type PageProps = {
  params: { id: string };
  searchParams?: { page?: string };
};

export default async function TravellerPublicPage({ params, searchParams }: PageProps) {
  const travellerId = params.id;
  const currentPage = Number(searchParams?.page ?? "1");

  const userRes = await api.get<TravellerUser>(`/users/${travellerId}`);
  const user = userRes.data;

  let stories: Story[] = [];
  let page = currentPage;
  let totalPages = 1;

  try {
    const res = await api.get<StoriesResponse>(
      `/stories?userId=${travellerId}&page=${currentPage}&limit=6`
    );

    stories = res.data.data.stories;
    page = res.data.data.page;
    totalPages = res.data.data.totalPages;
  } catch (error) {}

  const hasStories = stories.length > 0;

  return (
    <main className={styles.page}>
      <section className={styles.travellerInfo}>
        <div className={styles.avatarWrapper}>
          <img
            src={user.avatarUrl || "/images/story-mobile.jpg"}
            alt={user.username || "Traveller avatar"}
            className={styles.avatar}
          />
        </div>

        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{user.username || "Мандрівник"}</h1>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
        </div>
      </section>

      <section className={styles.storiesSection}>
     <h2 className={styles.sectionTitle}>Історії Мандрівника</h2>

        {!hasStories ? (
          <div className={styles.noStories}>
            <p className={styles.noStoriesText}>
              Цей користувач ще не публікував історій.
            </p>

            <Link href="/stories" className={styles.noStoriesButton}>
              До історій
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cards}>
              {stories.map((story) => (
                <article key={story._id} className={styles.card}>
                  <img
                    src={story.storyImage || "/images/story-desk.jpg"}
                    alt={story.title}
                    className={styles.cardImage}
                  />

                  <div className={styles.cardBody}>
                    <span className={styles.category}>
                      {story.category?.name || "Категорія"}
                    </span>

                    <h3 className={styles.cardTitle}>{story.title}</h3>

                    <p className={styles.cardDescription}>
                      {story.description.slice(0, 120)}…
                    </p>

                    <div className={styles.authorRow}>
                      <img
                        src={user.avatarUrl || "/images/story-mobile.jpg"}
                        alt={user.username || "Автор"}
                        className={styles.authorAvatar}
                      />
                      <span className={styles.authorName}>
                        {user.username || "Мандрівник"}
                      </span>

                      {story.createdAt && (
                        <span className={styles.date}>
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/stories/${story._id}`}
                      className={styles.readBtn}
                    >
                      Переглянути статтю
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {page < totalPages && (
              <div className={styles.showMoreWrapper}>
                <Link
                  href={`/travellers/${travellerId}?page=${page + 1}`}
                  className={styles.showMore}
                >
                  Показати ще
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
