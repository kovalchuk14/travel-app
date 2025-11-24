import Image from "next/image";
import { useState } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  src?: string | null;
  name?: string;
}

export function Avatar({ src, name }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const hasValidSrc = src && src.trim() !== "";

  const showPlaceholder = !hasValidSrc || imageError;
  const firstLetter = name?.trim() ? name.trim()[0].toUpperCase() : null;

  return (
    <div className={styles.avatarWrapper}>
      {showPlaceholder ? (
        firstLetter ? (
          <div className={styles.avatarPlaceholder}>
            <span className={styles.avatarLetter}>{firstLetter}</span>
          </div>
        ) : (
          <div className={styles.avatarPlaceholder}>
            <Image
              src="/icons/avatar.svg"
              alt="Default avatar"
              width={199}
              height={199}
            />
          </div>
        )
      ) : (
        <Image
          src={src!}
          alt={name || "User avatar"}
          width={199}
          height={199}
          className={styles.avatar}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}