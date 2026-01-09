import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Layout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const isActive = (path) => location.pathname === path ? 'ativo' : ''

  return (
    <div>
      <nav>
        <div className="logo">
          <Link to="/home">
            <h1>🌱 Caça Verde</h1>
          </Link>
        </div>
        
        <ul>
          <li><Link to="/home" className={isActive('/home')}>🏠 Home</Link></li>
          <li><Link to="/apresentacao" className={isActive('/apresentacao')}>📄 Apresentação</Link></li>
          <li><Link to="/catalogar" className={isActive('/catalogar')}>📸 Catalogar</Link></li>
          <li><Link to="/meus-itens" className={isActive('/meus-itens')}>📦 Meus Itens</Link></li>
          <li><Link to="/pontos" className={isActive('/pontos')}>🏆 Pontos</Link></li>
          <li><Link to="/recompensas" className={isActive('/recompensas')}>🎁 Recompensas</Link></li>
          <li><Link to="/avisos" className={isActive('/avisos')}>🔔 Avisos <span className="badge">3</span></Link></li>
          <li><Link to="/reclamacoes" className={isActive('/reclamacoes')}>💬 Reclamações <span className="badge">1</span></Link></li>
          {user ? (
            <li><button onClick={logout} style={{padding: '0.5rem 1rem'}}>🚪 Sair</button></li>
          ) : (
            <li><Link to="/login" className={isActive('/login')}>🔐 Entrar</Link></li>
          )}
        </ul>
      </nav>

      <div className="container">
        <Outlet />
      </div>

      <footer>
        <hr />
        <p><strong>Caça Verde</strong> - Catalogação Inteligente | Time Monza | MoviTalent 2025</p>
        <nav>
          <Link to="/home">Home</Link> | 
          <Link to="/apresentacao"> Apresentação</Link> | 
          <Link to="/catalogar"> Catalogar</Link> | 
          <Link to="/meus-itens"> Meus Itens</Link> | 
          <Link to="/pontos"> Pontos</Link> | 
          <Link to="/recompensas"> Recompensas</Link> | 
          <Link to="/avisos"> Avisos</Link> | 
          <Link to="/reclamacoes"> Reclamações</Link>
        </nav>
        <p><small>Todos os direitos reservados © 2025</small></p>
      </footer>
    </div>
  )
}

export default Layout
