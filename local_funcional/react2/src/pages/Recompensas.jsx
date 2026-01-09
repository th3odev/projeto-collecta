import { useState, useEffect } from 'react'
import { listarRecompensas, resgatarRecompensa } from '/jsApiLayer/recompensa.js'
import { getMe } from '/jsApiLayer/user.js'

function Recompensas() {
  const [recompensas, setRecompensas] = useState([])
  const [pontosUsuario, setPontosUsuario] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resgatando, setResgatando] = useState(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Carregar recompensas e dados do usuário em paralelo
      const [recompensasData, userData] = await Promise.all([
        listarRecompensas(1, 50),
        getMe()
      ])
      
      setRecompensas(recompensasData.recompensas || recompensasData || [])
      setPontosUsuario(userData.pontos_atuais || 0)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const trocarPontos = async (recompensa) => {
    if (pontosUsuario < recompensa.custo_pontos) {
      alert(`Você precisa de ${recompensa.custo_pontos - pontosUsuario} pontos a mais`)
      return
    }

    if (!confirm(`Deseja trocar ${recompensa.custo_pontos} pontos por "${recompensa.titulo}"?`)) {
      return
    }

    setResgatando(recompensa.id)
    try {
      await resgatarRecompensa(recompensa.id)
      alert(`Parabéns! Você trocou ${recompensa.custo_pontos} pontos por: ${recompensa.titulo}!`)
      // Recarregar dados para atualizar pontos
      await carregarDados()
    } catch (err) {
      console.error('Erro ao resgatar recompensa:', err)
      alert('Erro ao resgatar recompensa: ' + (err.message || 'Erro desconhecido'))
    } finally {
      setResgatando(null)
    }
  }

  // Função para obter URL da imagem
  const getImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http') || url.startsWith('data:')) return url
    if (!url.startsWith('/images/'))    return `/images/${url}`
    return `${url}`
  }

  if (isLoading) {
    return (
      <div>
        <header>
          <h1>🎁 Catálogo de Recompensas</h1>
          <p>Troque seus pontos por prêmios incríveis</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>Carregando recompensas...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1>🎁 Catálogo de Recompensas</h1>
          <p>Troque seus pontos por prêmios incríveis</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>❌</div>
            <p style={{color: '#dc2626', marginBottom: '1rem'}}>{error}</p>
            <button onClick={carregarDados}>🔄 Tentar Novamente</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h1>🎁 Catálogo de Recompensas</h1>
        <p>Troque seus pontos por prêmios incríveis</p>
      </header>

      <main>
        <section>
          <div className="destaque-pontos" style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h3 style={{margin: 0, fontSize: '1rem', opacity: 0.9}}>Seus Pontos Disponíveis</h3>
            <p style={{margin: '0.5rem 0 0', fontSize: '3rem', fontWeight: 'bold'}}>{pontosUsuario} pontos</p>
          </div>
        </section>

        <section>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h2>Recompensas Disponíveis</h2>
            <button onClick={carregarDados} style={{background: '#6b7280'}}>🔄 Atualizar</button>
          </div>

          {recompensas.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
              <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📭</div>
              <h3>Nenhuma recompensa disponível</h3>
              <p style={{color: '#6b7280'}}>Novas recompensas serão adicionadas em breve!</p>
            </div>
          ) : (
            <div className="grid">
              {recompensas.map(rec => (
                <div key={rec.id} className="card" style={{overflow: 'hidden'}}>
                  {/* Imagem da recompensa */}
                  {rec.url_imagens && rec.url_imagens.length > 0 ? (
                    <div style={{
                      width: '100%',
                      height: '150px',
                      overflow: 'hidden',
                      background: '#f3f4f6'
                    }}>
                      <img 
                        src={getImageUrl(rec.url_imagens[0])} 
                        alt={rec.titulo}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '4rem',
                      textAlign: 'center',
                      padding: '1.5rem',
                      background: '#f0fdf4'
                    }}>
                      🎁
                    </div>
                  )}
                  
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{marginBottom: '0.5rem'}}>{rec.titulo}</h3>
                    {rec.descricao && (
                      <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem'}}>{rec.descricao}</p>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        fontWeight: 'bold',
                        color: '#10b981',
                        fontSize: '1.25rem'
                      }}>
                        {rec.custo_pontos} pontos
                      </span>
                      {rec.quantidade_disponivel !== undefined && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          background: '#f3f4f6',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '999px'
                        }}>
                          {rec.quantidade_disponivel} disponíveis
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => trocarPontos(rec)}
                      disabled={pontosUsuario < rec.custo_pontos || resgatando === rec.id}
                      style={{
                        width: '100%',
                        opacity: (pontosUsuario < rec.custo_pontos || resgatando === rec.id) ? 0.6 : 1,
                        background: pontosUsuario >= rec.custo_pontos ? '#10b981' : '#9ca3af'
                      }}
                    >
                      {resgatando === rec.id 
                        ? '⏳ Resgatando...' 
                        : pontosUsuario >= rec.custo_pontos 
                          ? 'Trocar Agora' 
                          : `Faltam ${rec.custo_pontos - pontosUsuario} pts`
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{marginTop: '2rem'}}>
          <h2>Como Funciona</h2>
          <div className="card" style={{padding: '1.5rem'}}>
            <ol style={{margin: 0, paddingLeft: '1.5rem', lineHeight: '2'}}>
              <li>Escolha a recompensa desejada</li>
              <li>Clique em "Trocar Agora"</li>
              <li>Seus pontos serão debitados automaticamente</li>
              <li>Você receberá o voucher por email</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Recompensas