import { api } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { Story as BaseStory } from "@/types/story";
import Link from "next/link";
import styles from "./page.module.css";

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

type TravellerPageProps = {
  params: { travellerId: string };
  searchParams?: { page?: string };
};

type TravellerInfoProps = {
  user: User;
};

type TravellersStoriesProps = {
  stories: Story[];
  user: User;
  page: number;
  totalPages: number;
  travellerId: string;
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function TravellerInfo({ user }: TravellerInfoProps) {
  const username =
    (user as any).username || (user as any).name || "Мандрівник";
  const avatar = (user as any).avatar || "/images/story-mobile.jpg";
  const bio = (user as any).bio;

  return (
    <section className={styles.header}>
      <div className={styles.avatarWrapper}>
        <img src={avatar} alt={username} className={styles.avatar} />
      </div>
      <div className={styles.headerInfo}>
        <h1 className={styles.name}>{username}</h1>
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>
    </section>
  );
}

function MessageNoStories() {
  return (
    <section className={styles.noStoriesSection}>
      <h2 className={styles.sectionTitle}>Історії Мандрівника</h2>
      <div className={styles.noStoriesBox}>
        <p className={styles.noStoriesText}>
          Цей користувач ще не публікував історії
        </p>
        <Link href="/stories" className={styles.noStoriesButton}>
          Назад до історій
        </Link>
      </div>
    </section>
  );
}

function TravellersStories({
  stories,
  user,
  page,
  totalPages,
  travellerId,
}: TravellersStoriesProps) {
  const username =
    (user as any).username || (user as any).name || "Мандрівник";
  const avatar = (user as any).avatar || "/images/story-mobile.jpg";

  return (
    <section className={styles.storiesSection}>
      <h2 className={styles.sectionTitle}>Історії Мандрівника</h2>

      <div className={styles.grid}>
        {stories.map((story: Story, index: number) => (
          <article
            key={story._id}
            className={`${styles.card} ${
              index > 3 ? styles.cardHiddenMobile : ""
            }`}
          >
            <img
              src={story.storyImage || "/images/story-desk.jpg"}
              alt={story.title}
              className={styles.cardImage}
            />

            <div className={styles.cardBody}>
              <span className={styles.category}>
                {story.category?.name || "Подорожі"}
              </span>

              <h3 className={styles.cardTitle}>{story.title}</h3>

              <p className={styles.cardDescription}>{story.description}</p>

              <div className={styles.cardFooter}>
                <div className={styles.cardAuthor}>
                  <img
                    src={avatar}
                    alt={username}
                    className={styles.cardAuthorAvatar}
                  />
                  <div>
                    <p className={styles.cardAuthorName}>{username}</p>
                    <p className={styles.cardMeta}>
                      {formatDate(story.createdAt)} 
                    </p>
                  </div>
                </div>

                <Link
                  href={`/stories/${story._id}`}
                  className={styles.cardButton}
                >
                  Переглянути статтю
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {page < totalPages && (
        <div className={styles.showMoreWrapper}>
          <Link
            href={`/travellers/${travellerId}?page=${page + 1}`}
            className={styles.showMoreButton}
          >
            Показати ще
          </Link>
        </div>
      )}
    </section>
  );
}

export default async function TravellerPage({
  params,
  searchParams,
}: TravellerPageProps) {
  const { travellerId } = params;
  const currentPage = Number(searchParams?.page || "1") || 1;

  const [userRes, storiesRes] = await Promise.all([
    api.get<User>(`/users/${travellerId}`),
    api.get<StoriesResponse>("/stories", {
      params: { userId: travellerId, page: currentPage, limit: 6 },
    }),
  ]);

  const user = userRes.data;
  const { page, totalPages, stories } = storiesRes.data.data;

  return (
    <main className={styles.page}>
      <TravellerInfo user={user} />
      {stories.length === 0 ? (
        <MessageNoStories />
      ) : (
        <TravellersStories
          stories={stories}
          user={user}
          page={page}
          totalPages={totalPages}
          travellerId={travellerId}
        />
      )}
    </main>
  );
}