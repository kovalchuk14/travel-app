"use client";
import { Story } from "@/types/story";
import css from "./PopularItem.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "../Icon/Icon";
import React from "react";

type Props = {
  story: Story;
  isAuthenticated: boolean;
};

export default function PopularItem({ story, isAuthenticated }: Props) {
  const router = useRouter();

  const dateStory = new Date(story.date).toLocaleDateString("uk-UA");
  const favoriteCount = story.favoriteCount ?? 0;

  const [isSaved, setIsSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const pushSave = async () => {
    if (!isAuthenticated) return;
    setIsSaving(true);
    try {
      setIsSaved(!isSaved);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <li className={css.StoryItem}>
      <Image
        src={story.img}
        alt={story.title}
        width={335}
        height={223}
        className={css.storyImg}
      />
      <div className={css.contentCard}>
        <p className={css.category}>{story.category.name}</p>
        <h3 className={css.storyTittle}>{story.title}</h3>
        <p className={css.storyArticle}>{story.description}</p>

        <div className={css.userInfo}>
          <Image
            src={story.ownerId.avatarUrl}
            alt="Автор"
            width={48}
            height={48}
            className={css.userImg}
          />
          <div className={css.userInfoWrapper}>
            <p className={css.userName}>{story.ownerId.name}</p>
            <div className={css.favWrapper}>
              <p className={css.storyDate}>{dateStory}</p>
              <p className={css.storyFavoriteCount}>{favoriteCount}</p>
              <Icon name="icon-bookmark" className={css.storySaveSvg} />
            </div>
          </div>
        </div>

        <div className={css.buttonsWrapper}>
          <button
            onClick={() => router.push(`/stories/${story._id}`)}
            className={css.storyDetailLink}
          >
            Переглянути статтю
          </button>

          <button
            onClick={pushSave}
            disabled={isSaving}
            className={`${css.storySave} ${isSaved ? css.saved : ""}`}
          >
            <Icon
              name="icon-bookmark"
              className={`${isSaved ? css.storySaved : css.storySaveSvg}`}
            />
          </button>
        </div>
      </div>
    </li>
  );
}
