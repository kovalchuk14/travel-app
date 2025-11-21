import css from "../../app/css/OurTravellers.module.css";
import type { Traveller } from "@/types/traveller";
import Link from "next/link";

interface TravellersListProps {
  items: Traveller[];
}

export default function TravellersList({ items }: TravellersListProps) {
  return (
    <ul className={css.list}>
      {items.map((item) => (
        <li className={css.item} key={item._id}>
          <img
            className={css.img}
            src={item.avatarUrl || "/images/auth-no-avatar.jpg"}
            alt="Avatar image"
          />

          <h3 className={css.titleName}>{item.name}</h3>
          <p className={css.text}>{item.description}</p>
          <Link className={css.btnUser} href={`/travellers/${item._id}`}>
            Переглянути профіль
          </Link>
        </li>
      ))}
    </ul>
  );
}
