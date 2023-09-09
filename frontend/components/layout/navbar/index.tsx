import { ConnectKitButton } from "connectkit";

import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftContent}>
        <a
          className={styles.button}
          href="https://github.com/consensus-collective/price-feed"
          target={"_blank"}
        >
          Github Repository
        </a>
      </div>
      <div className={styles.rightContent}>
        <ConnectKitButton />
      </div>
    </nav>
  );
}
