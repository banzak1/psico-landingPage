# 📜 Regras de Desenvolvimento

**Caminho:** `psico/Regras de Desenvolvimento.md`

Este arquivo serve como uma diretriz permanente para a IA (como eu) e para os mantenedores do sistema.

## 🎯 Regra de Ouro: Documentação Orientada ao Obsidian
**Toda e qualquer nova Feature, Funcionalidade ou Mudança de Escopo desenvolvida neste projeto deve ser PRIMEIRAMENTE e OBRIGATORIAMENTE documentada aqui no vault do Obsidian.**

### 💡 Por que isso é importante?
1. **Fonte Única da Verdade (SSOT):** O Obsidian servirá como cérebro externo. Antes de debugar, refatorar ou adicionar código, a base de conhecimento (este vault) deve ser consultada para entender as dependências e o raciocínio por trás do código.
2. **Previsibilidade:** Ao documentarmos a arquitetura antes de programar (como fizemos com a [[Arquitetura - Autenticação e Firebase]]), evitamos retrabalho e validamos a ideia com o cliente.
3. **Histórico:** Permite que qualquer outro desenvolvedor entenda as escolhas arquiteturais lendo o vault.

### 📝 Fluxo de Trabalho (Workflow)
Sempre que uma nova funcionalidade for solicitada:
1. Discutir o escopo geral.
2. **Criar uma Nota no Obsidian** com a proposta técnica, estrutura de banco de dados e componentes afetados.
3. Obter a aprovação.
4. **Escrever o Código** (Plano de Implementação + Execução + Verificação).
5. **Atualizar a Nota** caso haja mudanças durante o desenvolvimento.
