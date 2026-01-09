import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { criarItem } from "/jsApiLayer/item.js";
import { uploadImages } from "/jsApiLayer/images.js";
import { useAuth } from "../context/AuthContext";

import CategorySelect from "../components/catalog/CategoryGuide";
import PhotoUploader from "../components/catalog/PhotoUploader";

export default function CatalogarItem() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && !user) return <Navigate to="/auth" />;

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "Metais",
    subcategoria: "",
    condicao: "Bom",
    cep: "",
    endereco: "",
    referencia: "",
  });

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // 🔒 validações alinhadas ao backend
    if (
      !form.titulo ||
      !form.subcategoria ||
      !form.cep ||
      !form.endereco ||
      images.length === 0
    ) {
      alert("Preencha todos os campos obrigatórios e adicione uma imagem.");
      return;
    }

    setSubmitting(true);

    try {
      // 1️⃣ upload
      const url_imagens = await uploadImages(images);

      // 2️⃣ criação do item (100% compatível com o model)
      await criarItem(
        form.titulo,
        form.descricao || null,
        form.categoria,
        form.subcategoria,
        form.condicao,
        form.endereco,
        form.cep,
        form.referencia || null,
        null, // instrucoes_coleta
        url_imagens
      );

      navigate("/catalogo");
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-[#090A0D] min-h-screen pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-4 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Catalogar novo item
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Preencha as informações abaixo para disponibilizar o item
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-[#0F1217] p-6 rounded-2xl border border-white/10"
          >
            {/* título */}
            <input
              name="titulo"
              placeholder="Título do item *"
              value={form.titulo}
              onChange={updateField}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white"
              required
            />

            {/* descrição */}
            <textarea
              name="descricao"
              placeholder="Descrição (opcional)"
              value={form.descricao}
              onChange={updateField}
              rows={3}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white"
            />

            {/* categoria + subcategoria (obrigatória) */}
            <CategorySelect
              value={{
                categoria: form.categoria,
                subcategoria: form.subcategoria,
              }}
              onChange={({ categoria, subcategoria }) =>
                setForm((p) => ({ ...p, categoria, subcategoria }))
              }
            />

            {/* condição */}
            <select
              name="condicao"
              value={form.condicao}
              onChange={updateField}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white"
            >
              <option>Novo</option>
              <option>Bom</option>
              <option>Regular</option>
              <option>Precisa Reparo</option>
            </select>

            {/* imagens */}
            <PhotoUploader images={images} setImages={setImages} />

            {/* cep + endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="cep"
                placeholder="CEP *"
                value={form.cep}
                onChange={updateField}
                className="rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white"
                required
              />

              <input
                name="endereco"
                placeholder="Endereço *"
                value={form.endereco}
                onChange={updateField}
                className="rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white"
                required
              />
            </div>

            {/* referência */}
            <input
              name="referencia"
              placeholder="Ponto de referência (opcional)"
              value={form.referencia}
              onChange={updateField}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white"
            />

            {/* submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-[#0D9488] font-semibold text-black hover:bg-[#0fb9a6] transition disabled:opacity-50"
            >
              {submitting ? "Publicando..." : "Publicar item"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
