import React, { useState } from "react";
import styles from "./MainClientBlock.module.css";
import axios from "axios";
import API_ROUTES from "../../../../config";

export const AgencyHome: React.FC<{
  setAdding: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setAdding }) => {
  const userRaw = localStorage.getItem("userAgency");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<
    "firstName" | "lastName" | "dateOfBirth" | "email" | "phone" | "psn"
  >("firstName");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const validatePSN = (psn: string) => /^[0-9]{10}$/.test(psn);

  const handleSearch = async () => {
    setLoading(true);

    try {
      let data: any = [];

      if (searchField === "psn") {
        if (!validatePSN(query)) {
          alert("Неверный формат PSN. Должно быть 11 цифр.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_ROUTES.BASE_URL}persons/${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtAgency")}`,
          },
        });
        data = [res.data]; // чтобы унифицировать с массивом результатов
      } else {
        const params: Record<string, string> = {};
        params[searchField] = query;

        const res = await axios.get(`${API_ROUTES.BASE_URL}persons`, {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtAgency")}`,
          },
        });
        data = res.data;
      }

      setResults(data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setResults([]);
      } else {
        alert("Ошибка при поиске пользователей");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Неизвестный пользователь</div>;

  const canSearch = user.role !== "CITIZEN";

  return (
    <div className={styles.container}>
      {canSearch ? (
        <>
          <div className={styles.searchBlock}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Введите значение..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className={styles.searchSelect}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as any)}
            >
              <option value="firstName">Имя</option>
              <option value="lastName">Фамилия</option>
              <option value="dateOfBirth">Дата рождения</option>
              <option value="email">Email</option>
              <option value="phone">Телефон</option>
              <option value="psn">PSN</option>
            </select>

            <button className={styles.searchButton} onClick={handleSearch}>
              🔍
            </button>
            <button
              className={styles.searchButton}
              onClick={() => setAdding(true)}
            >
              Добавить клиента
            </button>
          </div>

          <div className={styles.resultsBlock}>
            {loading && <p>Загрузка...</p>}
            {!loading && results.length === 0 && <p>Пользователи не найдены</p>}
            {!loading &&
              results.map((person) => (
                <div className={styles.resultItem} key={person.psn}>
                  <span>
                    {person.firstName} {person.lastName}
                  </span>
                  <span>{person.psn}</span>
                  <span>{person.email}</span>
                </div>
              ))}
          </div>
          <div>
            
          </div>
        </>
      ) : (
        <p>Поиск доступен только для операторов агентства и администраторов.</p>
      )}
    </div>
  );
};

export default AgencyHome;
