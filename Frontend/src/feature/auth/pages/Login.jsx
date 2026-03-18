import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const load = useSelector((state) => state.auth.load);

  if (!load && user) {
    return <Navigate to="/" replace />;
  }

  const { handleLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      email,
      password,
    };

    await handleLogin(payload);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-black/70 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_30px_rgba(24,245,245,0.25)] p-8">
        <h2 className="text-2xl font-semibold text-cyan-100 text-center mb-6">
          Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-cyan-200/70">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-cyan-100 hover:text-cyan-50"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
