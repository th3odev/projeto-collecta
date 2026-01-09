import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function MobileMenu({ open, onClose, isAuthenticated }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  const mainLinks = [
    ["Home", "/"],
    ["Catálogo", "/catalogo"],
    ["Ganhe Pontos", "/ganhe-pontos"],
    ["Recompensas", "/recompensas"],
  ];

  return (
    <div className="fixed inset-0 z-[999] md:hidden">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* drawer */}
      <aside className="absolute right-0 top-0 h-full w-72 bg-[#090A0D] p-6 flex flex-col animate-slide-in">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-white font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* navegação */}
        <nav className="flex flex-col gap-5">
          {mainLinks.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "text-[#0D9488] font-semibold"
                  : "text-gray-300 hover:text-white"
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated && (
          <>
            <div className="my-6 border-t border-white/10" />

            <nav className="flex flex-col gap-4">
              <NavLink
                to="/perfil"
                onClick={onClose}
                className="text-gray-300 hover:text-white"
              >
                Meu perfil
              </NavLink>

              <a
                href="https://mt3.polartis.lan/react2/catalogar"
                onClick={onClose}
                className="text-gray-300 hover:text-white"
              >
                Catalogar item
              </a>

              <button
                onClick={() => alert("Em breve")}
                className="text-left text-gray-300 hover:text-white"
              >
                Configurações
              </button>
            </nav>
          </>
        )}

        {/* CTA */}
        {!isAuthenticated && (
          <button
            onClick={() => {
              onClose();
              navigate("/auth");
            }}
            className="mt-auto h-10 rounded-full border border-[#0D9488] text-[#0D9488] text-sm hover:bg-[#0D9488]/10 transition"
          >
            Entrar
          </button>
        )}

        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              onClose();
              navigate("/");
            }}
            className="mt-auto h-9 rounded-full border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition"
          >
            Sair
          </button>
        )}
      </aside>
    </div>
  );
}
