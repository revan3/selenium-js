/* Selenium | eventos.js
   Todos os EventListeners do site ficam aqui.
   As páginas são criadas e recriadas pelo roteador, então os eventos de
   conteúdo dinâmico (formulário, campos) são escutados no document e
   filtrados pelo elemento de origem: é a delegação de eventos.
   Só o checkbox do menu, que existe fixo no index.html, tem listener direto. */
(function (Selenium) {
	'use strict';

	const T = Selenium.templates;
	const M = Selenium.mascaras;
	const V = Selenium.validacao;
	const A = Selenium.armazenamento;
	const LIMITE_MENSAGEM = 500;

	function botaoMenu() {
		return document.getElementById('menu-toggle');
	}

	function menuEstaAberto() {
		const botao = botaoMenu();
		return Boolean(botao && botao.checked);
	}

	// Fecha o menu hambúrguer e avisa o listener de "change" (que atualiza o aria-expanded)
	function fecharMenu() {
		const botao = botaoMenu();
		if (botao && botao.checked) {
			botao.checked = false;
			botao.dispatchEvent(new Event('change'));
		}
	}

	// CHANGE no checkbox do menu: informa aos leitores de tela se está aberto
	function aoMudarMenu(evento) {
		evento.target.setAttribute('aria-expanded', String(evento.target.checked));
	}

	// Redesenha a lista de colaboradores com o que está salvo no localStorage
	function atualizarColaboradores() {
		const alvo = document.getElementById('colaboradores');
		if (alvo) {
			alvo.replaceChildren();
			alvo.insertAdjacentHTML('beforeend', T.colaboradores(A.ler()));
		}
		Selenium.grafico.atualizar();
	}

	// Remove do localStorage o colaborador do botão clicado
	function removerColaborador(botao) {
		A.remover(botao.dataset.remover);
		atualizarColaboradores();
		const titulo = document.getElementById('titulo-colaboradores');
		if (titulo) {
			titulo.focus();
		}
	}

	// CLICK (delegado): botão Remover da lista e fechamento do menu
	function aoClicar(evento) {
		const botaoRemover = evento.target.closest('[data-remover]');
		if (botaoRemover) {
			removerColaborador(botaoRemover);
			return;
		}
		if (!menuEstaAberto()) {
			return;
		}
		const dentroDoMenu = evento.target.closest('nav');
		const emUmLink = evento.target.closest('nav a');
		if (emUmLink || !dentroDoMenu) {
			fecharMenu();
		}
	}

	// KEYDOWN: a tecla Esc fecha o menu e devolve o foco ao botão
	function aoTeclar(evento) {
		if (evento.key === 'Escape' && menuEstaAberto()) {
			fecharMenu();
			botaoMenu().focus();
		}
	}

	function atualizarContador(campo) {
		const contador = document.getElementById('contador-mensagem');
		if (contador) {
			contador.textContent = campo.value.length + ' de ' + LIMITE_MENSAGEM + ' caracteres';
		}
	}

	// INPUT (delegado): máscara dos campos com data-mascara e contador da mensagem
	function aoDigitar(evento) {
		const campo = evento.target;
		const tipo = campo.dataset ? campo.dataset.mascara : undefined;
		if (tipo && Object.hasOwn(M, tipo)) {
			campo.value = M[tipo](campo.value);
		}
		if (campo.id === 'mensagem') {
			atualizarContador(campo);
		}
		// depois que o campo foi conferido uma vez, confere de novo a cada letra
		if (estaNoFormulario(campo) && campo.hasAttribute('aria-invalid')) {
			V.validarCampo(campo);
		}
	}

	function estaNoFormulario(campo) {
		return Boolean(campo.form) && campo.form.matches('.formulario');
	}

	// FOCUSOUT (delegado): ao sair de um campo, confere o que foi preenchido
	function aoSairDoCampo(evento) {
		const campo = evento.target;
		// indo para o botão Enviar: o submit confere tudo, e uma mensagem nova
		// empurraria o botão para baixo no meio do clique
		const indoParaEnviar = evento.relatedTarget && evento.relatedTarget.type === 'submit';
		if (estaNoFormulario(campo) && campo.type !== 'radio' && !indoParaEnviar) {
			V.validarCampo(campo);
		}
	}

	// CHANGE (delegado): lista de estados e botões de rádio são conferidos ao escolher
	function aoMudarCampo(evento) {
		const campo = evento.target;
		if (estaNoFormulario(campo) && (campo.type === 'radio' || campo.tagName === 'SELECT')) {
			V.validarCampo(campo);
		}
	}

	// Mostra o retorno do envio: alerta dentro da página e toast no canto da tela
	function mostrarRetorno(dados, salvou) {
		const retorno = document.getElementById('retorno-cadastro');
		if (retorno) {
			retorno.replaceChildren();
			retorno.insertAdjacentHTML('beforeend', T.alerta(salvou
				? {
					tipo: 'sucesso',
					papel: 'status',
					titulo: 'Cadastro enviado',
					texto: 'Obrigado, ' + dados.nome + '. Recebemos o seu cadastro e entraremos em contato pelo e-mail ' + dados.email + '. Ele já aparece na lista abaixo do formulário.'
				}
				: {
					tipo: 'aviso',
					papel: 'status',
					titulo: 'Cadastro enviado, mas não salvo',
					texto: 'O navegador não deixou guardar o cadastro neste aparelho, por isso ele não aparece na lista.'
				}));
			retorno.scrollIntoView({ block: 'nearest' });
		}
		document.querySelectorAll('.toast-fixo').forEach(function (toast) {
			toast.remove();
		});
		document.body.insertAdjacentHTML('beforeend', T.toast({
			titulo: 'Cadastro enviado',
			texto: 'Obrigado por ajudar a Selenium.'
		}));
	}

	// Alerta de erro no topo do formulário quando o envio é barrado
	function mostrarFalha(quantidade) {
		const retorno = document.getElementById('retorno-cadastro');
		if (retorno) {
			retorno.replaceChildren();
			retorno.insertAdjacentHTML('beforeend', T.alerta({
				tipo: 'erro',
				papel: 'alert',
				titulo: 'Não foi possível enviar',
				texto: quantidade === 1
					? 'Corrija o campo destacado e tente de novo.'
					: 'Corrija os ' + quantidade + ' campos destacados e tente de novo.'
			}));
		}
	}

	// SUBMIT (delegado): impede o envio padrão (que recarregaria a página),
	// confere todos os campos e só então trata o cadastro pela própria aplicação
	function aoEnviar(evento) {
		const formulario = evento.target;
		if (!formulario.matches('.formulario')) {
			return;
		}
		evento.preventDefault();

		const invalidos = V.validarFormulario(formulario);
		if (invalidos.length > 0) {
			mostrarFalha(invalidos.length);
			invalidos[0].focus();
			return;
		}

		const dados = Object.fromEntries(new FormData(formulario));
		const salvou = A.adicionar({
			id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
			nome: dados.nome.trim(),
			email: dados.email.trim(),
			cidade: dados.cidade.trim(),
			estado: dados.estado,
			colaboracao: dados.colaboracao,
			data: new Date().toISOString()
		});
		atualizarColaboradores();
		mostrarRetorno(dados, salvou);
		formulario.reset();
		V.limpar(formulario);
		atualizarContador(formulario.elements.mensagem);
	}

	// STORAGE: outra aba do site mudou o localStorage, então a lista desta aba está velha
	function aoMudarArmazenamento(evento) {
		if (evento.key === null || evento.key === 'selenium:colaboradores') {
			atualizarColaboradores();
		}
	}

	// ANIMATIONEND (delegado): tira o toast do DOM quando a animação dele acaba
	function aoTerminarAnimacao(evento) {
		if (evento.target.matches('.toast-fixo')) {
			evento.target.remove();
		}
	}

	function iniciar() {
		const botao = botaoMenu();
		if (botao) {
			botao.addEventListener('change', aoMudarMenu);
		}
		document.addEventListener('click', aoClicar);
		document.addEventListener('keydown', aoTeclar);
		document.addEventListener('input', aoDigitar);
		document.addEventListener('focusout', aoSairDoCampo);
		document.addEventListener('change', aoMudarCampo);
		document.addEventListener('submit', aoEnviar);
		document.addEventListener('animationend', aoTerminarAnimacao);
		window.addEventListener('storage', aoMudarArmazenamento);
	}

	Selenium.eventos = { iniciar: iniciar, fecharMenu: fecharMenu };
})(window.Selenium = window.Selenium || {});
