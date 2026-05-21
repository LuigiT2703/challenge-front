/* ============================================================
   CONTADOR.JS — animação dos números na seção de stats
   ============================================================ */

function animarContador(el) {
  var alvo   = parseInt(el.getAttribute('data-count'), 10);
  var tempo  = 1800;
  var inicio = null;

  function passo(ts) {
    if (!inicio) inicio = ts;
    var progresso = Math.min((ts - inicio) / tempo, 1);
    var eased     = 1 - Math.pow(1 - progresso, 3);
    el.textContent = Math.floor(eased * alvo).toLocaleString('pt-BR');
    if (progresso < 1) requestAnimationFrame(passo);
  }

  requestAnimationFrame(passo);
}

var contadores = document.querySelectorAll('[data-count]');

if (contadores.length) {
  var contObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        contObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  contadores.forEach(function (el) { contObs.observe(el); });
}
