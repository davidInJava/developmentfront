import React, { useState } from "react";
import styles from "./CitizenHome.module.css";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";

export const CitizenHome: React.FC = () => {
  const raw = localStorage.getItem("citizenUser");
  const initialUser = raw ? JSON.parse(raw) : null;
  const [user, setUser] = useState<any>(initialUser);
  const navigate = useNavigate();

  // Иконки не используются напрямую здесь; используются emoji-спаны для простоты.

  const formatDate = (d?: string | null) => {
    if (!d) return "не указано";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("ru-RU");
    } catch {
      return d;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtCitizen");
    localStorage.removeItem("citizenUser");
    navigate("/citizen/login");
  };

  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleSaveChanges = (changes: Array<{ field: string; oldValue: any; newValue: any }>) => {
    const updated = { ...(user || {}) };
    changes.forEach(ch => {
      updated[ch.field] = ch.newValue;
    });
    setUser(updated);
    localStorage.setItem('citizenUser', JSON.stringify(updated));
    setIsEditOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Профиль гражданина</h1>
            <p className={styles.subtitle}>Информация из вашего аккаунта</p>
          </div>
        </div>

        {!user ? (
          <div className={styles.empty}>
            Информация о пользователе не найдена. Войдите в систему.
          </div>
        ) : (
          <div className={styles.profileGrid}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} aria-hidden>
                {user.firstName ? user.firstName[0].toUpperCase() : "?"}
              </div>
              <div className={styles.avatarActions}>
                <span
                  onClick={handleEdit}
                  title="Редактировать профиль"
                  className={styles.emojiIcon}
                >
                  ✏️
                </span>
                <span
                  onClick={handleLogout}
                  title="Выйти"
                  className={styles.emojiIcon}
                >
                  🔓
                </span>
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.label}>ID</span>
                <span className={styles.value}>{user.id}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>PSN</span>
                <span className={styles.value}>{user.psn || "не указан"}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>ФИО</span>
                <span className={styles.value}>
                  {[user.lastName, user.firstName, user.middleName]
                    .filter(Boolean)
                    .join(" ")}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Дата рождения</span>
                <span className={styles.value}>
                  {formatDate(user.dateOfBirth)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Место рождения</span>
                <span className={styles.value}>
                  {user.placeOfBirth || "не указано"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Пол</span>
                <span className={styles.value}>
                  {user.gender || "не указан"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Статус гражданства</span>
                <span className={styles.value}>
                  {user.citizenshipStatus || "не указан"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Национальность</span>
                <span className={styles.value}>
                  {user.nationality || "не указано"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>
                  {user.email || "не указан"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Телефон</span>
                <span className={styles.value}>
                  {user.phone || "не указан"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Активен</span>
                <span className={styles.value}>
                  {user.isActive ? "Да" : "Нет"}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Создан</span>
                <span className={styles.value}>
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Обновлён</span>
                <span className={styles.value}>
                  {formatDate(user.updatedAt)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Метаданные</span>
                <span className={styles.value}>
                  {user.metadata ? JSON.stringify(user.metadata) : "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={user}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default CitizenHome;
