/* Selenium | dados.js
   Dados de origem do site: listas de objetos e de textos.
   Aqui só tem informação, sem nenhum HTML. Quem transforma isso em
   elementos na tela são as funções de templates.js. */
(function (Selenium) {
	'use strict';

	Selenium.dados = {
		// Cartões da página Projetos
		frentes: [
			{
				titulo: 'Pesquisa e descobertas',
				texto: 'Estudamos as neurodivergências e compartilhamos o que descobrimos em linguagem simples, para que famílias, escolas e profissionais possam usar.'
			},
			{
				titulo: 'Ferramentas de apoio com inteligência artificial',
				texto: 'Criamos ferramentas que ajudam crianças e adultos nas tarefas do dia a dia, adaptadas ao jeito de cada pessoa.'
			},
			{
				titulo: 'Palestras e agendas',
				texto: 'Fazemos encontros abertos para conversar sobre neurodivergência e mostrar o nosso trabalho.'
			}
		],

		// Lista da seção Voluntariado
		voluntariado: [
			'Participe das nossas palestras e agendas.',
			'Visite os nossos centros de pesquisa e acolha as pessoas que atendemos.',
			'Ajude a divulgar a nossa causa nas redes sociais.',
			'Se você é pesquisador(a), junte-se aos nossos estudos.'
		],

		// Passos da doação por Pix
		passosPix: [
			'Abra o aplicativo do seu banco e escolha Pix.',
			'Escolha a opção de ler QR Code.',
			'Aponte a câmera para o QR Code desta página.',
			'Confira o nome Selenium e digite o valor.',
			'Confirme a doação.'
		],

		// Opções do campo Estado do formulário
		estados: [
			'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
			'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
		],

		// Tipos de colaboração do formulário (valor do rádio -> nome na tela)
		tiposColaboracao: {
			doador: 'Doador',
			voluntario: 'Voluntário',
			pesquisador: 'Pesquisador'
		},

		// Badges da página Componentes (tipo vira a classe badge-<tipo>)
		badges: [
			{ tipo: 'voluntario', texto: 'Voluntário' },
			{ tipo: 'doador', texto: 'Doador' },
			{ tipo: 'pesquisador', texto: 'Pesquisador' },
			{ tipo: 'sucesso', texto: 'Ativo' },
			{ tipo: 'neutro', texto: 'Em análise' },
			{ tipo: 'erro', texto: 'Urgente' }
		],

		// Alertas da página Componentes
		alertas: [
			{ tipo: 'sucesso', papel: 'status', titulo: 'Cadastro enviado', texto: 'Recebemos os seus dados. Em breve entraremos em contato.' },
			{ tipo: 'erro', papel: 'alert', titulo: 'Não foi possível enviar', texto: 'Confira o CPF e o telefone e tente novamente.' },
			{ tipo: 'aviso', papel: 'status', titulo: 'Falta um passo', texto: 'Escolha como quer ajudar para concluir o cadastro.' },
			{ tipo: 'info', papel: 'status', titulo: 'Você sabia?', texto: 'As palestras da Selenium são abertas e gratuitas.' }
		]
	};
})(window.Selenium = window.Selenium || {});
