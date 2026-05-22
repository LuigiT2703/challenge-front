/* ============================================================
   RANKING.JS — tabs de categoria + contador regressivo
   ============================================================ */

/* ---- Tabs ---- */
var tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    tabBtns.forEach(function (b) { b.classList.remove('ativo'); });
    btn.classList.add('ativo');

    var alvo = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(function (c) {
      c.style.display = (c.getAttribute('data-tab') === alvo) ? 'block' : 'none';
    });
  });
});

/* ---- Countdown — fecha no último dia do mês às 23:59:59 ---- */
function fimDoMes() {
  var agora = new Date();
  /* Dia 0 do próximo mês = último dia do mês atual */
  return new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);
}

function atualizarContagem() {
  var diff = fimDoMes() - new Date();

  var dEl = document.getElementById('cd-dias');
  var hEl = document.getElementById('cd-horas');
  var mEl = document.getElementById('cd-min');
  var sEl = document.getElementById('cd-seg');

  if (diff <= 0) {
    /* Mês virou: zera tudo */
    if (dEl) dEl.textContent = '00';
    if (hEl) hEl.textContent = '00';
    if (mEl) mEl.textContent = '00';
    if (sEl) sEl.textContent = '00';
    return;
  }

  var dias  = Math.floor(diff / 86400000);
  var horas = Math.floor((diff % 86400000) / 3600000);
  var min   = Math.floor((diff % 3600000)  / 60000);
  var seg   = Math.floor((diff % 60000)    / 1000);

  if (dEl) dEl.textContent = String(dias).padStart(2, '0');
  if (hEl) hEl.textContent = String(horas).padStart(2, '0');
  if (mEl) mEl.textContent = String(min).padStart(2, '0');
  if (sEl) sEl.textContent = String(seg).padStart(2, '0');
}

atualizarContagem();
setInterval(atualizarContagem, 1000);
