import leafIcon from "../../assets/icons/nest_eco_leaf.svg";

export default function Hero() {
  return (
    <section className="relative min-h-[64vh] flex items-center bg-gradient-to-b from-[#0A1316] to-[#0A0C10]">
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Transforme coleta em <br />
          <span className="text-[#0D9488]">impacto ambiental</span>
        </h1>

        <p className="mt-6 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Conectamos pessoas comprometidas com ações reais de recolhimento de
          itens descartados, oferecendo reconhecimento através de um sistema de
          pontos confiável.
        </p>

        <div className="mt-10 flex justify-center">
          <button className="h-[36px] px-6 flex items-center gap-2 rounded-full border border-[#0D9488] bg-[#0A0C10] text-[#0D9488] text-sm font-medium hover:bg-[#0D9488]/10 transition">
            <img src={leafIcon} alt="" className="h-4 w-4" />
            Plataforma de coleta sustentável
          </button>
        </div>
      </div>
    </section>
  );
}
