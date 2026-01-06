import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import PointsCard from "../components/points/PointsCard";
import PointsNotice from "../components/points/PointsNotice";

import boxIcon from "../assets/icons/package_cinza.svg";
import usersIcon from "../assets/icons/group.svg";
import calendarIcon from "../assets/icons/calendar_check.svg";
import cardsIcon from "../assets/icons/cards_star.svg";

export default function EarnPoints() {
  return (
    <>
      <Navbar />

      <main className="bg-[#090A0D] min-h-screen pt-28 md:pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          {/* header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Ganhe Pontos
            </h1>
            <p className="text-sm text-gray-400">
              Amplie seu impacto e acumule mais estrelas além das coletas
            </p>
          </div>

          {/* cards */}
          <div className="space-y-4">
            <PointsCard
              icon={boxIcon}
              title="Cadastre Itens"
              description="Encontrou algo descartado? Cadastre na plataforma para ajudar outros coletores."
              points="+50 Estrelas"
              subtitle="Por item"
            />

            <PointsCard
              icon={usersIcon}
              title="Convide Amigos"
              description="Compartilhe sua experiência e traga mais pessoas para a comunidade."
              points="+100 Estrelas"
              subtitle="Por indicação"
            />

            <PointsCard
              icon={calendarIcon}
              title="Desafios Semanais"
              description="Participe dos desafios especiais lançados toda semana para ganhar bônus."
              points="+250 Estrelas"
              subtitle="Por desafio completo"
            />

            <PointsCard
              icon={cardsIcon}
              title="Missões Especiais"
              description="Complete sequências de ações para desbloquear recompensas exclusivas."
              points="+500 Estrelas"
              subtitle="Por missão concluída"
            />
          </div>

          {/* notice */}
          <PointsNotice />
        </div>
      </main>

      <Footer />
    </>
  );
}
