/* ============================================================
   DASHBOARD.JS — pontos, nível, posição e feed de atividades
   ============================================================ */

/* ---- Tabela de níveis ---- */
var NIVEIS = [
  { num: 1, nome: 'Eco Iniciante',       min: 0,    max: 499  },
  { num: 2, nome: 'Eco Aprendiz',        min: 500,  max: 999  },
  { num: 3, nome: 'Eco Guerreiro',       min: 1000, max: 1999 },
  { num: 4, nome: 'Guardião Verde',      min: 2000, max: 3499 },
  { num: 5, nome: 'Eco Mestre',          min: 3500, max: 4999 },
  { num: 6, nome: 'Campeão Sustentável', min: 5000, max: 7499 },
  { num: 7, nome: 'Lenda da Natureza',   min: 7500, max: Infinity }
];

function calcularNivel(pts) {
  for (var i = NIVEIS.length - 1; i >= 0; i--) {
    if (pts >= NIVEIS[i].min) return NIVEIS[i];
  }
  return NIVEIS[0];
}
function proximoNivel(atual) {
  var idx = NIVEIS.indexOf(atual);
  return idx < NIVEIS.length - 1 ? NIVEIS[idx + 1] : null;
}

/* ---- Pontos dos outros jogadores (fixos do ranking) ---- */
var OUTROS_PTS = [4820, 4310, 3980, 3750, 3420, 3180, 2940, 2810, 2650, 2430, 2280, 1180];

function calcularPosicao(pts) {
  return OUTROS_PTS.filter(function (p) { return p > pts; }).length + 1;
}

/* ---- Referências do DOM ---- */
var acaoBtns    = document.querySelectorAll('.acao-btn');
var todosPtsEls = document.querySelectorAll('.dash-total-pts');
var levelFill   = document.querySelector('.level-fill');
var levelPts    = document.querySelector('.level-pts');
var levelInfo   = document.querySelectorAll('.level-info span');
var nivelBadge  = document.querySelector('.nivel-badge');
var welcomeMsg  = document.querySelector('.dash-welcome p');
var posBadge    = document.querySelector('.pos-badge');
var feedLista   = document.querySelector('.feed-lista');

/* Card de posição no ranking — o <strong> dentro do stat com "Posição no ranking" */
var posStatEl = (function () {
  var stats = document.querySelectorAll('.dash-stat');
  for (var i = 0; i < stats.length; i++) {
    if (stats[i].textContent.includes('Posição')) {
      return stats[i].querySelector('strong');
    }
  }
  return null;
})();

/* ---- Lê pontos do localStorage (fallback: DOM) ---- */
function lerPontos() {
  var salvo = localStorage.getItem('soulup_pts');
  if (salvo !== null) return parseInt(salvo, 10);
  var primeiro = document.querySelector('.dash-total-pts');
  return primeiro ? parseInt(primeiro.textContent.replace(/\D/g, ''), 10) || 0 : 0;
}

/* ---- Hora formatada ---- */
function horaAtual() {
  var agora = new Date();
  var h = String(agora.getHours()).padStart(2, '0');
  var m = String(agora.getMinutes()).padStart(2, '0');
  return 'Hoje, ' + h + 'h' + m;
}

/* ---- Adiciona item no feed de atividades ---- */
function adicionarFeed(icone, descricao, pts) {
  if (!feedLista) return;

  /* Cria o item */
  var item = document.createElement('div');
  item.className = 'feed-item feed-novo';
  item.innerHTML =
    '<span class="feed-icon">' + icone + '</span>' +
    '<span class="f-desc">' + descricao + '</span>' +
    '<span class="f-time">' + horaAtual() + '</span>' +
    '<span class="f-pts">+' + pts + '</span>';

  /* Insere no topo */
  feedLista.insertBefore(item, feedLista.firstChild);

  /* Remove animação depois */
  setTimeout(function () { item.classList.remove('feed-novo'); }, 600);

  /* Limita a 8 itens */
  var itens = feedLista.querySelectorAll('.feed-item');
  if (itens.length > 8) feedLista.removeChild(itens[itens.length - 1]);

  /* Persiste no localStorage */
  salvarFeed();
}

/* ---- Persiste e restaura o feed ---- */
function salvarFeed() {
  if (!feedLista) return;
  localStorage.setItem('soulup_feed', feedLista.innerHTML);
}

function restaurarFeed() {
  if (!feedLista) return;
  var salvo = localStorage.getItem('soulup_feed');
  if (salvo) feedLista.innerHTML = salvo;
}

/* ---- Atualiza todos os elementos visuais ---- */
function atualizarTudo(pts) {
  localStorage.setItem('soulup_pts', pts);

  var nivel = calcularNivel(pts);
  var prox  = proximoNivel(nivel);
  var pos   = calcularPosicao(pts);

  localStorage.setItem('soulup_pos', pos);

  /* Pontos */
  todosPtsEls.forEach(function (el) {
    el.textContent = pts.toLocaleString('pt-BR');
  });

  /* Card de posição (#12, #8, etc.) */
  if (posStatEl) posStatEl.textContent = '#' + pos;

  /* Badge flutuante de posição */
  if (posBadge) posBadge.textContent = '🏆 #' + pos + ' no ranking';

  /* Mensagem de boas-vindas */
  if (welcomeMsg) {
    if (pos === 1)      welcomeMsg.textContent = '🥇 Você é o líder do ranking! Incrível!';
    else if (pos <= 3)  welcomeMsg.textContent = '🏅 Você está no Top ' + pos + '! Continue assim!';
    else if (pos <= 10) welcomeMsg.textContent = 'Você está no Top ' + pos + ' este mês. Continue assim!';
    else                welcomeMsg.textContent = 'Você está na posição #' + pos + '. Registre mais ações para subir!';
  }

  /* Badge de nível */
  if (nivelBadge) nivelBadge.textContent = 'Nível ' + nivel.num + ' — ' + nivel.nome;

  /* Labels da barra */
  if (levelInfo.length >= 2) {
    levelInfo[0].textContent = nivel.nome;
    levelInfo[1].textContent = prox ? prox.nome : '🏆 Nível máximo!';
  }

  /* Barra de progresso (relativa ao nível atual) */
  if (levelFill) {
    var pct = !prox ? 100 : Math.min(((pts - nivel.min) / (prox.min - nivel.min)) * 100, 100);
    levelFill.style.width = pct + '%';
  }

  /* Texto embaixo da barra */
  if (levelPts) {
    levelPts.textContent = !prox
      ? pts.toLocaleString('pt-BR') + ' pts — Nível máximo atingido! 🏆'
      : pts.toLocaleString('pt-BR') + ' pts — faltam ' +
        (prox.min - pts).toLocaleString('pt-BR') + ' pts para ' + prox.nome;
  }
}

/* ---- Ícones por nome de ação ---- */
var ICONES = {
  'Reciclar': '♻️', 'Energia': '⚡', 'Água': '💧',
  'Bike': '🚲', 'Plantar': '🌳', 'Consumo': '🛒'
};

/* ---- Inicializa ---- */
restaurarFeed();
atualizarTudo(lerPontos());

/* ---- Clique nos botões de ação ---- */
acaoBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var pts    = parseInt(btn.getAttribute('data-pts') || '0', 10);
    var nome   = (btn.getAttribute('data-nome') || 'Ação').replace(/[^\w\sÀ-ÿ]/gu, '').trim();
    var icone  = ICONES[nome] || '🌱';
    var aPts   = btn.querySelector('.a-pts');

    atualizarTudo(lerPontos() + pts);
    adicionarFeed(icone, nome, pts);

    btn.classList.add('registrado');
    if (aPts) aPts.textContent = '✅';

    setTimeout(function () {
      btn.classList.remove('registrado');
      if (aPts) aPts.textContent = '+' + pts + ' pts';
    }, 2500);
  });
});
