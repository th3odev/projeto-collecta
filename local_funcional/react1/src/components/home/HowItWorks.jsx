export default function HowItWorks() {
  return (
    <section className="bg-[#090A0D] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Como funciona</h2>
          <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
            Um processo simples e transparente para transformar suas ações em
            impacto mensurável
          </p>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 01 */}
          <div className="rounded-xl border border-white/10 bg-[#0F1217] p-6">
            <span className="text-3xl font-bold text-[#0D9488]">01</span>

            <h3 className="mt-4 text-base font-semibold text-white">
              Encontre itens
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Navegue pelo catálogo e encontre itens descartados próximos a você
            </p>
          </div>

          {/* card 02 */}
          <div className="rounded-xl border border-white/10 bg-[#0F1217] p-6">
            <span className="text-3xl font-bold text-[#0D9488]">02</span>

            <h3 className="mt-4 text-base font-semibold text-white">
              Colete e registre itens
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Vá até o local, colete o item e registre a ação na plataforma
            </p>
          </div>

          {/* card 03 */}
          <div className="rounded-xl border border-white/10 bg-[#0F1217] p-6">
            <span className="text-3xl font-bold text-[#0D9488]">03</span>

            <h3 className="mt-4 text-base font-semibold text-white">
              Acumule estrelas
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Ganhe estrelas por cada coleta e evolua seu nível
            </p>
          </div>

          {/* card 04 */}
          <div className="rounded-xl border border-white/10 bg-[#0F1217] p-6">
            <span className="text-3xl font-bold text-[#0D9488]">04</span>

            <h3 className="mt-4 text-base font-semibold text-white">
              Troque por recompensas
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Use suas estrelas para resgatar produtos e experiências
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
