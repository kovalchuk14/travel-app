"use client";

import { Story } from "@/types/story";
import css from "./StoryDetails.module.css";
import Image from "next/image";
import { useState } from "react";
import { savedArticles } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useMutation } from "@tanstack/react-query";

type StoryDetailsProps = {
  data: Story;
};

export default function StoryDetails({ data }: StoryDetailsProps) {
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log(isAuthenticated);

  const mutation = useMutation({
    mutationFn: () => savedArticles(data._id),
    onSuccess: () => {
      setSaved(true);
    },
    onError: (error) => {
      console.error("Error saving article:", error);
    },
  });

  const handleSave = () => {
    if (!user || !isAuthenticated) {
      router.push("/auth/register");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>{data.title}</h2>

      <div className={css.info}>
        <div className={css.info_row}>
          <p className={css.meta}>
            Автор статті
            <span className={css.author}>{data.ownerId?.name}</span>
          </p>
          <p className={css.meta}>
            Опубліковано
            <span className={css.date}>{data.date}</span>
          </p>
        </div>
        <p className={css.category}>{data.category?.name}</p>
      </div>

      <picture>
        <source media="(max-width: 767px)" srcSet={data.img} />
        <source media="(max-width: 1439px)" srcSet={data.img} />

        <Image
          src={data.img}
          alt={data.title}
          width={1312}
          height={874}
          className={css.imageWrapper}
        />
      </picture>

      <div className={css.container_story_save}>
        <article className={css.content}>
          <p>{data.article}</p>
        </article>

        <section className={css.cta} aria-label="Saving history">
          <h2 className={css.ctaTitle}>Збережіть собі історію</h2>
          <p className={css.ctaText}>
            Вона буде доступна у вашому профілі у розділі збережене
          </p>
          <button className={css.saveButton} onClick={handleSave}>
            {saved ? "Збережено" : "Зберегти"}
          </button>
        </section>
      </div>
    </div>
  );
}
