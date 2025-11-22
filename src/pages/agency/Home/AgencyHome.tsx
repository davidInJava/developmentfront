import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AgencyHome.module.css";
import shared from "../../../styles/Shared.module.css";
import MainClientBlock from "./ClientBLock/MainClientBlock";
import AddClientModal from "../../../components/AddClientModal/AddClientModal";
import { useState } from "react";

export const AgencyHome: React.FC = () => {
  const navigate = useNavigate();

  const userAgencyRaw = localStorage.getItem("userAgency");
  const user = userAgencyRaw ? JSON.parse(userAgencyRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("jwtAgency");
    localStorage.removeItem("userAgency");
    navigate("/agency/login", { replace: true });
  };

  const [adding, setAdding] = useState(false);

  const handleCreated = (created: any) => {
    // можно обновить список клиентов или показать уведомление
    console.log('created', created);
  };

  return (
    <div>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.userEmail}>
            email: {user?.email || "Неизвестный пользователь"}
          </span>
          <span className={styles.userPsn}>
            psn: {user?.psn || "PSN отсутствует"}
          </span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className={styles.container}>
        <div className={styles.card}>
          <div>
            {" "}
            <h1 className={styles.title}>Добро пожаловать!</h1>
            <p className={styles.subtitle}>
              Вы вошли в аккаунт агентства. Здесь будет полезная информация и
              действия.
            </p>
            {user && (
              <div className={styles.userInfo}>
                <h3>Ваши данные</h3>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Имя:</strong> {user.firstName}
                </p>
                <p>
                  <strong>Фамилия:</strong> {user.lastName}
                </p>
                <p>
                  <strong>Роль:</strong> {user.role}
                </p>
                <p>
                  <strong>PSN:</strong> {user.psn || "не указан"}
                </p>
              </div>
            )}
            <div>
              <button className={styles.addClientButton} onClick={() => setAdding(true)}>Добавить клиента</button>
            </div>
          </div>
          <div>
            <MainClientBlock></MainClientBlock>
          </div>
        </div>
      </div>
      {adding && <AddClientModal onClose={() => setAdding(false)} onCreated={handleCreated} />}
    </div>
  );
};

export default AgencyHome;
