"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./TravellerInfo.module.css";
import { getTravellerById } from "@/lib/api/travellersApi";
import { Avatar } from "../Avatar/Avatar";

interface TravellerInfoProps {
  id: string;
}

export default function TravellerInfo({ id }: TravellerInfoProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["traveller", id],
    queryFn: () => getTravellerById(id),
  });


  if (isError || !data) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.error}>Помилка завантаження профілю.</p>
        </div>
      </section>
    );
  }

  const { name, avatar, bio } = data as {
    name: string;
    avatar?: string;
    bio?: string;
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.profile}>
            <Avatar src={avatar} name={name} />

            <div className={styles.info}>
              <h1 className={styles.name}>{name}</h1>
              <p className={styles.bio}>
                {bio || "Мандрівник поки не додав опис."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}