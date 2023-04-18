import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import abi from "@/utils/WavePortal.json";
import LoadingIndicator from "@/components/LoadingIndicator.js";
import Message from "@/components/Message.js";

const getEthereumObject = () => window.ethereum;
const contractAddress = "0x632effae1EB8835178bC70F4C0f2DDEB65a4405D";
const contractABI = abi.abi;

export default function SendWave() {
  const [inputValue, setInputValue] = useState("");
  const connectionStatus = useConnectionStatus();
  const signer = useSigner();

  // Wave
  const wave = async () => {
    try {
      const ethereum = getEthereumObject();

      if (connectionStatus === "connected") {
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(inputValue.toString());
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Please Connect Wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Display message about metamask hook in UI
  if (connectionStatus === "connected") {
    return (
      <div className={styles.main}>
        <h3 htmlFor="name">Wave to me here! 🫡</h3>
        <input
          className={styles.input}
          id="name"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className={styles.button} onClick={wave}>
          Send
        </button>
      </div>
    );
  } else {
    return <Message text="Please connect wallet." />;
  }
}
