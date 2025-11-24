import { fetchCategories, getStoriesServer } from "@/lib/api/serverApi";
import StoriesPageClient from "@/components/StoriesPageClient/StoriesPageClient";
import css from "./Stories.module.css";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const firstStories = await getStoriesServer(1, 9);
  const categories = await fetchCategories();

  return (
    <section className={css.stories}>
      <div className="container">
        <StoriesPageClient
          firstStories={firstStories}
          categories={categories}
        />
      </div>
    </section>
  );
}
