import React, { useEffect, useState } from "react";
import styles from "./ClientRequests.module.css";
import axios from "axios";
import API_ROUTES from "../../config";
import PersonDetailsModal from "../PersonDetailsModal/PersonDetailsModal";

type RequestItem = {
  id: string;
  requestNumber?: string;
  personId?: string;
  status?: string;
  requestedChanges?: Record<string, any>;
  currentData?: Record<string, any>;
  createdAt?: string;
};

const ClientRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPsn, setSelectedPsn] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwtAgency");
      const res = await axios.get(`${API_ROUTES.BASE_URL}auth/requests/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setRequests(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Ошибка при загрузке заявок"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (psn: string) => {
    setSelectedPsn(psn);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPsn(null);
  };

  const handleApprove = async (id: string, status: boolean) => {
    console.log("Approving request", id);
    try {
      const token = localStorage.getItem("jwtAgency");
      await axios.put(
        `${API_ROUTES.BASE_URL}persons/approve-change-request`,
        {psn: id, is_approve: status },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      fetchRequests();
    } catch (err: any) {
      console.error(err);
      alert("Ошибка при применении запроса");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("jwtAgency");
      await axios.put(
        `${API_ROUTES.BASE_URL}auth/requests/${id}`,
        { status: "rejected" },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      fetchRequests(); 
    } catch (err: any) {
      console.error(err);
      alert("Ошибка при отклонении запроса");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Запросы на изменения</h3>
        <div className={styles.controls}>
          <button
            className={styles.refresh}
            onClick={fetchRequests}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Обновить"}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.list}>
        {requests.length === 0 && !loading ? (
          <div className={styles.empty}>Нет ожидающих запросов</div>
        ) : (
          requests.map((r) => {
            const edits = r.requestedChanges || {};
            const editEntries = Object.keys(edits).map((k) => {
              const val = edits[k];
              // translate key
              const KEY_LABELS: Record<string, string> = {
                firstName: "Имя",
                lastName: "Фамилия",
                middleName: "Отчество",
                dateOfBirth: "Дата рождения",
                placeOfBirth: "Место рождения",
                gender: "Пол",
                citizenshipStatus: "Статус гражданства",
                nationality: "Национальность",
                photo: "Фото",
                email: "Email",
                phone: "Телефон",
              };

              const GENDER_MAP: Record<string, string> = {
                MALE: "Мужской",
                FEMALE: "Женский",
                OTHER: "Другой",
              };
              const CITIZENSHIP_MAP: Record<string, string> = {
                CITIZEN: "Гражданин",
                PERMANENT_RESIDENT: "Постоянный резидент",
                TEMPORARY_RESIDENT: "Временный резидент",
                REFUGEE: "Беженец",
                ASYLUM_SEEKER: "Ищущий убежища",
              };

              let displayVal = val;
              if (k === "dateOfBirth") {
                try {
                  displayVal = val
                    ? new Date(val).toLocaleDateString("ru-RU")
                    : "—";
                } catch {
                  displayVal = val;
                }
              }
              if (k === "gender") displayVal = GENDER_MAP[val] || val;
              if (k === "citizenshipStatus")
                displayVal = CITIZENSHIP_MAP[val] || val;

              const label = KEY_LABELS[k] || k;
              return { key: k, label, value: displayVal };
            });

            return (
              <div key={r.id} className={styles.item}>
                <div className={styles.row}>
                  <strong>№</strong> <span>{r.requestNumber || r.id}</span>
                </div>
                <div className={styles.row}>
                  <strong>ID</strong>{" "}
                  <span
                    onClick={() => r.personId && openModal(r.personId)}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    {r.personId}
                  </span>
                </div>
                <div className={styles.row}>
                  <strong>Статус</strong> <span>{r.status}</span>
                </div>
                <div className={styles.row}>
                  <strong>Запрошенные изменения</strong>
                  <div className={styles.chips}>
                    {editEntries.map((e) => (
                      <span
                        key={e.key}
                        className={styles.chip}
                        title={`${e.label}: ${e.value}`}
                      >
                        <strong className={styles.chipLabel}>{e.label}:</strong>
                        &nbsp;
                        <span className={styles.chipValue}>
                          {String(e.value)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.row}>
                  <strong>Дата</strong>{" "}
                  <span>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString("ru-RU")
                      : "-"}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() =>
                      r.personId && handleApprove(r.personId, true)
                    }
                    className={styles.approveBtn}
                  >
                    Применить
                  </button>

                  <button
                    onClick={() =>
                      r.personId && handleApprove(r.personId, false)
                    }
                    className={styles.rejectBtn}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <PersonDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        psn={selectedPsn || ""}
      />
    </div>
  );
};

export default ClientRequests;
