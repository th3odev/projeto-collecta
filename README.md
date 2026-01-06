# COLLECTA | Plataforma de Coleta Gamificada

![Static Badge](https://img.shields.io/badge/STATUS-MVP%20FUNCIONAL-success)

---

## Objetivo do Projeto

O **Collecta** foi desenvolvido como um **MVP funcional** para a **terceira fase do programa MoviTalent**, com foco em validar uma solução digital baseada em economia circular, gamificação e reaproveitamento urbano.

Os principais objetivos técnicos e conceituais foram:

- Implementar o fluxo completo de **catalogação → coleta → pontuação**
- Garantir separação clara entre **frontend**, **backend** e **camada de API**
- Trabalhar uma arquitetura **escalável, reutilizável e orientada a times**
- Construir uma interface simples, objetiva e funcional para usuários finais

---

## Branding, Conceito e Gamificação

O projeto teve início **antes do código**, a partir da definição de conceito e branding.

### Conceito

A ideia proposta pelo programa era transformar a **coleta de itens reutilizáveis** em uma experiência: colaborativa, sustentável, motivadora e gamificada.

Para isso, adotei um **sistema de pontuação baseado em estrelas**, onde cada ação positiva dentro da plataforma gera pontuações.

### Gamificação

- Pontos foram representados como **estrelas**, reforçando sensação de progresso
- Coletar itens gera pontuação imediata
- Resgatar recompensas consome estrelas, criando equilíbrio no sistema
- Histórico de atividades reforça feedback constante ao usuário ótima para a UX.

Essa abordagem busca incentivar engajamento sem complexidade excessiva.

---

## Prototipação e Design (Figma)

Todo o fluxo do Collecta foi **prototipado integralmente no Figma** antes da implementação final.

### Processo adotado:

1. Definição do **branding e identidade visual**
2. Criação de **wireframes funcionais**
3. Evolução para **protótipo de média/alta fidelidade**
4. Implementação no código com ajustes finos direto no frontend

Grande parte das decisões de UI/UX partiram do protótipo, enquanto ajustes finais foram feitos diretamente no código para melhorar responsividade e fluidez.

**Protótipo completo no Figma:**  
👉 https://www.figma.com/design/TgmWKhC40urAKFvv45KEHn/collecta

---

## Funcionalidades Implementadas (Status Atual)

### Core System

- **Autenticação:** Login e sessão persistente via backend próprio.
- **Catalogação de Itens:**
  - Criação de itens com título, descrição, categoria, condição e imagens.
  - Upload de múltiplas imagens.
- **Coleta de Itens:**
  - Usuários podem coletar itens disponíveis.
  - Atualização de status do item.
- **Sistema de Pontos:**
  - Pontos ganhos por coleta.
  - Pontos gastos ao resgatar recompensas.
- **Histórico de Atividades:**
  - Registro de coletas e resgates com saldo de pontos.

---

### Interface (Frontend)

- **Catálogo de Itens:** Listagem com cards e navegação.
- **Detalhe do Item:**
  - Galeria de imagem
  - Informações completas
  - Ações de coleta
- **Perfil do Usuário:**
  - Pontuação atual
  - Histórico de atividades
- **Catalogar Item:**
  - Formulário simples e objetivo
  - Upload visual de imagens com remoção individual
- **Navbar Responsiva:**
  - Desktop e Mobile
  - Menus contextuais por autenticação

---

## UI / UX

O Collecta segue uma estética focada em clareza e funcionalidade:

- Dark Mode como padrão intensifica a sensação de gamificação
- Interface limpa e sem ruído visual
- Foco em legibilidade e ações diretas

---

## Backend

- **Framework:** Flask
- **ORM:** SQLAlchemy
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT
- **Migrations:** Alembic
- **Upload de Imagens:** Persistência via volume Docker

O backend foi estruturado para suportar:

- Itens
- Usuários
- Coletas
- Logs de transações
- Sistema de pontuação

---

## Infraestrutura

- **Docker + Docker Compose**
- **Nginx** como proxy reverso
- Separação clara entre:
  - API
  - Frontend
  - Assets estáticos
- Ambiente preparado para produção ou staging

---

## Stack Técnica

![Static Badge](https://img.shields.io/badge/React-18-blue)
![Static Badge](https://img.shields.io/badge/Vite-fast-purple)
![Static Badge](https://img.shields.io/badge/TailwindCSS-UI-teal)
![Static Badge](https://img.shields.io/badge/Flask-backend-black)
![Static Badge](https://img.shields.io/badge/PostgreSQL-DB-blue)
![Static Badge](https://img.shields.io/badge/Docker-Infra-blue)
![Static Badge](https://img.shields.io/badge/Nginx-Proxy-green)

---

## jsApiLayer (Camada de API Compartilhada)

Um dos pilares do projeto é o uso de uma **camada de API desacoplada**, chamada **jsApiLayer**, responsável por:

- Comunicação com o backend
- Centralização de chamadas HTTP
- Controle de cache e invalidação
- Reutilização entre múltiplos frontends (Collecta, Admin, etc.)

### Créditos Importantes

> O **jsApiLayer** e o **Admin** foram completamente desenvolvidos por  
> **[@Vinicius-b-Canonico](https://github.com/Vinicius-b-Canonico)**  
> e são utilizados neste projeto **sem modificações**, respeitando sua arquitetura original.

Essa decisão garante:

- Consistência entre aplicações
- Facilidade de manutenção
- Escalabilidade do ecossistema

---

## Nota Pessoal e Aprendizados

O Collecta representa um avanço importante na minha jornada como desenvolvedor fullstack.

Durante o desenvolvimento, aprofundei conhecimentos em:

- Arquitetura em camadas
- Integração frontend ↔ backend
- Organização de projetos reais
- Dockerização de aplicações completas
- UX orientado a produto

O projeto ainda possui espaço para evolução, mas já cumpre seu papel como um **MVP sólido, funcional e escalável**.

---

## Agradecimentos

- **@Vinicius-b-Canonico** pelo trabalho no **jsApiLayer**, Admin e backend
- Todos que contribuíram direta ou indiretamente para o aprendizado envolvido neste projeto

---

Obrigado por visitar o projeto.  
Sugestões e feedbacks são bem-vindos.
