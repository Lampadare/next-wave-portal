import React from "react";
import Image from "next/image";
import styles from "/styles/Home.module.css";

export default function LoadingIndicator() {
  return (
    <div className={styles.main}>
      <Image
        className={styles.loader}
        src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
        alt="loading..."
      ></Image>
    </div>
  );
}
