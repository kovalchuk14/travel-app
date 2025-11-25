'use client';

import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "../../app/css/MobileMain.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);

    const body = document.body;
    const html = document.documentElement;

    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);

      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };
  }, [onClose]);

  return createPortal(
  <div className={css.backdrop} onClick={handleBackdropClick}>
    <div className={css.modal}>
      <button
        className={css.closeButton}
        onClick={onClose}
        aria-label="Close menu"
        type="button"
      >
        <svg width={24} height={24} aria-hidden="true">
          <use href="/icon.svg#icon-close" />
        </svg>
      </button>
      {children}
    </div>
  </div>,
  document.body
);
} 