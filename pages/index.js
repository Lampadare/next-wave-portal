import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "/styles/Home.module.css";
import SendWave from "@/components/SendWave";

export default function Home() {
  return (
    <div className={styles.main}>
      <ConnectWallet></ConnectWallet>
      <h1 className={styles.main}>Epic Masters Project</h1>
      <p className={styles.description}>
        This is the beginning of a blockchain-enabled decentralised
        crowdsourcing platform. Don&apos;t post anything stupid, this is on the
        blockchain and fully public ✌️
      </p>
      <SendWave></SendWave>
    </div>
  );
}
