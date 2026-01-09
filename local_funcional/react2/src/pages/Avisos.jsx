import { useState } from 'react'

function Avisos() {
  const [filtro, setFiltro] = useState('todos')
  
  const avisos = [
    {
      id: 1,
      tipo: 'item-coletado',
      titulo: '✅ Item Coletado!',
      descricao: 'Sofá 3 lugares foi coletado por João Silva',
      detalhes: 'Você ganhou +10 pontos',
      tempo: 'Há 2 horas',
      lido: false
    },
    {
      id: 2,
      tipo: 'pontos',
      titulo: '🎉 Pontos Bônus!',
      descricao: 'Seu item Cadeira de Escritório foi coletado em menos de 24h',
      detalhes: 'Você ganhou +5 pontos bônus',
      tempo: 'Há 5 horas',
      lido: false
    },
    {
      id: 3,
      tipo: 'reclamacao',
      titulo: '⚠️ Nova Reclamação',
      descricao: 'Sobre o item: Mesa de Jantar',
      detalhes: 'Motivo: "Item não estava no local informado"',
      tempo: 'Há 1 dia',
      lido: false
    },
    {
      id: 4,
      tipo: 'conquista',
      titulo: '🏆 Nova Conquista Desbloqueada!',
      descricao: 'Você alcançou 100 pontos',
      detalhes: 'Parabéns! Agora você pode trocar por recompensas especiais',
      tempo: 'Há 2 dias',
      lido: true
    },
    {
      id: 5,
      tipo: 'visualizacao',
      titulo: '👀 Seu item está sendo visualizado',
      descricao: 'Estante de Livros foi visualizada 8 vezes hoje',
      detalhes: 'Grande chance de ser coletada em breve!',
      tempo: 'Há 3 dias',
      lido: true
    }
  ]

  const avisosFiltrados = filtro === 'todos' 
    ? avisos 
    : avisos.filter(a => a.tipo === filtro)

  const marcarComoLido = (id) => {
    console.log(`Marcar aviso ${id} como lido`)
  }

  return (
    <div>
      <header>
        <h1>🔔 Avisos e Notificações</h1>
        <p>Fique por dentro de tudo que acontece com seus itens</p>
      </header>

      <main>
        <section>
          <h2>Filtrar por:</h2>
          <div className="flex flex-wrap">
            <label>
              <input 
                type="radio" 
                name="filtro" 
                value="todos" 
                checked={filtro === 'todos'}
                onChange={(e) => setFiltro(e.target.value)}
              />
              {' '}Todos
            </label>
            <label>
              <input 
                type="radio" 
                name="filtro" 
                value="item-coletado" 
                checked={filtro === 'item-coletado'}
                onChange={(e) => setFiltro(e.target.value)}
              />
              {' '}Item Coletado
            </label>
            <label>
              <input 
                type="radio" 
                name="filtro" 
                value="pontos" 
                checked={filtro === 'pontos'}
                onChange={(e) => setFiltro(e.target.value)}
              />
              {' '}Pontos
            </label>
            <label>
              <input 
                type="radio" 
                name="filtro" 
                value="reclamacao" 
                checked={filtro === 'reclamacao'}
                onChange={(e) => setFiltro(e.target.value)}
              />
              {' '}Reclamações
            </label>
          </div>
        </section>

        <section>
          <h2>Seus Avisos ({avisosFiltrados.length})</h2>

          {avisosFiltrados.map(aviso => (
            <div 
              key={aviso.id} 
              className={`aviso ${aviso.tipo} ${!aviso.lido ? 'novo' : ''}`}
              style={{
                borderLeft: aviso.tipo === 'reclamacao' ? '4px solid #ef4444' : '4px solid #10b981',
                opacity: aviso.lido ? 0.7 : 1
              }}
            >
              <h3>{aviso.titulo}</h3>
              <p><strong>{aviso.descricao}</strong></p>
              <p>{aviso.detalhes}</p>
              <p><small>{aviso.tempo}</small></p>
              <div className="mt-2">
                {aviso.tipo === 'reclamacao' && (
                  <button onClick={() => window.location.href = '/reclamacoes'}>
                    Responder Agora
                  </button>
                )}
                {!aviso.lido && (
                  <button 
                    className="secondary" 
                    onClick={() => marcarComoLido(aviso.id)}
                    style={{marginLeft: '0.5rem'}}
                  >
                    Marcar como Lido
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2>Resumo</h2>
          <div className="grid">
            <div className="card">
              <h4>Não Lidas</h4>
              <p className="numero-grande">{avisos.filter(a => !a.lido).length}</p>
            </div>
            <div className="card">
              <h4>Itens Coletados Esta Semana</h4>
              <p className="numero-grande">3</p>
            </div>
            <div className="card">
              <h4>Reclamações Pendentes</h4>
              <p className="numero-grande">1</p>
            </div>
            <div className="card">
              <h4>Pontos Este Mês</h4>
              <p className="numero-grande">35</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Preferências de Notificação</h2>
          <label>
            <input type="checkbox" defaultChecked /> 
            {' '}Receber email quando item for coletado
          </label><br/>
          <label>
            <input type="checkbox" defaultChecked /> 
            {' '}Notificar sobre novas reclamações
          </label><br/>
          <label>
            <input type="checkbox" /> 
            {' '}Avisar quando atingir metas de pontos
          </label><br/>
          <label>
            <input type="checkbox" /> 
            {' '}Dicas e novidades do sistema
          </label><br/>
          <button className="mt-2">Salvar Preferências</button>
        </section>
      </main>
    </div>
  )
}

export default Avisos
