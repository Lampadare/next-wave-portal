import React from "react";
import Image from "next/image";
import styles from "/styles/Home.module.css";

export default function LoadingIndicator() {
  return (
    <div className={styles.main}>
      <Image
        className={styles.loader}
        src="/loading.png"
        alt="loading..."
        width={500}
        height={500}
      ></Image>
    </div>
  );
}
