import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CitizenLogin.module.css";
import shared from "../../../styles/Shared.module.css";
import API_ROUTES from "../../../config";

export const CitizenLogin: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtCitizen");
    if (token) {
      navigate("/citizen/home", { replace: true });
    }
  }, [navigate]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const psnRegex = /^\d{10}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmail = emailRegex.test(identifier);
    const isPSN = psnRegex.test(identifier);

    if (!isEmail && !isPSN) {
      alert("Введите корректный email или 10-значный PSN");
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_ROUTES.BASE_URL}citizen/login`, {
        identifier,
        password,
      });
      console.log("Ответ сервера:", res.data);

      const token = res.data?.accessToken;
      const user = res.data?.user;

      if (token) {
        localStorage.setItem("jwtCitizen", token);
      }
      if (user) {
        localStorage.setItem("citizenUser", JSON.stringify(user));
      }

      alert("Вход выполнен успешно");
      navigate("/citizen/home", { replace: true });
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Вход для граждан</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Email или PSN"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`${styles.button}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
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
