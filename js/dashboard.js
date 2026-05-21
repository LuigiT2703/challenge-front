/* ============================================================
   DASHBOARD.JS — botões de ação rápida
   ============================================================ */

var acaoBtns   = document.querySelectorAll('.acao-btn');
var totalPtsEl = document.querySelector('.dash-total-pts');

acaoBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var pts  = parseInt(btn.getAttribute('data-pts') || '0', 10);
    var nome = btn.getAttribute('data-nome') || 'Ação';

    if (totalPtsEl) {
      var atual = parseInt(totalPtsEl.textContent.replace(/\D/g, ''), 10) || 0;
      totalPtsEl.textContent = (atual + pts).toLocaleString('pt-BR');
    }

    btn.classList.add('registrado');
    btn.querySelector('.a-pts').textContent = '✅';

    setTimeout(function () {
      btn.classList.remove('registrado');
      btn.querySelector('.a-pts').textContent = '+' + pts + ' pts';
    }, 2500);
  });
});
