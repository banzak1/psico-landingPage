# 🧠 Psico Landing Page & Admin Dashboard

[![Angular](https://img.shields.io/badge/Angular-17.3-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Uma solução digital completa e de alta performance desenvolvida sob medida para a clínica de psicologia da **Dra. Jessica Regina**. Este projeto une uma **Landing Page institucional** altamente responsiva e otimizada para conversão a um **Painel Administrativo (Web App)** seguro para gestão clínica, prontuário eletrônico e fluxo de caixa.

---

## 🚀 Recursos Principais (Features)

### 🖥️ Landing Page Institucional
* **Design Premium e Acolhedor:** Paleta de cores quentes e terrosas (Terracota, Bege e Rosa Pastel) alinhada à estética de autocuidado e alta credibilidade.
* **Componentes Standalone Otimizados:**
  * **Hero Section:** Banner inicial de alto impacto focado em conversão imediata.
  * **Sobre Mim:** Apresentação da abordagem humanizada e autoridade profissional.
  * **Especialidades:** Grade dinâmica de serviços terapêuticos (Terapia Individual, Casal, Orientação Vocacional, etc.).
  * **Como Funciona:** Jornada passo a passo para reduzir a ansiedade do paciente no primeiro contato.
  * **FAQ Reativo:** Seção de perguntas frequentes em acordeão para quebrar objeções práticas.
* **Captação de Leads Reativa:** Formulário de contato no rodapé integrado em tempo real com o Firestore.

### 🔑 Painel Administrativo de Gestão Clínica (`/admin`)
* **Autenticação Segura:** Login social rápido via Google OAuth (Firebase Authentication) com sincronização automática de perfis.
* **Dashboard Geral de Métricas:**
  * Visualização de sessões do dia e atalho para prontuários.
  * Painel financeiro em tempo real (Faturamento Bruto, Faturamento Líquido descontando taxas da clínica e Contas a Receber).
  * Gestão de novos contatos com conversão automatizada de "Lead" para "Paciente Ativo".
* **Gestão de Pacientes & Prontuários (EHR):**
  * CRUD completo de Pacientes e pacotes de sessões contratados.
  * Registro de Evoluções Clínicas textuais protegidas por criptografia e regras de segurança rígidas.
* **Controle de Sessões:** Agendamento e controle de status de atendimento (Agendada, Realizada, Cancelada) e pagamento (Pendente, Pago).

---

## 🛠️ Stack Tecnológica & Qualidade

* **Frontend:** Angular 17 (Standalone Components, Signals para reatividade local e RxJS para fluxos de dados assíncronos).
* **Styling:** SCSS modularizado baseado em tokens globais de estilo (breakpoints, espaçamentos e cores).
* **Backend as a Service (BaaS):** Google Firebase (Auth & Cloud Firestore).
* **Segurança:** Regras de acesso restritas via `firestore.rules` (Garantindo que pacientes só acessem seus próprios dados e evoluções clínicas fiquem visíveis unicamente para o psicólogo responsável).
* **Testes Automatizados:** Jest + `jest-preset-angular` com **cobertura de testes de 100%** (Branches, Functions, Lines e Statements) para garantir a estabilidade das regras de negócio.
* **Qualidade de Código:** ESLint, Husky e Commitlint integrados para manter o repositório padronizado.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (versão recomendada: 18 ou 20)
* Angular CLI instalado globalmente (`npm install -g @angular/cli`)

### Instruções

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/psico-landing-page.git
   cd psico-landing-page
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento local:**
   ```bash
   npm run local
   ```
   A aplicação estará disponível em `http://localhost:4202/`.

4. **Rodar a suíte de testes unitários (Jest):**
   ```bash
   # Rodar todos os testes
   npm run test
   
   # Rodar com cobertura de código (100% obrigatório)
   npm run test:coverage
   ```

5. **Executar a verificação do linter:**
   ```bash
   npm run lint
   ```

---

## 🔒 Regras do Firestore (`firestore.rules`)

As regras de segurança garantem a conformidade com a LGPD e privacidade do paciente:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /leads/{leadId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /patients/{patientId} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /evolutions/{evolutionId} {
      allow create: if request.auth != null && request.resource.data.psychologistId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.psychologistId == request.auth.uid;
    }
  }
}
```
