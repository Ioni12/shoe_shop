import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import Stamp from "../../components/Stamp";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/admin/products";

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = err.code;
      setError(
        code ? t(`errors.${code}`, { defaultValue: err.message }) : err.message,
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Stamp tone="oxblood" className="mb-4">
            {t("admin.login.stamp")}
          </Stamp>
          <h1 className="font-display text-3xl">{t("admin.login.title")}</h1>
        </div>

        {error && (
          <div className="mb-6 border border-oxblood text-oxblood px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="stamp text-ink mb-2 inline-block"
            >
              {t("admin.login.username")}
            </label>
            <input
              id="username"
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="stamp text-ink mb-2 inline-block"
            >
              {t("admin.login.password")}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors disabled:opacity-50"
          >
            {submitting ? t("admin.login.signingIn") : t("admin.login.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
