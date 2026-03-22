# 🚀 Features

**Caminho:** `src/app/features/landing/`

As **Features** (ou Funcionalidades) no Angular agrupam o código por "contexto ou domínio de negócio". Nesta Landing Page, isolamos todas as "sessões" visíveis da página dentro de Features.

Diferente do [[Core]] (onde o foco é a estrutura ou layout), nas _Features_ está o recheio: a proposta de valor, os serviços e o conteúdo que convence o visitante.

## 🎯 Componentes de Feature:
O conteúdo flui de cima para baixo através dos seguintes blocos:
1. **[[HeroComponent]]**: A chamada chamativa inicial (Hero Banner).
2. **[[AboutComponent]]**: Conteúdo "Sobre a Psicóloga".
3. **[[ServicesComponent]]**: A lista de serviços oferecidos.
4. **[[HowItWorksComponent]]**: Explicação de como funciona o passo a passo.
5. **[[FaqComponent]]**: Perguntas Frequentes (matando objeções).

## 💡 Princípio:
Na arquitetura de Componentes Standalone (Angular 14+), cada componente da *Feature* gerencia seu próprio HTML, CSS e lógica, importando somente o que precisa. Todos eles são orquestrados e combinados no [[AppComponent]].

*Voltar para: [[Visão Geral do Projeto]]*
