
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";
import css from "./TravellersStories.module.css"
import { Story } from "@/types/story";


interface TravellersStoriesProps{
  stories: Story[];
  className?: string;
}

export default function TravellersStories({ stories,  className }: TravellersStoriesProps) {

  
    return (

        <div>
          <ul className={`${css.storiesList} ${className || ''}`}>
        {stories.map(story => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </ul>
        </div>

  );
}
