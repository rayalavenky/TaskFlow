import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./styles/auth.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-email"
          element={<VerifyOtp mode="email" />}
        />

        <Route
          path="/verify-login"
          element={<VerifyOtp mode="login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;