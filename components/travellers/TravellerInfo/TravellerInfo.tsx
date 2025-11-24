"use client";

import css from "./TravellerInfo.module.css";
import { Avatar } from "../Avatar/Avatar";

interface Traveller {
  _id: string;
  name: string;
  avatar?: string | null;
  bio?: string;
}

interface TravellerInfoProps {
  id?: string;
  traveller?: Traveller;
}

export default function TravellerInfo({ traveller }: TravellerInfoProps) {
  if (!traveller) {
    return <p className={css.loading}>Завантаження...</p>;
  }

  const { name, avatar, bio } = traveller;

  return (
    <div className={css.profile}>
      <Avatar src={avatar ?? undefined} name={name} />
      
      <div className={css.info}>
        <h1 className={css.name}>{name}</h1>
        <p className={css.bio}>{bio || "Мандрівник поки не додав опис."}</p>
      </div>
    </div>
  );
}