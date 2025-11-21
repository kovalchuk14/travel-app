import OurTravellers from "@/components/OurTravellers/OurTravellers";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import css from "../css/OurTravellers.module.css";

export default function OurTravellersPage() {
  return (
    <section className={css.section}>
      <h1 className={css.title}>Мандрівники</h1>
      <OurTravellers perPage={12} gap={24} />
    </section>
  );
}
