import starWhite from "../../assets/icons/star_white.svg";

export default function RewardCard({ recompensa, estado, onResgatar }) {
  const disabled = estado !== "disponivel";

  return (
    <div
      className={`w-full h-[180px] rounded-xl border bg-[#0F1217] overflow-hidden relative transition
        ${
          disabled
            ? "border-white/5 opacity-50"
            : "border-white/10 hover:border-[#0D9488]/40"
        }`}
    >
      {!disabled && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      )}

      <div className="relative p-4 flex flex-col h-full justify-between">
        <div>
          <h3 className="font-semibold text-sm">{recompensa.titulo}</h3>

          {recompensa.descricao && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {recompensa.descricao}
            </p>
          )}

          {/*  custo */}
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-300">
            <span>Custo:</span>
            <img src={starWhite} className="h-4 w-4" alt="Estrelas" />
            <span className="font-semibold">{recompensa.custo_pontos}</span>
          </div>
        </div>

        <button
          disabled={disabled}
          onClick={onResgatar}
          className={`mt-4 px-4 py-2 text-sm rounded-full border transition
            ${
              disabled
                ? "border-white/10 text-white/30 cursor-not-allowed"
                : "border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/10"
            }`}
        >
          {estado === "bloqueada"
            ? "Pontos insuficientes"
            : estado === "esgotada"
            ? "Esgotada"
            : "Resgatar"}
        </button>
      </div>
    </div>
  );
}
