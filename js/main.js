/* Selenium | main.js
   Ponto de entrada do JavaScript. Os arquivos de js/modules/ já foram
   carregados antes deste (dados, templates, máscaras, validação, armazenamento, gráfico, views, router e
   eventos); aqui só se inicia o site. */
(function (Selenium) {
	'use strict';

	Selenium.router.iniciar();
	Selenium.eventos.iniciar();
})(window.Selenium);
