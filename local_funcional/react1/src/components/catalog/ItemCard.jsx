import { Link } from "react-router-dom";
import { useState } from "react";
import { resolveItemImage } from "../../assets/imageUrl";

export default function ItemCard({ item }) {
  const [imgError, setImgError] = useState(false);
  const isCollected = item.status === "coletado";

  const image =
    !imgError && item.url_imagens?.length
      ? resolveItemImage(item.url_imagens[0])
      : null;

  return (
    <Link to={`/item/${item.id}`}>
      <div
        className={`
          relative w-full rounded-xl border bg-[#0F1217] overflow-hidden transition
          ${
            isCollected
              ? "border-white/5 opacity-70"
              : "border-white/10 hover:border-[#0D9488]/40"
          }
        `}
      >
        {/* badge de coletado */}
        {isCollected && (
          <div className="absolute top-3 left-3 z-10 px-3 h-7 rounded-full bg-black/70 border border-white/10 text-xs text-white flex items-center">
            Coletado
          </div>
        )}

        {/* imagem */}
        <div className="h-[140px] bg-black/40 relative">
          {image ? (
            <img
              src={image}
              alt={item.titulo}
              className={`w-full h-full object-cover ${
                isCollected ? "grayscale" : ""
              }`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
              Sem imagem
            </div>
          )}
        </div>

        {/* conteúdo */}
        <div className="p-4">
          <h3 className="text-white font-medium line-clamp-1">{item.titulo}</h3>

          <p className="text-white/60 text-sm mt-1 line-clamp-2">
            {item.descricao}
          </p>

          <div className="text-xs text-white/40 mt-2">
            {item.categoria} • {item.subcategoria}
          </div>
        </div>
      </div>
    </Link>
  );
}
