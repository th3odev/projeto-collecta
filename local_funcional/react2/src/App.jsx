import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'

// Páginas NOVAS (integradas da Paula e Mariana)
import ApresentacaoNova from './pages/ApresentacaoNova'
import HomeNova from './pages/HomeNova'
import LoginNovo from './pages/LoginNovo'
import CadastroUsuario from './pages/CadastroUsuario'

// Páginas antigas (mantidas para funcionalidades adicionais)
import CatalogarItem from './pages/CatalogarItem'
import MeusItens from './pages/MeusItens'
import PontosGanhos from './pages/PontosGanhos'
import Recompensas from './pages/Recompensas'
import MinhasRecompensas from './pages/MinhasRecompensas'
import Avisos from './pages/Avisos'
import ResponderReclamacoes from './pages/ResponderReclamacoes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/react2">
        <Routes>
          {/* Rota raiz redireciona para apresentação */}
          <Route path="/" element={<Navigate to="/apresentacao" replace />} />
          
          {/* Páginas INICIAIS (sem Layout - tela cheia) */}
          <Route path="/apresentacao" element={<ApresentacaoNova />} />
          <Route path="/login" element={<LoginNovo />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          
          {/* Páginas com Layout (após login) */}
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<HomeNova />} />
            <Route path="catalogar" element={<CatalogarItem />} />
            <Route path="meus-itens" element={<MeusItens />} />
            <Route path="pontos" element={<PontosGanhos />} />
            <Route path="recompensas" element={<Recompensas />} />
            <Route path="minhas-recompensas" element={<MinhasRecompensas />} />
            <Route path="avisos" element={<Avisos />} />
            <Route path="reclamacoes" element={<ResponderReclamacoes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
