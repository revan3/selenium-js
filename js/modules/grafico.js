/* Selenium | grafico.js
   Único ponto de contato do site com a biblioteca Chart.js (js/vendor/chart.umd.js).
   O resto do código nunca usa o objeto global Chart: só chama
   Selenium.grafico.atualizar() e Selenium.grafico.destruir().
   Gráfico de barras com a quantidade de colaboradores de cada tipo,
   calculada a partir do que está salvo no localStorage. */
(function (Selenium) {
	'use strict';

	const ID_CANVAS = 'grafico-colaboradores';
	const ID_AREA = 'area-grafico';

	let instancia = null;

	// Lê uma variável do design system (ex.: --cor-primaria)
	function variavelCss(nome) {
		return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
	}

	// Conta quantos colaboradores existem de cada tipo, na ordem de dados.tiposColaboracao
	function contarPorTipo(colaboradores) {
		const tipos = Selenium.dados.tiposColaboracao;
		const chaves = Object.keys(tipos);
		return {
			rotulos: chaves.map(function (chave) { return tipos[chave]; }),
			valores: chaves.map(function (chave) {
				return colaboradores.filter(function (item) { return item.colaboracao === chave; }).length;
			})
		};
	}

	// Texto alternativo do gráfico, para quem usa leitor de tela
	function descrever(contagem) {
		const partes = contagem.rotulos.map(function (rotulo, i) {
			return rotulo + ': ' + contagem.valores[i];
		});
		return 'Gráfico de barras com a quantidade de colaboradores por tipo. ' + partes.join('. ') + '.';
	}

	// Tira o gráfico da memória (chamado ao sair da página que o mostra)
	function destruir() {
		if (instancia) {
			instancia.destroy();
			instancia = null;
		}
	}

	// Desenha o gráfico, ou atualiza os valores se ele já existe
	function atualizar() {
		const canvas = document.getElementById(ID_CANVAS);
		const area = document.getElementById(ID_AREA);
		if (!canvas || !area) {
			destruir();
			return;
		}

		const colaboradores = Selenium.armazenamento.ler();
		area.hidden = colaboradores.length === 0 || typeof window.Chart === 'undefined';
		if (area.hidden) {
			destruir();
			return;
		}

		const contagem = contarPorTipo(colaboradores);
		canvas.setAttribute('aria-label', descrever(contagem));

		if (instancia && instancia.canvas === canvas) {
			instancia.data.datasets[0].data = contagem.valores;
			instancia.update();
			return;
		}

		destruir();
		const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const corTexto = variavelCss('--cor-texto');
		const corGrade = variavelCss('--cor-fundo-suave');

		instancia = new window.Chart(canvas, {
			type: 'bar',
			data: {
				labels: contagem.rotulos,
				datasets: [{
					label: 'Colaboradores',
					data: contagem.valores,
					backgroundColor: variavelCss('--cor-primaria'),
					borderRadius: 4,
					maxBarThickness: 48
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: reduzirMovimento ? false : { duration: 400 },
				font: { family: variavelCss('--fonte-base'), size: 14 },
				plugins: { legend: { display: false } },
				scales: {
					x: { grid: { display: false }, ticks: { color: corTexto } },
					y: {
						beginAtZero: true,
						ticks: { color: corTexto, precision: 0 },
						grid: { color: corGrade }
					}
				}
			}
		});
	}

	Selenium.grafico = { atualizar: atualizar, destruir: destruir };
})(window.Selenium = window.Selenium || {});
