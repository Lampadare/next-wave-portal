import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import LoadingIndicator from "@/components/LoadingIndicator.js";
import Message from "@/components/Message.js";

const getEthereumObject = () => window.ethereum;

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

export default function ConnectWallet_({ displayMessage = false }) {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  // Check for metamask
  useEffect(() => {
    const checkMetamask = async () => {
      const ethereum = await getEthereumObject();
      if (!ethereum) {
        console.error("Get metamask");
      } else if (ethereum) {
        console.log("ethereum", ethereum);
        console.log("We have the ethereum object", ethereum);
        setHasMetamask(true);
      }
    };

    checkMetamask();
  }, []);

  // Check for account on page load and on account change
  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        console.log("THE ACCOUNT IS" + account);
        setCurrentAccount(account);
      }
    });
  }, [currentAccount]);

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

  // Display message about metamask hook in UI
  if (displayMessage === true) {
    if (currentAccount !== "") {
      return (
        <div className={styles.main}>
          <Message
            text="Metamask account connected: "
            account={currentAccount}
          />
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
}
