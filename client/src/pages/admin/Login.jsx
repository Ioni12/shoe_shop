import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Stamp from "../../components/Stamp";

export default function Login() {
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
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Stamp tone="oxblood" className="mb-4">
            Admin
          </Stamp>
          <h1 className="font-display text-3xl">Kepuca e arte</h1>
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
              Username
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
              Password
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
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
