# Instruções para Agentes de IA

Contexto: Este repositório é uma Landing Page completa, responsiva e de alta performance utilizando Angular 17 com a arquitetura de Standalone Components. O projeto adotou a paleta de cores quentes e terrosas (Terracota, Bege e Rosa Pastel), conforme solicitado para a psicóloga Jessica Regina, trazendo estética de auto cuidado moderno e alta credibilidade.


## Visão Geral


## Estrutura & Convenções
- Features: cada pasta em `features/<nome>` define `<nome>.routes.ts` (rotas da feature) e pode ter `pages/` ou outras pastas específicas da feature.
- Usar SCSS (schematics já configurado). Gerar artefatos com `ng generate` e depois ajustar caminhos e nomes.
- Path aliases: `@/` aponta para `src/app/content`, `~/` para `src/`. Prefira usar estes aliases em imports internos. Evite usar caminhos relativos complexos ou os aliases quando o caminho for curto e claro.
- Usar idioma ingles para código e comentários/JSDoc, exceto documentações internas (.md) e path de rotas
- Validar html semântico. Não há premissas de acessibilidade, mas validar padrão de tecla enter para avançar etapas/telas com OmniSubmitOnEnterDirective e foco automático em inputs de texto quando este for o primeiro input da tela com AutofocusDirective.
- Seguir convenções de estilo do ESLint configurados.
- Evitar comentários desnecessários; código claro deve falar por si.
- Evitar tipagens em linha quando complexas; usar interfaces/tipos nomeados.
- Evitar "any" sempre que o tipo for conhecido; Priorizar `unknown` se possível. Adicionar disables de lint apenas em último caso com comentário explicativo.
- Validar escopo de componentes reutilizáveis/evitar regra de negócio específica em componentes reutilizáveis.
- Gerar componentes/serviços/pipes: `ng generate <type> <name>`
- Caso algum arquivo tenha seu conteúdo alterado e este conteúdo esteja relacionado a alguma documentação, atualizar também a documentação.
- Evitar dependências circulares.

## Rotas & Navegação
- Rotas carregadas por lazy: manter comentário `/* webpackChunkName: "nome" */` para otimizar chunks.
- Para novas rotas globais, editar apenas `app-routing.module.ts`; para rotas de domínio, criar/alterar `<feature>.routes.ts`.

## Build & Execução
- Desenvolvimento local: `npm run local` (porta 4202). Ambientes: `local:dev|prd` mudam replacements de `environment.*`.
- Builds específicas com deploy URL: `build:dev|prd`. Preserve `--deploy-url` adequado ao ambiente.
- Lint estrito: `npm run lint` roda ESLint + TypeScript (sem emitir) + build. Corrigir via `npm run lint:fix` antes de commit.

## Testes
- Jest + `jest-preset-angular`; ambiente custom `jsdom.config.ts`; setup em `jest.setup.ts`.
- Cobertura 100% global (branches/funcs/linhas/statements). Não reduza thresholds; ao criar código novo, escreva testes mantendo cobertura.
- Validar se o teste faz sentido (não apenas para aumentar cobertura, por ex: "should call x function" e o corpo do teste chama diretamente a função x).
- Exclusões de cobertura: consultar `jest.config.ts` e `sonar-project.properties`.
- Manter equivalência entre jest e sonar (caso novas configurações sejam adicionadas em jest.config ou sonar-project.properties).
- Scripts: `npm run test`, `test:watch`, `test:coverage` (gera relatório em `coverage/`).
- Os testes devem possuir títulos em inglês e o título deve complementar o “it” (it requests, it calls, ou it should call, it should request)

