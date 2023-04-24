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
  const [canSendWave, setCanSendWave] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

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
      if (connectionStatus === "connected" && canSendWave) {
        setCanSendWave(false);
        setTimeLeft(60);
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft <= 1) {
              clearInterval(timer);
              setCanSendWave(true);
              return 0;
            }
            return prevTimeLeft - 1;
          });
        }, 1000);

        const { message, fundsSent } = parseInputWave(inputWave);
        console.log("message-", message, "-fundsSent", fundsSent, "-");
        const data = await waveMethod({
          args: [message],
          overrides: {
            value: ethers.utils.parseEther(fundsSent.toString()),
          },
        });
        console.log("Success calling contract:", data);

        setInputWave("");
      } else {
        console.log("Please Connect Wallet or wait for the timer");
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    wave();
  };

  // Display message about metamask hook in UI
  if (connectionStatus === "connected") {
    return (
      <div className={styles.main}>
        <h2 htmlFor="name">Wave to me here! 🫡</h2>
        <p className={styles.description}>
          Optionally, put any funds (göETH) you want to send with your wave in
          curly brackets: &#123;0.05&#125;.
        </p>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <input
            className={styles.input}
            id="name"
            type="text"
            value={inputWave}
            onChange={(e) => setInputWave(e.target.value)}
          />
          <button
            className={styles.button}
            onClick={wave}
            disabled={!canSendWave}
          >
            Send
          </button>
        </form>
        {!canSendWave ? (
          <p className={styles.description}>
            Seconds left before sending another wave: {timeLeft}
          </p>
        ) : null}
        <div className={styles.main}>
          {isLoading ? <LoadingIndicator /> : null}
        </div>
        <div className={styles.tilegrid}>
          <h3 className={styles.main}>Alltime Waves Are Below</h3>
          <h3 className={styles.main}>
            Current Prize Pool:{" "}
            {ContractBalance
              ? ethers.utils.formatEther(ContractBalance)
              : "Loading..."}{" "}
            göETH
          </h3>
        </div>
        <div className={styles.tilegrid}>
          {AllWaves_cleaned.map((wave) => (
            <Tile key={wave.index} wave_content={wave} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.main}>
        <Message
          text="Please connect wallet to send waves a 
        get a chance to win some göETH!"
        />
        <div className={styles.tilegrid}>
          <h3 className={styles.main}>Alltime Waves Are Below</h3>
          <h3 className={styles.main}>
            Current Prize Pool:{" "}
            {ContractBalance
              ? ethers.utils.formatEther(ContractBalance)
              : "Loading..."}{" "}
            göETH
          </h3>
        </div>
        <div className={styles.tilegrid}>
          {AllWaves_cleaned.map((wave) => (
            <Tile key={wave.index} wave_content={wave} />
          ))}
        </div>
      </div>
    );
  }
}
