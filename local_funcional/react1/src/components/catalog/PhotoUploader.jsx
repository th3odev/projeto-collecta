export default function PhotoUploader({ images, setImages }) {
  function handleFiles(files) {
    setImages((prev) => [...prev, ...Array.from(files)]);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-gray-400">Fotos do item</label>

      {/* Upload box */}
      <label className="flex flex-col items-center justify-center h-36 rounded-xl border border-dashed border-white/20 cursor-pointer hover:border-[#0D9488] transition bg-black/30">
        <span className="text-sm text-gray-300">
          Clique para adicionar imagens
        </span>
        <span className="text-xs text-gray-500 mt-1">
          JPG ou PNG • mínimo 1 imagem de até 50mb
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative h-24 rounded-lg overflow-hidden border border-white/10 group"
            >
              <img
                src={URL.createObjectURL(img)}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white text-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-red-500"
                title="Remover imagem"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
