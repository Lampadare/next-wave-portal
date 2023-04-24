import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useConnectionStatus,
  useAddress,
  useContract,
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
    "0x4096A961E206D26E8c4A8771943153001D68D839"
  );
  const user_address = useAddress();

  const { mutateAsync: waveMethod, isLoading } = useContractWrite(
    wavePortalContract,
    "wave"
  );

  const { data: AllWaves } = useContractRead(wavePortalContract, "getAllWaves");
  const { data: ContractBalance } = useContractRead(
    wavePortalContract,
    "getContractBalance"
  );
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
    console.log("ContractBalance", ContractBalance);
  }, [AllWaves, user_address, ContractBalance]);

  // Wave
  const wave = async () => {
    try {
      if (connectionStatus === "connected") {
        const { message, fundsSent } = parseInputWave(inputWave);
        console.log("message-", message, "-fundsSent", fundsSent, "-");
        const data = await waveMethod({
          args: [message],
          overrides: {
            value: ethers.utils.parseEther(fundsSent.toString()),
          },
        });
        console.log("Success calling contract:", data);
      } else {
        console.log("Please Connect Wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function parseInputWave(inputWave) {
    const regex = /{([\d.]+)}/;
    const fundsMatch = inputWave.match(regex);
    const fundsSent = fundsMatch ? parseFloat(fundsMatch[1]) : 0;

    const message = inputWave.replace(regex, "").trim();

    return { message, fundsSent };
  }

  // Display message about metamask hook in UI
  if (connectionStatus === "connected") {
    return (
      <div className={styles.main}>
        <h3 htmlFor="name">Wave to me here! 🫡</h3>
        <p className={styles.description}>
          Optionally, put any funds (ETH) you want to send with your wave in
          curly brackets: &#123;0.05&#125;.
        </p>
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
        <p className={styles.description}>
          Current Prize Pool:{" "}
          {ContractBalance
            ? ethers.utils.formatEther(ContractBalance)
            : "Loading..."}
        </p>
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
