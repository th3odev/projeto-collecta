export default function PointsCard({
  icon,
  title,
  description,
  points,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0F1217] px-4 py-4">
      {/* Ícone */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center">
        <img src={icon} alt="" className="w-5 h-5 opacity-80" />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>

      {/* Pontos */}
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-semibold text-white">{points}</span>
        <p className="text-[11px] text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
