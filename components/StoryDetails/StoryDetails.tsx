import { Story } from "@/types/story";
import css from "@/components/StoryDetails/StoryDetails.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { localAPI } from "@/lib/localAPI";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  story: Story;
};

export default function StoryDetails({ story }: Props) {
  const [saved, setSaved] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.savedArticles.includes(story._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [story]);

  const handleSave = async () => {
    try {
      if (!saved) {
        await localAPI.post(`/users/saved-articles/${story._id}`);
        setSaved(true);
      } else {
        await localAPI.delete(`/users/saved-articles/${story._id}`);
        setSaved(false);
      }
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  return (
    <div className={css.container} id="stories">
      <h2 className={css.title}>{story.title}</h2>
      <div className={css.info}>
        <div className={css.info_row}>
          <p className={css.meta}>
            Автор статті{" "}
            <span className={css.author}> {story.ownerId.name}</span>
          </p>
          <p className={css.meta}>
            Опубліковано<span className={css.date}>{story.date}</span>
          </p>
        </div>

        <p className={css.category}>{story.category.name}</p>
      </div>

      <picture className={css.imageWrapper}>
        <img src={story.img} alt="story pictures " width={1312} height={874} />
      </picture>
      <div className={css.container_story_save}>
        <p className={css.content}>{story.article}</p>

        <div className={css.cta} aria-label="Saving history">
          <h2 className={css.ctaTitle}>Збережіть собі історію</h2>
          <p className={css.ctaText}>
            Вона буде доступна у вашому профілі у розділі збережене
          </p>
          <button onClick={handleSave} className={css.saveButton}>
            {saved ? "Збережено ✓" : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
}
