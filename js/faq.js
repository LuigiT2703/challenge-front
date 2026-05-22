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

var buscaInput = document.getElementById('buscaFaq');
var faqLista   = document.getElementById('faqLista');

if (buscaInput && faqLista) {
  buscaInput.addEventListener('input', function () {
    var termo = buscaInput.value.toLowerCase().trim();

    faqItens.forEach(function (item) {
      var texto = item.textContent.toLowerCase();
      item.style.display = (!termo || texto.includes(termo)) ? '' : 'none';
    });
  });
}
