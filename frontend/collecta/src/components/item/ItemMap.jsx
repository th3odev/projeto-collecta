import locationIcon from "../../assets/icons/location_on.svg";
import exploreIcon from "../../assets/icons/explore.svg";

export default function ItemMap() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1217] h-[260px] flex flex-col items-center justify-center gap-4 text-center">
      <img src={locationIcon} alt="" className="h-6 w-6 opacity-40" />

      <p className="text-sm text-gray-400">Mapa de localização</p>

      <span className="px-4 py-1.5 rounded-full border border-[#0D9488] bg-[#0A1A1D] text-[#0D9488] text-xs flex items-center gap-2">
        <img src={exploreIcon} alt="" className="h-4 w-4" />
        Integração com API de mapas em desenvolvimento
      </span>
    </div>
  );
}
