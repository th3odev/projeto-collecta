import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CATEGORIES = ["Móveis", "Brinquedos", "Eletrônicos", "Esportes", "Roupas", "Livros"]
const STATUS = ["disponível", "reservado", "resgatado", "expirado"]

function Badge({ children, tone = "brand" }) {
  const styles = {
    brand: "bg-green-50 text-green-700 border-green-200",
    ocean: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-gray-50 text-gray-700 border-gray-200",
  }
  
  return (
    <span className={`inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-semibold ${styles[tone] || styles.slate}`}>
      {children}
    </span>
  )
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border-2 border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-gray-600">{label}</div>
      {children}
    </label>
  )
}

function HomeNova() {
  const navigate = useNavigate()
  
  // Verificar se está autenticado
  const [user] = useState(() => {
    const userData = localStorage.getItem('user')
    return userData ? userData : null
  })

  // Geolocalização (browser)
  const [geo, setGeo] = useState({
    supported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    loading: false,
    lat: null,
    lon: null,
    accuracy: null,
    address: "",
    error: "",
  })

  async function reverseGeocode(lat, lon) {
    // Nominatim (OpenStreetMap) — melhor esforço (pode falhar por rede/CORS/limites)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
      if (!res.ok) throw new Error('Falha no reverse geocode')
      const data = await res.json()
      return data?.display_name || ""
    } catch {
      return ""
    }
  }

  async function requestGeolocation({ autoFill = false } = {}) {
    if (!geo.supported) {
      setGeo((p) => ({ ...p, error: 'Geolocalização não é suportada neste navegador/dispositivo.' }))
      return
    }

    setGeo((p) => ({ ...p, loading: true, error: "" }))

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        const accuracy = pos.coords.accuracy

        const address = await reverseGeocode(lat, lon)

        setGeo((p) => ({
          ...p,
          loading: false,
          lat,
          lon,
          accuracy,
          address,
          error: "",
        }))

        if (autoFill) {
          const value = address?.trim() ? address : `Lat ${lat.toFixed(6)}, Lon ${lon.toFixed(6)}`
          setForm((p) => ({ ...p, location: value }))
        }
      },
      (err) => {
        const msg =
          err?.code === 1 ? 'Permissão de localização negada.' :
          err?.code === 2 ? 'Não foi possível obter sua localização.' :
          'Tempo esgotado ao obter localização.'

        setGeo((p) => ({ ...p, loading: false, error: msg }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  // Não chama nada automaticamente — evita prompt de permissão ao abrir a Home
  useEffect(() => {}, [])


  const [items, setItems] = useState(() => ([
    {
      id: 1,
      title: "Cadeira de escritório",
      category: "Móveis",
      status: "disponível",
      createdAt: new Date().toISOString(),
      pointsEarned: 0,
    },
    {
      id: 2,
      title: "Halteres 5kg (par)",
      category: "Esportes",
      status: "resgatado",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      pointsEarned: 25,
    },
  ]))

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    status: "disponível",
    description: "",
    location: "",
  })

  const pointsTotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.pointsEarned || 0), 0),
    [items]
  )

  function onSubmit(e) {
    e.preventDefault()
    const next = {
      id: Date.now(),
      title: form.title.trim() || "Item sem título",
      category: form.category,
      status: form.status,
      createdAt: new Date().toISOString(),
      pointsEarned: 0,
    }
    setItems((prev) => [next, ...prev])
    setForm((p) => ({ ...p, title: "", description: "", location: "" }))
    alert('Item cadastrado com sucesso!')
  }

  function handleLogout() {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return (
      <div style={{minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
        <Card className="p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-4">🔐 Acesso Restrito</h1>
          <p className="text-gray-700 mb-6">
            Para ver seus itens e pontos, você precisa fazer login.
          </p>
          <Link to="/login">
            <button className="w-full rounded-xl border-2 border-gray-900 bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:opacity-95">
              Fazer Login
            </button>
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Cadastre-se
            </Link>
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb'}}>
      <header style={{
        background: 'white',
        borderBottom: '2px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <div style={{
            height: '40px',
            width: '40px',
            background: '#10b981',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            🌱
          </div>
          <div>
            <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>Caça Verde</div>
            <div style={{fontSize: '0.75rem', color: '#6b7280'}}>Olá, {user.name || user.email}!</div>
          </div>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <div style={{
            background: '#fef3c7',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{fontSize: '1.2rem'}}>🏆</span>
            <span style={{fontWeight: 'bold', color: '#92400e'}}>{pointsTotal} pts</span>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        <div className="space-y-6">
          {/* Cabeçalho do usuário */}
          <Card className="p-7">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge>Home</Badge>
              <Badge tone="ocean">Meu painel</Badge>
              {/* Geolocalização */}
            <div className="mb-4 rounded-2xl border-2 border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-600">Minha localização</div>
                  <div className="mt-1 text-sm text-gray-800">
                    {!geo.supported && (
                      <span className="text-gray-600">Geolocalização não suportada neste navegador.</span>
                    )}
                    {geo.supported && geo.loading && (
                      <span className="text-gray-600">Obtendo localização…</span>
                    )}
                    {geo.supported && !geo.loading && geo.error && (
                      <span className="text-red-600">{geo.error}</span>
                    )}
                    {geo.supported && !geo.loading && !geo.error && geo.lat != null && geo.lon != null && (
                      <span>
                        {geo.address?.trim()
                          ? geo.address
                          : `Lat ${geo.lat.toFixed(6)}, Lon ${geo.lon.toFixed(6)}`}
                        {geo.accuracy != null ? (
                          <span className="text-xs text-gray-500"> — ±{Math.round(geo.accuracy)}m</span>
                        ) : null}
                      </span>
                    )}
                    {geo.supported && !geo.loading && !geo.error && geo.lat == null && (
                      <span className="text-gray-600">Clique para permitir e carregar sua localização.</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => requestGeolocation({ autoFill: false })}
                    className="rounded-2xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    disabled={!geo.supported || geo.loading}
                  >
                    📍 Atualizar
                  </button>
                  <button
                    type="button"
                    onClick={() => requestGeolocation({ autoFill: true })}
                    className="rounded-2xl border-2 border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    disabled={!geo.supported || geo.loading}
                  >
                    Usar no cadastro
                  </button>
                </div>
              </div>
            </div>

            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-600">Meus itens</div>
                <div className="mt-1 text-2xl font-semibold">{items.length}</div>
              </div>
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-600">Pontos ganhos</div>
                <div className="mt-1 text-2xl font-semibold">{pointsTotal}</div>
              </div>
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-600">Status</div>
                <div className="mt-1 text-sm font-semibold">Protótipo local</div>
              </div>
            </div>
          </Card>

          {/* Cadastrar item */}
          <Card className="p-7">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Cadastrar item</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Cadastro rápido para publicação.
                </p>
              </div>
              <Badge tone="brand">Publicação</Badge>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <Field label="Título">
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
                  placeholder="Ex.: Sofá 3 lugares"
                />
              </Field>

              <Field label="Categoria">
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Localização (endereço / referência)">
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
                  placeholder="Ex.: Rua X, nº Y — Portaria"
                />
              </Field>

              <Field label="Descrição" className="md:col-span-2">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
                  placeholder="Detalhes que ajudam no resgate (estado, observações)."
                />
              </Field>

              <div className="md:col-span-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="rounded-2xl border-2 border-emerald-600 bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  Salvar item
                </button>
              </div>
            </form>
          </Card>

          {/* Meus itens */}
          <Card className="p-7">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Meus itens</h2>
              <Badge tone="ocean">Lista</Badge>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 border-gray-200">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                <div className="col-span-5">Item</div>
                <div className="col-span-3">Categoria</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Pontos</div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((it) => (
                  <div key={it.id} className="grid grid-cols-12 items-center px-4 py-4">
                    <div className="col-span-5">
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(it.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-gray-700">{it.category}</div>
                    <div className="col-span-2">
                      <span className="rounded-full border-2 border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        {it.status}
                      </span>
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold">
                      {it.pointsEarned || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default HomeNova