import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react'

const FEED = [
  {
    tag: "Sustentabilidade",
    title: "Menos descarte, mais reuso",
    desc: "Itens em bom estado circulando reduzem resíduos e consumo de novos recursos.",
  },
  {
    tag: "Comunidade",
    title: "Rede local de reaproveitamento",
    desc: "Publicações por proximidade facilitam resgate rápido e evitam desperdício.",
  },
  {
    tag: "Transparência",
    title: "Status e histórico",
    desc: "Disponível, reservado, resgatado e expirado — rastreio simples e claro.",
  },
  {
    tag: "ESG",
    title: "Impacto mensurável",
    desc: "Pontuação e registros permitem medir participação e resultados ao longo do tempo.",
  },
  {
    tag: "Boas práticas",
    title: "Segurança e confiança",
    desc: "Regras para conflitos e denúncias reforçam o uso responsável da plataforma.",
  },
]

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

function FeedCard({ item }) {
  return (
    <div className="w-[360px] shrink-0 rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Badge tone="ocean">{item.tag}</Badge>
      </div>
      <div className="mt-3 text-lg font-semibold tracking-tight">{item.title}</div>
      <div className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</div>
    </div>
  )
}

function useAutoCarousel({ intervalMs = 2200 } = {}) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)
  const count = FEED.length

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let timer = 0

    const scrollToIndex = (i) => {
      const child = el.children?.[i]
      if (!child) return
      const left = child.offsetLeft
      el.scrollTo({ left, behavior: "smooth" })
    }

    const tick = () => {
      setIndex((prev) => {
        const next = (prev + 1) % count

        if (next === 0) {
          el.scrollTo({ left: 0, behavior: "auto" })
          raf = requestAnimationFrame(() => {
            scrollToIndex(0)
          })
        } else {
          scrollToIndex(next)
        }
        return next
      })
    }

    timer = setInterval(tick, intervalMs)

    const onMouseEnter = () => clearInterval(timer)
    const onMouseLeave = () => (timer = setInterval(tick, intervalMs))

    el.addEventListener("mouseenter", onMouseEnter)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      clearInterval(timer)
      cancelAnimationFrame(raf)
      el.removeEventListener("mouseenter", onMouseEnter)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [count, intervalMs])

  return { ref, index, setIndex }
}

function ApresentacaoNova() {
  const { ref, index, setIndex } = useAutoCarousel({ intervalMs: 2100 })
  const dots = useMemo(() => Array.from({ length: FEED.length }, (_, i) => i), [])

  return (
    <div>
      <header style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
          🌱 Caça Verde
        </h1>
        <p style={{fontSize: '1.1rem', opacity: 0.9}}>
          Transformando Resíduos em Oportunidades
        </p>
      </header>

      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Novo Destino</Badge>
              <Badge tone="ocean">Rastreio</Badge>
              <Badge tone="slate">Pontos</Badge>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Reuso inteligente, com rastreio e pontos
            </h1>

            <p className="mt-3 max-w-3xl text-gray-700">
              Rede de catalogação e resgate de itens com localização, status e pontuação.
              O foco é manter clareza de fluxo e incentivar reuso com uma experiência leve.
            </p>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Feed de notícias e atualizações</h2>
                <span className="text-xs text-gray-500">passando automaticamente</span>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

                <div
                  ref={ref}
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
                  style={{scrollbarWidth: 'thin'}}
                >
                  {FEED.map((i) => (
                    <div key={i.title} className="snap-start">
                      <FeedCard item={i} />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  {dots.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        const el = ref.current
                        const child = el?.children?.[d]
                        if (el && child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" })
                        setIndex(d)
                      }}
                      className={
                        "h-2.5 w-2.5 rounded-full border-2 transition " +
                        (d === index ? "border-gray-900 bg-gray-900" : "border-gray-200 bg-white")
                      }
                      aria-label={`Ir para card ${d + 1}`}
                      title={`Card ${d + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-600">Publicação</div>
                <div className="mt-1 text-sm font-semibold">Foto + dados + localização</div>
              </div>
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-600">Resgate</div>
                <div className="mt-1 text-sm font-semibold">Confirmação e status</div>
              </div>
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-600">Pontos</div>
                <div className="mt-1 text-sm font-semibold">Registro e troca</div>
              </div>
            </div>
          </Card>

          <section className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">📸</div>
                <h3 className="font-bold mb-2">1. Catalogue um Item</h3>
                <p className="text-sm text-gray-600">
                  Tire foto de algo que você quer doar
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="font-bold mb-2">2. Alguém Coleta</h3>
                <p className="text-sm text-gray-600">
                  Outra pessoa vê seu item no mapa
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-bold mb-2">3. Você Ganha Pontos</h3>
                <p className="text-sm text-gray-600">
                  Receba pontos automaticamente
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="font-bold mb-2">4. Troque por Recompensas</h3>
                <p className="text-sm text-gray-600">
                  Use pontos para ganhar prêmios
                </p>
              </Card>
            </div>
          </section>

          <section className="text-center py-8">
            <h2 className="text-2xl font-bold mb-6">Pronto para começar?</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login">
                <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg">
                  🔐 Fazer Login
                </button>
              </Link>
              <Link to="/cadastro">
                <button className="px-8 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                  📝 Criar Conta
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ApresentacaoNova
