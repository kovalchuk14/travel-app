"use client";

import { useRouter } from "next/navigation";
import css from "./MessageNoStories.module.css";

interface MessageNoStoriesProps {
    text: string;
    buttonText: string;
    redirectTo?: string;
}

export default function MessageNoStories({
    text,
    buttonText,
    redirectTo = "/stories",
}: MessageNoStoriesProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(redirectTo);
    };

    return (
        <div className={css.wrapper}>
            <div className={css.card}>
                <p className={css.text}>{text}</p>

                <button type="button" onClick={handleClick} className={css.button}>{buttonText}</button>
            </div>
        </div>
    );
};