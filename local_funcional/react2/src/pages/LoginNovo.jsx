import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '/jsApiLayer/auth.js'

const IconMail = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconLock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconRecycle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
    <path d="m14 16-3 3 3 3"/>
    <path d="M8.293 13.596 7.196 9.5 3.1 9.5a1.83 1.83 0 0 1-1.582-.881 1.785 1.785 0 0 1-.004-1.784l4.296-7.882a1.83 1.83 0 0 1 1.569-.88h3.433a1.83 1.83 0 0 1 1.569.88l4.296 7.882a1.785 1.785 0 0 1-.004 1.784L15.707 13.596"/>
    <path d="M15 4h6a1 1 0 0 1 1 1v3.5"/>
    <path d="M20 6 6 20"/>
  </svg>
)

const InputField = ({ icon: Icon, type, placeholder, value, onChange, required }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {Icon && <Icon className="h-5 w-5 text-gray-400" />}
    </div>
    <input
      type={type}
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
)

function LoginNovo() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await login(email, senha)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', data.usuario)
      navigate('/home')
    } catch (err) {
      alert('Erro: ' + (err.message || 'Login falhou'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 mb-4">
            <IconRecycle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Caça Verde</h1>
          <p className="mt-2 text-sm text-gray-600">Time Monza</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-gray-600">Entre para continuar</p>
          </div>

          <form onSubmit={handleLogin}>
            <InputField
              icon={IconMail}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              icon={IconLock}
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Lembrar-me</span>
              </label>

              <Link to="/recuperar-senha" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="font-medium text-emerald-600 hover:text-emerald-500">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/apresentacao" className="text-sm text-gray-600 hover:text-gray-900">
            ← Voltar para apresentação
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginNovo