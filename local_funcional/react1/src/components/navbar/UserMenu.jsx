import { NavLink } from "react-router-dom";

export default function UserMenu({ open, onClose, onLogout }) {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-[#0F1217] border border-white/10 rounded-xl shadow-lg z-50">
      <NavLink
        to="/perfil"
        onClick={onClose}
        className="block px-4 py-3 text-sm text-white hover:bg-white/5 transition"
      >
        Meu perfil
      </NavLink>

      {/* 🔹 Catalogar Item */}
      <a
        href="https://mt3.polartis.lan/react2/catalogar"
        onClick={onClose}
        className="block px-4 py-3 text-sm text-white hover:bg-white/5 transition"
      >
        Catalogar item
      </a>

      <button
        onClick={() => alert("Em breve")}
        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition"
      >
        Configurações
      </button>

      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
      >
        Sair
      </button>
    </div>
  );
}
