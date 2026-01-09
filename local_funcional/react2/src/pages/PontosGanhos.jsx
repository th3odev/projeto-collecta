import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarTransacoes } from '/jsApiLayer/logs.js'
import { getMe } from '/jsApiLayer/user.js'

function PontosGanhos() {
  const [transacoes, setTransacoes] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [transacoesData, userData] = await Promise.all([
        listarTransacoes(null, true),
        getMe()
      ])
      setTransacoes(transacoesData || [])
      setUsuario(userData)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const filtrarTransacoes = () => {
    if (filtro === 'todos') return transacoes
    
    const agora = new Date()
    const umaSemana = 7 * 24 * 60 * 60 * 1000
    const umMes = 30 * 24 * 60 * 60 * 1000
    const umAno = 365 * 24 * 60 * 60 * 1000

    return transacoes.filter(t => {
      const data = new Date(t.criado_em)
      const diff = agora - data
      
      if (filtro === 'semana') return diff <= umaSemana
      if (filtro === 'mes') return diff <= umMes
      if (filtro === 'ano') return diff <= umAno
      return true
    })
  }

  const calcularPontosPeriodo = (dias) => {
    const agora = new Date()
    const limite = dias * 24 * 60 * 60 * 1000
    
    return transacoes
      .filter(t => (agora - new Date(t.criado_em)) <= limite)
      .reduce((sum, t) => sum + t.quantidade, 0)
  }

  const getMotivoLabel = (motivo) => {
    const labels = {
      'coleta_item': '📦 Item Coletado',
      'item_coletado': '✅ Seu item foi coletado',
      'adicao_admin': '➕ Adição pelo Admin',
      'remocao_admin': '➖ Remoção pelo Admin',
      'resgate_recompensa': '🎁 Resgate de Recompensa',
      'penalidade': '⚠️ Penalidade'
    }
    return labels[motivo] || motivo
  }

  if (isLoading) {
    return (
      <div>
        <header>
          <h1>🏆 Meus Pontos</h1>
          <p>Acompanhe seu impacto e suas conquistas</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>Carregando seus pontos...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1>🏆 Meus Pontos</h1>
          <p>Acompanhe seu impacto e suas conquistas</p>
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

  const transacoesFiltradas = filtrarTransacoes()
  const pontosSemana = calcularPontosPeriodo(7)
  const pontosMes = calcularPontosPeriodo(30)

  return (
    <div>
      <header>
        <h1>🏆 Meus Pontos</h1>
        <p>Acompanhe seu impacto e suas conquistas</p>
      </header>

      <main>
        {/* Resumo Geral */}
        <section>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h2>Resumo</h2>
            <button onClick={carregarDados} style={{background: '#6b7280'}}>🔄 Atualizar</button>
          </div>
          
          <div className="destaque-pontos" style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{margin: 0, fontSize: '1rem', opacity: 0.9}}>Total de Pontos</h3>
            <p style={{margin: '0.5rem 0', fontSize: '3rem', fontWeight: 'bold'}}>
              {usuario?.pontos_atuais || 0} pontos
            </p>
          </div>

          <div className="grid">
            <div className="card">
              <h4>Pontos Este Mês</h4>
              <p className="numero-grande" style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>
                {pontosMes >= 0 ? '+' : ''}{pontosMes}
              </p>
            </div>

            <div className="card">
              <h4>Pontos Esta Semana</h4>
              <p className="numero-grande" style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>
                {pontosSemana >= 0 ? '+' : ''}{pontosSemana}
              </p>
            </div>

            <div className="card">
              <h4>Total de Transações</h4>
              <p className="numero-grande" style={{fontSize: '2rem', fontWeight: 'bold', color: '#6b7280'}}>
                {transacoes.length}
              </p>
            </div>
          </div>
        </section>

        {/* Histórico */}
        <section style={{marginTop: '2rem'}}>
          <h2>Histórico de Pontos</h2>
          
          <div style={{marginBottom: '1rem'}}>
            <label>
              Período: {' '}
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="semana">Última Semana</option>
                <option value="mes">Último Mês</option>
                <option value="ano">Último Ano</option>
              </select>
            </label>
          </div>

          {transacoesFiltradas.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
              <p style={{color: '#6b7280'}}>Nenhuma transação encontrada neste período.</p>
            </div>
          ) : (
            <div className="card" style={{overflow: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                    <th style={{textAlign: 'left', padding: '0.75rem'}}>Data</th>
                    <th style={{textAlign: 'left', padding: '0.75rem'}}>Descrição</th>
                    <th style={{textAlign: 'right', padding: '0.75rem'}}>Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoesFiltradas.map(t => (
                    <tr key={t.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                      <td style={{padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {t.criado_em ? new Date(t.criado_em).toLocaleString('pt-BR') : '-'}
                      </td>
                      <td style={{padding: '0.75rem'}}>
                        <strong>{getMotivoLabel(t.motivo)}</strong>
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: t.quantidade > 0 ? '#10b981' : '#ef4444'
                      }}>
                        {t.quantidade > 0 ? '+' : ''}{t.quantidade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Ações */}
        <section style={{marginTop: '2rem', textAlign: 'center'}}>
          <Link to="/recompensas">
            <button>🎁 Ver Recompensas Disponíveis</button>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default PontosGanhos