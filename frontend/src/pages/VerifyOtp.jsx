import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ToastContainer from "../components/ToastContainer";

function VerifyOtp({ mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const challengeId = location.state?.challengeId || "";
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = mode === "login";

  if (isLogin ? !challengeId : !email) {
    return <Navigate to={isLogin ? "/login" : "/register"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from your email");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = isLogin ? { challengeId, otp } : { email, otp };
      const endpoint = isLogin ? "/auth/verify-login" : "/auth/verify-email";
      const response = await api.post(endpoint, payload);

      if (!response.data.success) {
        throw new Error(response.data.message || "Code verification failed");
      }

      if (isLogin) {
        navigate("/dashboard", { state: response.data.data });
      } else {
        navigate("/login", {
          replace: true,
          state: { message: response.data.message || "Email verified successfully" },
        });
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Code verification failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <aside className="brand-panel">
          <div className="brand-header">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3.5c3.6 0 6.5 2.5 6.5 6.2 0 4.1-3.3 7.5-6.5 10.8C8.8 17.2 5.5 13.8 5.5 9.7 5.5 6 8.4 3.5 12 3.5Z" />
                <path d="M12 6v6M9 9h6" />
              </svg>
            </div>
            <span className="brand-name">Leaf</span>
          </div>

          <div className="brand-graphic" aria-hidden="true">
            <div className="leaf" />
          </div>

          <div className="brand-copy">
            <p className="brand-title">
              {isLogin ? (
                <>One last step<br />to your space.</>
              ) : (
                <>A fresh start<br />begins here.</>
              )}
            </p>
            <p>
              {isLogin
                ? "Confirm it’s you to securely finish signing in."
                : "Verify your email to finish creating your account."}
            </p>
          </div>

          <ul className="brand-features">
            <li>Safe &amp; private</li>
            <li>Quick verification</li>
            <li>Works on every device</li>
          </ul>
        </aside>

        <section className="form-panel">
          <div className="verification-form auth-form">
            <span className="verification-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="6" width="16" height="12" rx="2" />
                <path d="m5 7 7 6 7-6" />
              </svg>
            </span>
            <h1 className="form-heading">
              {isLogin ? "Verify it’s you" : "Check your email"}
            </h1>
            <p className="form-subtitle">
              Enter the 6-digit code we sent to
              <strong className="verification-email"> {email}</strong>.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="verification-otp">6-digit verification code</label>
                <input
                  id="verification-otp"
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="••••••"
                  aria-describedby="otp-help"
                  autoFocus
                  required
                />
                <p id="otp-help" className="otp-help">
                  The code expires in 5 minutes.
                </p>
              </div>

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify code"}
              </button>
            </form>

            <p className="switch-copy">
              {isLogin ? (
                <>Not you? <Link to="/login">Back to log in</Link></>
              ) : (
                <>Wrong email? <Link to="/register">Back to registration</Link></>
              )}
            </p>
          </div>
        </section>
      </div>
      <ToastContainer
        message={message || error}
        type={error ? "error" : "success"}
        onDismiss={error ? setError : setMessage}
      />
    </div>
  );
}

export default VerifyOtp;
