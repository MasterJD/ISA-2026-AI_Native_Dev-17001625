import inventoryData from "./data/inventory.json";
import {
  calculateInsuranceFee,
  calculateTotalWithInsurance,
  getInsuranceRate,
} from "./lib/smart-insurance";
import type { CategoryId, GearItem } from "./types/gear";

const DISPLAY_ITEMS = (inventoryData as GearItem[]).slice(0, 6);

const categoryIndicatorLabels = [
  "Photography",
  "Audio",
  "Video",
  "Camping",
  "Water Sports",
];

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function App() {
  return (
    <main>
      <header>
        <h1>Rent-My-Gear</h1>
        <p>Premium equipment rental marketplace.</p>
        <p>
          Smart Insurance / Seguro Inteligente: Photography equipment has a 20%
          fee, all other categories have a 10% fee.
        </p>
      </header>

      <section aria-label="Category indicators">
        <h2>Categories</h2>
        <ul>
          {categoryIndicatorLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Equipment listings">
        <h2>Equipment Listings</h2>
        {DISPLAY_ITEMS.map((item) => {
          const categoryId = item.categoryId as CategoryId;
          const insuranceRate = getInsuranceRate(categoryId);
          const insuranceFee = calculateInsuranceFee(item.dailyRate, categoryId);
          const totalWithInsurance = calculateTotalWithInsurance(
            item.dailyRate,
            categoryId,
          );

          return (
            <article key={item.id}>
              <h3>{item.name}</h3>
              <p>Category: {item.categoryName}</p>
              <p>Price: {formatMoney(item.dailyRate)} / day</p>
              <p>
                Smart Insurance: {Math.round(insuranceRate * 100)}% (
                {formatMoney(insuranceFee)})
              </p>
              <p>Total with insurance: {formatMoney(totalWithInsurance)}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export { App };