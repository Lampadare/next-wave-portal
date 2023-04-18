import SendWave from "@/components/SendWave";
import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "/styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <ConnectWallet></ConnectWallet>
      <h1 className={styles.main}>Smart Contracts Step 1</h1>
      <p className={styles.description}>
        This is the beginning of a blockchain-enabled decentralised
        crowdsourcing platform.
      </p>
      <SendWave></SendWave>
    </div>
  );
}
