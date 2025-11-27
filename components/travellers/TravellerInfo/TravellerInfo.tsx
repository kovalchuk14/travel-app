"use client";

import css from "./TravellerInfo.module.css";
import { Avatar } from "../Avatar/Avatar";

interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  description: string;
}

interface TravellerInfoProps {
  id: string;
  traveller: Traveller;
}

export default function TravellerInfo({ traveller }: TravellerInfoProps) {
  if (!traveller) {
    return <p className={css.loading}>Завантаження...</p>;
  }

  const { name, avatarUrl, description } = traveller;

  return (
    <div className={css.profile}>
      <Avatar src={avatarUrl ?? undefined} name={name} />
      
      <div className={css.info}>
        <h1 className={css.name}>{name}</h1>
        <p className={css.description}>{description || "Мандрівник поки не додав опис."}</p>
      </div>
    </div>
  );
}