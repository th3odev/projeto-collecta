import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarResgates } from '/jsApiLayer/logs.js'

function MinhasRecompensas() {
  const [resgates, setResgates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    carregarResgates()
  }, [])

  const carregarResgates = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listarResgates(null, true)
      setResgates(data || [])
    } catch (err) {
      console.error('Erro ao carregar resgates:', err)
      setError(err.message || 'Erro ao carregar resgates')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pendente: { bg: '#fef3c7', color: '#92400e', text: '⏳ Pendente' },
      entregue: { bg: '#d1fae5', color: '#065f46', text: '✅ Entregue' },
      usado: { bg: '#dbeafe', color: '#1e40af', text: '✔️ Usado' },
      cancelado: { bg: '#fee2e2', color: '#991b1b', text: '❌ Cancelado' }
    }
    const s = styles[status] || styles.pendente
    return (
      <span style={{
        background: s.bg,
        color: s.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        {s.text}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div>
        <header>
          <h1>🎁 Minhas Recompensas</h1>
          <p>Histórico de trocas realizadas</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>Carregando suas recompensas...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1>🎁 Minhas Recompensas</h1>
          <p>Histórico de trocas realizadas</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>❌</div>
            <p style={{color: '#dc2626', marginBottom: '1rem'}}>{error}</p>
            <button onClick={carregarResgates}>🔄 Tentar Novamente</button>
          </div>
        </main>
      </div>
    )
  }

  const totalPontosGastos = resgates.reduce((sum, r) => sum + (r.recompensa?.custo_pontos || 0), 0)
  const pendentes = resgates.filter(r => r.status === 'pendente').length

  return (
    <div>
      <header>
        <h1>🎁 Minhas Recompensas</h1>
        <p>Histórico de trocas realizadas</p>
      </header>

      <main>
        <section>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h2>Recompensas Trocadas</h2>
            <button onClick={carregarResgates} style={{background: '#6b7280'}}>🔄 Atualizar</button>
          </div>

          {resgates.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
              <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📭</div>
              <h3>Nenhuma recompensa resgatada ainda</h3>
              <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>
                Troque seus pontos por recompensas incríveis!
              </p>
              <Link to="/recompensas">
                <button>🎁 Ver Recompensas Disponíveis</button>
              </Link>
            </div>
          ) : (
            <div className="card" style={{overflow: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                    <th style={{textAlign: 'left', padding: '0.75rem'}}>Data</th>
                    <th style={{textAlign: 'left', padding: '0.75rem'}}>Recompensa</th>
                    <th style={{textAlign: 'right', padding: '0.75rem'}}>Pontos</th>
                    <th style={{textAlign: 'center', padding: '0.75rem'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resgates.map(r => (
                    <tr key={r.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                      <td style={{padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {r.criado_em ? new Date(r.criado_em).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td style={{padding: '0.75rem'}}>
                        <strong>{r.recompensa?.titulo || 'Recompensa'}</strong>
                        {r.recompensa?.descricao && (
                          <p style={{margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280'}}>
                            {r.recompensa.descricao}
                          </p>
                        )}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: '#ef4444'
                      }}>
                        -{r.recompensa?.custo_pontos || 0}
                      </td>
                      <td style={{padding: '0.75rem', textAlign: 'center'}}>
                        {getStatusBadge(r.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {resgates.length > 0 && (
          <section style={{marginTop: '2rem'}}>
            <h2>Resumo</h2>
            <div className="grid">
              <div className="card">
                <h4>Total de Trocas</h4>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0.5rem 0'}}>
                  {resgates.length}
                </p>
              </div>
              <div className="card">
                <h4>Pontos Gastos</h4>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', margin: '0.5rem 0'}}>
                  {totalPontosGastos}
                </p>
              </div>
              <div className="card">
                <h4>Pendentes</h4>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0.5rem 0'}}>
                  {pendentes}
                </p>
              </div>
            </div>
          </section>
        )}

        <section style={{marginTop: '2rem', textAlign: 'center'}}>
          <Link to="/recompensas">
            <button>🎁 Ver Mais Recompensas</button>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default MinhasRecompensas