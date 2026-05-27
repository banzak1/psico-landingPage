# 🔍 Auditoria: Login com Google Auth

**Data:** 2026-05-11
**Escopo:** Verificação completa do fluxo de autenticação Google (OAuth) via Firebase no projeto Angular 17.
**Arquivos Analisados:**
- `src/app/app.config.ts`
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/auth.service.spec.ts`
- `src/app/core/services/contact.service.ts`
- `src/app/core/services/contact.service.spec.ts`
- `src/app/core/guards/admin.guard.ts`
- `src/app/core/guards/admin.guard.spec.ts`
- `src/app/core/header/header.component.ts`
- `src/app/core/header/header.component.html`
- `src/app/core/header/header.component.css`
- `src/app/app.routes.ts`
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `angular.json`

---

## 🚨 Bugs Críticos (Impedem o Funcionamento)

### BUG 1: `handleRedirectResult()` executa no `constructor` e quebra com mock vazio
**Arquivo:** `auth.service.ts` (linha 31)
**Severidade:** 🔴 Crítico

O `constructor` chama `this.handleRedirectResult()` imediatamente. Essa função usa `getRedirectResult(this.auth)`, que é uma função do SDK Firebase que **precisa de uma instância real e inicializada do `Auth`**.

**Problemas concretos:**
1. Se o Firebase demorar para inicializar (rede lenta), o `getRedirectResult` pode ser chamado antes do SDK estar pronto, gerando erros silenciosos.
2. Nos testes unitários (`auth.service.spec.ts`), o mock do Auth é apenas `{}` (objeto vazio). Quando o `TestBed.inject(AuthService)` roda, o constructor é executado e chama `getRedirectResult({})`, que vai lançar um erro porque `{}` não é uma instância válida de `Auth`.

**Correção sugerida:** Mover o `handleRedirectResult()` para fora do `constructor`. Usar o `APP_INITIALIZER` do Angular ou chamá-lo de forma condicional apenas quando houver um `auth` válido. Alternativamente, envolver em um `try/catch` mais robusto com verificação de estado.

---

### BUG 2: `adminGuard` usa `take(1)` em um Observable que pode emitir `null` antes dos dados reais
**Arquivo:** `admin.guard.ts` (linha 11)
**Severidade:** 🔴 Crítico

O guard faz:
```typescript
return authService.userProfile$.pipe(
  take(1),
  map(profile => { ... })
);
```

O `userProfile$` internamente faz um `switchMap` no `user$` (que é o Firebase Auth state). Quando a página carrega, o Firebase Auth **sempre emite `null` primeiro** enquanto verifica se há sessão persistida, e só depois emite o `User` real.

Com `take(1)`, o guard vai capturar esse **primeiro `null`**, concluir que não há admin logado, e redirecionar para `/` — mesmo que o usuário **esteja** logado e seja admin. O login simplesmente nunca "passaria" no guard.

**Correção sugerida:** Substituir `take(1)` por `skipWhile(profile => profile === undefined)` + `take(1)`, ou usar `first(profile => profile !== null)` para esperar até o Firebase emitir o estado real de autenticação. Isso exige diferenciar `undefined` (ainda carregando) de `null` (definitivamente deslogado) no `userProfile$`.

---

## ⚠️ Problemas Importantes (Não Impedem, Mas São Riscos)

### PROBLEMA 3: Dados sensíveis do Firebase expostos no `environment.ts` versionado
**Arquivos:** `environment.ts` e `environment.development.ts`
**Severidade:** 🟡 Importante

As chaves do Firebase (apiKey, appId, projectId) estão hardcoded. Embora chaves do Firebase **não sejam secretas** por design (a segurança vem das Firestore Rules e Auth Rules), é uma boa prática colocá-las em variáveis de ambiente do CI/CD e **não** commitá-las no repositório público. Validar se o `.gitignore` cobre esses arquivos.

---

### PROBLEMA 4: Ausência de Firestore Security Rules no projeto
**Severidade:** 🟡 Importante

Não existe nenhum arquivo `firestore.rules` ou `firebase.json` no projeto. Isso significa que:
- Qualquer pessoa autenticada pode ler/escrever em qualquer coleção.
- Ou pior: as rules padrão do Firebase podem estar bloqueando tudo (modo teste expira em 30 dias).

Precisamos criar regras como: *"Apenas o próprio usuário pode escrever no seu documento"* e *"Apenas admins podem ler a coleção `leads`"*.

---

### PROBLEMA 5: `ContactService` não vincula o `lead` ao UID do usuário logado
**Arquivo:** `contact.service.ts`
**Severidade:** 🟡 Importante

A interface `ContactLead` pede `name`, `email`, `phone`, `message` e `createdAt`, mas **não inclui o `uid`** do Firebase Auth. Isso significa que quando o admin vir a lista de leads, não poderá cruzar o lead com o perfil completo salvo na coleção `users`. Os dados ficam "órfãos".

**Correção sugerida:** Adicionar o campo `uid` à interface `ContactLead` e preenchê-lo automaticamente no serviço usando o `AuthService.user$`.

---

## 📝 Problemas Menores (Qualidade de Código)

### PROBLEMA 6: Testes unitários são apenas "smoke tests"
**Arquivos:** Todos os `.spec.ts`
**Severidade:** 🟠 Menor, mas viola a regra de cobertura de 100%

Os testes atuais verificam apenas `should be created`. Conforme a [[Diretrizes de Código]], a cobertura exigida é **100% em branches, funções, linhas e statements**. Faltam testes para:
- `AuthService`: testar `loginWithGoogle()`, `logout()`, `handleRedirectResult()`, os observables `user$`, `userProfile$`, `isLoggedIn$`.
- `AdminGuard`: testar cenário de admin autorizado vs. usuário comum redirecionado.
- `ContactService`: testar a chamada ao `addDoc` do Firestore.
- `HeaderComponent`: **não existe `.spec.ts`** para esse componente.

---

## ✅ O Que Está Correto

| Item | Status |
|------|--------|
| Configuração do `provideAuth`, `provideFirestore`, `provideFirebaseApp` no `app.config.ts` | ✅ OK |
| Estratégia de `signInWithRedirect` (melhor que popup para mobile) | ✅ OK |
| Criação automática de perfil no Firestore para novos usuários | ✅ OK |
| Interface `UserProfile` com campo `role` tipado (`'admin' \| 'user'`) | ✅ OK |
| Header responsivo com botões dinâmicos (Entrar/Sair) via `async pipe` | ✅ OK |
| Badge "Admin" condicional no Header baseado na role do Firestore | ✅ OK |
| CSS dos botões de auth com estética pastel coerente com a Landing Page | ✅ OK |
| Header `Cross-Origin-Opener-Policy: unsafe-none` no `angular.json` (necessário para redirects OAuth em dev) | ✅ OK |

---

## 🎯 Plano de Correção (Priorizado)

1. **[URGENTE]** Corrigir o `handleRedirectResult` no constructor do AuthService.
2. **[URGENTE]** Corrigir o `take(1)` no `adminGuard` para esperar o estado real do Firebase.
3. **[ALTO]** Adicionar `uid` ao `ContactLead` e vincular ao usuário autenticado.
4. **[ALTO]** Criar `firestore.rules` com permissões adequadas.
5. **[MÉDIO]** Escrever testes unitários reais para todos os serviços, guard e header.
6. **[BAIXO]** Avaliar uso de variáveis de ambiente para as chaves do Firebase.

*Voltar para: [[Arquitetura - Autenticação e Firebase]] | [[Visão Geral do Projeto]]*
