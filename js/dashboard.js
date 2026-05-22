/* ============================================================
   DASHBOARD.JS — botões de ação rápida + sincronização de pontos
   ============================================================ */

/* ---- Referências ---- */
var acaoBtns    = document.querySelectorAll('.acao-btn');
var todosPtsEls = document.querySelectorAll('.dash-total-pts'); /* sidebar + card stat */
var levelFill   = document.querySelector('.level-fill');
var levelPts    = document.querySelector('.level-pts');

/* Pontos para subir de nível (Eco Guerreiro → Guardião Verde) */
var META = 2000;

/* Lê o valor atual de pontos (pega do primeiro elemento) */
function lerPontos() {
  var primeiro = document.querySelector('.dash-total-pts');
  if (!primeiro) return 0;
  return parseInt(primeiro.textContent.replace(/\D/g, ''), 10) || 0;
}

/* Atualiza todos os elementos de pontos + barra de progresso */
function atualizarTudo(novos) {
  /* 1. Todos os contadores de pontos */
  todosPtsEls.forEach(function (el) {
    el.textContent = novos.toLocaleString('pt-BR');
  });

  /* 2. Barra de progresso */
  if (levelFill) {
    var pct = Math.min((novos / META) * 100, 100);
    levelFill.style.width = pct + '%';
  }

  /* 3. Texto abaixo da barra */
  if (levelPts) {
    var faltam = Math.max(META - novos, 0);
    levelPts.textContent =
      novos.toLocaleString('pt-BR') + ' / ' +
      META.toLocaleString('pt-BR') + ' pts — faltam ' +
      faltam.toLocaleString('pt-BR') + ' pts';
  }
}

/* ---- Sincroniza ao carregar (garante barra correta no início) ---- */
atualizarTudo(lerPontos());

/* ---- Clique nos botões de ação ---- */
acaoBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var pts  = parseInt(btn.getAttribute('data-pts') || '0', 10);

    /* Soma e sincroniza */
    atualizarTudo(lerPontos() + pts);

    /* Feedback visual no botão */
    var aPts = btn.querySelector('.a-pts');
    btn.classList.add('registrado');
    if (aPts) aPts.textContent = '✅';

    setTimeout(function () {
      btn.classList.remove('registrado');
      if (aPts) aPts.textContent = '+' + pts + ' pts';
    }, 2500);
  });
});
