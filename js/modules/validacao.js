/* Selenium | validacao.js
   Verificação de consistência dos campos do formulário.
   Cada campo tem um conjunto de mensagens. O código descobre o que está
   errado, marca o campo com aria-invalid (o CSS pinta a borda e o ícone) e
   injeta a mensagem de erro logo abaixo dele. */
(function (Selenium) {
	'use strict';

	const T = Selenium.templates;

	// Mensagem de cada tipo de erro, por nome de campo
	const MENSAGENS = {
		nome: {
			valueMissing: 'Digite o seu nome completo.',
			nomeCompleto: 'Digite o nome e o sobrenome.'
		},
		idade: {
			valueMissing: 'Informe a sua idade.',
			badInput: 'Informe uma idade entre 1 e 120.',
			rangeUnderflow: 'Informe uma idade entre 1 e 120.',
			rangeOverflow: 'Informe uma idade entre 1 e 120.',
			stepMismatch: 'Digite a idade em anos inteiros, sem vírgula.'
		},
		cpf: {
			valueMissing: 'Digite o CPF.',
			patternMismatch: 'Use o formato 000.000.000-00.'
		},
		email: {
			valueMissing: 'Digite o e-mail.',
			typeMismatch: 'Digite um e-mail válido, como nome@exemplo.com.',
			dominio: 'Digite um e-mail válido, como nome@exemplo.com.'
		},
		telefone: {
			valueMissing: 'Digite o telefone.',
			patternMismatch: 'Use o formato (11) 90000-0000.'
		},
		cep: {
			valueMissing: 'Digite o CEP.',
			patternMismatch: 'Use o formato 00000-000.'
		},
		rua: { valueMissing: 'Informe a rua e o número.' },
		cidade: { valueMissing: 'Informe a cidade.' },
		estado: { valueMissing: 'Escolha um estado.' },
		colaboracao: { valueMissing: 'Escolha como quer ajudar.' }
	};

	// Tipos de erro do navegador (campo.validity) que o código confere, em ordem
	const TIPOS_DE_ERRO = ['badInput', 'typeMismatch', 'patternMismatch', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch'];

	// Só os campos que têm mensagens cadastradas são validados
	function temRegras(campo) {
		return Boolean(campo.name) && Object.hasOwn(MENSAGENS, campo.name);
	}

	// Os botões de rádio são validados em grupo
	function camposDoGrupo(campo) {
		return campo.type === 'radio'
			? Array.from(campo.form.elements[campo.name])
			: [campo];
	}

	// Devolve o texto do erro, ou '' quando o campo está certo
	function mensagemDoCampo(campo) {
		const regras = MENSAGENS[campo.name];

		if (campo.type === 'radio') {
			return campo.form.elements[campo.name].value === '' ? regras.valueMissing : '';
		}

		const texto = campo.value.trim();
		if (texto === '') {
			return campo.required ? regras.valueMissing : '';
		}
		for (const tipo of TIPOS_DE_ERRO) {
			if (campo.validity[tipo] && regras[tipo]) {
				return regras[tipo];
			}
		}
		// nome: pelo menos duas palavras, cada uma com alguma letra
		if (campo.name === 'nome' && !/\p{L}\S*\s+\S*\p{L}/u.test(texto)) {
			return regras.nomeCompleto;
		}
		// e-mail: o navegador aceita "a@b"; aqui exijo um ponto depois do @
		if (campo.name === 'email' && !/@[^@\s]+\.[^@\s]+$/.test(texto)) {
			return regras.dominio;
		}
		return '';
	}

	function idDoErro(campo) {
		return 'erro-' + campo.name;
	}

	// A mensagem entra logo depois do campo (ou depois do grupo de rádios)
	function referencia(campo) {
		return campo.type === 'radio' ? campo.closest('.opcoes') : campo;
	}

	function removerMensagem(campo) {
		const mensagem = document.getElementById(idDoErro(campo));
		if (mensagem) {
			mensagem.remove();
		}
	}

	// Marca o campo como inválido e injeta (ou atualiza) a mensagem no DOM
	function mostrarErro(campo, texto) {
		camposDoGrupo(campo).forEach(function (item) {
			item.setAttribute('aria-invalid', 'true');
			item.setAttribute('aria-describedby', idDoErro(campo));
		});
		const mensagem = document.getElementById(idDoErro(campo));
		if (mensagem) {
			mensagem.textContent = texto;
		} else {
			referencia(campo).insertAdjacentHTML('afterend', T.mensagemErro({ id: idDoErro(campo), texto: texto }));
		}
	}

	// Marca o campo como correto e tira a mensagem
	function mostrarSucesso(campo) {
		camposDoGrupo(campo).forEach(function (item) {
			item.setAttribute('aria-invalid', 'false');
			item.removeAttribute('aria-describedby');
		});
		removerMensagem(campo);
	}

	// Valida um campo e mostra o resultado na tela. Devolve true se estiver certo
	function validarCampo(campo) {
		if (!temRegras(campo)) {
			return true;
		}
		const erro = mensagemDoCampo(campo);
		if (erro) {
			mostrarErro(campo, erro);
		} else {
			mostrarSucesso(campo);
		}
		return erro === '';
	}

	// Valida o formulário inteiro e devolve a lista de campos com erro
	function validarFormulario(formulario) {
		const vistos = new Set();
		const invalidos = [];
		Array.from(formulario.elements).forEach(function (campo) {
			if (!temRegras(campo) || vistos.has(campo.name)) {
				return;
			}
			vistos.add(campo.name);
			if (!validarCampo(campo)) {
				invalidos.push(campo);
			}
		});
		return invalidos;
	}

	// Volta o formulário ao estado inicial: sem marcas e sem mensagens
	function limpar(formulario) {
		Array.from(formulario.elements).forEach(function (campo) {
			campo.removeAttribute('aria-invalid');
			campo.removeAttribute('aria-describedby');
		});
		formulario.querySelectorAll('.msg-erro').forEach(function (mensagem) {
			mensagem.remove();
		});
	}

	Selenium.validacao = {
		temRegras: temRegras,
		validarCampo: validarCampo,
		validarFormulario: validarFormulario,
		limpar: limpar
	};
})(window.Selenium = window.Selenium || {});
