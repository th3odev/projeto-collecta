import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Filters from "../components/catalog/Filters";
import SkeletonCard from "../components/catalog/SkeletonCard";
import ItemCard from "../components/catalog/ItemCard";

export default function Catalog() {
  const [openFilters, setOpenFilters] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "todos", // todos | disponivel | coletado
    category: "",
  });

  function handleFilterChange(partial) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      try {
        setLoading(true);

        const requests = [];

        if (filters.status === "todos" || filters.status === "disponivel") {
          requests.push(
            window.api.item.listarItens(
              1,
              50,
              filters.category || null,
              null,
              "disponivel",
              false,
              { force_ignore_cache: true }
            )
          );
        }

        if (filters.status === "todos" || filters.status === "coletado") {
          requests.push(
            window.api.item.listarItens(
              1,
              50,
              filters.category || null,
              null,
              "coletado",
              false,
              { force_ignore_cache: true }
            )
          );
        }

        const results = await Promise.all(requests);

        if (cancelled) return;

        // merge sem duplicar
        const map = new Map();
        results.flat().forEach((item) => {
          map.set(item.id, item);
        });

        setItems(Array.from(map.values()));
      } catch (err) {
        console.error("Erro ao carregar itens:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 bg-[#090A0D] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Catálogo de itens
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {items.length} itens encontrados
            </p>
          </div>

          {/* BOTÃO FILTROS MOBILE */}
          <button
            onClick={() => setOpenFilters(!openFilters)}
            className="lg:hidden mb-6 w-full h-10 rounded-full border border-white/10 text-sm text-gray-300 hover:text-white"
          >
            Filtrar itens
          </button>

          {/* LAYOUT */}
          <div className="flex gap-10">
            <div className="hidden lg:block">
              <Filters filters={filters} onChange={handleFilterChange} />
            </div>

            <section className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}

                {!loading &&
                  items.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>

              {!loading && items.length === 0 && (
                <p className="text-gray-400 text-sm mt-10">
                  Nenhum item encontrado.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
