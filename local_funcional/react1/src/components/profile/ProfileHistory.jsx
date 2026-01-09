import { useEffect, useState } from "react";
import starGreen from "../../assets/icons/star_green.svg";
import boxIcon from "../../assets/icons/box.svg";

export default function ProfileHistory() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);

        const data = await window.api.logs.listarTransacoes(null, true, {
          force_ignore_cache: true,
        });

        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0F1217] border border-white/10 rounded-xl p-8 text-center text-gray-400">
        Carregando histórico...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-[#0F1217] border border-white/10 rounded-xl p-8 text-center">
        <h2 className="text-white font-semibold mb-6">
          Histórico de atividades
        </h2>

        <img src={boxIcon} className="w-10 h-10 mx-auto opacity-40 mb-4" />

        <p className="text-sm text-gray-400">Nenhuma atividade registrada</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F1217] border border-white/10 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-4">Histórico de atividades</h2>

      <ul className="space-y-3">
        {logs.map((log) => {
          const isResgate = log.motivo === "resgate_recompensa";
          const isColeta =
            log.motivo === "coleta_item" || log.motivo === "item_coletado";

          const sinal = isResgate ? "-" : "+";
          const cor = isResgate ? "text-red-400" : "text-[#0D9488]";
          const quantidade = Math.abs(log.quantidade);

          let titulo = "Movimentação de pontos";
          if (isColeta) titulo = "Item coletado";
          if (isResgate) titulo = "Recompensa resgatada";

          return (
            <li
              key={log.id}
              className="flex justify-between items-center px-4 py-3 rounded-lg bg-[#0A0C10] border border-white/5"
            >
              <div className="flex items-center gap-3">
                <img src={starGreen} className="h-4 w-4" />

                <div>
                  <p className="text-sm text-white">{titulo}</p>

                  <p className="text-xs text-gray-400">
                    {new Date(log.criado_em).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <span className={`text-sm font-medium ${cor}`}>
                {sinal}
                {quantidade}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
