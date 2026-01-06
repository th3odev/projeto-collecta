import { useAuth } from "../../context/AuthContext";

export default function ProfileHeader({ user }) {
  const { logout } = useAuth();

  // fallbacks seguros
  const nome = user?.nome_usuario || "Usuário";
  const email = user?.email || "email@exemplo.com";
  const apelido = user?.apelido || "";
  const pontos = user?.pontos ?? 0;
  const itensColetados = user?.itens_coletados ?? 0;

  // icon com inicial do nome
  const avatarLetter = nome.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between gap-6 mb-8">
      {/* esquerda */}
      <div className="flex items-center gap-4">
        {/* icon */}
        <div className="w-14 h-14 rounded-xl bg-[#0D9488] flex items-center justify-center text-white font-bold text-lg">
          {avatarLetter}
        </div>

        {/* info */}
        <div>
          <h1 className="text-white font-semibold text-lg">
            {nome}
            {apelido && (
              <span className="ml-2 text-sm text-gray-400">@{apelido}</span>
            )}
          </h1>

          <p className="text-sm text-gray-400">{email}</p>

          <p className="text-xs text-gray-500 mt-1">
            {itensColetados} itens coletados • {pontos} pontos
          </p>
        </div>
      </div>

      {/* logout */}
      <button
        onClick={logout}
        className="h-9 px-4 rounded-full border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition"
      >
        Sair
      </button>
    </div>
  );
}
