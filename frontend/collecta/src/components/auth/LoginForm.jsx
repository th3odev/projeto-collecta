import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, senha); // login único válido
      onSuccess?.();
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-black/30 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        className="w-full p-3 rounded-lg bg-black/30 text-white"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button
        disabled={loading}
        className="w-full h-12 rounded-lg bg-[#0D9488] text-white font-medium hover:opacity-90 transition"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
