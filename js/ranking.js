/* ============================================================
   RANKING.JS — tabs de categoria + contador regressivo
   ============================================================ */

/* ---- Sincroniza pontos e reordena tabela ---- */
(function () {
  var salvo = localStorage.getItem('soulup_pts');
  if (salvo === null) return;

  var pts = parseInt(salvo, 10);
  if (isNaN(pts)) return;

  var tabela    = document.querySelector('.ranking-table tbody');
  var minhaLinha = document.querySelector('.minha-linha');
  if (!tabela || !minhaLinha) return;

  /* 1. Atualiza os pontos na linha do usuário */
  var ptsCelula = minhaLinha.querySelector('td strong');
  if (ptsCelula) ptsCelula.textContent = pts.toLocaleString('pt-BR') + ' pts';

  /* 2. Lê todos os pontos de cada linha */
  function lerPtsLinha(tr) {
    var strong = tr.querySelector('td strong');
    if (!strong) return 0;
    return parseInt(strong.textContent.replace(/\D/g, ''), 10) || 0;
  }

  /* 3. Pega as linhas, ordena por pontos (maior primeiro) */
  var linhas = Array.from(tabela.querySelectorAll('tr'));
  linhas.sort(function (a, b) { return lerPtsLinha(b) - lerPtsLinha(a); });

  /* 4. Reinsere na ordem certa */
  linhas.forEach(function (tr) { tabela.appendChild(tr); });

  /* 5. Renumera posições a partir de 1 — bolinha verde só no top 3 */
  linhas.forEach(function (tr, i) {
    var posEl = tr.querySelector('.pos-num');
    if (!posEl) return;
    posEl.textContent = i + 1;
    if (i < 3) {
      posEl.classList.add('top');
    } else {
      posEl.classList.remove('top');
    }
  });

  /* 6. Salva posição real no localStorage para o dashboard ler */
  var minhaPos = linhas.indexOf(minhaLinha) + 1;
  localStorage.setItem('soulup_pos', minhaPos);
})();

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
