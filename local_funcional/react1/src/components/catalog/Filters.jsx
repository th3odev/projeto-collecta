export default function Filters({ filters, onChange }) {
  return (
    <aside className="w-full md:w-[260px] rounded-xl border border-white/10 bg-[#0F1217] p-5 space-y-5">
      {/* buscar (em breve) */}
      <div className="space-y-1 opacity-50 cursor-not-allowed">
        <label className="text-xs text-gray-400">Buscar</label>
        <input
          disabled
          placeholder="Em breve disponível"
          title="Em breve disponível"
          className="w-full h-9 px-3 rounded-md bg-[#0A0C10] border border-white/10 text-sm text-gray-500"
        />
      </div>

      {/* categoria */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Categoria</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full h-9 px-3 rounded-md bg-[#0A0C10] border border-white/10 text-sm text-gray-400 focus:outline-none focus:border-[#0D9488]"
        >
          <option value="">Todas as categorias</option>
          <option value="metais">Metais</option>
          <option value="papel">Papel</option>
          <option value="plastico">Plástico</option>
          <option value="vidro">Vidro</option>
          <option value="eletronicos">Eletrônicos</option>
        </select>
      </div>

      {/* distância (em breve) */}
      <div className="space-y-2 opacity-50 cursor-not-allowed">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Distância</span>
          <span className="text-[#0D9488]">—</span>
        </div>

        <input disabled type="range" className="w-full accent-[#0D9488]" />

        <div className="flex justify-between text-[10px] text-gray-500">
          <span>1km</span>
          <span>50km</span>
        </div>
      </div>

      {/* status */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="w-full h-9 px-3 rounded-md bg-[#0A0C10] border border-white/10 text-sm text-gray-400 focus:outline-none focus:border-[#0D9488]"
        >
          <option value="todos">Todos</option>
          <option value="disponivel">Disponível</option>
          <option value="coletado">Coletado</option>
        </select>
      </div>
    </aside>
  );
}
