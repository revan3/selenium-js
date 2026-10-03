/* Selenium | templates.js
   Sistema de templates: cada função recebe um dado e devolve o HTML do
   componente (template literal). A função lista() repete um template para
   todos os itens de um array. Todo dado passa por escapar() antes de entrar
   no HTML, para um texto nunca virar código. */
(function (Selenium) {
	'use strict';

	const SUBSTITUTOS = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	};

	// Troca os caracteres que têm função no HTML por versões inofensivas
	function escapar(valor) {
		return String(valor).replace(/[&<>"']/g, function (caractere) {
			return SUBSTITUTOS[caractere];
		});
	}

	// Aplica um template a cada item do array e junta tudo num só texto de HTML
	function lista(itens, modelo) {
		return itens.map(function (item) {
			return modelo(item);
		}).join('\n');
	}

	// Cartão de projeto: recebe { titulo, texto }
	function cartao(frente) {
		return `<article class="cartao">
	<h3>${escapar(frente.titulo)}</h3>
	<p>${escapar(frente.texto)}</p>
</article>`;
	}

	// Item de lista simples: recebe um texto
	function item(texto) {
		return `<li>${escapar(texto)}</li>`;
	}

	// Opção do campo Estado: recebe a sigla
	function opcaoEstado(sigla) {
		return `<option>${escapar(sigla)}</option>`;
	}

	// Badge: recebe { tipo, texto }
	function badge(dados) {
		return `<span class="badge badge-${escapar(dados.tipo)}">${escapar(dados.texto)}</span>`;
	}

	// Alerta: recebe { tipo, papel, titulo, texto }
	function alerta(dados) {
		return `<div class="alerta alerta-${escapar(dados.tipo)}" role="${escapar(dados.papel)}">
	<div>
		<strong class="alerta-titulo">${escapar(dados.titulo)}</strong>
		<p>${escapar(dados.texto)}</p>
	</div>
</div>`;
	}

	// Toast: recebe { titulo, texto }
	function toast(dados) {
		return `<div class="toast toast-fixo" role="status">
	<strong>${escapar(dados.titulo)}</strong>
	<span>${escapar(dados.texto)}</span>
</div>`;
	}

	// Mensagem de erro de um campo: recebe { id, texto }
	function mensagemErro(dados) {
		return `<span class="msg-erro" id="${escapar(dados.id)}" role="alert">${escapar(dados.texto)}</span>`;
	}

	// Cartão de colaborador salvo: recebe { id, nome, email, cidade, estado, colaboracao, data }
	function colaborador(dados) {
		const tipos = Selenium.dados.tiposColaboracao;
		const tipo = Object.hasOwn(tipos, dados.colaboracao) ? dados.colaboracao : 'neutro';
		const rotulo = tipo === 'neutro' ? 'Sem tipo' : tipos[tipo];
		const data = new Date(dados.data);
		const dataTexto = isNaN(data) ? '' : data.toLocaleDateString('pt-BR');
		return `<li class="cartao">
	<h3>${escapar(dados.nome)}</h3>
	<p>${escapar(dados.email)}<br>${escapar(dados.cidade)}/${escapar(dados.estado)}</p>
	${dataTexto ? `<p class="dica">Cadastrado em ${escapar(dataTexto)}</p>` : ''}
	<div class="cartao-acoes">
		${badge({ tipo: tipo, texto: rotulo })}
		<button type="button" class="botao" data-remover="${escapar(dados.id)}" aria-label="Remover ${escapar(dados.nome)}">Remover</button>
	</div>
</li>`;
	}

	// Lista de colaboradores (ou a mensagem de lista vazia)
	function colaboradores(lista) {
		if (lista.length === 0) {
			return '<p>Nenhum colaborador cadastrado ainda.</p>';
		}
		return `<ul class="lista-colaboradores">
${lista.map(function (item) { return colaborador(item); }).join('\n')}
</ul>`;
	}

	Selenium.templates = {
		escapar: escapar,
		lista: lista,
		cartao: cartao,
		item: item,
		opcaoEstado: opcaoEstado,
		badge: badge,
		alerta: alerta,
		toast: toast,
		mensagemErro: mensagemErro,
		colaborador: colaborador,
		colaboradores: colaboradores
	};
})(window.Selenium = window.Selenium || {});
