"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import TravellerInfo from "@/components/travellers/TravellerInfo/TravellerInfo";
import TravellersStories from "@/components/stories/TravellersStories";
import { Loader } from "../ui/Loader/Loader";
import { Story } from "@/types/story";

import css from "./ProfilePage.module.css";
import MessageNoStories from "../MessageNoStories/MessageNoStories";
import { useAuthStore } from "@/lib/store/authStore";

type SavedStoryRef = string | { _id: string };

type CurrentUser = {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  savedStories: SavedStoryRef[];
};

type PublicProfileResponse = {
  data: {
    articles: Story[];
  };
};

type StoryResponse = {
  data: Story;
};

const TABS = {
  SAVED: "saved",
  MINE: "mine",
} as const;

type activeTab = (typeof TABS)[keyof typeof TABS];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<activeTab>(TABS.SAVED);

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<CurrentUser | null> => {
      try {
        const res = await fetch("/api/users/me", { credentials: "include" });
        const json = await res.json();
        return json.data ?? null;
      } catch (err) {
        console.error("Profile load error:", err);
        return null;
      }
    },
    retry: false,
  });

  const userId = currentUser?._id;
  const savedIds =
    currentUser?.savedStories?.map((s) =>
      typeof s === "string" ? s : s._id
    ) ?? [];

  const {
    data: myStories = [],
    isLoading: isMyLoading,
    isError: isMyError,
  } = useQuery({
    queryKey: ["profile-my-stories", userId],
    enabled: Boolean(userId) && activeTab === TABS.MINE,
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/users/${userId}`, {
        credentials: "include",
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data?.articles || [];
    },
  });

  const {
    data: savedStories = [],
    isLoading: isSavedLoading,
    isError: isSavedError,
  } = useQuery({
    queryKey: ["profile-saved-stories", savedIds],
    enabled: activeTab === TABS.SAVED && savedIds.length > 0,
    queryFn: async () => {
      if (!savedIds.length) return [];
      const responses = await Promise.all(
        savedIds.map((id) =>
          fetch(`/api/stories/${id}`, { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => json?.data || null)
            .catch(() => null)
        )
      );
      return responses.filter(Boolean) as Story[];
    },
  });

  const isStoriesLoading =
    activeTab === TABS.SAVED ? isSavedLoading : isMyLoading;
  const isStoriesError = activeTab === TABS.SAVED ? isSavedError : isMyError;
  const stories = activeTab === TABS.SAVED ? savedStories : myStories;

  if (isUserLoading) {
    return (
      <div className={css.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <p className={css.error}>
        Не вдалося завантажити профіль. Увійдіть у свій акаунт ще раз.
      </p>
    );
  }

  return (
    <main className={css.page}>
      <div className={css.container}>
        <div className={css.travellerHeader}>
          <TravellerInfo traveller={currentUser} />
        </div>

        <section className={css.storiesSection}>
          <div className={css.tabs}>
            <button
              className={`${css.tabButton} ${
                activeTab === TABS.SAVED ? css.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab(TABS.SAVED)}
            >
              Збережені історії
            </button>

            <button
              className={`${css.tabButton} ${
                activeTab === TABS.MINE ? css.tabButtonActive : ""
              }`}
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

            {isStoriesError && (
              <p className={css.error}>
                Помилка завантаження історій. Спробуйте ще раз.
              </p>
            )}

            {!isStoriesLoading && !isStoriesError && stories.length === 0 && (
              <MessageNoStories
                text={
                  activeTab === TABS.SAVED
                    ? "У вас ще немає збережених історій, мерщій збережіть вашу першу історію!"
                    : "Ви ще нічого не публікували, поділіться своєю першою історією!"
                }
                buttonText={
                  activeTab === TABS.SAVED
                    ? "До історій"
                    : "Опублікувати історію"
                }
                redirectTo={
                  activeTab === TABS.SAVED ? "/stories" : "/stories/create"
                }
              />
            )}

            {!isStoriesLoading && !isStoriesError && stories.length > 0 && (
              <TravellersStories stories={stories} key={activeTab} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
