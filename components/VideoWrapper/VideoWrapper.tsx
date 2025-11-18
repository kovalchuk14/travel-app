import Hero from "../Hero/Hero";
import css from "./VideoWrapper.module.css";

export default function VideoWrapper() {
  return (
    <div>
      <video
        className={css.backgroundVideo}
        src="/images/herovideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={css.videoWrapper}>
        <div className={css.videoOverlay}>
          <div className={css.videoContent}>
            <Hero />
          </div>
        </div>
      </div>
    </div>
  );
}
