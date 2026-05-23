(function () {
  var salvo = localStorage.getItem('soulup_pts');
  if (salvo === null) return;

  var pts = parseInt(salvo, 10);
  if (isNaN(pts)) return;

  var tabela     = document.querySelector('.ranking-table tbody');
  var minhaLinha = document.querySelector('.minha-linha');
  if (!tabela || !minhaLinha) return;

  var ptsCelula = minhaLinha.querySelector('td strong');
  if (ptsCelula) ptsCelula.textContent = pts.toLocaleString('pt-BR') + ' pts';

  function lerPtsLinha(tr) {
    var strong = tr.querySelector('td strong');
    if (!strong) return 0;
    return parseInt(strong.textContent.replace(/\D/g, ''), 10) || 0;
  }

  function lerNomeLinha(tr) {
    var userInfo = tr.querySelector('.user-info');
    if (!userInfo) return '';
    return userInfo.textContent.trim();
  }

  function lerCidadeLinha(tr) {
    var tds = tr.querySelectorAll('td');
    return tds[2] ? tds[2].textContent.trim() : '';
  }

  var linhas = Array.from(tabela.querySelectorAll('tr'));
  linhas.sort(function (a, b) { return lerPtsLinha(b) - lerPtsLinha(a); });

  linhas.forEach(function (tr) { tabela.appendChild(tr); });

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

  var minhaPos = linhas.indexOf(minhaLinha) + 1;
  localStorage.setItem('soulup_pos', minhaPos);

  var podio = [
    document.querySelector('.podium-box.p1'),
    document.querySelector('.podium-box.p2'),
    document.querySelector('.podium-box.p3')
  ];

  var medalhas = ['🥇', '🥈', '🥉'];
  var posicoes  = [0, 1, 2];

  [0, 1, 2].forEach(function (rank) {
    var tr = linhas[rank];
    if (!tr) return;

    var boxIndex = rank === 0 ? 0 : rank === 1 ? 1 : 2;
    var box = podio[boxIndex];
    if (!box) return;

    var medalEl  = box.querySelector('.podium-medal');
    var posEl    = box.querySelector('.podium-pos');
    var nomeEl   = box.querySelector('.podium-nome');
    var cidadeEl = box.querySelector('.podium-cidade');
    var ptsEl    = box.querySelector('.pts-chip');

    if (medalEl)  medalEl.textContent  = medalhas[rank];
    if (posEl)    posEl.textContent    = '#' + (rank + 1);
    if (nomeEl)   nomeEl.textContent   = lerNomeLinha(tr).replace('(você)', '').trim();
    if (cidadeEl) cidadeEl.textContent = lerCidadeLinha(tr);
    if (ptsEl)    ptsEl.textContent    = lerPtsLinha(tr).toLocaleString('pt-BR') + ' pts';
  });
})();

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

function fimDoMes() {
  var agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);
}

function atualizarContagem() {
  var diff = fimDoMes() - new Date();

  var dEl = document.getElementById('cd-dias');
  var hEl = document.getElementById('cd-horas');
  var mEl = document.getElementById('cd-min');
  var sEl = document.getElementById('cd-seg');

  if (diff <= 0) {
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
