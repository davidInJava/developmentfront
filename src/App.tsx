import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CitizenHome, CitizenLogin } from "./pages/CitizenPages";
import { AgencyHome, AgencyLogin, AgencyRegister } from "./pages/AgencyPages";
import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <Link to="/citizen">Citizen</Link>
        <Link to="/agency">Agency</Link>
      </nav>

      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
