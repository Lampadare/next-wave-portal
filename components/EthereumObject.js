import { useState, useEffect } from "react";
import styles from "/styles/Home.module.css";

const getEthereumObject = () => window.ethereum;

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
    const provider = await getEthereumObject();
    if (!provider) {
      console.error("Get metamask");
    } else if (provider) {
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

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        console.log("THE ACCOUNT IS" + account);
        setCurrentAccount(account);
      }
    });
  }, [currentAccount]);

  if (currentAccount !== "") {
    return (
      <Message text="Metamask account connected: " account={currentAccount} />
    );
  } else if (hasMetamask === true) {
    return (
      <div className={styles.main}>
        <Message text="Ethereum object hooked! Please connect your account." />
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    );
  } else {
    return <Message text="MetaMask is needed to use this dApp." />;
  }
}
