import { useEffect, useRef } from "react";
import starWhite from "../../assets/icons/star_white.svg";

export default function NotificationsPopover({
  open,
  onClose,
  notifications = [],
}) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="
        absolute top-full right-0 mt-2 w-80
        bg-[#0F1217]
        border border-white/10
        rounded-xl shadow-xl
        z-[100]
        origin-top-right
      "
    >
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 text-sm font-medium text-white">
        Notificações
      </div>

      {/* LISTA */}
      <ul
        className="
          max-h-72 overflow-y-auto pr-2
        "
        style={{
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "rgba(255,255,255,0.25) transparent",
        }}
      >
        {notifications.length === 0 && (
          <li className="px-4 py-4 text-sm text-gray-400">
            Nenhuma notificação
          </li>
        )}

        {notifications.map((n) => (
          <li
            key={n.id}
            className="
              px-4 py-3
              text-sm text-white
              hover:bg-white/5
              flex justify-between gap-3
            "
          >
            <div className="flex flex-col">
              <p className="font-medium">{n.titulo}</p>
              <p className="text-xs text-gray-400">{n.data}</p>
            </div>

            {n.pontos !== null && n.pontos !== undefined && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold
                  ${n.isNegative ? "text-red-400" : "text-[#0D9488]"}`}
              >
                <img src={starWhite} className="h-4 w-4" alt="Estrelas" />
                <span>
                  {n.sinal}
                  {n.pontos}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* FOOTER */}
      <button
        onClick={onClose}
        className="
          w-full px-4 py-2
          text-xs text-[#0D9488]
          hover:bg-[#0D9488]/10
          rounded-b-xl
        "
      >
        Fechar
      </button>
    </div>
  );
}
