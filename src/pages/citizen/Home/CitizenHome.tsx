import React from "react";
import styles from "./CitizenHome.module.css";
import shared from "../../../styles/Shared.module.css";
import { Link } from "react-router-dom";

export const CitizenHome: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Добро пожаловать</h1>
        <p className={styles.subtitle}>Панель гражданина</p>
        <div className={styles.actions}>
          <Link to="/citizen/login" className={`${styles.primary} ${shared.primaryButton}`}>
            Войти
          </Link>
        </div>
        <p style={{marginTop:12,color:'#475569'}}>Регистрация граждан выполняется через агентство.</p>
      </div>
    </div>
  );
};

export default CitizenHome;
