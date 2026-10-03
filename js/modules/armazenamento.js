/* Selenium | armazenamento.js
   Guarda a lista de colaboradores no localStorage do navegador.
   O localStorage só aceita texto, então a lista (um array de objetos) é
   convertida com JSON.stringify ao gravar e com JSON.parse ao ler. */
(function (Selenium) {
	'use strict';

	const CHAVE = 'selenium:colaboradores';

	const CAMPOS_TEXTO = ['email', 'cidade', 'estado', 'colaboracao', 'data'];

	// O localStorage pode ter sido editado à mão ou salvo por outra versão do site.
	// Só passa quem tem id e nome em texto; os outros campos viram '' se faltarem.
	function normalizar(item) {
		if (typeof item !== 'object' || item === null) {
			return null;
		}
		if (typeof item.id !== 'string' || item.id === '' || typeof item.nome !== 'string' || item.nome === '') {
			return null;
		}
		const limpo = { id: item.id, nome: item.nome };
		CAMPOS_TEXTO.forEach(function (campo) {
			limpo[campo] = typeof item[campo] === 'string' ? item[campo] : '';
		});
		return limpo;
	}

	// Lê o texto salvo e converte de volta para um array. Se não houver nada,
	// ou se o texto estiver corrompido, devolve uma lista vazia.
	function ler() {
		try {
			const texto = window.localStorage.getItem(CHAVE);
			const lista = texto ? JSON.parse(texto) : [];
			return Array.isArray(lista)
				? lista.map(normalizar).filter(function (item) { return item !== null; })
				: [];
		} catch (erro) {
			return [];
		}
	}

	// Converte o array em texto e grava. Devolve false se o navegador recusar
	// (armazenamento cheio ou bloqueado, como em algumas janelas anônimas).
	function gravar(lista) {
		try {
			window.localStorage.setItem(CHAVE, JSON.stringify(lista));
			return true;
		} catch (erro) {
			return false;
		}
	}

	// Acrescenta um colaborador ao fim da lista salva
	function adicionar(colaborador) {
		const lista = ler();
		lista.push(colaborador);
		return gravar(lista);
	}

	// Tira da lista o colaborador com o id informado
	function remover(id) {
		const lista = ler().filter(function (colaborador) {
			return colaborador.id !== id;
		});
		return gravar(lista);
	}

	Selenium.armazenamento = { ler: ler, adicionar: adicionar, remover: remover };
})(window.Selenium = window.Selenium || {});
