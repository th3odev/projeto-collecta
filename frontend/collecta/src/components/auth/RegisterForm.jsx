import { useState } from "react";
import { register } from "/jsApiLayer/auth.js";

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    apelido: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form.nome, form.senha, form.email, form.apelido);
      onSuccess?.(); // volta pro login
    } catch (err) {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <input
        placeholder="Nome"
        className="w-full p-3 rounded-lg bg-black/30 text-white"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
      />

      <input
        placeholder="Apelido"
        className="w-full p-3 rounded-lg bg-black/30 text-white"
        value={form.apelido}
        onChange={(e) => setForm({ ...form, apelido: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-black/30 text-white"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Senha"
        className="w-full p-3 rounded-lg bg-black/30 text-white"
        value={form.senha}
        onChange={(e) => setForm({ ...form, senha: e.target.value })}
      />

      <button
        disabled={loading}
        className="w-full h-12 rounded-lg bg-[#0D9488] text-white font-medium"
      >
        {loading ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
