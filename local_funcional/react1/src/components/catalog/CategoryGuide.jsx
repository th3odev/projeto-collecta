export const CATEGORIES = {
  Metais: ["Ferro", "Alumínio", "Cobre", "Inox", "Outros"],
  Plásticos: ["PET", "PVC", "PP", "PS", "PEAD", "Outros"],
  "Papel/Papelão": ["Caixas", "Branco", "Jornais", "Revestido"],
  Eletrônicos: ["TV", "Computador", "Celular", "Outros"],
  Vidros: ["Vidro comum"],
  Madeiras: ["Bruta", "Processada"],
};

export default function CategoryGuide({ value, onChange }) {
  const { categoria, subcategoria } = value;

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Categoria</label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#0D9488]"
          value={categoria}
          onChange={(e) =>
            onChange({
              categoria: e.target.value,
              subcategoria: "",
            })
          }
        >
          {Object.keys(CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#0D9488]"
          value={subcategoria}
          onChange={(e) =>
            onChange({
              categoria,
              subcategoria: e.target.value,
            })
          }
        >
          <option value="">Subcategoria</option>
          {CATEGORIES[categoria]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
