/* Selenium | mascaras.js
   Funções que formatam o texto de um campo enquanto a pessoa digita.
   Cada uma recebe o valor atual e devolve o valor formatado. */
(function (Selenium) {
	'use strict';

	// Tira tudo que não for número
	function soDigitos(valor) {
		return String(valor).replace(/\D/g, '');
	}

	// 000.000.000-00
	function cpf(valor) {
		const d = soDigitos(valor).slice(0, 11);
		let resultado = d.slice(0, 3);
		if (d.length > 3) { resultado += '.' + d.slice(3, 6); }
		if (d.length > 6) { resultado += '.' + d.slice(6, 9); }
		if (d.length > 9) { resultado += '-' + d.slice(9, 11); }
		return resultado;
	}

	// (00) 0000-0000 ou (00) 00000-0000
	function telefone(valor) {
		const d = soDigitos(valor).slice(0, 11);
		if (d.length === 0) { return ''; }
		if (d.length <= 2) { return '(' + d; }
		const corte = d.length > 10 ? 5 : 4;
		const resto = d.slice(2);
		const meio = resto.length > corte ? resto.slice(0, corte) + '-' + resto.slice(corte) : resto;
		return '(' + d.slice(0, 2) + ') ' + meio;
	}

	// 00000-000
	function cep(valor) {
		const d = soDigitos(valor).slice(0, 8);
		return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
	}

	Selenium.mascaras = { cpf: cpf, telefone: telefone, cep: cep };
})(window.Selenium = window.Selenium || {});
