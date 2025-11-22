import Link from "next/link";
import Image from "next/image";
import type { Story } from "@/types/story";
import styles from "./TravellersStories.module.css";

interface Props {
  stories: Story[];
}

export default function TravellersStories({ stories }: Props) {
  if (!stories.length) return null;

  return (
    <div className={styles.grid}>
      {stories.map((story) => (
        <Link
          key={story._id}
          href={`/stories/${story._id}`}
          className={styles.card}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={story.img || "/placeholder.jpg"}
              alt={story.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 350px"
            />
            <div className={styles.overlay} />
          </div>

          <div className={styles.content}>
            <h3 className={styles.title}>{story.title}</h3>
            <p className={styles.excerpt}>
              {story.article.slice(0, 120)}... 
            </p>
            <div className={styles.footer}>
              <time>
                {new Date(story.date).toLocaleDateString("uk-UA")}
              </time>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}