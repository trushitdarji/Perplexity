import { useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data?.message || "Registration failed");
        return;
      }

      console.log("register success", data);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err?.message ?? "Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-black/70 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_30px_rgba(24,245,245,0.25)] p-8">
        <h2 className="text-2xl font-semibold text-cyan-100 text-center mb-6">
          Register
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-cyan-100/90">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-cyan-400/40 bg-black/50 px-3 py-2 text-white placeholder:text-cyan-200/60 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              placeholder="Your username"
            />
          </label>

          <label className="block">
            <span className="text-sm text-cyan-100/90">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-cyan-400/40 bg-black/50 px-3 py-2 text-white placeholder:text-cyan-200/60 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-cyan-100/90">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-cyan-400/40 bg-black/50 px-3 py-2 text-white placeholder:text-cyan-200/60 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              placeholder="••••••••"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400/80 to-cyan-200/50 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-cyan-200/70">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-cyan-100 hover:text-cyan-50"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
