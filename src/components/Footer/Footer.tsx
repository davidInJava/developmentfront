import React from "react";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>Портал государственных услуг</div>
        <div className={styles.links}>
          <a className={styles.link} href="#">Политика конфиденциальности</a>
          <a className={styles.link} href="#">Помощь</a>
          <div className={styles.small}>© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
