/* Selenium | router.js
   Roteador da Single Page Application. Usa o hash da URL (#/projetos) para
   saber qual página mostrar e injeta o fragmento de views.js na div#app. */
(function (Selenium) {
	'use strict';

	const ROTA_INICIAL = 'inicio';
	const ALVO_ID = 'app';

	let rotaAtual = null;
	let viewAtual = null;

	// Lê o hash da URL e devolve { nome, ancora }. Ex.: "#/projetos/doacao"
	function lerRota(hash) {
		if (!hash.startsWith('#/')) {
			return { nome: ROTA_INICIAL, ancora: '' };
		}
		const partes = hash.slice(2).split('/');
		return { nome: partes[0] || ROTA_INICIAL, ancora: partes[1] || '' };
	}

	// Devolve a view da rota, ou a de "não encontrada" se o nome não existir
	function acharView(nome) {
		const existe = Object.hasOwn(Selenium.views, nome) && nome !== 'naoEncontrada';
		return existe ? Selenium.views[nome] : Selenium.views.naoEncontrada;
	}

	// Função principal: limpa a div#app e injeta o fragmento da página nova
	function renderizar(rota) {
		const alvo = document.getElementById(ALVO_ID);
		const view = acharView(rota.nome);

		// o HTML vira um fragmento do DOM dentro de um <template> (ainda fora da página)
		const molde = document.createElement('template');
		molde.innerHTML = view.html;

		if (viewAtual && typeof viewAtual.aoSair === 'function') {
			viewAtual.aoSair();        // a página que sai pode limpar o que criou (ex.: gráfico)
		}
		alvo.replaceChildren();        // 1. limpa o conteúdo antigo
		alvo.append(molde.content);    // 2. injeta o conteúdo novo
		viewAtual = view;
		if (typeof view.aoMostrar === 'function') {
			view.aoMostrar();          // a página nova pode iniciar o que precisa do DOM pronto
		}

		document.title = view.titulo;
		rotaAtual = Object.hasOwn(Selenium.views, rota.nome) ? rota.nome : 'naoEncontrada';
	}

	// Rola até a âncora da rota (ex.: #/projetos/doacao) ou volta ao topo
	function rolarPara(ancora) {
		const destino = ancora ? document.getElementById(ancora) : null;
		if (destino) {
			destino.scrollIntoView();
		} else {
			window.scrollTo(0, 0);
		}
	}

	// Marca o link da página atual e fecha o menu hambúrguer do celular
	function atualizarMenu() {
		document.querySelectorAll('nav a').forEach(function (link) {
			const eDoMenuPrincipal = !link.closest('.submenu');
			const rotaDoLink = lerRota(link.getAttribute('href'));
			const ehAtual = eDoMenuPrincipal && rotaDoLink.nome === rotaAtual;
			if (ehAtual) {
				link.setAttribute('aria-current', 'page');
			} else {
				link.removeAttribute('aria-current');
			}
		});
		const botaoMenu = document.getElementById('menu-toggle');
		if (botaoMenu) {
			botaoMenu.checked = false;
			botaoMenu.dispatchEvent(new Event('change'));
		}
	}

	// Chamada toda vez que o hash da URL muda (clique em link, botão voltar, etc.)
	function aoMudarHash() {
		const hash = window.location.hash;
		const ehAncoraComum = hash !== '' && !hash.startsWith('#/');
		if (ehAncoraComum) {
			return; // ex.: link "Pular para o conteúdo" (#principal): o navegador resolve
		}

		const rota = lerRota(hash);
		const mudouDePagina = rota.nome !== rotaAtual;
		if (mudouDePagina) {
			renderizar(rota);
			atualizarMenu();
		}
		rolarPara(rota.ancora);

		if (mudouDePagina) {
			document.getElementById('principal').focus({ preventScroll: true });
		}
	}

	function iniciar() {
		window.addEventListener('hashchange', aoMudarHash);
		renderizar(lerRota(window.location.hash));
		atualizarMenu();
		rolarPara(lerRota(window.location.hash).ancora);
	}

	Selenium.router = { iniciar: iniciar, renderizar: renderizar, lerRota: lerRota };
})(window.Selenium = window.Selenium || {});
