# 🏥 Consulta Fácil — Interface do Paciente & Acessibilidade Sênior (WCAG 2.1 AAA)

> **Protótipo Funcional de Front-End & Design System voltado para a Terceira Idade e Baixa Literacia Digital**  
> Desenvolvido com foco em usabilidade médica, ergonomia motora (Lei de Fitts) e independência de microserviços na interface.

---

## 📌 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura de Componentes e Microserviços na Interface](#1-arquitetura-de-componentes-e-microserviços-na-interface)
3. [Identidade Visual & Design System no Código](#2-identidade-visual--design-system-no-código)
4. [Desenvolvimento do Protótipo Funcional (Sem Banco de Dados)](#3-desenvolvimento-do-protótipo-funcional-sem-banco-de-dados)
5. [Acessibilidade Prática (WCAG 2.1 AAA no Código)](#4-acessibilidade-prática-wcag-21-aaa-no-código)
6. [Telas do Paciente Implementadas](#-telas-do-paciente-implementadas)
7. [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
8. [Publicação e Hospedagem Gratuita (Deploy)](#-publicação-e-hospedagem-gratuita-deploy)
9. [Justificativa das Tecnologias Utilizadas](#-justificativa-das-tecnologias-utilizadas)

---

## 🎯 Sobre o Projeto

O **Consulta Fácil** é uma interface centrada exclusivamente na **jornada do paciente**, removendo toda a complexidade de painéis administrativos e burocráticos. O projeto foi projetado para atender com excelência idosos, aposentados e pacientes com limitações motoras (artrose, tremores) ou visuais (presbiopia, catarata).

O projeto é estruturado em duas grandes fases complementares:
* **Fase de Concepção Visual (UX/UI):** Aplicação de Heurísticas de Nielsen, Leis de Fitts, Hick e Miller, e regra de cores 60-30-10.
* **Fase de Desenvolvimento Técnico (Front-End):** Modularidade de componentes, independência de microserviços simulada via *mock services*, semântica HTML5 estrita e conformidade com as diretrizes internacionais **WCAG 2.1 nível AAA**.

---

## 1. Arquitetura de Componentes e Microserviços na Interface

```
apiUIUX/
├── index.html                   # Estrutura semântica principal e simulador mobile
├── styles/
│   └── design-system.css        # Centralização de variáveis CSS, paleta e regras WCAG
└── scripts/
    ├── mock-services.js         # Camada de microserviços desacoplados (LocalStorage)
    └── app.js                   # Lógica da interface, acessibilidade e eventos
```

### Componentização Modular
A interface não é estática nem monolítica. Foi codificada adotando blocos reutilizáveis:
* `<header class="app-header">`: Cabeçalho institucional com SVG escalável e alternador de acessibilidade.
* `<nav class="tab-nav">`: Barra de navegação com atributos `role="tab"` e `aria-selected`.
* `<div class="mockup-frame">`: Simulador ergonômico *mobile-first* (390 x 800) com *notch* e barra de status.
* `<div class="modal-sheet">`: Modais acessíveis com `role="dialog"` e suporte à tecla `Esc`.
* `<div class="chips-grid">`: Seletores ergonômicos de horário com matriz 2x2.
* `<div class="mini-calendar">`: Calendário retrátil sob demanda que fecha automaticamente após a seleção.

### Independência de Microserviços na Interface
Para atender ao requisito de independência de microserviços, o arquivo `scripts/mock-services.js` isola as operações em quatro domínios independentes:
1. **`AuthService`:** Gerencia sessão, login por CPF e cadastro de novos usuários.
2. **`AppointmentService`:** Gerencia listagem, criação, reagendamento e cancelamento de consultas.
3. **`DoctorService`:** Catálogo de médicos credenciados, especialidades e unidades.
4. **`NotificationService`:** Mensageria simulada para envio de confirmações por SMS e WhatsApp.

#### Como a interface lida com a queda de um microserviço?
* **Isolamento de Estado:** Os dados são mantidos em chaves separadas do `localStorage`. Se o microserviço de reagendamento cair ou simular uma falha de conexão, o microserviço de autenticação e a visualização do histórico continuam funcionando sem interrupção.
* **Fallback Gracioso (Graceful Degradation):** Em caso de falha de rede na API de agendamento, a interface não quebra nem exibe mensagens técnicas em inglês. Ela aciona um fallback acolhedor convidando o idoso a tocar no card telefônico para ser atendido gratuitamente pelo **0800 700 8000**.

---

## 2. Identidade Visual & Design System no Código

Todo o estilo da aplicação é centralizado no arquivo `styles/design-system.css`, realizando a **customização interna do framework Bootstrap 5.3** através da sobrescrita e extensão de suas variáveis nativas (`:root`), conforme previsto no regulamento do projeto:

```css
:root {
  /* ========================================================================
     1. CUSTOMIZAÇÃO INTERNA DO BOOTSTRAP 5.3 (CSS VARIABLES)
     ======================================================================== */
  --bs-primary: #0F52BA;          /* Azul Safira - 10% Ação Principal e Confiança */
  --bs-primary-rgb: 15, 82, 186;
  --bs-secondary: #16A34A;        /* Verde Esmeralda - Sucesso e Conclusão Segura */
  --bs-secondary-rgb: 22, 163, 74;
  --bs-warning: #D97706;          /* Âmbar - Alerta Acolhedor */
  --bs-danger: #DC2626;           /* Vermelho Cuidadoso - Cancelamento */
  --bs-body-color: #0F172A;       /* Texto Primário (Contraste 14.2:1 - WCAG AAA) */
  --bs-body-bg: #F8FAFC;          /* Fundo Neutro Anti-Ofuscamento */
  --bs-border-color: #94A3B8;     /* Borda Nítida para Idosos com Baixa Visão */
  --bs-focus-ring-color: rgba(2, 132, 199, 0.4);

  /* ========================================================================
     2. DESIGN SYSTEM PROPRIETÁRIO (PALETA 60-30-10 & SEMÂNTICA MÉDICA)
     ======================================================================== */
  --primary: #0F52BA;          /* 10% Ação Principal: Azul Confiança */
  --secondary: #16A34A;        /* Sucesso e Conclusão Segura: Verde SUS */
  --warning: #D97706;          /* Alerta e Suporte Acolhedor: Âmbar */
  --danger: #DC2626;           /* Ação Cuidadosa: Vermelho Cancelamento */

  /* 60% Fundo / 30% Estrutura */
  --bg-neutral: #F8FAFC;       /* Fundo Anti-Ofuscamento */
  --surface-white: #FFFFFF;    /* Superfície de Alto Contraste */
  --text-main: #0F172A;        /* Texto Escuro (Contraste 14.2:1 - WCAG AAA) */
  --text-muted: #334155;       /* Texto Secundário (Contraste > 7:1) */

  /* Ergonomia e Escala */
  --focus-ring: #0284C7;       /* Anel de Foco Visível WCAG 2.4.7 */
  --font-scale: 1;             /* Fator de Escala Dinâmico */
  --btn-min-height: 56px;      /* Alvo de Toque Mínimo (Lei de Fitts) */
}

/* Modo Sênior: Tipografia Ampliada (+20%) e Contraste Máximo */
body.senior-mode {
  --font-scale: 1.20;
  --text-muted: #1E293B;
  --border-strong: #64748B;
  --btn-min-height: 64px;
}
```

### Regra Cromática 60-30-10
* **60% Fundo Neutro (#F8FAFC):** Superfície clara que não ofusca a visão do idoso.
* **30% Estrutura (#0F172A):** Tipografia escura de alto contraste (14.2:1), superando os 7:1 exigidos pela norma WCAG AAA.
* **10% Ação Primária (#0F52BA / #16A34A):** Ponto focal indiscutível nos botões de conversão e confirmação.

---

## 3. Desenvolvimento do Protótipo Funcional (Sem Banco de Dados)

O protótipo opera de forma **100% demonstrativa e funcional sem necessidade de banco de dados externo (PostgreSQL, MySQL)** ou servidor backend (Java, Node).

* **Persistência Inteligente com LocalStorage:** As consultas criadas, reagendadas ou canceladas durante a navegação do usuário são salvas em tempo real no navegador. Ao recarregar a página ou alternar de tela, os dados continuam lá.
* **Dados Iniciais Pré-Carregados (Seed Data):** O sistema já inicia com um perfil de paciente realista (*Dona Maria Francisca da Silva*) e duas consultas ativas agendadas, permitindo testar de imediato os fluxos de reagendamento e cancelamento.
* **Leis de UX Aplicadas:**
  * **Lei de Fitts:** Todos os botões interativos e *chips* possuem altura mínima de 54px a 58px e ocupam a largura total na zona nobre do polegar.
  * **Lei de Hick:** Telas com caminhos diretos (ex: "Entrar" ou "Cadastrar"), reduzindo o tempo de decisão.
  * **Lei de Miller & Chunking:** Formulários divididos em blocos temáticos pequenos (*Passo 1: Dados Pessoais* e *Passo 2: Contato & Senha*).
  * **Heurística de Nielsen #6 (Reconhecimento vs. Lembrança):** Na tela de reagendamento, o sistema exibe um card azul claro com a consulta original completa (médico, especialidade, dia e sala), poupando a memória do idoso.

---

## 4. Acessibilidade Prática (WCAG 2.1 AAA no Código)

A acessibilidade não é meramente estética, mas reflete diretamente na estrutura técnica:

### 4.1. Semântica HTML Rigorosa
* Uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<fieldset>` e `<legend>`.
* Nenhum botão interativo foi construído com tags genéricas (`<div>` ou `<span>`) sem semântica. Todos são `<button>` ou `<a>`.

### 4.2. Atributos ARIA & Alt Descritivos
* **`aria-label`:** Presente em todos os botões de ícone (ex: botão de fechar `✕` possui `aria-label="Fechar janela"`, botão de ajuda possui `aria-label="Ligar para a Central de Apoio Gratuita 0800"`).
* **`aria-hidden="true"`:** Aplicado a emojis e SVGs puramente decorativos para evitar leitura poluída em leitores de tela.
* **`aria-pressed="false/true"`:** Reflete o estado ativo do botão de Modo Sênior.
* **`aria-live="polite"`:** Área invisível reservada para que o leitor de tela anuncie trocas de tela e mensagens de sucesso suavemente sem interromper o usuário.
* **`role="dialog"` e `aria-modal="true"`:** Aplicados a todos os modais de login, cadastro, agendamento e cancelamento.

### 4.3. Navegabilidade Completa por Teclado (Tab & Focus Visible)
* **Skip Link:** Primeiro elemento do documento (`<a href="#main-content" class="skip-link">`), permitindo a usuários de teclado pular o menu de navegação diretamente para o conteúdo principal.
* **Foco Visível de Alto Contraste (WCAG 2.4.7):**
  ```css
  :focus-visible {
    outline: 3px solid #0284C7 !important;
    outline-offset: 3px !important;
    box-shadow: 0 0 0 5px rgba(2, 132, 199, 0.3) !important;
  }
  ```
* **Navegação Intuitiva:**
  * Tecla `Tab` e `Shift + Tab` percorrem todos os campos na ordem lógica do fluxo.
  * Tecla `Esc` fecha imediatamente qualquer modal ou calendário aberto.
  * Teclas `Enter` e `Espaço` acionam botões e selecionam horários.

---

## 📱 Telas do Paciente Implementadas

| Aba | Tela | Funcionalidades Demonstrativas |
| :---: | :--- | :--- |
| **01** | **Boas-Vindas & Acesso** | Recepção acolhedora, CTAs na zona do polegar, benefícios diretos e socorro telefônico 0800. |
| **02** | **Login Seguro** | Login por CPF com máscara automática, botão bimodal `[ 👁️ Mostrar ]` / `[ 🙈 Ocultar ]` senha e recuperação por SMS. |
| **03** | **Novo Cadastro** | Formulário linear espaçado com *chunking* (Dados Pessoais + Contato), máscaras assistidas e validação positiva de senha. |
| **04** | **Minhas Consultas** | Listagem de consultas ativas em cards ricos, histórico retrátil e cancelamento seguro com dupla confirmação. |
| **05** | **Nova Consulta** | Seleção de especialidade médica, médico credenciado, calendário retrátil sob demanda e chips de horário (Manhã/Tarde). |
| **06** | **Reagendamento** | Card contextual de reconhecimento, mini calendário interativo, grade 2x2 de horários e botão de saída seguro. |
| **📋** | **Visão Geral & Diretrizes** | Painel técnico com os 4 critérios de avaliação, matriz de cores e documentação teórica do projeto. |

---

## 🚀 Como Executar o Projeto Localmente

Por ter sido construído com **HTML5, CSS3 e JavaScript nativo modular**, o projeto não exige Node.js, npm, Java ou Docker para ser executado:

1. Clone o repositório ou baixe os arquivos para o seu computador:
   ```bash
   git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   ```
2. Abra a pasta do projeto.
3. Dê um duplo clique no arquivo **`index.html`** (ou abra-o em qualquer navegador: Chrome, Edge, Firefox, Safari).
4. O protótipo carregará instantaneamente com todas as funcionalidades ativas!

---

## 🌐 Publicação e Hospedagem Gratuita (Deploy)

O projeto está 100% pronto para publicação em serviços de hospedagem gratuita com apenas 1 clique:

### Opção 1: GitHub Pages (Recomendado)
1. Crie um repositório no GitHub e envie os arquivos (`index.html`, `styles/`, `scripts/`, `README.md`).
2. No repositório, clique em **Settings** > **Pages** (no menu lateral esquerdo).
3. Na seção **Branch**, selecione `main` (ou `master`) e a pasta `/ (root)`.
4. Clique em **Save**.
5. Em poucos segundos, o GitHub fornecerá o link público do projeto (ex: `https://seu-usuario.github.io/seu-repositorio/`).

### Opção 2: Vercel ou Netlify
1. Acesse [vercel.com](https://vercel.com) ou [netlify.com](https://netlify.com).
2. Conecte sua conta do GitHub ou simplesmente arraste a pasta do projeto para o painel de *Deploy*.
3. O deploy será concluído em menos de 1 minuto sem nenhuma etapa de build.

---

## 💡 Justificativa das Tecnologias Utilizadas

1. **Bootstrap 5.3 (Framework Moderno de Mercado Obrigatório):** Utilizado como framework base para o grid responsivo, normalização de estilos e classes utilitárias, customizado internamente via CSS Variables (`--bs-primary`, `--bs-body-bg`, etc.) para atingir a paleta 60-30-10 e as diretrizes de contraste WCAG 2.1 AAA.
2. **HTML5 Semântico Puro:** Garante a melhor interoperabilidade possível com tecnologias assistivas (leitores de tela NVDA, TalkBack, VoiceOver) e elimina tags genéricas desprovidas de contexto.
3. **CSS3 com Custom Properties (`:root`):** Permite criar um Design System robusto, performático e escalável, viabilizando o **Modo Sênior dinâmico (+20%)** sem causar recarregamento de página.
4. **JavaScript Vanilla Modular (ES6+):** Código limpo dividido em responsabilidades bem definidas (`mock-services.js` para persistência e `app.js` para interface). Evita dependências pesadas de bibliotecas de terceiros, garantindo um carregamento ultrarrápido em dispositivos móveis de baixo custo com conexão 3G/4G.
5. **LocalStorage API:** Simula perfeitamente um banco de dados real e microserviços desacoplados, viabilizando a demonstração completa de fluxos transacionais (adicionar, editar, cancelar) sem custos de infraestrutura ou falhas de servidor durante a apresentação do trabalho.

---
*Projeto desenvolvido para fins acadêmicos e avaliação na disciplina de Front-End, UI/UX e Acessibilidade Digital.*
