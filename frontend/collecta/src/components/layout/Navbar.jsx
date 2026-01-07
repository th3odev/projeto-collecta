import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logos/logo_menu.png";
import starIcon from "../../assets/icons/star_white.svg";
import bellIcon from "../../assets/icons/notification.svg";
import userIcon from "../../assets/icons/user.svg";

import NotificationsPopover from "../navbar/NotificationsPopover";
import UserMenu from "../navbar/UserMenu";
import MobileMenu from "../navbar/MobileMenu";

const baseLink =
  "cursor-pointer px-4 h-8 flex items-center rounded-full text-sm font-medium text-gray-300 hover:text-white transition whitespace-nowrap";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const pontos = user?.pontos ?? 0;

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  /* NOTIFICAÇÕES */
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadNotifications() {
      try {
        const logs = await window.api.logs.listarTransacoes(null, true, {
          force_ignore_cache: true,
        });

        if (!logs?.length) {
          setNotifications([]);
          setHasUnread(false);
          return;
        }

        const formatted = logs.map((l) => {
          let titulo = "Atividade";
          let sinal = "+";
          let isNegative = false;

          if (l.motivo === "resgate_recompensa") {
            titulo = "Recompensa resgatada";
            sinal = "-";
            isNegative = true;
          } else if (
            l.motivo === "coleta_item" ||
            l.motivo === "item_coletado"
          ) {
            titulo = "Item coletado";
            sinal = "+";
          }

          return {
            id: l.id,
            titulo,
            data: new Date(l.criado_em).toLocaleString("pt-BR"),
            pontos: Math.abs(l.quantidade),
            sinal,
            isNegative,
            createdAt: new Date(l.criado_em).getTime(),
          };
        });

        setNotifications(formatted);

        const latest = formatted[0].createdAt;
        const lastSeen = Number(localStorage.getItem("last_notification_seen"));

        setHasUnread(!lastSeen || latest > lastSeen);
      } catch (err) {
        console.error("Erro ao carregar notificações:", err);
      }
    }

    loadNotifications();
  }, [isAuthenticated, pontos]);

  /* FECHAR POPOVERS AO CLICAR FORA */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setOpenNotifications(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpenNotifications() {
    setOpenNotifications((p) => !p);
    setOpenUserMenu(false);
    setHasUnread(false);

    if (notifications.length) {
      localStorage.setItem(
        "last_notification_seen",
        notifications[0].createdAt
      );
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#090A0D] border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between md:grid md:grid-cols-3">
          {/* LOGO */}
          <div className="flex items-center h-full">
            <img
              src={logo}
              alt="Collecta"
              onClick={() => navigate("/")}
              className="
                      h-12
                     max-h-full
                    w-auto
                     cursor-pointer
                      object-contain
                    "
            />
          </div>

          {/* MENU CENTRAL */}
          <ul className="hidden md:flex items-center justify-center gap-6">
            {[
              ["Home", "/"],
              ["Catálogo", "/catalogo"],
              ["Ganhe Pontos", "/ganhe-pontos"],
              ["Recompensas", "/recompensas"],
            ].map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? `${baseLink} border border-[#0D9488] bg-[#0D9488]/10 !text-[#0D9488]`
                    : baseLink
                }
              >
                {label}
              </NavLink>
            ))}
          </ul>

          {/* AÇÕES */}
          <div className="flex items-center justify-end gap-4">
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/auth")}
                className="hidden md:flex px-4 h-8 items-center rounded-full border border-[#0D9488] text-[#0D9488] text-sm hover:bg-[#0D9488]/10 transition"
              >
                Entrar
              </button>
            )}

            {isAuthenticated && (
              <>
                {/* PONTOS */}
                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-white text-xs">
                  <img src={starIcon} className="h-4" />
                  <span>{pontos}</span>
                </div>

                {/* NOTIFICAÇÕES */}
                <div ref={notificationsRef} className="relative hidden md:flex">
                  <button
                    onClick={handleOpenNotifications}
                    className="relative h-8 w-8 flex items-center justify-center"
                  >
                    <img src={bellIcon} className="h-5" />
                    {hasUnread && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#0D9488]" />
                    )}
                  </button>

                  <NotificationsPopover
                    open={openNotifications}
                    onClose={() => setOpenNotifications(false)}
                    notifications={notifications}
                  />
                </div>

                {/* USER */}
                <div ref={userMenuRef} className="relative hidden md:block">
                  <button
                    onClick={() => {
                      setOpenUserMenu((p) => !p);
                      setOpenNotifications(false);
                    }}
                  >
                    <img src={userIcon} className="h-6" />
                  </button>

                  <UserMenu
                    open={openUserMenu}
                    onClose={() => setOpenUserMenu(false)}
                    onLogout={logout}
                  />
                </div>
              </>
            )}

            {/* MOBILE */}
            <button
              onClick={() => setOpenMobileMenu(true)}
              className="md:hidden text-white text-xl"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
