var contatoForm = document.querySelector('.contato-form');

if (contatoForm) {
  contatoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    contatoForm.querySelectorAll('.campo-erro').forEach(function (el) {
      el.classList.remove('campo-erro');
    });

    var nome   = contatoForm.querySelector('[name="nome"]');
    var email  = contatoForm.querySelector('[name="email"]');
    var msg    = contatoForm.querySelector('[name="mensagem"]');
    var valido = true;

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

    var avisos = contatoForm.querySelectorAll('.form-aviso');
    var aviso  = avisos[avisos.length - 1];

    if (aviso) {
      if (valido) {
        aviso.textContent = '✅ Mensagem enviada com sucesso!';
        aviso.className   = 'form-aviso sucesso';
        contatoForm.reset();
      } else {
        aviso.textContent = '⚠️ Preencha todos os campos corretamente.';
        aviso.className   = 'form-aviso erro';
      }
    }
  });
}
