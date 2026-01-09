export default function ProfileLevel() {
  return (
    <div className="bg-[#0F1217] border border-white/10 rounded-xl p-5 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center text-white font-semibold">
          1
        </div>

        <div>
          <p className="text-sm text-white font-medium">Nível 1 </p>
          <p className="text-xs text-gray-400">
            Nível 1 a 10 (Em breve implementação completa)
          </p>
        </div>
      </div>

      {/* barra */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-[10%] bg-[#0D9488]" />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        1000 estrelas para o próximo nível
      </p>
    </div>
  );
}
