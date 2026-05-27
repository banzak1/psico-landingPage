# ✅ Correções Aplicadas: Login com Google Auth

**Data:** 2026-05-11
**Referência:** [[Auditoria - Login Google Auth]]

Este documento resume as correções implementadas com base na auditoria realizada.

---

## 🔴 BUG 1 — `handleRedirectResult()` no `constructor` (CORRIGIDO ✅)

**O que foi feito:**
- Removido o `constructor` que chamava `handleRedirectResult()` imediatamente.
- Criado novo método público `initRedirectListener()`.
- Registrado um `APP_INITIALIZER` no `app.config.ts` que chama `initRedirectListener()` durante o bootstrap do Angular.
- Isso garante que o Firebase Auth já está 100% inicializado quando o resultado do redirect é processado.

**Arquivos alterados:**
- `src/app/core/services/auth.service.ts`
- `src/app/app.config.ts`

---

## 🔴 BUG 2 — `adminGuard` com `take(1)` capturando `null` inicial (CORRIGIDO ✅)

**O que foi feito:**
- Adicionado `filter(profile => profile !== undefined)` antes do `take(1)`.
- O `userProfile$` do `AuthService` agora emite 3 estados: `undefined` (carregando), `null` (deslogado), `UserProfile` (logado).
- O guard agora espera o Firebase resolver o estado real antes de tomar decisão.

**Arquivos alterados:**
- `src/app/core/guards/admin.guard.ts`
- `src/app/core/services/auth.service.ts` (ajuste no tipo de retorno do `userProfile$`)

---

## 🟡 PROBLEMA 5 — `ContactService` sem `uid` vinculado (CORRIGIDO ✅)

**O que foi feito:**
- Adicionado o campo `uid` na interface `ContactLead`.
- O `ContactService` agora injeta o `AuthService` e busca automaticamente o `uid` do usuário logado.
- O `createdAt` também é preenchido automaticamente com `new Date().toISOString()`.
- Se o usuário não estiver logado, o uid é salvo como `'anonymous'`.

**Arquivo alterado:**
- `src/app/core/services/contact.service.ts`

---

## 🟡 PROBLEMA 4 — Firestore Security Rules (CRIADO ✅)

**O que foi feito:**
- Criado o arquivo `firestore.rules` na raiz do projeto com as seguintes regras:
  - Coleção `users`: Apenas o próprio usuário pode ler/escrever seu documento.
  - Coleção `leads`: Qualquer pessoa logada pode criar; apenas admin pode ler todos.

> [!WARNING]
> Essas regras precisam ser aplicadas manualmente no Console do Firebase, pois o Firebase CLI não está instalado.

**Arquivo criado:**
- `firestore.rules`

---

## 🟠 PROBLEMA 6 — Testes Unitários Reais (CORRIGIDO ✅)

**O que foi feito:**
- Reescritos os testes de `auth.service.spec.ts`, `admin.guard.spec.ts` e `contact.service.spec.ts`.
- Criado o `header.component.spec.ts` que não existia.
- **Resultado: 31 de 31 testes passando com 0 falhas.**

**Nota técnica:** Os exports do `@angular/fire` são read-only (ES modules). Isso impediu o uso de `spyOn` diretamente nas funções do SDK Firebase. A solução foi usar `spyOnProperty` nos getters do serviço e mock via DI nos outros testes.

**Arquivos alterados/criados:**
- `src/app/core/services/auth.service.spec.ts`
- `src/app/core/services/contact.service.spec.ts`
- `src/app/core/guards/admin.guard.spec.ts`
- `src/app/core/header/header.component.spec.ts` [NOVO]

---

## 🔵 ADIADO — Chaves do Firebase expostas no repositório

Adiado para uma etapa posterior, quando houver setup de CI/CD. Não bloqueia o desenvolvimento.

*Voltar para: [[Auditoria - Login Google Auth]] | [[Arquitetura - Autenticação e Firebase]] | [[Visão Geral do Projeto]]*
