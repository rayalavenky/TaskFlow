import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ToastContainer from "../components/ToastContainer";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Registration failed",
      );
    } finally {
      setIsSubmitting(false);
    }
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
              Plant the seed of
              <br />
              something new.
            </p>
            <p>Join in under a minute — no fuss, just fresh starts.</p>
          </div>

          <ul className="brand-features">
            <li>Safe &amp; private</li>
            <li>Quick sign up</li>
            <li>Works on every device</li>
          </ul>
        </aside>

        <section className="form-panel">
          <div className="mode-switch" aria-label="Authentication mode selector">
            <Link to="/login" className="mode-button">
              Log in
            </Link>
            <Link to="/register" className="mode-button active">
              Register
            </Link>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="form-heading">Create account</h2>
            <p className="form-subtitle">It only takes a moment.</p>

            <div className="field">
              <label htmlFor="register-name">Full name</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.2 18.3c.8-2.2 3.1-3.6 4.8-3.6s4 .9 4.8 3.6" />
                    <circle cx="12" cy="8.5" r="3.4" />
                  </svg>
                </span>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ravi Kumar"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-email">Email</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                    <path d="m4.8 6.8 7.2 5.7 7.2-5.7" />
                  </svg>
                </span>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 10V8.8A5 5 0 0 1 12 4a5 5 0 0 1 5 4.8V10" />
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                  </svg>
                </span>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                      <path d="M9.2 5.3A12.8 12.8 0 0 1 12 5c3.8 0 7 2.1 9 7-1.1 2.2-2.7 3.9-4.7 5.1" />
                      <path d="M6.1 6.1A16.2 16.2 0 0 0 3 12c1.8 3.6 5 6 9 6 1.8 0 3.4-.4 4.8-1.1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-confirm-password">Confirm password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 10V8.8A5 5 0 0 1 12 4a5 5 0 0 1 5 4.8V10" />
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                  </svg>
                </span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                      <path d="M9.2 5.3A12.8 12.8 0 0 1 12 5c3.8 0 7 2.1 9 7-1.1 2.2-2.7 3.9-4.7 5.1" />
                      <path d="M6.1 6.1A16.2 16.2 0 0 0 3 12c1.8 3.6 5 6 9 6 1.8 0 3.4-.4 4.8-1.1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="checkbox-row">
              <label className="remember">
                <input type="checkbox" />
                <span>I agree to the terms &amp; privacy policy</span>
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create my account"}
            </button>

            <p className="switch-copy">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

          </form>
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

export default Register;