import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '/jsApiLayer/auth.js'

// Ícones SVG
const IconUser = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

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

const IconAt = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>
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

function CadastroUsuario() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email: '',
    apelido: '',
    senha: '',
    confirmarSenha: ''
  })

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }

    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!')
      return
    }

    setIsLoading(true)
    
    try {
      // Usa a função register do jsApiLayer/auth.js
      await register(
        formData.nome_usuario,
        formData.senha,
        formData.email,
        formData.apelido
      )

      alert('Cadastro realizado com sucesso!')
      navigate('/login')
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao cadastrar: ' + (error.message || 'Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 mb-4">
            <IconRecycle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Caça Verde</h1>
          <p className="mt-2 text-sm text-gray-600">Time Monza</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Criar conta</h2>
            <p className="mt-1 text-sm text-gray-600">
              Preencha os dados abaixo para se cadastrar
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  icon={IconUser}
                  type="text"
                  placeholder="Nome de usuário"
                  value={formData.nome_usuario}
                  onChange={handleChange('nome_usuario')}
                  required
                />
              </div>

              <div>
                <InputField
                  icon={IconMail}
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <InputField
                  icon={IconAt}
                  type="text"
                  placeholder="Apelido (nome público)"
                  value={formData.apelido}
                  onChange={handleChange('apelido')}
                  required
                />
              </div>

              <div>
                <InputField
                  icon={IconLock}
                  type="password"
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={formData.senha}
                  onChange={handleChange('senha')}
                  required
                />
              </div>

              <div>
                <InputField
                  icon={IconLock}
                  type="password"
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange('confirmarSenha')}
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  Eu aceito os{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-500">
                    termos de uso
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-500">
                    política de privacidade
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/apresentacao"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Voltar para apresentação
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CadastroUsuario