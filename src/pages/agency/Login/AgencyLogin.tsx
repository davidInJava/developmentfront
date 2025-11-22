import React, { useState } from "react";
import styles from "./AgencyLogin.module.css";
import shared from "../../../styles/Shared.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import API_ROUTES from "../../../config";

export const AgencyLogin: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      alert("Введите email и пароль");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_ROUTES.BASE_URL}auth/login/`,
        form
      );

      const token = data?.accessToken;
      const user = data?.user;

      if (token) {
        localStorage.setItem("jwtAgency", token);
      }

      if (user) {
        localStorage.setItem("userAgency", JSON.stringify(user));
      }

      window.location.href = "/agency/home";
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        alert("Неверный email или пароль");
        return;
      }

      alert("Ошибка при входе");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Вход для агентств</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Электронная почта"
            required
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Пароль"
            required
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className={`${styles.button} ${shared.primaryButton}`}
            type="submit"
          >
            Войти
          </button>
        </form>

        <div className={styles.meta}>
          Нет аккаунта?{" "}
          <Link
            to="/agency/register"
            className={`${styles.link} ${shared.mutedLink}`}
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgencyLogin;
