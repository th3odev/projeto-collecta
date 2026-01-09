# COLLECTA | Plataforma de Coleta Gamificada

![Static Badge](https://img.shields.io/badge/STATUS-MVP%20local%20funcional%20%7C%20Deploy%20cloud%20em%20ajuste-yellow)

---

## Objetivo do Projeto

O **Collecta** foi desenvolvido como um **MVP funcional** para a **terceira fase do programa MoviTalent**, com foco em validar uma solução digital baseada em **economia circular**, **gamificação** e **reaproveitamento urbano**.

Os principais objetivos técnicos e conceituais do projeto foram:

- Implementar o fluxo completo de **catalogação → coleta → pontuação**
- Garantir separação clara entre **frontend**, **backend** e **camada de API**
- Trabalhar uma arquitetura **modular, reutilizável e orientada a times**
- Construir uma interface simples, objetiva e funcional para usuários finais

---

## Status Atual do Projeto (Importante)

> ⚠️ **Aviso de transparência técnica**

O Collecta encontra-se atualmente no seguinte estado:

- ✅ **MVP totalmente funcional em ambiente local via Docker Compose** Dentro do diretório local_funcional
- ⚠️ **Deploy em nuvem (Render + Vercel) em fase de adaptação técnica** Alterações no collecta para um deploy online para visualização ainda em andamento, tanto que a vercel atual está com bugs.
- ❌ Ainda **não considerado pronto para produção cloud**

A arquitetura original do projeto foi pensada para **execução orquestrada via Docker**, com múltiplos serviços (API, frontend, proxy, volumes, banco).

Durante o processo de deploy online, foram identificadas **diferenças relevantes entre o ambiente Docker local e o modelo de execução serverless / PaaS**, exigindo refatorações e ajustes adicionais que ainda estão em andamento.

👉 **Isso não invalida o MVP**, mas reforça que o projeto está sendo **adaptado para ambientes cloud modernos**.

---

## Branding, Conceito e Gamificação

O projeto teve início **antes do código**, a partir da definição de conceito e branding.

### Conceito

A proposta foi transformar a **coleta de itens reutilizáveis** em uma experiência **colaborativa, sustentável, motivadora e gamificada**.

Para isso, foi adotado um **sistema de pontuação baseado em estrelas**, onde cada ação positiva dentro da plataforma gera reconhecimento.

### Gamificação

- Pontos representados como **estrelas**
- Coleta de itens gera pontuação imediata
- Recompensas consomem estrelas, criando equilíbrio
- Histórico de atividades reforça feedback contínuo ao usuário

---

## Prototipação e Design (Figma)

Todo o fluxo do Collecta foi **prototipado integralmente no Figma** antes da implementação.

### Processo adotado:

1. Definição do **branding e identidade visual**
2. Criação de **wireframes funcionais**
3. Evolução para **protótipo de média/alta fidelidade**
4. Implementação no código com ajustes finos direto no frontend

**Protótipo completo no Figma:**  
👉 https://www.figma.com/design/TgmWKhC40urAKFvv45KEHn/collecta

---

## Funcionalidades Implementadas (MVP Local)

### Core System

- **Autenticação:** Login e sessão persistente via backend próprio (JWT)
- **Catalogação de Itens:**
  - Criação de itens com título, descrição, categoria e condição
  - Upload de múltiplas imagens
- **Coleta de Itens:**
  - Usuários podem coletar itens disponíveis
  - Atualização de status do item
- **Sistema de Pontos:**
  - Pontos ganhos por coleta
  - Pontos gastos ao resgatar recompensas
- **Histórico de Atividades:**
  - Registro de coletas e resgates

---

## Interface (Frontend)

- **Catálogo de Itens:** Listagem com cards e navegação
- **Detalhe do Item:**
  - Galeria de imagens
  - Informações completas
  - Ações de coleta
- **Perfil do Usuário:**
  - Pontuação atual
  - Histórico de atividades
- **Catalogar Item:**
  - Formulário simples e objetivo
  - Upload visual de imagens
- **Navbar Responsiva:**
  - Desktop e Mobile
  - Menus contextuais por autenticação

---

## UI / UX

O Collecta segue uma estética focada em clareza e funcionalidade:

- Dark Mode como padrão
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

- Usuários
- Itens
- Coletas
- Logs de transações
- Sistema de pontuação

---

## Infraestrutura (Ambiente Local)

- **Docker + Docker Compose**
- **Nginx** como proxy reverso
- Separação clara entre:
  - API
  - Frontend
  - Assets estáticos
- Ambiente preparado para **desenvolvimento e testes integrados**

> O modelo de infraestrutura cloud está sendo reavaliado para melhor compatibilidade com serviços PaaS.

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

> O **jsApiLayer** e o **Admin** foram desenvolvidos por  
> **[@Vinicius-b-Canonico](https://github.com/Vinicius-b-Canonico)**  
> e são utilizados neste projeto **sem modificações**, respeitando sua arquitetura original.

---

## Nota Pessoal e Aprendizados

O Collecta representa um avanço importante na minha jornada como desenvolvedor.

Durante o desenvolvimento, aprofundei conhecimentos em:

- Arquitetura em camadas
- Integração frontend ↔ backend
- Organização de projetos reais
- Dockerização de aplicações completas
- UX orientado a produto
- Desafios reais de deploy e adaptação para cloud

O projeto ainda possui espaço para evolução e refino, especialmente no contexto de deploy online, mas cumpre seu papel como um **MVP técnico consistente e bem arquitetado**.

---

## Agradecimentos

- **@Vinicius-b-Canonico** pelo trabalho no **jsApiLayer**, Admin e backend
- Todos que contribuíram direta ou indiretamente para o aprendizado envolvido neste projeto

---

Obrigado por visitar o projeto.  
Sugestões e feedbacks são sempre bem-vindos.
