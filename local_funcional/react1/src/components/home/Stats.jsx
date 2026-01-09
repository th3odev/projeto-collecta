import packageIcon from "../../assets/icons/package_2.svg";
import usersIcon from "../../assets/icons/diversity_3.svg";
import starIcon from "../../assets/icons/hotel_class.svg";
import recycleIcon from "../../assets/icons/compost.svg";

export default function Stats() {
  return (
    <section className="border-y border-white/10 bg-[#0F1217]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {/* itens coletados */}
          <div className="flex flex-col items-center">
            <div className="w-[45px] h-[45px] mb-3 rounded-xl bg-[#0A1A1D] flex items-center justify-center">
              <img src={packageIcon} alt="" className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold text-white">12.5K+</span>
            <span className="mt-1 text-xs text-gray-400">Itens coletados</span>
          </div>

          {/* usuários ativos */}
          <div className="flex flex-col items-center">
            <div className="w-[45px] h-[45px] mb-3 rounded-xl bg-[#0A1A1D] flex items-center justify-center">
              <img src={usersIcon} alt="" className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold text-white">3.2K+</span>
            <span className="mt-1 text-xs text-gray-400">Usuários ativos</span>
          </div>

          {/* estrelas distribuídas */}
          <div className="flex flex-col items-center">
            <div className="w-[45px] h-[45px] mb-3 rounded-xl bg-[#0A1A1D] flex items-center justify-center">
              <img src={starIcon} alt="" className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold text-white">850K+</span>
            <span className="mt-1 text-xs text-gray-400">
              Estrelas distribuídas
            </span>
          </div>

          {/* toneladas desviadas */}
          <div className="flex flex-col items-center">
            <div className="w-[45px] h-[45px] mb-3 rounded-xl bg-[#0A1A1D] flex items-center justify-center">
              <img src={recycleIcon} alt="" className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold text-white">45+</span>
            <span className="mt-1 text-xs text-gray-400">
              Toneladas desviadas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
