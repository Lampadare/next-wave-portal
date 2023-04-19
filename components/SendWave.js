import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import abi from "@/utils/WavePortal.json";
import Message from "@/components/Message.js";
import Tile from "@/components/Tile.js";

const contractAddress = "0x632effae1EB8835178bC70F4C0f2DDEB65a4405D";
const contractABI = abi.abi;

export default function SendWave() {
  const [inputWave, setInputWave] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const connectionStatus = useConnectionStatus();
  const signer = useSigner();
  let count = 0;

  // Wave
  const wave = async () => {
    try {
      if (connectionStatus === "connected") {
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(inputWave);
        setIsLoading(true);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setIsLoading(false);

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
          value={inputWave}
          onChange={(e) => setInputWave(e.target.value)}
        />
        <button className={styles.button} onClick={wave}>
          Send
        </button>
        <Tile
          is_loading={isLoading}
          wave_number={count}
          wave_content={inputWave}
        />
      </div>
    );
  } else {
    return <Message text="Please connect wallet." />;
  }
}
