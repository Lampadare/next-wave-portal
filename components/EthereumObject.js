import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { ethers } from "ethers";
import abi from "@/utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;
const contractAddress = "0x632effae1EB8835178bC70F4C0f2DDEB65a4405D";
const contractABI = abi.abi;

// Display message about metamask hook in UI
function Message({ text, account }) {
  return (
    <div className={styles.main}>
      <p className={styles.description}>
        {text}
        {account}
      </p>
      <style jsx>{`
        p {
          color: rgb(200, 200, 200);
        }
      `}</style>
    </div>
  );
}

// This function returns the first linked account found.
// If there is no account linked, it will return null.
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    // First make sure we have access to the Ethereum object.
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function EthereumObject() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  // Check for metamask
  (async () => {
    const ethereum = await getEthereumObject();
    if (!ethereum) {
      console.error("Get metamask");
    } else if (ethereum) {
      console.log("ethereum", ethereum);
      console.log("We have the ethereum object", ethereum);
      setHasMetamask(true);
    }
  })();

  // Connect to wallet
  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

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

        const waveTxn = await wavePortalContract.wave("yo");
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

  // Check for account on page load an on account change
  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        console.log("THE ACCOUNT IS" + account);
        setCurrentAccount(account);
      }
    });
  }, [currentAccount]);

  // Display message about metamask hook in UI
  if (currentAccount !== "") {
    return (
      <div className={styles.main}>
        <form className={styles.form}></form>
        <label htmlFor="name">Wave to me here! 🫡</label>
        <input id="name" type="text"></input>
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
