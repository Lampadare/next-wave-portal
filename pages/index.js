import EthereumObject from "@/components/EthereumObject";
import styles from "/styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <h1 className={styles.main}>Smart Contracts Step 1</h1>
      <p className={styles.description}>
        This is the beginning of a blockchain-enabled decentralised
        crowdsourcing platform.
      </p>
      <EthereumObject></EthereumObject>
    </div>
  );
}
