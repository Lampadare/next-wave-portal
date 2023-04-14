import styles from "/styles/Home.module.css";

// Display message about metamask hook in UI
export default function Message({ text, account }) {
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
