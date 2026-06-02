# Épico 01: Criação do Dashboard de Gestão Clínica e Prontuário Eletrônico

**Data de Criação:** Junho de 2026
**Status:** Em Planejamento

## 📋 Resumo Executivo (Elevator Pitch)
Atualmente, a área administrativa do sistema atua apenas como um repositório básico de captação de leads. Este Épico visa transformar o espaço logado em um **Dashboard de Gestão Clínica Completo**, focado nas operações diárias da psicóloga. 

A solução permitirá a transição fluida de um "contato do site" para um "paciente ativo", o agendamento de sessões, o controle do fluxo de caixa (pagamentos) e o registro do histórico clínico (evoluções e documentos). Com isso, centralizaremos a gestão da clínica em uma única plataforma, eliminando a necessidade de planilhas paralelas ou sistemas terceiros de prontuário.

## 🎯 Valor de Negócio e Objetivos
* **Por que estamos fazendo isso?** Para aumentar a eficiência operacional da clínica, garantindo previsibilidade de caixa (rastreando sessões não pagas) e centralizando o histórico do paciente em um ambiente seguro, profissionalizando o atendimento.
* **Quem será impactado?** A Persona principal é a **Psicóloga/Administradora** (usuária do sistema). Secundariamente, os **Pacientes** são impactados de forma indireta por um atendimento mais organizado.

## 📊 Métricas de Sucesso (KPIs)
* **Adoção do Sistema:** 100% dos pacientes ativos migrados e gerenciados através da nova plataforma.
* **Redução de Inadimplência:** Reduzir o número de sessões com pagamento "pendente" há mais de 7 dias para próximo de zero, através da fácil visualização no dashboard financeiro.
* **Eficiência:** Reduzir em 50% o tempo gasto pela psicóloga para consultar o histórico de um paciente antes da sessão começar.

## 🚧 Escopo
* **O que ESTÁ no escopo:**
  * Criação de fluxos de CRUD (Criar, Ler, Atualizar, Deletar) para Pacientes, Sessões e Prontuários (Evoluções textuais).
  * Painel/Dashboard inicial com visão geral de métricas do dia.
  * Módulo financeiro simplificado atrelado ao status das sessões (Pago/Não Pago).
  * Layout base e estrutura de navegação lateral (Sidebar) exclusiva para a área logada.
* **O que NÃO ESTÁ no escopo:** 
  * Integração com gateways de pagamento (Pix/Cartão automático).
  * Disparos automáticos de lembretes pelo WhatsApp API (será tratado em um Épico futuro).
  * Upload de arquivos físicos/anexos pesados nesta primeira versão (foco inicial será no registro de documentos textuais/evoluções no banco de dados).

## 🧩 Desdobramento de Histórias (Story Breakdown)
- [ ] **Story 1:** Criar a Estrutura de Navegação (Layout) e Rotas da Área Restrita
- [ ] **Story 2:** Gerenciamento de Pacientes (CRUD e Conversão de Leads)
- [ ] **Story 3:** Agendamento e Controle de Status de Sessões
- [ ] **Story 4:** Registro de Evolução Clínica (Prontuário de Texto) no Perfil do Paciente
- [ ] **Story 5:** Painel de Resumo Financeiro (Contas a Receber vs Recebidas) e Visão Geral do Dia

## ⚠️ Riscos e Dependências
* **Risco Técnico:** Complexidade na arquitetura de rotas (Nested Routes e Lazy Loading no Standalone Components) para manter a performance alta.
* **Segurança/LGPD:** Os dados armazenados (evoluções clínicas) são dados sensíveis de saúde. Dependemos de regras de segurança rigorosas no Firestore (Security Rules) para garantir que apenas o administrador autenticado tenha acesso a essas coleções.
