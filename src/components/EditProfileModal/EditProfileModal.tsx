import React, { useEffect, useMemo, useState } from "react";
import styles from "./EditProfileModal.module.css";
import axios from "axios";
import API_ROUTES from "../../config";

type ChangeRow = {
  id: number;
  field?: string;
  newValue?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave?: (
    changes: Array<{ field: string; oldValue: any; newValue: any }>
  ) => void;
};

const FIELDS: {
  key: string;
  label: string;
  type?: "text" | "date" | "select";
}[] = [
  { key: "firstName", label: "Имя" },
  { key: "lastName", label: "Фамилия" },
  { key: "middleName", label: "Отчество" },
  { key: "dateOfBirth", label: "Дата рождения", type: "date" },
  { key: "placeOfBirth", label: "Место рождения" },
  { key: "gender", label: "Пол", type: "select" },
  { key: "citizenshipStatus", label: "Статус гражданства", type: "select" },
  { key: "nationality", label: "Национальность" },
  { key: "photo", label: "Фото (URL)" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Телефон" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Мужской" },
  { value: "FEMALE", label: "Женский" },
  { value: "OTHER", label: "Другой" },
];

const CITIZENSHIP_OPTIONS = [
  { value: "CITIZEN", label: "Гражданин" },
  { value: "PERMANENT_RESIDENT", label: "Постоянный резидент" },
  { value: "TEMPORARY_RESIDENT", label: "Временный резидент" },
  { value: "REFUGEE", label: "Беженец" },
  { value: "ASYLUM_SEEKER", label: "Ищущий убежища" },
];

export const EditProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [rows, setRows] = useState<ChangeRow[]>([{ id: Date.now() }]);

  const selectedFields = useMemo(
    () => rows.map((r) => r.field).filter(Boolean) as string[],
    [rows]
  );

  const availableOptions = (exclude?: string[]) =>
    FIELDS.filter((f) => !(exclude || []).includes(f.key));

  const addRow = () => {
    const optionsLeft = availableOptions(selectedFields);
    // Don't add if no options left
    if (optionsLeft.length === 0) return;
    // Don't add if any existing row is not filled (field not chosen or newValue empty)
    const hasIncomplete = rows.some(r => !r.field || r.newValue === undefined || r.newValue === '');
    if (hasIncomplete) return;
    setRows(prev => [...prev, { id: Date.now() + Math.random() }]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, patch: Partial<ChangeRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidDate = (d: string) => {
    const t = Date.parse(d);
    if (isNaN(t)) return false;
    const dt = new Date(t);
    const now = new Date();
    // дата не должна быть в будущем
    return dt <= now;
  };

  const formatToInputDate = (val: any) => {
    if (!val) return "";
    try {
      const dt = new Date(val);
      if (isNaN(dt.getTime())) return "";
      return dt.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  const handleSave = async () => {
    const validRows = rows.filter(
      (r) => r.field && r.newValue !== undefined && r.newValue !== ""
    );
    const errors: string[] = [];
    const changes = [] as Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;

    for (const r of validRows) {
      const field = r.field as string;
      const meta = FIELDS.find((f) => f.key === field);
      const newVal = r.newValue as string;
      if (!meta) continue;
      if (field === "email") {
        if (!isValidEmail(newVal))
          errors.push(`Поле "${meta.label}": некорректный email`);
      }
      if (meta.type === "date") {
        if (!isValidDate(newVal))
          errors.push(
            `Поле "${meta.label}": некорректная дата или дата в будущем`
          );
      }
      if (field === "gender") {
        if (!GENDER_OPTIONS.some((o) => o.value === newVal))
          errors.push(`Поле "${meta.label}": некорректное значение`);
      }
      if (field === "citizenshipStatus") {
        if (!CITIZENSHIP_OPTIONS.some((o) => o.value === newVal))
          errors.push(`Поле "${meta.label}": некорректное значение`);
      }
      changes.push({ field, oldValue: user?.[field], newValue: newVal });
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    if (changes.length === 0) return;
    try {
      const token = localStorage.getItem("jwtCitizen");
      const edit: Record<string, any> = {};
      validRows.forEach(r => { if (r.field) edit[r.field] = r.newValue; });
      const url = `${API_ROUTES.BASE_URL}citizen/change-request`;
      await axios.post(
        url,
        { psn: user.psn, edit},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      alert("Заявка на изменение отправлена.");
      setRows([{ id: Date.now() }]);
      onClose();
    } catch (err: any) {
      console.error(err?.response || err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 409) {
        alert(data?.message || 'Уже существует активная заявка на изменение');
      } else if (status === 400) {
        alert(data?.message || 'Некорректные данные запроса');
      } else {
        alert('Ошибка при отправке заявки: ' + (err?.message || 'unknown'));
      }
    }
  };
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);
  if (!isOpen) return null;

  // Блокируем прокрутку страницы, когда модал открыт, и восстанавливаем при закрытии

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Редактирование профиля</h3>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {rows.map((row, idx) => {
            const selectedKeys = rows
              .filter((r) => r.id !== row.id)
              .map((r) => r.field as string);
            const options = availableOptions(selectedKeys);
            const selectedMeta = FIELDS.find((f) => f.key === row.field);
            return (
              <div className={styles.row} key={row.id}>
                <select
                  className={styles.select}
                  value={row.field || ""}
                  onChange={(e) => {
                    const key = e.target.value;
                    const meta = FIELDS.find((f) => f.key === key);
                    const initial =
                      meta?.type === "date"
                        ? formatToInputDate(user?.[key])
                        : user?.[key] ?? "";
                    updateRow(row.id, { field: key, newValue: initial });
                  }}
                >
                  <option value="" disabled>
                    Выберите поле...
                  </option>
                  {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className={styles.beforeAfter}>
                  <div className={styles.before}>
                    {row.field
                      ? selectedMeta?.type === "date"
                        ? formatToInputDate(user?.[row.field]) || "—"
                        : user?.[row.field] ?? "—"
                      : "—"}
                  </div>
                  <div className={styles.arrow}>→</div>
                  {selectedMeta?.type === "date" ? (
                    <input
                      className={styles.input}
                      type="date"
                      value={row.newValue || ""}
                      onChange={(e) =>
                        updateRow(row.id, { newValue: e.target.value })
                      }
                    />
                  ) : selectedMeta?.key === "gender" ? (
                    <select
                      className={styles.input}
                      value={row.newValue || ""}
                      onChange={(e) =>
                        updateRow(row.id, { newValue: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Выберите...
                      </option>
                      {GENDER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : selectedMeta?.key === "citizenshipStatus" ? (
                    <select
                      className={styles.input}
                      value={row.newValue || ""}
                      onChange={(e) =>
                        updateRow(row.id, { newValue: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Выберите...
                      </option>
                      {CITIZENSHIP_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={styles.input}
                      placeholder="Новое значение"
                      value={row.newValue || ""}
                      onChange={(e) =>
                        updateRow(row.id, { newValue: e.target.value })
                      }
                    />
                  )}
                </div>

                <div className={styles.actionsCell}>
                  <button
                    className={styles.remove}
                    onClick={() => removeRow(row.id)}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}

          <div className={styles.addRowWrap}>
            {(() => {
              const optionsLeft = availableOptions(selectedFields);
              const hasIncomplete = rows.some(r => !r.field || r.newValue === undefined || r.newValue === '');
              const disabled = optionsLeft.length === 0 || hasIncomplete;
              return (
                <>
                  <button
                    className={styles.addButton}
                    onClick={addRow}
                    disabled={disabled}
                    title={disabled ? 'Сначала заполните текущее поле или нет доступных опций' : 'Добавить параметр'}
                  >
                    +
                  </button>
                  <span className={styles.addHint}>
                    Добавить параметр для редактирования
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.save} onClick={handleSave}>
            Сохранить
          </button>
          <button className={styles.cancel} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
