"use client";

import { useState } from "react";
import css from "./page.module.css";
import AuthForm from "./AuthForm.tsx";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className={css.mainContent}>
      <div className={css.authBox}>
        <div className={css.toggleButtons}>
          <button
            className={`${css.chooseButton} ${
              mode === "register" ? css.active : ""
            }`}
            onClick={() => setMode("register")}
          >
            Реєстрація
          </button>
          <button
            className={`${css.chooseButton} ${
              mode === "login" ? css.active : ""
            }`}
            onClick={() => setMode("login")}
          >
            Вхід
          </button>
        </div>

        <AuthForm mode={mode} />
      </div>
    </main>
  );
}
