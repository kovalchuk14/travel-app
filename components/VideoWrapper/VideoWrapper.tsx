import Hero from "../Hero/Hero";
import css from "./VideoWrapper.module.css";
import Header from "../Header/Header";

export default function VideoWrapper() {
  return (
    <section className={css.videoWrapper}>
      <video
        className={css.backgroundVideo}
        src="/images/herovideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={css.videoOverlay}></div>
        <Header />
        <Hero />
    </section>
  );
}
