import { Link } from "react-router-dom";
import OurTravellers from "../components/OurTravellers";

export default function HomePage() {
  return (
    <div>
      <h1>Головна сторінка</h1>
      <Link to="/travellers">Переглянути всіх мандрівників</Link>
      <OurTravellers perPage={4} />
    </div>
  );
}
