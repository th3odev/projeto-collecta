import starIcon from "../../assets/icons/star_white.svg";
import trophyIcon from "../../assets/icons/trophy.svg";
import starsImage from "../../assets/images/stars.jpg";

export default function PointSystem() {
  return (
    <section className="bg-[#0F1217] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* text */}
          <div>
            <h2 className="text-3xl font-bold text-white">Sistema de pontos</h2>

            <p className="mt-4 text-sm text-gray-400 max-w-md">
              Cada item coletado gera estrelas que refletem o impacto ambiental
              da sua ação. Quanto maior o item ou sua complexidade de descarte,
              mais estrelas você recebe.
            </p>

            <div className="mt-8 space-y-5">
              {/* item 1 */}
              <div className="flex items-start gap-3">
                <img src={starIcon} alt="" className="h-5 w-5 mt-1" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Acumule e evolua
                  </p>
                  <p className="text-xs text-gray-400">
                    Progrida através de níveis e desbloqueie emblemas exclusivos
                  </p>
                </div>
              </div>

              {/* item 2 */}
              <div className="flex items-start gap-3">
                <img src={trophyIcon} alt="" className="h-5 w-5 mt-1" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Recompensas reais
                  </p>
                  <p className="text-xs text-gray-400">
                    Troque suas estrelas por produtos sustentáveis e
                    experiências
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* image */}
          <div className="flex justify-center md:justify-end">
            <img
              src={starsImage}
              alt="Sistema de estrelas"
              className="w-full max-w-sm rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
