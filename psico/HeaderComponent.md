# 🧭 HeaderComponent

**Caminho:** `src/app/core/header/header.component.ts`

O **HeaderComponent** é o menu superior da aplicação que fica disponível independente de que altura o visitante esteja na página.
Faz parte do módulo/pasta arquitetural **[[Core]]**.

## 📍 Responsabilidade: Navegação
Sua responsabilidade é abrigar a logomarca da psicóloga (ou texto principal) e fornecer o _Menu de Navegação_.

Cada link deste menu (ex: "Sobre", "Serviços", "FAQ") usa âncoras (`#about`, `#services`) que operam via "smooth scroll". Ao invés de o visitante mudar de página (com uma rota comum), a tela rola suavemente até a div/id do respectivo componente da pasta [[Features]].

## 📞 Estímulo
Normalmente apresenta também um botão "Call to Action" na extremidade direita do menu ("Agende uma Conversa" ou WhatsApp), fornecendo um acesso rápido a pacientes quentes que não querem ler toda a página.

*Voltar para: [[Visão Geral do Projeto]]*
