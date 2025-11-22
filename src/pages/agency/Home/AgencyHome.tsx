import React from "react";
import styles from "./AgencyHome.module.css";
import shared from "../../../styles/Shared.module.css";
import { Link } from "react-router-dom";

export const AgencyHome: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Панель агентства</h1>
        <p className={styles.subtitle}>Добро пожаловать, представитель агентства.</p>
        <div className={styles.actions}>
          <Link to="/agency/login" className={`${styles.linkButton} ${shared.primaryButton}`}>
            Войти
          </Link>
          <Link to="/agency/register" className={`${styles.ghostButton} ${shared.secondaryButton}`}>
            Создать аккаунт
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgencyHome;
