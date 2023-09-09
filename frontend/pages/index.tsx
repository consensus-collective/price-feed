import { PriceFeed } from "@/components/price-feed";

import styles from "@/styles/page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <PriceFeed />
    </main>
  );
}
