"use client";

import { Story } from "@/types/story";
import css from "./StoryDetails.module.css";
import Image from "next/image";

type StoryDetailsProps = {
  story: Story;
};

export default function StoryDetails({ story }: StoryDetailsProps) {
  return (
    <div className={css.container}>
      <h2 className={css.title}>{story.title}</h2>

      <div className={css.info}>
        <div className={css.info_row}>
          <p className={css.meta}>
            Автор статті
            <span className={css.author}>{story.ownerId?.name}</span>
          </p>
          <p className={css.meta}>
            Опубліковано
            <span className={css.date}>{story.date}</span>
          </p>
        </div>
        <p className={css.category}>{story.category?.name}</p>
      </div>

      <picture>
        <source media="(max-width: 767px)" srcSet={story.img} />
        <source media="(max-width: 1439px)" srcSet={story.img} />

        <Image
          src={story.img}
          alt={story.title}
          width={1312}
          height={874}
          className={css.imageWrapper}
        />
      </picture>

      <div className={css.container_story_save}>
        <article className={css.content}>
          <p>{story.article}</p>
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
