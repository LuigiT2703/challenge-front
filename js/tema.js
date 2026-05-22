/* ============================================================
   TEMA.JS — alternador de modo claro / escuro
   ============================================================ */

(function () {
  /* ---- Cria o botão flutuante ---- */
  var btn = document.createElement('button');
  btn.id = 'tema-btn';
  btn.setAttribute('aria-label', 'Alternar modo escuro');
  document.body.appendChild(btn);

  /* ---- Estado inicial (localStorage) ---- */
  var escuro = localStorage.getItem('tema') === 'escuro';

  function aplicar() {
    if (escuro) {
      document.documentElement.setAttribute('data-tema', 'escuro');
      btn.textContent = '☀️';
      btn.title = 'Modo claro';
    } else {
      document.documentElement.removeAttribute('data-tema');
      btn.textContent = '🌙';
      btn.title = 'Modo escuro';
    }
  }

  aplicar();

  btn.addEventListener('click', function () {
    escuro = !escuro;
    localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    aplicar();
  });
})();
