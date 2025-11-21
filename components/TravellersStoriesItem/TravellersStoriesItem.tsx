'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Story } from '@/types/story';
import { addStoryToFavorites, deleteStoryFromFavorites } from '@/lib/api/clientApi';
import css from './TravellersStoriesItem.module.css';
import { Icon } from '../Icon/Icon';

interface TravellersStoriesItemProps {
  story: Story;
  isAuthenticated: boolean;
}


export default function TravellersStoriesItem({ story, isAuthenticated }: TravellersStoriesItemProps) {

  const router = useRouter();
  const [isSaved, setIsSaved] = useState<boolean>(story.isFavorite ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(story.favoriteCount);

  useEffect(()=>{ setIsSaved(story.isFavorite??false)}, [story.isFavorite])

  const pushSave = async () => {
    if (!isAuthenticated) {
      router.push('/auth/register');
      return;
      }

      try {
      setIsSaving(true);
      if (!isSaved) {
        await addStoryToFavorites(story._id);
        setFavoriteCount(prev => prev + 1);
        setIsSaved(true);
        toast.success('Додано до збережених!');
      } else {
        await deleteStoryFromFavorites(story._id);
        setFavoriteCount(prev => prev - 1);
        setIsSaved(false);
        toast('Видалено із збережених');
      }
    } catch (error) {
        console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const dateStory = getDate(story.date);


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
        <p className={css.storyArticle}>{story.article}</p>

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
              <p className={css.  storyFavoriteCount}>
                {favoriteCount}</p>
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
              className={`${css.storySave} ${isSaved ? css.saved : ''}`}
                 >
                <Icon name="icon-bookmark" className={`${isSaved ? css.storySaved : css.storySaveSvg}`} />
            
                  </button>     

        </div>
      </div>
    </li>
  )
        
}



function getDate(date: string): string {
  const formattedDate = new Date(date).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });


  return formattedDate;
}