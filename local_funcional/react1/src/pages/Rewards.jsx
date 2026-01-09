import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import RewardCard from "../components/rewards/RewardCard";

import starGreen from "../assets/icons/star_green.svg";

export default function Rewards() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const pontos = user?.pontos ?? 0;

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await window.api.recompensa.listarRecompensas();
        setRewards(data || []);
      } catch (err) {
        console.error(err);
        addToast({
          title: "Erro",
          description: "Não foi possível carregar as recompensas.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    loadRewards();
  }, []);

  async function handleResgatar(recompensa) {
    try {
      await window.api.recompensa.resgatarRecompensa(recompensa.id);

      // ✅ Toast principal
      addToast({
        title: "Recompensa resgatada!",
        description: `Foram consumidas ${recompensa.custo_pontos} estrelas.`,
      });

      // ✅ Toast de instrução (email)
      addToast({
        title: "Próximo passo",
        description:
          "Confira seu e-mail para mais informações sobre a recompensa resgatada.",
      });

      await refreshUser();

      // reload simples (mantém UX direta)
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (err) {
      console.error(err);
      addToast({
        title: "Não foi possível resgatar",
        description: err.message || "Tente novamente mais tarde.",
        type: "error",
      });
    }
  }

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 bg-[#090A0D] min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* HEADER */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Recompensas</h1>
              <p className="mt-1 text-sm text-gray-400">
                Troque seus pontos por produtos e experiências
              </p>
            </div>

            {/* pontos */}
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1
                rounded-full
                border border-[#0D9488]/40
                bg-[#0D9488]/10
                text-[#0D9488]
                text-xs
                w-fit
              "
            >
              <img src={starGreen} className="w-3.5 h-3.5" alt="Estrelas" />
              <span className="font-medium">{pontos}</span>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400">Carregando recompensas...</p>
          ) : rewards.length === 0 ? (
            <p className="text-gray-400">
              Nenhuma recompensa disponível no momento.
            </p>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewards.map((r) => {
                const estado =
                  r.quantidade_disponivel <= 0
                    ? "esgotada"
                    : pontos < r.custo_pontos
                    ? "bloqueada"
                    : "disponivel";

                return (
                  <RewardCard
                    key={r.id}
                    recompensa={r}
                    estado={estado}
                    onResgatar={() => handleResgatar(r)}
                  />
                );
              })}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
