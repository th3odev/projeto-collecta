import { useEffect, useState } from "react";
import starGreen from "../../assets/icons/star_green.svg";
import boxIcon from "../../assets/icons/box.svg";
import awardIcon from "../../assets/icons/award_star.svg";

export default function ProfileStats({ user }) {
  const pontos = user?.pontos ?? 0;
  const emblemas = user?.emblemas ?? 0;

  const [coletas, setColetas] = useState(0);

  useEffect(() => {
    async function loadColetas() {
      try {
        // busca todas as transações do usuário
        const logs = await window.api.logs.listarTransacoes(null, true, {
          force_ignore_cache: true,
        });

        if (!Array.isArray(logs)) {
          setColetas(0);
          return;
        }

        // filtra apenas logs de coleta de item
        const coletasFiltradas = logs.filter(
          (log) =>
            log.motivo === "item_coletado" || log.motivo === "coleta_item"
        );

        setColetas(coletasFiltradas.length);
      } catch (err) {
        console.error("Erro ao carregar coletas:", err);
        setColetas(0);
      }
    }

    loadColetas();
  }, []);

  const stats = [
    { label: "Estrelas", value: pontos, icon: starGreen },
    { label: "Coletas", value: coletas, icon: boxIcon },
    { label: "Emblemas", value: emblemas, icon: awardIcon },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-[#0F1217] border border-white/10 rounded-xl p-5 flex items-center gap-4"
        >
          <img
            src={stat.icon}
            alt={stat.label}
            className="w-6 h-6 opacity-80 flex-shrink-0"
          />

          <div>
            <p className="text-sm text-white font-medium">
              {stat.value} {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
