/* ============================================================
   NAV.JS — hambúrguer mobile + scrollspy
   ============================================================ */

/* ---- Hambúrguer ---- */
var navBotao = document.querySelector('.nav-botao');
var navLinks  = document.querySelector('.nav-links');

if (navBotao && navLinks) {
  navBotao.addEventListener('click', function () {
    navLinks.classList.toggle('aberto');
  });
}

/* ---- Scrollspy ---- */
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
    var ini = document.querySelector(
      '.nav-links a[href="index.html"], .nav-links a[href="../index.html"], .nav-links a[href="./index.html"]'
    );
    if (ini) ini.classList.add('nav-ativo');
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) ativarLink(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  secoes.forEach(function (s) { obs.observe(s); });

  window.addEventListener('scroll', function () {
    if (window.scrollY < 80) ativarInicio();
  }, { passive: true });
})();
