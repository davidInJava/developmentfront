import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMainPage = location.pathname === "/main";

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>Портал государственных услуг</div>
        <div className={styles.links}>
          {!isMainPage && (
            <button className={styles.homeButton} onClick={() => navigate("/main")}>
              🏠 Главная
            </button>
          )}
          <a className={styles.link} href="#">Политика конфиденциальности</a>
          <a className={styles.link} href="#">Помощь</a>
          <div className={styles.small}>© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
