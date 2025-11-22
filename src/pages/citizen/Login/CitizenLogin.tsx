import React from "react";
import styles from "./CitizenLogin.module.css";
import shared from "../../../styles/Shared.module.css";

export const CitizenLogin: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Вход для граждан</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Пароль"
            required
          />
          <button
            className={`${styles.button} ${shared.primaryButton}`}
            type="submit"
          >
            Войти
          </button>
        </form>
        <div className={styles.meta}>
          Регистрация проводится через агентство. Обратитесь в службу поддержки.
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;
