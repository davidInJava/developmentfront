import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CitizenHome, CitizenLogin } from "./pages/CitizenPages";
import { AgencyHome, AgencyLogin, AgencyRegister } from "./pages/AgencyPages";
import { ProtectedRoute } from "./ProtectedRoute";
import { Main } from "./pages/Main";
import Footer from "./components/Footer/Footer";

const AgencyEntry: React.FC = () => {
  const token = localStorage.getItem("jwtAgency");
  return token ? (
    <Navigate to="/agency/home" replace />
  ) : (
    <Navigate to="/agency/login" replace />
  );
};

const CitizenEntry: React.FC = () => {
  const token = localStorage.getItem("jwtCitizen");
  return token ? (
    <Navigate to="/citizen/home" replace />
  ) : (
    <Navigate to="/citizen/login" replace />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/main" element={<Main />} />

        <Route path="/agency" element={<AgencyEntry />} />
        <Route path="/citizen" element={<CitizenEntry />} />

        {/* Citizen */}
        <Route
          path="/citizen/home"
          element={
            <ProtectedRoute role="citizen">
              <CitizenHome />
            </ProtectedRoute>
          }
        />
        <Route path="/citizen/login" element={<CitizenLogin />} />

        {/* Agency */}
        <Route
          path="/agency/home"
          element={
            <ProtectedRoute role="agency">
              <AgencyHome />
            </ProtectedRoute>
          }
        />
        <Route path="/agency/login" element={<AgencyLogin />} />
        <Route path="/agency/register" element={<AgencyRegister />} />

        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
