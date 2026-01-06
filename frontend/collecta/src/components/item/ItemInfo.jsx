export default function ItemInfo({ item }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1217] p-6 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300">Descrição:</h3>
        <p className="mt-1 text-sm text-gray-400">
          {item.descricao || "Sem descrição"}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300">Localização:</h3>
        <p className="mt-1 text-sm text-gray-400">
          {item.endereco} – {item.cep}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300">Categoria:</h3>
        <p className="mt-1 text-sm text-gray-400">
          {item.categoria} • {item.subcategoria}
        </p>
      </div>
    </div>
  );
}
