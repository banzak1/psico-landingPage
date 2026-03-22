# 🤖 Diretrizes Gerais e Padrões de Código

**Origem:** Importado interpertando o `GEMINI.md` da raiz do projeto.
**Caminho Principal do Vault:** `psico/Diretrizes de Código.md`

Este documento contém as preferências absolutas e as tecnologias utilizadas no desenvolvimento desta aplicação. Qualquer código escrito deve respeitar rigidamente estas regras.

## 🎨 Contexto e Design
- **Projeto:** Landing Page completa, responsiva e de alta performance.
- **Framework:** Angular 17.
- **Arquitetura:** Standalone Components (sem NgModules).
- **Design System / Paleta de Cores:** Quentes e terrosas (Terracota, Bege e Rosa Pastel), focando em estética de auto cuidado moderno e alta credibilidade para a Dra. Jessica Regina.
- **Estilo:** `SCSS` gerado preferencialmente via schematics (`ng generate`).

## 🧱 Estrutura e Convenções de Código
1. **Idioma:** Usar inglês para o código, nomes de variáveis, JSDoc e comentários. Português apenas no conteúdo final visual (HTML) e documentações do Obsidian.
2. **Tipagem:** TypeScript em sua melhor forma. Evite tipagens complexas em linha (use `interfaces`) e é totalmente **proibido o uso de `any`** quando o tipo for conhecido. Priorize `unknown`. Se for realmente necessário ignorar o linter, adicione o comentário justificador.
3. **Paths/Atalhos:**
   - `@/` aponta para `src/app/content`
   - `~/` aponta para `src/`
   *(Regra: Evite caminhos relativos complexos, use os atalhos. Mas se estiverem na mesma pasta, o caminho relativo curto é melhor).*
4. **Organização Funcional:** Componentes de uso global/repetido não devem possuir regra de negócio engessada neles mesmos.
5. **Navegação (Acessibilidade/UX):** Validar padrão de tecla _Enter_ para avançar em formulários (`OmniSubmitOnEnterDirective`) e usar `AutofocusDirective` no primeiro input da tela.
6. **Deploy de Rotas:** Utilizar *Lazy Loading*. Mantenha comentários de chunking como `/* webpackChunkName: "nome" */` nas rotas filhas.
7. **Linter:** Siga as regras configuradas pelo `eslint`. Rode `npm run lint:fix` frequentemente. Não crie componentes com lixo ou espaços não utilizados (código claro fala por si só).

## 🧪 Testes Unitários
- **Ferramentas:** Jest + `jest-preset-angular`.
- **Cobertura Exigida:** **100% global** (Branches, Funções, Linhas e Statements). Nenhum código entra sem teste de qualidade. Exclusões de cobertura ocorrem só via `jest.config.ts` ou Sonar.
- **Título Padrão:** Os arquivos `.spec.ts` devem ser nomeados em inglês e complementar o `it` de forma semântica (ex: `it should request`, `it should call`, `it renders`).
- **Validação Lógica:** Os testes precisam validar comportamentos reais da aplicação, não apenas "chamar uma função para ganhar porcentagem de cobertura no Jest".

## 🚀 Comandos de Execução Úteis
- `npm run local` (Desenvolvimento padrão, porta `4202`).
- `npm run lint` ou `npm run lint:fix`
- `npm run test` (Testes comuns)
- `npm run test:watch` (TDD)
- `npm run test:coverage` (Gerar mapa de cobertura no `/coverage`)

*Voltar para: [[Visão Geral do Projeto]] | Ler regras de escopo: [[Regras de Desenvolvimento]]*
