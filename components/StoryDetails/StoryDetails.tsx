"use client";

import { Story } from "@/types/story";
import css from "./StoryDetails.module.css";
import Image from "next/image";

type StoryDetailsProps = {
  story: Story;
};

export default function StoryDetails({ story }: StoryDetailsProps) {
  if (!story) {
    return <p className={css.noStory}>Історія не знайдена</p>;
  }

  return (
    <div className={css.container}>
      <h2 className={css.title}>{story.title || "Без назви"}</h2>

      <div className={css.info}>
        <div className={css.info_row}>
          <p className={css.meta}>
            Автор статті
            <span className={css.author}>
              {story.ownerId?.name || "Невідомий автор"}
            </span>
          </p>
          <p className={css.meta}>
            Опубліковано
            <span className={css.date}>
              {story.date
                ? new Date(story.date).toLocaleDateString("uk-UA")
                : "Без дати"}
            </span>
          </p>
        </div>
        <p className={css.category}>
          {story.category?.name || "Без категорії"}
        </p>
      </div>

      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={story.img || "/images/default.jpg"}
        />
        <source
          media="(max-width: 1439px)"
          srcSet={story.img || "/images/default.jpg"}
        />
        <source
          media="(min-width: 1440px)"
          srcSet={story.img || "/images/default.jpg"}
        />

        <Image
          src={story.img || "/images/desk.jpg"}
          alt={story.title || "Без назви"}
          width={1312}
          height={874}
        />
      </picture>

      <div className={css.container_story_save}>
        <article className={css.content}>
          <p>{story.article || "Текст відсутній"}</p>
        </article>

        <section className={css.cta} aria-label="Saving history">
          <h2 className={css.ctaTitle}>Збережіть собі історію</h2>
          <p className={css.ctaText}>
            Вона буде доступна у вашому профілі у розділі збережене
          </p>
          <button className={css.saveButton}>Зберегти</button>
        </section>
      </div>
    </div>
  );
}
