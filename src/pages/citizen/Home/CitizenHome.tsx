import React, { useState, useEffect } from "react";
import styles from "./CitizenHome.module.css";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";
import axios from "axios";
import API_ROUTES from "../../../config";

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

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [issuedBy, setIssuedBy] = useState('');

  const fetchDocuments = async () => {
    const token = localStorage.getItem("jwtCitizen");
    if (!token) return;
    try {
      const response = await axios.get(`${API_ROUTES.BASE_URL}documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    if (documentType) formData.append('documentType', documentType);
    if (documentNumber) formData.append('documentNumber', documentNumber);
    if (issueDate) formData.append('issueDate', issueDate);
    if (issuedBy) formData.append('issuedBy', issuedBy);
    const token = localStorage.getItem("jwtCitizen");
    try {
      await axios.post(`${API_ROUTES.BASE_URL}documents/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
      setFile(null);
      setDocumentType('');
      setDocumentNumber('');
      setIssueDate('');
      setIssuedBy('');
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("jwtCitizen");
    try {
      await axios.delete(`${API_ROUTES.BASE_URL}documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleEdit = () => {
    setIsEditOpen(true);
  };


  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Документы гражданина</h1>
            <p className={styles.subtitle}>Управление вашими документами</p>
          </div>
          <div className={styles.profileActions}>
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

        <div className={styles.contentGrid}>
          <div className={styles.documentsSection}>
            <h2>Загрузка документов</h2>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Файл:</label>
                  <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Тип документа:</label>
                  <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                    <option value="">Выберите тип</option>
                    <option value="PASSPORT">Паспорт</option>
                    <option value="DRIVER_LICENSE">Водительские права</option>
                    <option value="SNILS">СНИЛС</option>
                    <option value="INN">ИНН</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Номер документа:</label>
                  <input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Дата выдачи:</label>
                  <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Кем выдан:</label>
                <input type="text" value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} />
              </div>
              <button type="submit" className={styles.uploadButton}>Загрузить документ</button>
            </form>

            <div className={styles.documentsList}>
              <h3>Ваши документы</h3>
              {documents.length === 0 ? (
                <p className={styles.noDocuments}>Документы не загружены</p>
              ) : (
                <ul>
                  {documents.map((doc: any) => (
                    <li key={doc.id} className={styles.documentItem}>
                      <div className={styles.documentInfo}>
                        <span className={styles.documentName}>{doc.filename || doc.originalname}</span>
                        <span className={styles.documentType}>{doc.documentType || 'Тип не указан'}</span>
                        {doc.documentNumber && <span className={styles.documentDetail}>№ {doc.documentNumber}</span>}
                        {doc.issueDate && <span className={styles.documentDetail}>от {new Date(doc.issueDate).toLocaleDateString('ru-RU')}</span>}
                      </div>
                      <button onClick={() => handleDelete(doc.id)} className={styles.deleteButton}>Удалить</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.profileSection}>
            {!user ? (
              <div className={styles.empty}>
                Информация о пользователе не найдена. Войдите в систему.
              </div>
            ) : (
              <>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar} aria-hidden>
                    {user.firstName ? user.firstName[0].toUpperCase() : "?"}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.row}>
                    <span className={styles.label}>ФИО</span>
                    <span className={styles.value}>
                      {[user.lastName, user.firstName, user.middleName]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>PSN</span>
                    <span className={styles.value}>{user.psn || "не указан"}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Дата рождения</span>
                    <span className={styles.value}>
                      {formatDate(user.dateOfBirth)}
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={user}
        />
      )}
    </div>
  );
};

export default CitizenHome;
