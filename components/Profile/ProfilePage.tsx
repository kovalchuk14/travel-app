"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import TravellerInfo from "@/components/travellers/TravellerInfo/TravellerInfo";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import { Loader } from "../ui/Loader/Loader";
import { Story } from "@/types/story";
import MessageNoStories from "../MessageNoStories/MessageNoStories";

import css from "./ProfilePage.module.css";

type SavedStoryRef = string | { _id: string };

type CurrentUser = {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  description: string;
  articlesAmount?: number;
  savedArticles: SavedStoryRef[];
};

const TABS = { SAVED: "saved", MINE: "mine" } as const;
type ActiveTab = (typeof TABS)[keyof typeof TABS];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(TABS.SAVED);

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<CurrentUser | null> => {
      try {
        const res = await fetch("/api/users/me?t=" + Date.now(), {
          credentials: "include",
          cache: "no-store",
        });
        const json = await res.json();
        return json.data ?? null;
      } catch {
        return null;
      }
    },
    staleTime: 0,
  });

  const isAuthenticated = !!currentUser;

  const savedIds = useMemo(() => {
    return currentUser?.savedArticles?.map(s => typeof s === "string" ? s : s._id) ?? [];
  }, [currentUser]);

  const { data: savedStories = [], isLoading: isSavedLoading } = useQuery({
    queryKey: ["saved-stories", savedIds],
    enabled: activeTab === TABS.SAVED && savedIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        savedIds.map(id =>
          fetch(`/api/stories/${id}`, { credentials: "include" })
            .then(r => r.ok ? r.json() : null)
            .then(j => j?.data || null)
            .catch(() => null)
        )
      );
      return results.filter(Boolean) as Story[];
    },
  });

  const { data: myStories = [], isLoading: isMyLoading } = useQuery({
    queryKey: ["my-stories", currentUser?._id],
    enabled: activeTab === TABS.MINE && !!currentUser?._id,
    queryFn: async () => {
      if (!currentUser?._id) return [];

      const res = await fetch("/api/stories?perPage=999", {
        credentials: "include",
      });

      if (!res.ok) return [];

      const json = await res.json();
      const allStories = json.data?.data || json.data || [];

      return allStories
        .filter((story: any) => story.ownerId?._id === currentUser._id)
        .map((story: Story) => ({
          ...story,
          isFavorite: true,
          favoriteCount: story.favoriteCount ?? 0,
        }));
    },
  });

  // Що показуємо
  const stories = activeTab === TABS.SAVED ? savedStories : myStories;
  const isStoriesLoading = activeTab === TABS.SAVED ? isSavedLoading : isMyLoading;

  if (isUserLoading) return <div className={css.loaderWrapper}><Loader /></div>;
  if (!currentUser) return <p className={css.error}>Не вдалося завантажити профіль.</p>;

  return (
    <main className={css.page}>
      <div className={css.container}>
        <div className={css.travellerHeader}>
          <TravellerInfo traveller={currentUser} />
        </div>

        <section className={css.storiesSection}>
          <div className={css.tabs}>
            <button
              className={`${css.tabButton} ${activeTab === TABS.SAVED ? css.tabButtonActive : ""}`}
              onClick={() => setActiveTab(TABS.SAVED)}
            >
              Збережені історії
            </button>

            <button
              className={`${css.tabButton} ${activeTab === TABS.MINE ? css.tabButtonActive : ""}`}
              onClick={() => setActiveTab(TABS.MINE)}
            >
              Мої історії
            </button>
          </div>

          <div className={css.storiesInner}>
            {isStoriesLoading && (
              <div className={css.loaderWrapper}>
                <Loader />
              </div>
            )}

            {!isStoriesLoading && stories.length === 0 && (
              <MessageNoStories
                text={
                  activeTab === TABS.SAVED
                    ? "У вас ще немає збережених історій!"
                    : "Ви ще нічого не публікували!"
                }
                buttonText={activeTab === TABS.SAVED ? "До історій" : "Опублікувати історію"}
                redirectTo={activeTab === TABS.SAVED ? "/stories" : "/stories/create"}
              />
            )}

            {!isStoriesLoading && stories.length > 0 && (
              <TravellersStories
                stories={stories}
                isAuthenticated={isAuthenticated}
                key={`${activeTab}-${stories.length}`}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}