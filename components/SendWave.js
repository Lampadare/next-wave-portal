import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { ethers } from "ethers";
import abi from "@/utils/WavePortal.json";
import LoadingIndicator from "@/components/LoadingIndicator.js";
import Message from "@/components/Message.js";

const getEthereumObject = () => window.ethereum;
const contractAddress = "0x632effae1EB8835178bC70F4C0f2DDEB65a4405D";
const contractABI = abi.abi;

export default function EthereumObject() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Wave
  const wave = async () => {
    try {
      const ethereum = getEthereumObject();
      console.log("ethereum", ethereum);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
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
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Display message about metamask hook in UI
  if (currentAccount !== "") {
    return (
      <div className={styles.main}>
        <label htmlFor="name">Wave to me here! 🫡</label>
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
        <Message text="Metamask account connected: " account={currentAccount} />
      </div>
    );
  } else if (hasMetamask === true) {
    return (
      <div className={styles.main}>
        <Message text="Ethereum object found! Please connect your account." />
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    );
  } else {
    return <Message text="MetaMask is needed to use this dApp." />;
  }
}
