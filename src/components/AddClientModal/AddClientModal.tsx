import React, { useState, useEffect } from "react";
import styles from "./AddClientModal.module.css";
import axios from "axios";
import API_ROUTES from "../../config";

interface Props {
  onClose: () => void;
  onCreated?: (created: any) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AddClientModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "MALE",
    citizenshipStatus: "CITIZEN",
    nationality: "",
    email: "",
    phone: "",
    primaryAddress: {
      country: "",
      region: "",
      city: "",
      street: "",
      building: "",
      apartment: "",
      postalCode: "",
    },
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /** ==== Блокировка скролла ==== */
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  /** Общий обработчик полей */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("addr_")) {
      const key = name.replace("addr_", "");
      setForm((prev) => ({
        ...prev,
        primaryAddress: { ...prev.primaryAddress, [key]: value },
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Простая валидация */
  const validate = () => {
    if (!form.firstName.trim()) return "Укажите имя";
    if (!form.lastName.trim()) return "Укажите фамилию";
    if (!form.dateOfBirth.trim()) return "Укажите дату рождения";
    if (!form.email.trim()) return "Укажите email";
    if (!emailRegex.test(form.email)) return "Некорректный email";
    if (!form.password || form.password.length < 6)
      return "Пароль должен быть не короче 6 символов";
    return null;
  };

  /** Отправка формы */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtAgency");
      const normalizedDate = form.dateOfBirth.split("T")[0];

      const payload: any = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: normalizedDate,
        gender: form.gender,
        citizenshipStatus: form.citizenshipStatus,
        password: form.password, // обязательно
      };

      if (form.middleName.trim()) payload.middleName = form.middleName.trim();
      if (form.placeOfBirth.trim()) payload.placeOfBirth = form.placeOfBirth.trim();
      if (form.nationality.trim()) payload.nationality = form.nationality.trim();
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.phone.trim()) payload.phone = form.phone.trim();

      const address = form.primaryAddress;
      if (Object.values(address).some((v) => v.trim() !== "")) {
        payload.primaryAddress = {
          country: address.country || undefined,
          region: address.region || undefined,
          city: address.city || undefined,
          street: address.street || undefined,
          building: address.building || undefined,
          apartment: address.apartment || undefined,
          postalCode: address.postalCode || undefined,
        };
      }

      const res = await axios.post(`${API_ROUTES.BASE_URL}persons`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Клиент успешно добавлен");
      onCreated && onCreated(res.data);
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Ошибка при добавлении клиента");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>Добавить клиента</div>
          <button className={styles.close} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="firstName"
            placeholder="Имя *"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="lastName"
            placeholder="Фамилия *"
            value={form.lastName}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="middleName"
            placeholder="Отчество"
            value={form.middleName}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="placeOfBirth"
            placeholder="Место рождения"
            value={form.placeOfBirth}
            onChange={handleChange}
          />
          <select
            className={styles.input}
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
            <option value="OTHER">Другой</option>
          </select>
          <select
            className={styles.input}
            name="citizenshipStatus"
            value={form.citizenshipStatus}
            onChange={handleChange}
          >
            <option value="CITIZEN">Гражданин</option>
            <option value="PERMANENT_RESIDENT">Постоянный резидент</option>
            <option value="TEMPORARY_RESIDENT">Временный резидент</option>
            <option value="REFUGEE">Беженец</option>
            <option value="ASYLUM_SEEKER">Проситель убежища</option>
          </select>
          <input
            className={styles.input}
            name="nationality"
            placeholder="Национальность"
            value={form.nationality}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
          />

          {/* === Пароль (обязательный) === */}
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Пароль *"
            value={form.password}
            onChange={handleChange}
          />

          <div className={styles.subtitle}>Адрес (опционально)</div>
          <input
            className={styles.input}
            name="addr_country"
            placeholder="Страна"
            value={form.primaryAddress.country}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="addr_region"
            placeholder="Регион"
            value={form.primaryAddress.region}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="addr_city"
            placeholder="Город"
            value={form.primaryAddress.city}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="addr_street"
            placeholder="Улица"
            value={form.primaryAddress.street}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="addr_building"
            placeholder="Дом"
            value={form.primaryAddress.building}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="addr_apartment"
            placeholder="Квартира"
            value={form.primaryAddress.apartment}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="addr_postalCode"
            placeholder="Почтовый индекс"
            value={form.primaryAddress.postalCode}
            onChange={handleChange}
          />

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnCreate}`}
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
