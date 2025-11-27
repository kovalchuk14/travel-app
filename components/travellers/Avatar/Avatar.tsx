import Image from "next/image";
import { useState } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "small" | "medium" | "large"; // опціонально, якщо треба різні розміри
}

export function Avatar({ src, name, size = "large" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidSrc = src && src.trim() !== "" && !imageError;
  const firstLetter = name?.trim() ? name.trim()[0].toUpperCase() : null;

  // Розміри залежно від пропса size (можна розширити)
  const dimensions = {
    small: 40,
    medium: 80,
    large: 199,
  };
  const dim = dimensions[size];

  return (
    <div className={styles.avatarWrapper}>
      {hasValidSrc ? (
        <Image
          src={src}
          alt={name || "User avatar"}
          width={dim}
          height={dim}
          className={styles.avatar}
          onError={() => setImageError(true)}
          unoptimized={true}   // найголовніше — вимикає кеш Next.js
          key={src}            // примусово перерендерить при зміні src
        />
      ) : firstLetter ? (
        // Показуємо першу букву імені
        <div className={`${styles.avatarPlaceholder} ${styles[size]}`}>
          <span className={styles.avatarLetter}>{firstLetter}</span>
        </div>
      ) : (
        // Дефолтна іконка
        <div className={`${styles.avatarPlaceholder} ${styles[size]}`}>
          <Image
            src="/icons/avatar.svg"
            alt="Default avatar"
            width={dim}
            height={dim}
            unoptimized={true}
          />
        </div>
      )}
    </div>
  );
}