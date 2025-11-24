import { Story } from "@/types/story";
import css from "@/components/StoryDetails/StoryDetails.module.css";
import { backendAPI } from "@/lib/backendAPI";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  story: Story;
};

export default function StoryDetails({ story }: Props) {
  const [saved, setSaved] = useState(false);

  const router = useRouter();

  const isAuthenticated = () => {
    return document.cookie.includes("accessToken=");
  };

  const handleSave = async () => {
    if (!isAuthenticated()) {
      router.push("/auth/register");
      return;
    }

    if (saved) return;

    try {
      const res = await backendAPI.post(
        `/users/saved-articles/${story._id}`,
        {}
      );
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
          <button onClick={handleSave} disabled={saved} className="saveButton">
            {saved ? "Збережено ✓" : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
}
