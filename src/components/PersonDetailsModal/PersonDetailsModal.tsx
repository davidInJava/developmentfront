import React, { useEffect, useState } from 'react';
import styles from './PersonDetailsModal.module.css';
import axios from 'axios';
import API_ROUTES from '../../config';

type PersonData = {
  psn: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  citizenshipStatus?: string;
  nationality?: string;
  photo?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
  primaryAddress?: any;
  secondaryAddress?: any;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  psn: string;
};

const PersonDetailsModal: React.FC<Props> = ({ isOpen, onClose, psn }) => {
  const [person, setPerson] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && psn) {
      fetchPerson();
    }
  }, [isOpen, psn]);

  const fetchPerson = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwtAgency');
      const res = await axios.get(`${API_ROUTES.BASE_URL}persons/${psn}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setPerson(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const KEY_LABELS: Record<string, string> = {
    psn: 'PSN',
    firstName: 'Имя',
    lastName: 'Фамилия',
    middleName: 'Отчество',
    dateOfBirth: 'Дата рождения',
    placeOfBirth: 'Место рождения',
    gender: 'Пол',
    citizenshipStatus: 'Статус гражданства',
    nationality: 'Национальность',
    photo: 'Фото',
    email: 'Email',
    phone: 'Телефон',
    isActive: 'Активен',
    createdAt: 'Создан',
    updatedAt: 'Обновлен',
    metadata: 'Метаданные',
    primaryAddress: 'Основной адрес',
    secondaryAddress: 'Вторичный адрес',
  };

  const GENDER_MAP: Record<string, string> = { MALE: 'Мужской', FEMALE: 'Женский', OTHER: 'Другой' };
  const CITIZENSHIP_MAP: Record<string, string> = {
    CITIZEN: 'Гражданин',
    PERMANENT_RESIDENT: 'Постоянный резидент',
    TEMPORARY_RESIDENT: 'Временный резидент',
    REFUGEE: 'Беженец',
    ASYLUM_SEEKER: 'Ищущий убежища',
  };

  const formatValue = (key: string, value: any) => {
    if (!value) return '—';
    if (key === 'dateOfBirth') {
      try {
        return new Date(value).toLocaleDateString('ru-RU');
      } catch {
        return value;
      }
    }
    if (key === 'gender') return GENDER_MAP[value] || value;
    if (key === 'citizenshipStatus') return CITIZENSHIP_MAP[value] || value;
    if (key === 'isActive') return value ? 'Да' : 'Нет';
    if (key === 'createdAt' || key === 'updatedAt') {
      try {
        return new Date(value).toLocaleString('ru-RU');
      } catch {
        return value;
      }
    }
    return value;
  };

  const renderValue = (key: string, value: any, depth: number = 0) => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return (
          <ul style={{ marginLeft: `${depth * 20}px` }}>
            {value.map((item, index) => (
              <li key={index}>{renderValue(`${key}[${index}]`, item, depth + 1)}</li>
            ))}
          </ul>
        );
      } else {
        return (
          <div style={{ marginLeft: `${depth * 20}px` }}>
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey}>
                <strong>{subKey}:</strong> {renderValue(subKey, subValue, depth + 1)}
              </div>
            ))}
          </div>
        );
      }
    } else {
      return formatValue(key, value);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Подробная информация о человеке</h3>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div className={styles.body}>
          {loading && <div>Загрузка...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {person && (
            <div className={styles.details}>
              {Object.entries(person).map(([key, value]) => (
                <div key={key} className={styles.row}>
                  <strong>{KEY_LABELS[key] || key}:</strong> {renderValue(key, value)}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailsModal;