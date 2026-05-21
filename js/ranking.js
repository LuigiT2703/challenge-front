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

/* ---- Countdown ---- */
function atualizarContagem() {
  var fim  = new Date();
  fim.setDate(fim.getDate() + 18);
  fim.setHours(fim.getHours() + 14);

  var diff = fim - new Date();
  if (diff <= 0) return;

  var dias  = Math.floor(diff / 86400000);
  var horas = Math.floor((diff % 86400000) / 3600000);
  var min   = Math.floor((diff % 3600000)  / 60000);
  var seg   = Math.floor((diff % 60000)    / 1000);

  var dEl = document.getElementById('cd-dias');
  var hEl = document.getElementById('cd-horas');
  var mEl = document.getElementById('cd-min');
  var sEl = document.getElementById('cd-seg');

  if (dEl) dEl.textContent = String(dias).padStart(2, '0');
  if (hEl) hEl.textContent = String(horas).padStart(2, '0');
  if (mEl) mEl.textContent = String(min).padStart(2, '0');
  if (sEl) sEl.textContent = String(seg).padStart(2, '0');
}

atualizarContagem();
setInterval(atualizarContagem, 1000);
