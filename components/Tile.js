import styles from "/styles/Home.module.css";

export default function Tile({ wave_content }) {
  if (wave_content) {
    const { index, isuser, address, message, timestamp } = wave_content;
    return (
      <div className={`${styles.card} ${isuser ? styles.userWave : ""}`}>
        <h1>WAVE #0{index}</h1>
        <h2>From:</h2>
        <p>
          <i>
            {isuser ? "(Yes this is you.) " : "(Not you!)"}
            {address}
          </i>
        </p>
        <h2>At:</h2>
        <p>{timestamp.toString()}</p>
        <h2>Message:</h2>
        <p>{message}</p>
      </div>
    );
  } else {
    return (
      <div className={styles.card}>
        <h3>No Waves Yet</h3>
      </div>
    );
  }
}
