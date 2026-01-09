import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import heartIcon from "../../assets/icons/wrong_location.svg";

export default function ItemActions({ item }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alreadyCollected, setAlreadyCollected] = useState(false);

  // Modal
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [collectionCode, setCollectionCode] = useState("");
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    setAlreadyCollected(item.status === "coletado");
  }, [item.status]);

  const openCodeModal = () => {
    if (loading || alreadyCollected) return;
    setShowCodeModal(true);
    setCollectionCode("");
    setCodeError("");
  };

  const closeCodeModal = () => {
    setShowCodeModal(false);
    setCollectionCode("");
    setCodeError("");
  };

  async function handleConfirmCollection() {
    if (!collectionCode.trim()) {
      setCodeError("Por favor, insira o código de coleta.");
      return;
    }

    try {
      setLoading(true);
      setCodeError("");

      await window.api.item.coletarItem(item.id, collectionCode);

      addToast({
        title: "Item coletado!",
        description: "Você ganhou 50 estrelas.",
      });

      setAlreadyCollected(true);
      closeCodeModal();

      setTimeout(() => {
        navigate("/catalogo", { replace: true });
        setTimeout(() => window.location.reload(), 50);
      }, 1200);
    } catch (err) {
      console.error(err);

      const backendMessage = err?.message || err?.response?.error || "";

      let errorMessage = "Não foi possível coletar o item.";

      if (backendMessage.toLowerCase().includes("próprio item")) {
        errorMessage =
          "Você não pode coletar um item que você mesmo cadastrou.\n\nSe quiser removê-lo, cancele a oferta no catálogo.";
      } else if (backendMessage.toLowerCase().includes("código")) {
        errorMessage =
          "O código informado é inválido.\nVerifique e tente novamente.";
      } else if (backendMessage) {
        errorMessage = backendMessage;
      }

      setCodeError(errorMessage);
      setLoading(false);
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
    <>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={openCodeModal}
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
                : "hover:text-white hover:border-white/20"
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

      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#090A0D] shadow-2xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Código de coleta
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Digite o código fornecido no local de coleta.
              </p>
            </div>

            {/* Input */}
            <div className="px-6">
              <input
                type="text"
                value={collectionCode}
                onChange={(e) => {
                  setCollectionCode(e.target.value.toUpperCase());
                  setCodeError("");
                }}
                placeholder="Ex: ABC123"
                autoFocus
                onKeyDown={(e) =>
                  e.key === "Enter" && handleConfirmCollection()
                }
                className="
                  w-full h-11 rounded-xl
                  bg-[#0F1217]
                  border border-white/10
                  px-4 text-white
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:border-[#0D9488]
                  focus:ring-1 focus:ring-[#0D9488]/30
                  transition
                "
              />
            </div>

            {/* Erro */}
            {codeError && (
              <div className="mx-6 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400 leading-relaxed whitespace-pre-line">
                  {codeError}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 px-6 py-6">
              <button
                onClick={handleConfirmCollection}
                disabled={loading}
                className="
      flex-1 h-10 rounded-full
      border border-[#0D9488]
      text-[#0D9488] text-sm font-medium
      hover:bg-[#0D9488]/10
      transition
      disabled:opacity-50
    "
              >
                {loading ? "Validando..." : "Confirmar"}
              </button>

              <button
                onClick={closeCodeModal}
                disabled={loading}
                className="
      flex-1 h-10 rounded-full
      border border-white/15
      text-gray-300 text-sm
      hover:border-white/30
      transition
      disabled:opacity-50
    "
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
