import React, { useState } from "react";
import styles from "./AgencyRegister.module.css";
import shared from "../../../styles/Shared.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import API_ROUTES from "../../../config";

export const AgencyRegister: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "CITIZEN" as "CITIZEN" | "AGENCY_OPERATOR" | "ADMIN",
    secretKey: "",
  });

  const showSecret = form.role === "ADMIN" || form.role === "AGENCY_OPERATOR";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Клиентская валидация
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Введите корректный email");
      return;
    }

    if (typeof form.password !== "string" || form.password.length < 6) {
      alert("Пароль должен быть не короче 6 символов");
      return;
    }

    if (!form.firstName.trim()) {
      alert("Укажите имя");
      return;
    }

    if (!form.lastName.trim()) {
      alert("Укажите фамилию");
      return;
    }

    const allowedRoles = ["CITIZEN", "AGENCY_OPERATOR", "ADMIN"];
    if (!allowedRoles.includes(form.role)) {
      alert("Выберите корректную роль");
      return;
    }

    if (showSecret && !form.secretKey.trim()) {
      alert("Требуется секретный ключ для выбранной роли");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_ROUTES.BASE_URL}auth/register/`,
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

      alert("Аккаунт создан!");
      window.location.href = "/agency/home";
    } catch (err: any) {
      console.error(err);

      if (err.response) {
        const { status } = err.response;

        if (status === 401) {
          alert("Секретный ключ не подошёл");
          return;
        }

        if (status === 409) {
          alert("Пользователь с данным email уже зарегистрирован");
          return;
        }
      }

      alert("Ошибка при регистрации");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Регистрация агентства</h2>

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

          <input
            className={styles.input}
            type="text"
            placeholder="Имя"
            required
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />

          <input
            className={styles.input}
            type="text"
            placeholder="Фамилия"
            required
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />

          {/* ROLE */}
          <FormControl required style={{ marginTop: "12px", width: "100%" }}>
            <FormLabel>Роль</FormLabel>
            <RadioGroup
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as any })
              }
            >
              <FormControlLabel
                value="CITIZEN"
                control={<Radio />}
                label="CITIZEN"
              />
              <FormControlLabel
                value="AGENCY_OPERATOR"
                control={<Radio />}
                label="AGENCY_OPERATOR"
              />
              <FormControlLabel
                value="ADMIN"
                control={<Radio />}
                label="ADMIN"
              />
            </RadioGroup>
          </FormControl>

          {/* SECRET KEY */}
          {showSecret && (
            <TextField
              label="Secret Key"
              variant="outlined"
              required
              fullWidth
              name="secretKey"
              value={form.secretKey}
              onChange={handleChange}
              style={{ marginTop: "12px" }}
            />
          )}

          <button
            className={`${styles.button} ${shared.primaryButton}`}
            type="submit"
          >
            Создать аккаунт
          </button>
        </form>

        <div className={styles.meta}>
          Уже есть аккаунт?{" "}
          <Link
            to="/agency/login"
            className={`${styles.link} ${shared.mutedLink}`}
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgencyRegister;
