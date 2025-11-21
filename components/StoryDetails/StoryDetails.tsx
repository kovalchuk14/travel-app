import { Story } from "@/types/story";
import css from "@/components/StoryDetails/StoryDetails.module.css";

type Props = {
  story: Story;
};

export default function StoryDetails({ story }: Props) {
  return (
    <div className={css.container}>
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
        <article >
          <p className={css.content}>{story.article}</p>
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
