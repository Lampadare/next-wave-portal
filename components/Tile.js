import styles from "/styles/Home.module.css";
import LoadingIndicator from "@/components/LoadingIndicator.js";

export default function Tile({ is_loading, wave_number, wave_content }) {
  if (is_loading === true) {
    return (
      <div className={styles.card}>
        <h3>Loading...</h3>
        <LoadingIndicator />
      </div>
    );
  } else {
    return (
      <div className={styles.card}>
        <h2>Wave #{wave_number}</h2>
        <p>{wave_content}</p>
      </div>
    );
  }
}
