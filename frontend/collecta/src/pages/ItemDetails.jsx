import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import ItemHeader from "../components/item/ItemHeader";
import ItemInfo from "../components/item/ItemInfo";
import ItemActions from "../components/item/ItemActions";
import ItemMap from "../components/item/ItemMap";

import { resolveItemImage } from "../assets/imageUrl";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const items = await window.api.item.listarItens();
        const found = items.find((i) => String(i.id) === id);
        setItem(found || null);
      } catch (err) {
        console.error("Erro ao carregar item:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="bg-[#090A0D] pt-24 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
          {loading ? (
            <div className="h-[300px] rounded-xl bg-[#0F1217] animate-pulse" />
          ) : !item ? (
            <p className="text-gray-400">Item não encontrado.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* COLUNA ESQUERDA */}
                <div className="space-y-4">
                  <Link
                    to="/catalogo"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                  >
                    ← voltar
                  </Link>

                  {/* IMAGEM */}
                  <div className="relative h-[240px] md:h-[320px] rounded-xl border border-white/10 bg-[#0F1217] overflow-hidden flex items-center justify-center">
                    {item.url_imagens?.length ? (
                      <img
                        src={resolveItemImage(item.url_imagens[0])}
                        alt={item.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">Sem imagem</span>
                    )}
                  </div>

                  {/* TÍTULO MOBILE */}
                  <h1 className="lg:hidden text-2xl font-bold text-white">
                    {item.titulo}
                  </h1>
                </div>

                {/* COLUNA DIREITA */}
                <div className="flex flex-col justify-center gap-6">
                  <ItemHeader item={item} />
                  <ItemInfo item={item} />
                  <ItemActions item={item} />
                </div>
              </div>

              <ItemMap item={item} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
