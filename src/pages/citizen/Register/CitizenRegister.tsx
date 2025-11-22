import React from "react";

// Эта страница не используется — регистрация граждан проводится через агентства.
export const CitizenRegister: React.FC = () => {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>Страница отключена</h2>
      <p>
        Регистрация граждан осуществляется вручную через агентство. Для доступа
        используйте вход.
      </p>
    </div>
  );
};

export default CitizenRegister;
