"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/api"
import { Loader } from "../ui/Loader/Loader";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.storiesSection}>
          <div className={styles.tabs}>
            <button className={styles.tabButton}>
              Збережені історії
            </button>

            <button className={styles.tabButton}>
              Мої історії
            </button>
          </div>

          <div className={styles.storiesInner}>
            {/* Loader placeholder */}
            <div className={styles.loaderWrapper}>Loading...</div>

            {/* Error placeholder */}
            <p className={styles.error}>
              Помилка завантаження історій. Спробуйте ще раз.
            </p>

            {/* Empty state placeholder */}
            <div>
              <p>Немає історій</p>
              <button>Перейти</button>
            </div>

            {/* Stories placeholder */}
            <div>
              <p>Тут будуть історії користувача…</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
