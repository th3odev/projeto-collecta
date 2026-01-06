import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="bg-[#090A0D] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white">
          Comece a fazer a diferença hoje
        </h2>

        <p className="mt-4 text-sm text-gray-400 max-w-xl mx-auto">
          Junte-se a milhares de pessoas que já estão transformando o descarte
          irregular em ação ambiental positiva.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/catalogo"
            className="h-[36px] px-6 flex items-center gap-2 rounded-full border border-[#0D9488] bg-[#0A1A1D] text-[#0D9488] text-sm font-medium hover:bg-[#0D9488]/10 transition"
          >
            Explorar
            <span className="text-base">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
