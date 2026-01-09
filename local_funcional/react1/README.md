# C 𓇻 l l e c t a

Plataforma web gamificada para coleta sustentável e economia circular.

---

## Sobre o Projeto

O **Collecta** é um MVP desenvolvido no programa **MoviTalent** com o objetivo de validar uma solução digital que incentiva a coleta de itens reutilizáveis com incentivo por meio de gamificação.

Usuários visualizam itens descartados pelo aplicativo Caça verde (Equipe Monza), realizam a coleta no mundo real e recebem pontos (estrelas), que podem ser utilizados futuramente para resgate de recompensas.

O projeto faz parte de um ecossistema maior, integrando:

- Itens catalogados por outro sistema
- Recompensas e gestão de usuários gerenciadas via painel administrativo

---

## Funcionalidades

- Autenticação e sessão
- Catálogo de itens disponíveis
- Detalhe do item e ação de coleta
- Sistema de pontos (estrelas)
- Perfil do usuário com histórico de atividades
- Notificações baseadas em eventos

---

## Arquitetura

O frontend segue uma arquitetura em camadas:

React (UI)

↓

jsApiLayer (Camada de Comunicação entre Apps)

↓

Backend (API REST)

O frontend **não se comunica diretamente com o backend**.  
Toda interação passa por uma camada de API compartilhada, responsável por autenticação, cache e padronização de requisições que foi incrívelmente desenvolvida pelo Vínicius da equipe Roma.

---

## Stack

- React + Vite
- React Router
- Context API
- Tailwind CSS
- Backend em Flask
- Docker + Docker Compose
- Nginx (proxy reverso)

---

## Decisões Técnicas

- Separação clara entre UI, API e backend
- Consumo de uma camada de API compartilhada
- Estado global centralizado para autenticação e usuário
- Dados sensíveis sempre originados no backend
- Normalização e tratamento de dados no frontend

Essas decisões garantem compatibilidade com múltiplos aplicativos que utilizam a mesma infraestrutura.

---

## Status atual do Projeto

- Catálogo de itens ✅
- Coleta de itens ✅
- Sistema de pontos ✅
- Perfil e histórico ✅
- Notificações ✅
- Sistema de recompensas ✅

---

## Observações

Este projeto foi desenvolvido como um **MVP funcional**, priorizando:

- Estabilidade
- Clareza arquitetural
- Boas práticas de frontend
- Integração com sistemas existentes

## Futuramente

Pretendo implementar itens que otimizariam o collecta como:

- Níveis (Gamificação)
- Emblemas (Gamificação)
- Localização (UX)

---

## Autor

Projeto desenvolvido para terceira fase do MoviTalent.

Github: https://github.com/th3odev

Linkedin: https://www.linkedin.com/in/devth3o/

🐱‍👤☕
