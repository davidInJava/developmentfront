import React, { useState } from "react";
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
  });

  const [loading, setLoading] = useState(false);

  /** Общий обработчик полей */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    // дата должна быть формата YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth))
      return "Дата рождения должна быть в формате YYYY-MM-DD";

    if (form.email && !emailRegex.test(form.email))
      return "Некорректный email";

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

      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        citizenshipStatus: form.citizenshipStatus,
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
          <input className={styles.input} name="firstName" placeholder="Имя *" onChange={handleChange} />
          <input className={styles.input} name="lastName" placeholder="Фамилия *" onChange={handleChange} />
          <input className={styles.input} name="middleName" placeholder="Отчество" onChange={handleChange} />

          <input
            className={styles.input}
            name="dateOfBirth"
            placeholder="Дата рождения (YYYY-MM-DD) *"
            onChange={handleChange}
          />

          <input className={styles.input} name="placeOfBirth" placeholder="Место рождения" onChange={handleChange} />

          {/* Gender */}
          <select className={styles.input} name="gender" value={form.gender} onChange={handleChange}>
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
            <option value="OTHER">Другой</option>
          </select>

          {/* Citizenship */}
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

          <input className={styles.input} name="nationality" placeholder="Национальность" onChange={handleChange} />
          <input className={styles.input} name="email" placeholder="Email" onChange={handleChange} />
          <input className={styles.input} name="phone" placeholder="Телефон" onChange={handleChange} />

          <div className={styles.subtitle}>Адрес (опционально)</div>

          <input className={styles.input} name="addr_country" placeholder="Страна" onChange={handleChange} />
          <input className={styles.input} name="addr_region" placeholder="Регион" onChange={handleChange} />
          <input className={styles.input} name="addr_city" placeholder="Город" onChange={handleChange} />
          <input className={styles.input} name="addr_street" placeholder="Улица" onChange={handleChange} />
          <input className={styles.input} name="addr_building" placeholder="Дом" onChange={handleChange} />
          <input className={styles.input} name="addr_apartment" placeholder="Квартира" onChange={handleChange} />
          <input className={styles.input} name="addr_postalCode" placeholder="Почтовый индекс" onChange={handleChange} />

          <div className={styles.actions}>
            <button type="button" className={`${styles.btn} ${styles.btnCancel}`} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnCreate}`} disabled={loading}>
              {loading ? "Сохранение..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
