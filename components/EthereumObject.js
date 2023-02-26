import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import detectEthereumProvider from "@metamask/detect-provider";

const getEthereumObject = () => window.ethereum;

export default function EthereumObject() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [CurrentAccount, setCurrentAccount] = useState("");

  // Ensure metamask is available
  (async () => {
    const provider = await detectEthereumProvider();
    if (!provider) {
      console.log("Make sure you have metamask!");
      setHasMetamask(false);
    } else {
      console.log("We have the ethereum object", ethereum);
      setHasMetamask(true);
    }
  })();

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
  }, []);

  return hasMetamask ? (
    <Message text="Ethereum object hooked!" />
  ) : (
    <Message text="Make sure you have Metamask!" />
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

// Display message about metamask hook in UI
function Message({ text }) {
  return (
    <div className={styles.main}>
      <p className={styles.description}>{text}</p>
      <style jsx>{`
        p {
          color: rgb(200, 200, 200);
        }
      `}</style>
      <findMetaMaskAccount />
    </div>
  );
}
