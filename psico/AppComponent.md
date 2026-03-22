# 🧩 AppComponent

**Caminho:** `src/app/app.component.ts`

O **AppComponent** é a raiz (root) de tudo. Ele é o primeiro componente renderizado pelo Angular ao carregar a aplicação, servindo de contêiner ou orquestrador.

## ⚙️ Função na Landing Page

Sendo este um site "Single Page Application" (SPA) estático (uma página só de rolagem), o `AppComponent` tem o trabalho principal de empilhar linearmente os componentes de forma semântica:

```html
<app-header />    <!-- [[Core]] -->
<main>
  <app-hero />       <!-- [[Features]] -->
  <app-about />      <!-- [[Features]] -->
  <app-services />   <!-- [[Features]] -->
  <app-how-it-works /><!-- [[Features]] -->
  <app-faq />        <!-- [[Features]] -->
</main>
<app-footer />    <!-- [[Core]] -->
```

## 🛠️ Standalone
No Angular 17, o `AppComponent` é *Standalone* (`standalone: true`). Isso significa que ele próprio declara quais outros componentes precisa importar para renderizar o seu HTML. 

Se quiser adicionar uma nova seção à página, é nele que você fará a chamada da nova tag HTML.

*Voltar para: [[Visão Geral do Projeto]]*
