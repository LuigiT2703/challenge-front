const navBotao = document.querySelector('.nav-botao');
const navLinks  = document.querySelector('.nav-links');

if (navBotao && navLinks) {
  navBotao.addEventListener('click', function () {
    navLinks.classList.toggle('aberto');
  });
}

const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(function (el) { observer.observe(el); });
}

function animarContador(el) {
  var alvo  = parseInt(el.getAttribute('data-count'), 10);
  var tempo = 1800;
  var inicio = null;

  function passo(ts) {
    if (!inicio) inicio = ts;
    var progresso = Math.min((ts - inicio) / tempo, 1);
    var eased = 1 - Math.pow(1 - progresso, 3);
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

var faqItens = document.querySelectorAll('.faq-item');

faqItens.forEach(function (item) {
  var pergunta = item.querySelector('.faq-pergunta');
  if (!pergunta) return;

  pergunta.addEventListener('click', function () {
    var aberto = item.classList.contains('aberto');
    faqItens.forEach(function (i) { i.classList.remove('aberto'); });
    if (!aberto) item.classList.add('aberto');
  });
});

var contatoForm = document.querySelector('.contato-form');

if (contatoForm) {
  contatoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var aviso = document.querySelector('.form-aviso');

    contatoForm.querySelectorAll('.campo-erro').forEach(function (el) {
      el.classList.remove('campo-erro');
    });

    var nome    = contatoForm.querySelector('[name="nome"]');
    var email   = contatoForm.querySelector('[name="email"]');
    var msg     = contatoForm.querySelector('[name="mensagem"]');
    var valido  = true;

    if (nome && nome.value.trim().length < 2) {
      nome.classList.add('campo-erro');
      valido = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('campo-erro');
      valido = false;
    }
    if (msg && msg.value.trim().length < 10) {
      msg.classList.add('campo-erro');
      valido = false;
    }

    if (aviso) {
      if (valido) {
        aviso.textContent = '✅ Mensagem enviada com sucesso!';
        aviso.className = 'form-aviso sucesso';
        contatoForm.reset();
      } else {
        aviso.textContent = '⚠️ Preencha todos os campos corretamente.';
        aviso.className = 'form-aviso erro';
      }
    }
  });
}

var acaoBtns   = document.querySelectorAll('.acao-btn');
var totalPtsEl = document.querySelector('.dash-total-pts');

acaoBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var pts = parseInt(btn.getAttribute('data-pts') || '0', 10);

    if (totalPtsEl) {
      var atual = parseInt(totalPtsEl.textContent.replace(/\D/g, ''), 10) || 0;
      totalPtsEl.textContent = (atual + pts).toLocaleString('pt-BR');
    }

    btn.textContent = '✅ Registrado!';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = '+ Registrar';
      btn.disabled = false;
    }, 2500);
  });
});

(function () {
  var secoes = document.querySelectorAll('section[id]');
  if (!secoes.length) return;

  var links = document.querySelectorAll('.nav-links a');

  function ativarLink(id) {
    links.forEach(function (a) {
      a.classList.remove('nav-ativo');
      if (a.getAttribute('href') === '#' + id ||
          a.getAttribute('href').endsWith('#' + id)) {
        a.classList.add('nav-ativo');
      }
    });
  }

  function ativarInicio() {
    links.forEach(function (a) { a.classList.remove('nav-ativo'); });
    var linkInicio = document.querySelector('.nav-links a[href="index.html"], .nav-links a[href="../index.html"], .nav-links a[href="./index.html"]');
    if (linkInicio) linkInicio.classList.add('nav-ativo');
  }

  var spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        ativarLink(entry.target.id);
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  secoes.forEach(function (s) { spyObs.observe(s); });

  window.addEventListener('scroll', function () {
    if (window.scrollY < 80) ativarInicio();
  }, { passive: true });
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
