# 🏗️ Core

**Caminho:** `src/app/core/`

O módulo ou pasta **Core** em projetos Angular serve para guardar tudo aquilo que a aplicação precisa carregar de maneira **global** ou **única** no projeto.

Neste projeto de Landing Page, o Core foi utilizado para armazenar os componentes que funcionam como "moldura" para o restante do conteúdo. Eles não são instanciados várias vezes e nem têm lógica muito complexa, mas devem estar sempre visíveis ou prontos para a aplicação.

## 📂 Componentes Inclusos:
- **[[HeaderComponent]]**: O menu de navegação que fica no topo da tela. Fornece links que executam uma "rolagem suave" (smooth scroll) até a seção desejada.
- **[[FooterComponent]]**: O rodapé da página. Contém informações de contato e links importantes, garantindo um bom fechamento da Landing Page.

## 🎯 Por que separar?
Separar os componentes de "Core" dos componentes de "Features" mantém a arquitetura limpa:
- **Core** = Singleton, global, coisas de infraestrutura ou layout que envolve a página.
- **[[Features]]** = O conteúdo e lógica de negócio em si.

*Voltar para: [[Visão Geral do Projeto]]*
