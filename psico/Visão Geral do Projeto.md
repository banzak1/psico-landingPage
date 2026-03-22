# Visão Geral: Psicóloga Landing Page

Este projeto é uma **Landing Page** responsiva desenvolvida em **Angular 17** para a psicóloga Jessica Regina. A arquitetura principal foi focada no uso de **Standalone Components**, dispensando o uso tradicional de `NgModules` e garantindo uma aplicação mais leve e direta.

---

## 🏗️ Estrutura e Arquitetura

O código principal fica armazenado no diretório `src/app`, e foi organizado da seguinte maneira:

1. **[[Core]] (`src/app/core/`)**
   Contém componentes estruturais globais que estão sempre presentes em tela e servem de moldura para a aplicação.
   - **[[HeaderComponent]]**: O menu superior de navegação com as âncoras para as seções da página.
   - **[[FooterComponent]]**: O rodapé final, focado nas informações de contato (como Telefone e E-mail da Dra. Jessica).

2. **[[Features]] (`src/app/features/landing/`)**
   Agrupa as seções específicas de negócio e do conteúdo que compõem o corpo da Landing Page.
   - **[[HeroComponent]]**: A seção inicial de impacto (Banner), com foco direto em prender a atenção e apresentar a principal *Call to Action* (chamada para ação).
   - **[[AboutComponent]]**: A seção "Sobre Mim", detalhando a abordagem, humanizando a psicóloga e gerando conexão com o paciente.
   - **[[ServicesComponent]]**: A listagem prática dos serviços oferecidos e abordados nas consultas.
   - **[[HowItWorksComponent]]**: Passo a passo da jornada do paciente, para trazer previsibilidade (ex: "agendamento -> primeira sessão -> tratamento contínuo").
   - **[[FaqComponent]]**: Perguntas Frequentes (FAQ), focado em quebrar as objeções e dúvidas comuns antes do agendamento.

---

## 🔗 Ligação entre as Funcionalidades

O funcionamento da página é inteiramente gerido pelo **[[AppComponent]]** (`app.component.ts`), que une todos esses componentes em um único fluxo de usuário.

O fluxo de navegação da página (Single Page Application) funciona da seguinte forma:

1. O usuário entra e logo vê o **[[HeaderComponent]]**, que fica ancorado na parte superior.
2. O conteúdo vem logo abaixo através de um fluxo contínuo em cascata:
   - Apresentação & Promessa -> **[[HeroComponent]]**
   - Quem sou eu -> **[[AboutComponent]]**
   - O que eu trato -> **[[ServicesComponent]]**
   - Como começar -> **[[HowItWorksComponent]]**
   - Respostas Finais -> **[[FaqComponent]]**
3. O fim do fluxo leva naturalmente o usuário até as informações diretas de contato no **[[FooterComponent]]**.
4. Qualquer clique nos links do menu (**[[HeaderComponent]]**) executa o "smooth scroll" (rolagem suave) levando o paciente diretamente para a altura correspondente do componente específico na tela.

---

## 🛠️ Ferramentas de Desenvolvimento e Qualidade

O projeto também conta com scripts e configurações para garantir a integridade técnica durante a sua evolução:
- **Husky** e **Commitlint**: Configurados na raiz (`.husky`, `commitlint.config.js`) para garantir que todas as mudanças no código (commits) sigam um padrão estruturado.
- **ESLint**: Linter estabelecido (`.eslintrc.json`) para padronizar e evitar erros no código TypeScript.
- **Jest**: Configurado para rodar testes automatizados de comportamento (`.spec.ts`) nas funcionalidades dos componentes criados.
