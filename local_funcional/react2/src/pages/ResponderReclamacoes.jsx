import { useState, useEffect } from 'react'
import { listarRelatos, adicionarMensagem } from '/jsApiLayer/relato.js'

function ResponderReclamacoes() {
  const [relatos, setRelatos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [respostas, setRespostas] = useState({})
  const [enviando, setEnviando] = useState(null)

  useEffect(() => {
    carregarRelatos()
  }, [])

  const carregarRelatos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Buscar relatos onde o usuário é o relatado (my_user_only=true busca relatos do usuário)
      const data = await listarRelatos(null, null, true)
      setRelatos(data || [])
    } catch (err) {
      console.error('Erro ao carregar relatos:', err)
      setError(err.message || 'Erro ao carregar relatos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRespostaChange = (id, texto) => {
    setRespostas({
      ...respostas,
      [id]: texto
    })
  }

  const enviarResposta = async (relato_id) => {
    const texto = respostas[relato_id]
    if (!texto || !texto.trim()) {
      alert('Por favor, escreva uma resposta')
      return
    }

    setEnviando(relato_id)
    try {
      await adicionarMensagem(relato_id, texto.trim())
      alert('Resposta enviada com sucesso!')
      setRespostas(prev => ({ ...prev, [relato_id]: '' }))
      await carregarRelatos()
    } catch (err) {
      console.error('Erro ao enviar resposta:', err)
      alert('Erro ao enviar resposta: ' + (err.message || 'Erro desconhecido'))
    } finally {
      setEnviando(null)
    }
  }

  const filtrarPorStatus = (status) => {
    return relatos.filter(r => r.status === status)
  }

  const getStatusBadge = (status) => {
    const styles = {
      aberto: { bg: '#fef3c7', color: '#92400e', text: '⚠️ Pendente' },
      resolvido: { bg: '#d1fae5', color: '#065f46', text: '✅ Resolvido' },
      descartado: { bg: '#f3f4f6', color: '#6b7280', text: '❌ Descartado' }
    }
    const s = styles[status] || styles.aberto
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

  const getTipoLabel = (tipo) => {
    const tipos = {
      nao_encontrado: 'Item não encontrado',
      inapropriado: 'Conteúdo inapropriado',
      mensages_ofensivas: 'Mensagens ofensivas',
      spam: 'Spam',
      outro: 'Outro'
    }
    return tipos[tipo] || tipo
  }

  if (isLoading) {
    return (
      <div>
        <header>
          <h1>💬 Minhas Reclamações</h1>
          <p>Mantenha sua reputação respondendo rapidamente</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>Carregando reclamações...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1>💬 Minhas Reclamações</h1>
          <p>Mantenha sua reputação respondendo rapidamente</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>❌</div>
            <p style={{color: '#dc2626', marginBottom: '1rem'}}>{error}</p>
            <button onClick={carregarRelatos}>🔄 Tentar Novamente</button>
          </div>
        </main>
      </div>
    )
  }

  const pendentes = filtrarPorStatus('aberto')
  const resolvidos = filtrarPorStatus('resolvido')
  const descartados = filtrarPorStatus('descartado')

  return (
    <div>
      <header>
        <h1>💬 Minhas Reclamações</h1>
        <p>Mantenha sua reputação respondendo rapidamente</p>
      </header>

      <main>
        <section>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h2>Status das Reclamações</h2>
            <button onClick={carregarRelatos} style={{background: '#6b7280'}}>🔄 Atualizar</button>
          </div>
          
          <div className="grid">
            <div className="card" style={{borderLeft: '4px solid #f59e0b'}}>
              <h3 style={{fontSize: '2rem', margin: 0}}>{pendentes.length}</h3>
              <p><strong>Pendentes</strong></p>
              <small>Aguardando sua resposta</small>
            </div>

            <div className="card" style={{borderLeft: '4px solid #10b981'}}>
              <h3 style={{fontSize: '2rem', margin: 0}}>{resolvidos.length}</h3>
              <p><strong>Resolvidos</strong></p>
              <small>Fechados com sucesso</small>
            </div>

            <div className="card" style={{borderLeft: '4px solid #6b7280'}}>
              <h3 style={{fontSize: '2rem', margin: 0}}>{descartados.length}</h3>
              <p><strong>Descartados</strong></p>
              <small>Sem procedência</small>
            </div>
          </div>
        </section>

        {/* Reclamações Pendentes */}
        {pendentes.length > 0 && (
          <section>
            <h2>⚠️ Reclamações Pendentes</h2>

            {pendentes.map(relato => (
              <div key={relato.id} className="card" style={{borderLeft: '4px solid #f59e0b', marginBottom: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'}}>
                  <h3 style={{margin: 0}}>Reclamação #{relato.id}</h3>
                  {getStatusBadge(relato.status)}
                </div>

                <div style={{marginTop: '1rem', fontSize: '0.875rem'}}>
                  {relato.item && <p><strong>Item:</strong> {relato.item.titulo || `Item #${relato.item.id}`}</p>}
                  <p><strong>Tipo:</strong> {getTipoLabel(relato.tipo)}</p>
                  <p><strong>Data:</strong> {relato.criado_em ? new Date(relato.criado_em).toLocaleString('pt-BR') : '-'}</p>
                </div>

                <div style={{marginTop: '1rem'}}>
                  <h4 style={{marginBottom: '0.5rem'}}>Descrição:</h4>
                  <blockquote style={{
                    borderLeft: '3px solid #d1d5db',
                    paddingLeft: '1rem',
                    margin: '0.5rem 0',
                    fontStyle: 'italic',
                    color: '#4b5563'
                  }}>
                    "{relato.descricao || 'Sem descrição'}"
                  </blockquote>
                </div>

                {/* Mensagens existentes */}
                {relato.mensagens && relato.mensagens.length > 0 && (
                  <div style={{marginTop: '1rem'}}>
                    <h4>Mensagens:</h4>
                    <div style={{maxHeight: '200px', overflowY: 'auto', background: '#f9fafb', borderRadius: '8px', padding: '1rem'}}>
                      {relato.mensagens.map((msg, idx) => (
                        <div key={idx} style={{
                          marginBottom: '0.75rem',
                          padding: '0.75rem',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                            <strong>{msg.autor?.apelido || 'Usuário'}</strong> - {msg.criado_em ? new Date(msg.criado_em).toLocaleString('pt-BR') : ''}
                          </div>
                          <p style={{margin: 0, fontSize: '0.875rem'}}>{msg.texto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{marginTop: '1rem'}}>
                  <h4>Sua Resposta:</h4>
                  <textarea
                    rows="4"
                    placeholder="Explique a situação e forneça informações adicionais..."
                    value={respostas[relato.id] || ''}
                    onChange={(e) => handleRespostaChange(relato.id, e.target.value)}
                    style={{width: '100%', marginBottom: '0.5rem'}}
                  />
                  
                  <button 
                    onClick={() => enviarResposta(relato.id)}
                    disabled={enviando === relato.id}
                    style={{opacity: enviando === relato.id ? 0.7 : 1}}
                  >
                    {enviando === relato.id ? '⏳ Enviando...' : '📤 Enviar Resposta'}
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Sem pendentes */}
        {pendentes.length === 0 && (
          <section>
            <div className="card" style={{textAlign: 'center', padding: '3rem', background: '#f0fdf4'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✅</div>
              <h3>Nenhuma reclamação pendente!</h3>
              <p style={{color: '#6b7280'}}>Você está em dia com suas respostas.</p>
            </div>
          </section>
        )}

        {/* Histórico (resolvidos + descartados) */}
        {(resolvidos.length > 0 || descartados.length > 0) && (
          <section>
            <h2>📋 Histórico</h2>
            
            {[...resolvidos, ...descartados].map(relato => (
              <div key={relato.id} className="card" style={{
                borderLeft: `4px solid ${relato.status === 'resolvido' ? '#10b981' : '#6b7280'}`,
                marginBottom: '1rem',
                opacity: 0.8
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span><strong>#{relato.id}</strong> - {getTipoLabel(relato.tipo)}</span>
                  {getStatusBadge(relato.status)}
                </div>
                <p style={{margin: '0.5rem 0', fontSize: '0.875rem', color: '#6b7280'}}>
                  {relato.descricao?.substring(0, 100)}...
                </p>
                {relato.notas_resolucao && (
                  <p style={{margin: 0, fontSize: '0.75rem', color: '#059669'}}>
                    <strong>Resolução:</strong> {relato.notas_resolucao}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Dicas */}
        <section style={{marginTop: '2rem'}}>
          <h2>💡 Dicas para Manter Sua Boa Reputação</h2>
          <div className="card" style={{padding: '1.5rem'}}>
            <ul style={{margin: 0, paddingLeft: '1.5rem', lineHeight: '2'}}>
              <li>✅ Responda reclamações em até 24 horas</li>
              <li>✅ Seja educado e compreensivo</li>
              <li>✅ Reconheça erros quando houver</li>
              <li>✅ Forneça informações claras e atualizadas</li>
              <li>✅ Ofereça soluções práticas</li>
              <li>✅ Mantenha seus itens atualizados</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ResponderReclamacoes