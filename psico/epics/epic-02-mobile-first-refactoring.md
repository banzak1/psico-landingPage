# Epic 02: Refatoração Responsiva Mobile-First

## Visão Geral

Este épico aborda a transição arquitetural de CSS do projeto de **Desktop-First** para **Mobile-First**. O objetivo é solucionar diversos problemas visuais reportados, garantindo que o layout seja otimizado primariamente para dispositivos móveis (telas menores) e, de forma fluida, evolua e expanda para tablets e desktops utilizando media queries `@media (min-width: ...)`.

Além das correções na Landing Page principal, este épico engloba uma atenção especial ao **Dashboard de Admin**, que atualmente apresenta problemas de quebra de layout mesmo em desktop, agravando-se no mobile.

## Objetivos (Goals)

1. **Padronização Mobile-First**: Inverter a lógica atual em todos os componentes que utilizam `max-width`, passando a definir estilos base para celular e `min-width` para telas maiores.
2. **Correção Visual da Landing Page**: Refatorar os componentes `Header`, `Hero`, `About` e `How-it-Works` para uma apresentação limpa em resoluções de ~320px até ~425px, e expansão correta para desktop (~992px+).
3. **Refatoração do Admin**: Corrigir quebras de layout na aba de administração tanto no desktop quanto no mobile.
4. **Padronização de Variáveis de Breakpoints**: Definir explicitamente os breakpoints adotados (ex: 768px para md, 992px para lg) em `styles.scss`.

## Escopo e Tarefas (Features/Tasks)

### 1. Global & Estrutura Base
- [ ] Atualizar `styles.scss` para que paddings (ex: `.section`), tipografia (ex: `.section-title`) sejam mobile-friendly por padrão.
- [ ] Definir media queries com `min-width` para redimensionar globalmente em telas maiores.

### 2. Header & Navegação
- [ ] Refatorar `header.component.scss` para que o estado inicial (mobile) utilize o menu hambúrguer escondido.
- [ ] Exibir menu horizontal (`.header-actions`) apenas em `min-width: 768px`.

### 3. Hero Component
- [ ] Ajustar layout inicial do `hero.component.scss` para uma coluna centralizada.
- [ ] Aplicar grid de duas colunas apenas em `min-width: 992px`.
- [ ] Redimensionar imagens/shapes para não estourarem a largura (overflow) no mobile.

### 4. About & How it Works
- [ ] Refatorar `about.component.scss` substituindo max-width por estilos base em cascata.
- [ ] Validar e corrigir responsividade em `how-it-works.component.scss`.

### 5. Admin Dashboard
- [ ] Auditar e corrigir as quebras de layout na visualização desktop atual do Admin.
- [ ] Implementar scroll horizontal em tabelas ou alterar o layout de dados em grid/cards para visualização mobile.
- [ ] Garantir que o painel lateral (sidebar/menu admin) seja recolhível ou convertido em offcanvas no celular.

## Critérios de Aceite

1. Inspecionar as rotas da Landing e do Admin pelo Chrome DevTools no modo responsivo (ex: iPhone SE - 375px) e não constatar "overflow" horizontal indesejado ou textos superpostos.
2. Inspecionar as rotas no modo Desktop e garantir que o layout se expanda para ocupar a tela eficientemente (ex: retorno das duas colunas no Hero).
3. A experiência do Administrador no painel, seja em Desktop ou Mobile, não deve apresentar blocos de informação cortados ou ilegíveis.

## Dependências

- `Epic 01` (Criação do Admin): O Admin já deve estar funcional para as correções aplicarem efeito aos componentes existentes.

## Padrões de Breakpoints Recomendados

- `sm`: 576px (Tablets pequenos/Phablets)
- `md`: 768px (Tablets)
- `lg`: 992px (Desktops pequenos)
- `xl`: 1200px (Desktops grandes)
