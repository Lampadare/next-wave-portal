import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useConnectionStatus,
  useAddress,
  useContract,
  useContractEvents,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

import Message from "@/components/Message.js";
import Tile from "@/components/Tile.js";
import LoadingIndicator from "@/components/LoadingIndicator.js";
import styles from "/styles/Home.module.css";

// SenndWave Component
export default function SendWave() {
  const [inputWave, setInputWave] = useState("");
  const connectionStatus = useConnectionStatus();
  const { contract: wavePortalContract } = useContract(
    "0xFcC53A2F5c95E6370B13D45a3C8fad3446A3a6D0"
  );
  const user_address = useAddress();

  const { mutateAsync: waveMethod, isLoading } = useContractWrite(
    wavePortalContract,
    "wave"
  );

  const { data: AllWaves } = useContractRead(wavePortalContract, "getAllWaves");
  const [AllWaves_cleaned, setAllWavesCleaned] = useState([]);
  const [loadingWithTimeout, setLoadingWithTimeout] = useState(false);

  console.log("All Waves Cleaned", AllWaves_cleaned);

  useEffect(() => {
    console.log("=========isLoading", isLoading);
    if (isLoading) {
      setLoadingWithTimeout(true);
      const timeoutId = setTimeout(() => {
        setLoadingWithTimeout(false);
      }, 60000);
      return () => clearTimeout(timeoutId);
    } else {
      setLoadingWithTimeout(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (AllWaves) {
      let cleanedWaves = [];
      let count = 0;
      let isuser = false;
      AllWaves.forEach((wave) => {
        if (wave.waver === user_address) {
          isuser = true;
        } else {
          isuser = false;
        }
        cleanedWaves.push({
          index: count,
          isuser: isuser,
          address: wave.waver,
          message: wave.message,
          timestamp: new Date(wave.timestamp * 1000),
        });
        count += 1;
      });
      cleanedWaves = cleanedWaves.reverse();
      console.log("All Waves Cleaned", cleanedWaves);
      setAllWavesCleaned(cleanedWaves);
    }
  }, [AllWaves, user_address]);

  // Wave
  const wave = async () => {
    try {
      if (connectionStatus === "connected") {
        const data = await waveMethod({ args: [inputWave] });
        console.log("Success calling contract:", data);
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
        <div className={styles.main}>
          {isLoading ? <LoadingIndicator /> : null}
        </div>
        <div className={styles.tilegrid}>
          {AllWaves_cleaned.map((wave) => (
            <Tile key={wave.index} wave_content={wave} />
          ))}
        </div>
      </div>
    );
  } else {
    return <Message text="Please connect wallet." />;
  }
}
