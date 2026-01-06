import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import heartIcon from "../../assets/icons/wrong_location.svg";

export default function ItemActions({ item }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alreadyCollected, setAlreadyCollected] = useState(false);

  useEffect(() => {
    if (item.status === "coletado") {
      setAlreadyCollected(true);
    } else {
      setAlreadyCollected(false);
    }
  }, [item.status]);

  async function handleResgatar() {
    if (loading || alreadyCollected) return;

    try {
      setLoading(true);
      setAlreadyCollected(true); 

      await window.api.item.coletarItem(item.id);

      addToast({
        title: "Item coletado!",
        description: "Você ganhou 50 estrelas.",
      });

      //  volta pro catálogo e força atualização
      setTimeout(() => {
        navigate("/catalogo", { replace: true });
        setTimeout(() => window.location.reload(), 50);
      }, 800);
    } catch (err) {
      console.error(err);

      // rollback em caso de erro
      setAlreadyCollected(false);
      setLoading(false);

      addToast({
        type: "error",
        title: "Erro ao coletar",
        description: err.message || "Não foi possível coletar o item.",
      });
    }
  }

  async function handleNotFound() {
    if (loading || alreadyCollected) return;

    try {
      setLoading(true);

      await window.api.relato.criarRelato(
        "nao_encontrado",
        "Item não estava no local informado",
        [],
        null,
        item.id
      );

      addToast({
        type: "error",
        title: "Item não encontrado",
        description: "Obrigado por avisar, isso ajuda a comunidade.",
      });

      setTimeout(() => {
        navigate("/catalogo", { replace: true });
        setTimeout(() => window.location.reload(), 50);
      }, 800);
    } catch (err) {
      console.error(err);
      setLoading(false);

      addToast({
        type: "error",
        title: "Erro ao enviar relato",
        description: err.message || "Não foi possível registrar o relato.",
      });
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleResgatar}
        disabled={loading || alreadyCollected}
        className={`flex-1 h-[42px] rounded-full
          border border-[#0D9488]
          bg-[#0A1A1D]
          text-[#0D9488]
          transition
          ${
            loading || alreadyCollected
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#0D9488]/10"
          }
        `}
      >
        {alreadyCollected
          ? "Item já coletado"
          : loading
          ? "Processando..."
          : "Resgatar item"}
      </button>

      <button
        onClick={handleNotFound}
        disabled={loading || alreadyCollected}
        className={`h-[42px] px-6 rounded-full
          border border-white/10
          text-gray-400
          transition flex items-center gap-2
          ${
            loading || alreadyCollected
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-white"
          }
        `}
      >
        <img
          src={heartIcon}
          className="h-4 flex-shrink-0"
          alt="Não encontrado"
        />
        Não encontrado
      </button>
    </div>
  );
}
