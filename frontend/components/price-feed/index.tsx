import { Coin } from "../coin";
import styles from "./price-feed.module.css";

export function PriceFeed() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>Price Feed</h1>
          <h3>The ultimate solution to create web3 applications</h3>
        </div>
      </header>

      <div className={styles.body_container}>
        <Coin />
      </div>
    </div>
  );
}
