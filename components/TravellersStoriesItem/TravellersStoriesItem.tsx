'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Story } from '@/types/story';
import { addStoryToFavorites, deleteStoryFromFavorites } from '@/lib/api/clientApi';
import css from './TravellersStoriesItem.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useMutation } from "@tanstack/react-query";
import { Icon } from '../Icon/Icon';

interface TravellersStoriesItemProps {
  story: Story;
}


export default function TravellersStoriesItem({ story}: TravellersStoriesItemProps) {

  const router = useRouter();
  
  const [favoriteCount, setFavoriteCount] = useState<number>(story.favoriteCount);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOwner, setIsOwner] = useState(false);


  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateFavorites = useAuthStore((state) => state.updateFavorites);

  const ownerId =
    typeof story.ownerId === "string" ? story.ownerId : story.ownerId._id;


  useEffect(() => { 
    const updateStates = () => {
      if (!isAuthenticated || !user) return;
      if (ownerId === user._id) setIsOwner(true);
      if (!user.savedArticles) return;
      setIsFavorite(user.savedArticles.includes(story._id));
    };
    updateStates();
  }, [isAuthenticated, user, story._id, ownerId])

  
  const deleteStoryMutation = useMutation({
  mutationFn: (id: string) => deleteStoryFromFavorites(id),
  onSuccess(data) {
    updateFavorites(data.data.user.savedArticles);
    setFavoriteCount(data.data.story.favoriteCount);
    setIsFavorite(false)
  },
  onError(error: any) {
    toast.error(error.message);
  },
});

const addStoryMutation = useMutation({
  mutationFn: (id: string) => addStoryToFavorites(id),
  onSuccess(data) {
    updateFavorites(data.data.user.savedArticles);
    setFavoriteCount(data.data.story.favoriteCount);
    setIsFavorite(true)
  },
  onError(error: any) {
    toast.error(error.message);
  },
});


const handleOnClick = () => {
  if (!isAuthenticated) {
    router.push("/auth/register");
    return;
  }

  if (isFavorite) {
    toast.success("Видалено із збережених", { duration: 1200 });
    deleteStoryMutation.mutate(story._id);
  } else {
    toast.success("Додано до збережених!", { duration: 1200 });
    addStoryMutation.mutate(story._id);
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
            onClick={handleOnClick}
            className={isFavorite?`${css.storySave} ${css.storySaveFav}`: css.storySave} 
          >
            <svg className={css.storySaveSvg} >
                {isOwner ? (
                  <use href="/icons/sprite.svg#icon-edit"></use>
                ) : (
                  <use href="/icons/sprite.svg#icon-bookmark"></use>
                )}
              </svg>
            
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