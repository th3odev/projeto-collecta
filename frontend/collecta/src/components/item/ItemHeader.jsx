import starIcon from "../../assets/icons/star_green.svg";
import locationIcon from "../../assets/icons/explore.svg";

export default function ItemHeader({ item }) {
  const POINTS_PER_ITEM = 50;
  const isCollected = item.status === "coletado";

  return (
    <div className="hidden lg:flex flex-wrap items-center gap-4">
      {/* título */}
      <h1 className="text-3xl font-bold text-white flex-1">{item.titulo}</h1>

      {/* pontos */}
      <span
        className="h-8 px-3 rounded-full
                   border border-[#0D9488]
                   bg-[#0A1A1D]
                   text-[#0D9488]
                   text-xs flex items-center gap-2"
      >
        <img src={starIcon} className="h-4 w-4" />
        {POINTS_PER_ITEM} estrelas
      </span>

      {/* localização */}
      <span
        className="h-8 px-3 rounded-full
                   border border-[#0D9488]
                   bg-[#0A1A1D]
                   text-[#0D9488]
                   text-xs flex items-center gap-2"
      >
        <img src={locationIcon} className="h-4 w-4 opacity-70" />
        Local aproximado
      </span>

      {/* status coletado */}
      {isCollected && (
        <span
          className="h-8 px-3 rounded-full
                     border border-white/10
                     bg-white/5
                     text-gray-400
                     text-xs"
        >
          Coletado
        </span>
      )}
    </div>
  );
}
