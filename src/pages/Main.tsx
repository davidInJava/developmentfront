import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Main.module.css";
import shared from "../styles/Shared.module.css";

export const Main: React.FC = () => {
  const navigate = useNavigate();

  const jwtAgency = localStorage.getItem("jwtAgency");
  const jwtCitizen = localStorage.getItem("jwtCitizen");

  const handleAgencyClick = () => {
    jwtAgency ? navigate("/agency/home") : navigate("/agency/login");
  };

  const handleCitizenClick = () => {
    jwtCitizen ? navigate("/citizen/home") : navigate("/citizen/login");
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainHero}>
        <h1>Государственный регистр населения</h1>
        <p className={styles.subtitle}>
          Централизованная система учёта данных граждан — безопасно, прозрачно и
          удобно. Доступ для граждан и операторов агентств.
        </p>
      </div>

      <div className={styles.mainCards}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap} aria-hidden>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                  fill="#0b5fff"
                />
                <path
                  d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4z"
                  fill="#0b5fff"
                />
              </svg>
            </div>
            <div>
              <h2>Портал граждан</h2>
              <div className={styles.cardSub}>
                Просмотр личных данных и подача заявок
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button
              className={`${styles.cardButton} ${styles.btnPrimary}`}
              onClick={handleCitizenClick}
            >
              {jwtCitizen ? "Перейти в личный кабинет" : "Войти в портал"}
            </button>
            <button
              className={`${styles.cardButton} ${styles.btnGhost}`}
              onClick={() => alert("Информация о портале")}
            >
              Подробнее
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap} aria-hidden>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 13h18v8H3z" fill="#0b5fff" />
                <path d="M7 6h10v6H7z" fill="#0b5fff" />
              </svg>
            </div>
            <div>
              <h2>Портал агентств</h2>
              <div className={styles.cardSub}>
                Обработка заявок и управление клиентами
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button
              className={`${styles.cardButton} ${styles.btnPrimary}`}
              onClick={handleAgencyClick}
            >
              {jwtAgency ? "Личный кабинет" : "Войти в агентство"}
            </button>
            <button
              className={`${styles.cardButton} ${styles.btnGhost}`}
              onClick={() => alert("Информация для агентств")}
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>

      <div className={styles.mainInfo}>
        <h2>О системе SPR</h2>
        <p>
          Система обеспечивает точность, прозрачность и безопасность
          персональных данных.
        </p>

        <ul>
          <li>✔ Централизованная база данных населения</li>
          <li>✔ Быстрая подача запросов на изменения</li>
          <li>✔ Удобный интерфейс для граждан и операторов</li>
          <li>✔ Поддержка документов и вложений</li>
          <li>✔ Безопасность и аудит действий</li>
        </ul>
      </div>
    </div>
  );
};
