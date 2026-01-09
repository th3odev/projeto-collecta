import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarItens, deletarItem } from '/jsApiLayer/item.js'

function MeusItens() {
  const [itens, setItens] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fotoSelecionada, setFotoSelecionada] = useState(null)
  const [deletando, setDeletando] = useState(null)

  useEffect(() => {
    carregarItens()
  }, [])

  const carregarItens = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Buscar itens do usuário logado (my_items = true)
      const data = await listarItens(1, 50, null, null, 'disponivel', true)
      setItens(data)
    } catch (err) {
      console.error('Erro ao carregar itens:', err)
      setError(err.message || 'Erro ao carregar itens')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletar = async (id) => {
    if (!confirm('Deseja realmente remover este item?')) return
    
    setDeletando(id)
    try {
      await deletarItem(id)
      setItens(prev => prev.filter(item => item.id !== id))
      alert('Item removido com sucesso!')
    } catch (err) {
      console.error('Erro ao deletar item:', err)
      alert('Erro ao remover item: ' + (err.message || 'Erro desconhecido'))
    } finally {
      setDeletando(null)
    }
  }

  // Função para obter URL da imagem
  const getImageUrl = (url) => {
    if (!url) return null
    // Se já é uma URL completa, retorna
    if (url.startsWith('http') || url.startsWith('data:')) return url
    if (!url.startsWith('/images/'))    return `/images/${url}`
    return `${url}`
  }

  if (isLoading) {
    return (
      <div>
        <header>
          <h1>📦 Meus Itens</h1>
          <p>Itens que você catalogou</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>Carregando seus itens...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1>📦 Meus Itens</h1>
          <p>Itens que você catalogou</p>
        </header>
        <main>
          <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>❌</div>
            <p style={{color: '#dc2626', marginBottom: '1rem'}}>{error}</p>
            <button onClick={carregarItens}>🔄 Tentar Novamente</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h1>📦 Meus Itens</h1>
        <p>Itens que você catalogou</p>
      </header>

      <main>
        <section>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
            <h2>Total: {itens.length} {itens.length === 1 ? 'item' : 'itens'}</h2>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button onClick={carregarItens} style={{background: '#6b7280'}}>🔄 Atualizar</button>
              <Link to="/catalogar">
                <button>+ Catalogar Novo</button>
              </Link>
            </div>
          </div>

          {itens.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
              <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📭</div>
              <h3>Nenhum item catalogado ainda</h3>
              <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>
                Comece catalogando seu primeiro item para doação!
              </p>
              <Link to="/catalogar">
                <button>📸 Catalogar Primeiro Item</button>
              </Link>
            </div>
          ) : (
            <div className="grid">
              {itens.map(item => (
                <div key={item.id} className="card" style={{overflow: 'hidden'}}>
                  {/* GALERIA DE FOTOS */}
                  {item.url_imagens && item.url_imagens.length > 0 && (
                    <div>
                      {/* Foto principal */}
                      <div style={{
                        width: '100%',
                        height: '250px',
                        overflow: 'hidden',
                        background: '#f3f4f6',
                        position: 'relative'
                      }}>
                        <img 
                          src={getImageUrl(item.url_imagens[0])} 
                          alt={item.titulo}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            cursor: 'pointer'
                          }}
                          onClick={() => setFotoSelecionada({item, index: 0})}
                        />
                        {item.url_imagens.length > 1 && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            📸 {item.url_imagens.length} fotos
                          </div>
                        )}
                      </div>
                      
                      {/* Miniaturas */}
                      {item.url_imagens.length > 1 && (
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: '#f9fafb',
                          overflowX: 'auto',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          {item.url_imagens.map((foto, index) => (
                            <img
                              key={index}
                              src={getImageUrl(foto)}
                              alt={`${item.titulo} - ${index + 1}`}
                              style={{
                                width: '70px',
                                height: '70px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                border: index === 0 ? '3px solid #10b981' : '2px solid #e5e7eb',
                                flexShrink: 0
                              }}
                              onClick={() => setFotoSelecionada({item, index})}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* CONTEÚDO */}
                  <div style={{padding: '1.5rem'}}>
                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap'}}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {item.categoria}
                      </span>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: '#f3e8ff',
                        color: '#6b21a8',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {item.subcategoria}
                      </span>
                    </div>

                    <h3 style={{marginBottom: '0.5rem', fontSize: '1.25rem'}}>{item.titulo}</h3>
                    
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                      lineHeight: '1.5'
                    }}>
                      {item.descricao}
                    </p>

                    {item.condicao && (
                      <div style={{
                        padding: '0.75rem',
                        background: '#fef3c7',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        marginBottom: '0.75rem',
                        borderLeft: '4px solid #f59e0b'
                      }}>
                        <strong>Condição:</strong> {item.condicao}
                      </div>
                    )}

                    <div style={{
                      padding: '0.75rem',
                      background: '#f0fdf4',
                      borderRadius: '6px',
                      marginBottom: '0.75rem',
                      borderLeft: '4px solid #10b981'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{fontSize: '1.1rem'}}>📍</span>
                        <div>
                          <strong>Localização:</strong><br/>
                          {item.endereco}
                          {item.cep && ` - CEP: ${item.cep}`}
                        </div>
                      </div>

                      {item.referencia && (
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#047857',
                          marginTop: '0.5rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px dashed #86efac'
                        }}>
                          <strong>📌 Referência:</strong> {item.referencia}
                        </div>
                      )}
                    </div>

                    {item.instrucoes_coleta && (
                      <details style={{marginBottom: '0.75rem'}}>
                        <summary style={{
                          cursor: 'pointer',
                          color: '#10b981',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          padding: '0.5rem',
                          background: '#f0fdf4',
                          borderRadius: '6px',
                          marginBottom: '0.5rem'
                        }}>
                          📋 Instruções para Coleta
                        </summary>
                        <div style={{
                          padding: '1rem',
                          background: '#f9fafb',
                          borderRadius: '6px',
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {item.instrucoes_coleta}
                        </div>
                      </details>
                    )}

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #e5e7eb',
                      marginBottom: '1rem'
                    }}>
                      <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                        📅 {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '-'}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.85rem',
                        background: item.status === 'disponivel' ? '#dcfce7' : '#fef3c7',
                        color: item.status === 'disponivel' ? '#166534' : '#92400e',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {item.status === 'disponivel' ? '✓ Disponível' : item.status}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeletar(item.id)}
                      disabled={deletando === item.id}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: deletando === item.id ? '#fecaca' : '#fee2e2',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: deletando === item.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                        opacity: deletando === item.id ? 0.7 : 1
                      }}
                    >
                      {deletando === item.id ? '⏳ Removendo...' : '🗑️ Remover Item'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL DE FOTO AMPLIADA */}
      {fotoSelecionada && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setFotoSelecionada(null)}
        >
          <img 
            src={getImageUrl(fotoSelecionada.item.url_imagens[fotoSelecionada.index])}
            alt={fotoSelecionada.item.titulo}
            style={{
              maxWidth: '90%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          />
          <div style={{
            color: 'white',
            marginTop: '1.5rem',
            fontSize: '1rem',
            textAlign: 'center'
          }}>
            <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
              {fotoSelecionada.item.titulo}
            </div>
            <div style={{fontSize: '0.875rem', opacity: 0.8}}>
              Foto {fotoSelecionada.index + 1} de {fotoSelecionada.item.url_imagens.length} • Clique para fechar
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeusItens