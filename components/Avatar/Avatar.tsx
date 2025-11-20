import Image from "next/image";
import { useState } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  src?: string | null;
  name?: string;
}

export function Avatar({ src, name }: AvatarProps) {
  const [error, setError] = useState(false);

  const hasImage = src && src.trim() !== "" && !error;
  const hasName = name && name.trim() !== "";
  const firstLetter = hasName ? name!.charAt(0).toUpperCase() : null;

  return (
    <div className={styles.avatarWrapper}>
      {hasImage ? (
        <Image
          src={src!}
          alt={name || "Avatar"}
          width={199}
          height={199}
          className={styles.avatar}
          onError={() => setError(true)}
        />
      ) : hasName ? (
        <div className={styles.avatarPlaceholder}>
          <span className={styles.avatarLetter}>{firstLetter}</span>
        </div>
      ) : (
        <div className={styles.avatarPlaceholder}>
          <Image
            src="/icons/avatar.svg"
            alt="Avatar"
            width={199}
            height={199}
          />
        </div>
      )}
    </div>
  );
}
