import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingContainer } from "./pages/Landing/LandingContainer";
import { OtpContainer } from "./pages/Otp/OtpContainer";
import { DashboardContainer } from "./pages/Dashboard/DashboardContainer";
import { TransactionsContainer } from "./pages/Transactions/TransactionsContainer";
import { Navbar } from "./components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { AdminContainer } from "./pages/Admin/AdminContainer";
import { UserDetailContainer } from "./components/UserDetailContainer/UserDetailContainer";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// App
// Sets up routing with react-router-dom (a standard library for client-side routing in React).
// We keep tiny pieces of state (msisdn & otp) here because both the Landing and OTP
// pages need to access/update them.
function App() {
  const [msisdn, setMsisdn] = useState("");
  const [otp, setOtp] = useState("");

  // Treat visiting the landing page (/) like a logout: clear OTP value.
  useEffect(() => {
    if (window.location.pathname === "/") {
      setOtp("");
      // Optionally clear msisdn if you don't want it cached
      // setMsisdn("");
    }
  }, [window.location.pathname]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <DashboardContainer />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <TransactionsContainer />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <>
                <Navbar />
                <AdminContainer />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:msisdn"
          element={
            <ProtectedRoute requireAdmin>
              <>
                <Navbar />
                <UserDetailContainer />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/otp"
          element={<OtpContainer msisdn={msisdn} otp={otp} setOtp={setOtp} />}
        />
        <Route path="/" element={<LandingContainer setMsisdn={setMsisdn} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
