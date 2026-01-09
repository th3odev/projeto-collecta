# Caça Verde - Time Monza
## Frontend Integrado - MoviTalent 2025

### 📋 Alterações Implementadas

Este projeto integra as contribuições de todos os membros do Time Monza conforme solicitado:

---

## ✅ Mudanças Implementadas

### 1. **Paula - Separação das telas Inicial**
- ✅ **ApresentacaoNova.jsx**: Página de apresentação com carousel automático
- ✅ **HomeNova.jsx**: Dashboard completo com gerenciamento de itens e pontos
- ✅ Componentes reutilizáveis: Badge e Card
- ✅ Sistema de autenticação integrado

### 2. **Mariana - Telas de Login e Cadastro**
- ✅ **LoginNovo.jsx**: Tela de login completa com todos os campos
- ✅ **CadastroUsuario.jsx**: Cadastro de usuário com TODOS os campos solicitados:
  - Nome completo
  - Email
  - Telefone
  - Endereço
  - Senha
  - Confirmar senha
  - Checkbox de termos de uso

### 3. **Gustavo - Integração do Esqueleto**
- ✅ Todas as telas integradas no App.jsx
- ✅ Roteamento configurado corretamente
- ✅ Fluxo de navegação:
  - `/` → Redireciona para `/apresentacao`
  - `/apresentacao` → Página de apresentação (tela cheia, sem menu)
  - `/login` → Login (tela cheia, sem menu)
  - `/cadastro` → Cadastro de usuário (tela cheia, sem menu)
  - `/home` → Dashboard (com menu lateral)
  - Demais rotas mantidas com Layout

---

## 🎯 Estrutura do Projeto

```
src/
├── App.jsx                    # Rotas principais (ATUALIZADO)
├── components/
│   └── Layout.jsx            # Menu lateral (ATUALIZADO com link Home)
├── contexts/
│   └── AuthContext.jsx       # Sistema de autenticação
├── pages/
│   ├── ApresentacaoNova.jsx  # 🆕 Página de apresentação (Paula)
│   ├── HomeNova.jsx          # 🆕 Dashboard principal (Paula)
│   ├── LoginNovo.jsx         # 🆕 Login completo (Mariana)
│   ├── CadastroUsuario.jsx   # 🆕 Cadastro completo (Mariana)
│   ├── CatalogarItem.jsx     # Catalogar itens
│   ├── MeusItens.jsx         # Listar meus itens
│   ├── PontosGanhos.jsx      # Visualizar pontos
│   ├── Recompensas.jsx       # Loja de recompensas
│   ├── MinhasRecompensas.jsx # Recompensas resgatadas
│   ├── Avisos.jsx            # Notificações
│   └── ResponderReclamacoes.jsx # Sistema de reclamações
└── services/
    └── api.js                # Configuração da API
```

---

## 🚀 Tecnologias Utilizadas

- ⚛️ **React 19** - Framework frontend
- 🎨 **Tailwind CSS** - Estilização (via CDN)
- 🛣️ **React Router DOM 7** - Navegação
- ⚡ **Vite** - Build tool
- 🐳 **Docker** - Deploy (preparado para containerização)

---

## 📱 Fluxo de Navegação

1. **Usuário acessa** → `/` (redireciona para `/apresentacao`)
2. **Apresentação** → Usuário conhece o projeto
3. **Botões**:
   - "Fazer Login" → `/login`
   - "Criar Conta" → `/cadastro`
4. **Após Login** → `/home` (Dashboard)
5. **Menu lateral** disponível em todas as páginas autenticadas

---

## 🔐 Sistema de Autenticação

- Login simula autenticação (1.5s delay)
- Dados salvos no `localStorage`
- Redirecionamento automático após login
- Proteção de rotas: Home requer autenticação
- Logout limpa dados e redireciona para login

---

## 💾 Como Executar

### Desenvolvimento:
```bash
npm install
npm run dev
```

### Build para Produção:
```bash
npm run build
```

### Preview da Build:
```bash
npm run preview
```

---

## 🎨 Design System

### Cores Principais:
- **Brand**: Verde (#10b981 - Emerald)
- **Ocean**: Azul (#3b82f6)
- **Slate**: Cinza (#64748b)

### Componentes Estilizados:
- **Badge**: Tags com diferentes tons
- **Card**: Container com bordas arredondadas
- **InputField**: Campos de formulário com ícones

---

## 📝 Notas Importantes

1. **Tailwind CSS via CDN**: Optamos por CDN para facilitar o setup
2. **Dados Mock**: Autenticação e itens são simulados localmente
3. **Responsivo**: Todas as telas adaptadas para mobile e desktop
4. **Acessibilidade**: Ícones SVG inline para melhor performance

---

## 👥 Contribuidores

- **Paula**: Páginas Home e Apresentação
- **Mariana**: Login e Cadastro de Usuário
- **Gustavo**: Integração e estrutura do projeto

---

## 🎯 Próximos Passos

1. Integrar com backend .NET 8
2. Conectar ao PostgreSQL
3. Implementar Docker para deploy
4. Adicionar geolocalização real
5. Sistema de notificações push
6. Upload de imagens para catalogação

---

## 📞 Contato

**Time Monza** - MoviTalent 2025
Projeto de Economia Circular e ESG

---

*Desenvolvido com 💚 para um mundo mais sustentável*
