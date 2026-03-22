# 🔐 Arquitetura: Autenticação, Banco de Dados e Painel Admin

**Caminho:** `psico/Arquitetura - Autenticação e Firebase.md`

Este documento formaliza o salto de escopo de uma página estática (Landing Page) para um **Sistema de Gestão de Pacientes (Web App)** com a utilização de serviços em nuvem (BaaS - Backend as a Service).

## 🚀 O Backend: Firebase
Para evitar os custos e o tempo de desenvolvimento em um backend em Node.js/Python, optamos por utilizar o **Google Firebase** através de sua integração oficial `@angular/fire`.

Ele nos fornecerá três serviços fundamentais:
1. **Firebase Authentication:** Criação da tela/pop-up de Login com o Google e gestão de segurança de Tokens (Session Hold).
2. **Cloud Firestore:** O Banco de Dados NoSQL escalável, em tempo real, que salvará os usuários e as requisições de consulta de forma estruturada.
3. **Firebase Hosting (Opcional):** Para hospedar o Angular de forma rápida no final do projeto.

---

## 🧭 O Fluxo de Dados e Perfilamento

O sistema dividirá os usuários em duas "Roles" (Permissões): **Paciente** e **Administrador** (Psicóloga). O Firebase Auth gerencia as contas, mas o Angular guiará o que cada um pode ver.

### 1. Perfil: Paciente
Quando um mero visitante na aba "Agende sua Sessão" clicar em "Continuar com o Google":
- O Firebase faz o login nativo com 1 clique (OAuth).
- O Angular verifica se esse E-mail já existe no Firestore. Se não existir, criamos o seu perfil: `{ "uid": "xyz123", "nome": "João", "email": "joao@gmail.com", "role": "pacient" }`.
- Uma vez logado, o paciente pode preencher o **Formulário de Pré-Agendamento/Contato** (ex: informando que quer terapia individual ou telefone). Os dados não vão para um e-mail, vão diretamente salvos para a coleção `consultations` no Banco de Dados Firestore atrelados ao seu `uid`.

### 2. Perfil: Administrador (Sra. Jessica Regina)
Haverá uma rota "secreta" protegida pelas guardas de rotas (`AuthGuard`) do Angular. Por exemplo: o site no caminho `/admin`.

- Quando a psicóloga fizer o Login com a sua conta do Gmail, o Angular detectará a role (`"role": "admin"`) no banco de dados.
- Ao entrar, ao invés da Landing Page, ela observará um **Dashboard**.
- O Angular puxará do *Firestore* todas as solicitações de contato/consultas cadastradas por todos os pacientes.
- Ela poderá ler as respostas, acessar o Telefone/E-mail de cada paciente, e até clicar em "Marcar como Contatado" (atualizando o *Status* no Banco de Dados).

---

## 🧩 Os Novos Componentes do Angular
Para suprir essa arquitetura, novos componentes serão criados (ou refatorados):

### Novos Módulos:
1. **Módulo de Auth:** Para manter a lógica isolada (botão de login, lógica do serviço do Google).
2. **Dashboard (Admin):** Uma tela independente, com Sidebar e Tabela de leads (pacientes a contatar).
3. **Painel do Paciente (Opcional Futuro):** Uma tela onde ele vê o horário agendado. Parcialmente em nossa primeira etapa, será apenas o Form de Cadastro de Contato.

### Componentes Afetados:
- **[[HeaderComponent]]**: Recebe lógicas de estado. Se o usuário estiver Deslogado, mostra "Agendar"; se estiver logado, altera botão para "Meu Perfil" ou "Foto do Google" e botão "Sair" (Logout).

*Voltar para: [[Visão Geral do Projeto]]*
