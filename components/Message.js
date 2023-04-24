import styles from "/styles/Home.module.css";

// Display message about metamask hook in UI
export default function Message({ text, account }) {
  return (
    <div className={styles.main}>
      <h1>
        {text}
        {account}
      </h1>
    </div>
  );
}
