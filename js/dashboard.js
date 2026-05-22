/* ============================================================
   DASHBOARD.JS — pontos, nível e barra de progresso
   ============================================================ */

/* ---- Tabela de níveis ---- */
var NIVEIS = [
  { num: 1,  nome: 'Eco Iniciante',       min: 0,    max: 499  },
  { num: 2,  nome: 'Eco Aprendiz',        min: 500,  max: 999  },
  { num: 3,  nome: 'Eco Guerreiro',       min: 1000, max: 1999 },
  { num: 4,  nome: 'Guardião Verde',      min: 2000, max: 3499 },
  { num: 5,  nome: 'Eco Mestre',          min: 3500, max: 4999 },
  { num: 6,  nome: 'Campeão Sustentável', min: 5000, max: 7499 },
  { num: 7,  nome: 'Lenda da Natureza',   min: 7500, max: Infinity }
];

function calcularNivel(pts) {
  for (var i = NIVEIS.length - 1; i >= 0; i--) {
    if (pts >= NIVEIS[i].min) return NIVEIS[i];
  }
  return NIVEIS[0];
}

function proximoNivel(atual) {
  var idx = NIVEIS.indexOf(atual);
  return (idx < NIVEIS.length - 1) ? NIVEIS[idx + 1] : null;
}

/* ---- Pontos dos outros jogadores (fixos do ranking) ---- */
var OUTROS_PTS = [4820, 4310, 3980, 3750, 3420, 3180, 2940, 2810, 2650, 2430, 2280, 1180];

function calcularPosicao(pts) {
  /* Conta quantos outros têm MAIS pontos que o usuário */
  var acima = OUTROS_PTS.filter(function (p) { return p > pts; }).length;
  return acima + 1; /* posição = quantidade acima + 1 */
}

/* ---- Referências do DOM ---- */
var acaoBtns    = document.querySelectorAll('.acao-btn');
var todosPtsEls = document.querySelectorAll('.dash-total-pts');
var levelFill   = document.querySelector('.level-fill');
var levelPts    = document.querySelector('.level-pts');
var levelInfo   = document.querySelectorAll('.level-info span');  /* [atual, proximo] */
var nivelBadge  = document.querySelector('.nivel-badge');
var welcomeMsg  = document.querySelector('.dash-welcome p');
var posBadge    = document.querySelector('.pos-badge');

/* ---- Lê pontos do localStorage (fallback: DOM) ---- */
function lerPontos() {
  var salvo = localStorage.getItem('soulup_pts');
  if (salvo !== null) return parseInt(salvo, 10);
  var primeiro = document.querySelector('.dash-total-pts');
  if (!primeiro) return 0;
  return parseInt(primeiro.textContent.replace(/\D/g, ''), 10) || 0;
}

/* ---- Atualiza tudo no dashboard ---- */
function atualizarTudo(pts) {
  localStorage.setItem('soulup_pts', pts);

  var nivel = calcularNivel(pts);
  var prox  = proximoNivel(nivel);

  var pos = calcularPosicao(pts);

  /* 1. Contadores de pontos */
  todosPtsEls.forEach(function (el) {
    el.textContent = pts.toLocaleString('pt-BR');
  });

  /* 1b. Badge de posição e mensagem de boas-vindas */
  if (posBadge) {
    posBadge.textContent = '🏆 #' + pos + ' no ranking';
  }
  if (welcomeMsg) {
    if (pos === 1) {
      welcomeMsg.textContent = '🥇 Você é o líder do ranking! Incrível!';
    } else if (pos <= 3) {
      welcomeMsg.textContent = '🏅 Você está no Top ' + pos + '! Continue assim!';
    } else if (pos <= 10) {
      welcomeMsg.textContent = 'Você está no Top ' + pos + ' este mês. Continue assim!';
    } else {
      welcomeMsg.textContent = 'Você está na posição #' + pos + '. Registre mais ações para subir!';
    }
  }

  /* 1c. Salva posição no localStorage para o ranking ler */
  localStorage.setItem('soulup_pos', pos);

  /* 2. Badge de nível (sidebar) */
  if (nivelBadge) {
    nivelBadge.textContent = 'Nível ' + nivel.num + ' — ' + nivel.nome;
  }

  /* 3. Labels da barra */
  if (levelInfo.length >= 2) {
    levelInfo[0].textContent = nivel.nome;
    levelInfo[1].textContent = prox ? prox.nome : '🏆 Nível máximo!';
  }

  /* 4. Barra de progresso (relativa ao nível atual) */
  if (levelFill) {
    var pct;
    if (!prox) {
      pct = 100;
    } else {
      var intervalo = prox.min - nivel.min;
      var progresso = pts - nivel.min;
      pct = Math.min((progresso / intervalo) * 100, 100);
    }
    levelFill.style.width = pct + '%';
  }

  /* 5. Texto embaixo da barra */
  if (levelPts) {
    if (!prox) {
      levelPts.textContent = pts.toLocaleString('pt-BR') + ' pts — Nível máximo atingido! 🏆';
    } else {
      var faltam = prox.min - pts;
      levelPts.textContent =
        pts.toLocaleString('pt-BR') + ' pts — faltam ' +
        faltam.toLocaleString('pt-BR') + ' pts para ' + prox.nome;
    }
  }
}

/* ---- Sincroniza ao carregar ---- */
atualizarTudo(lerPontos());

/* ---- Clique nos botões de ação ---- */
acaoBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var pts  = parseInt(btn.getAttribute('data-pts') || '0', 10);
    var aPts = btn.querySelector('.a-pts');

    atualizarTudo(lerPontos() + pts);

    btn.classList.add('registrado');
    if (aPts) aPts.textContent = '✅';

    setTimeout(function () {
      btn.classList.remove('registrado');
      if (aPts) aPts.textContent = '+' + pts + ' pts';
    }, 2500);
  });
});
