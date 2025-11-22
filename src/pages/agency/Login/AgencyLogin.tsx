import React from "react";
import styles from "./AgencyLogin.module.css";
import shared from "../../../styles/Shared.module.css";
import { Link } from "react-router-dom";

export const AgencyLogin: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Вход для агентств</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input className={styles.input} type="email" placeholder="Электронная почта" required />
          <input className={styles.input} type="password" placeholder="Пароль" required />
          <button className={`${styles.button} ${shared.primaryButton}`} type="submit">
            Войти
          </button>
        </form>
        <div className={styles.meta}>
          Нет аккаунта? <Link to="/agency/register" className={`${styles.link} ${shared.mutedLink}`}>Создать аккаунт</Link>
        </div>
      </div>
    </div>
  );
};

export default AgencyLogin;
