import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  if (!open) return null;

  function handleSuccess() {
    onClose?.();
    navigate("/perfil"); //  redirecionar após o auth real
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0F1217] border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          {mode === "login"
            ? "Acesse sua conta para continuar"
            : "Crie sua conta para começar a coletar"}
        </p>

        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={() => setMode("login")} />
        )}

        <div className="mt-6 text-sm text-gray-400 text-center">
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-[#0D9488] hover:underline"
              >
                Criar agora
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-[#0D9488] hover:underline"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
