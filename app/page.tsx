import css from "./mainPage.module.css";
import About from "@/components/About/About";
import Popular from "@/components/Popular/Popular";
import OurTravellers from "@/components/OurTravellers/OurTravellers";
import Join from "@/components/Join/Join";
import VideoWrapper from "@/components/VideoWrapper/VideoWrapper";
export default function Home() {
  return (
    <main>
      <VideoWrapper />
      <About />
      <Popular />
      <section className={css.travellersSection}>
        <div className="container">
          <h2 className={css.titleTraveller}>Наші мандрівники</h2>
        </div>
        <OurTravellers perPage={4} gap={48} />
      </section>
      <Join isAuthenticated={false} />
    </main>
  );
}
