/* Selenium | views.js
   Fragmentos de HTML de cada página. O roteador (router.js) escolhe um deles
   e injeta na div#app. Guardados como texto aqui dentro para o site funcionar
   também aberto direto pelo arquivo, sem servidor. As partes repetidas
   (cartões, listas, badges, alertas) vêm de templates.js e dados.js. */
(function (Selenium) {
	'use strict';

	const T = Selenium.templates;
	const D = Selenium.dados;
	const A = Selenium.armazenamento;

	// String.raw mantém as barras invertidas dos atributos pattern (ex.: \d{3})
	Selenium.views = {
		inicio: {
			titulo: 'Selenium | Neurociência e tecnologia de apoio',
			get html() {
				return String.raw`<section class="secao-livro" id="quem-somos">
	<h2>Quem somos</h2>
	<img src="../imagens/quem-somos.jpg" alt="Ilustração de um cérebro formado por linhas de circuito eletrônico" width="800" height="533">
	<div class="texto">
		<p>Olá, caros visitantes!</p>
		<p>Somos a equipe de pesquisa em neurociências digitais sob o nome Selenium. Sejam bem-vindos à nossa casa.</p>
		<p>Gostaríamos de convidá-los a conhecer nossos projetos. Temos como foco o estudo e o compartilhamento de descobertas relacionadas às neurodivergências, desenvolvendo ferramentas de auxílio com base em inteligência artificial, para crianças e adultos.</p>
	</div>
</section>

<section class="secao-livro" id="objetivo">
	<h2>Nosso objetivo</h2>
	<img src="../imagens/objetivo.jpg" alt="Criança e adulto usando um tablet juntos, com um pesquisador ao lado" width="800" height="533">
	<div class="texto">
		<p>Nosso objetivo é desenvolver tecnologias que ajudem na pesquisa, no tratamento e no apoio a pessoas com diferentes tipos de neurodivergência. Queremos adaptar o mundo ao contexto que melhor atenda cada pessoa, estimulando e apoiando as tarefas do dia a dia.</p>
	</div>
</section>

<section class="secao-livro" id="ajudar">
	<h2>Como nos ajudar</h2>
	<img src="../imagens/pix-qrcode.png" alt="QR Code de exemplo para doação via Pix" width="400" height="400">
	<div class="texto">
		<p>Venha fazer parte da Selenium! Você pode ajudar de várias formas:</p>
		<ul>
			<li>Participe das nossas agendas e palestras.</li>
			<li>Visite os nossos centros de pesquisa e doe seu tempo e acolhimento às pessoas que atendemos.</li>
			<li>Faça uma doação por Pix: aponte a câmera do celular para o QR Code.</li>
			<li>Divulgue a nossa causa: compartilhe o <a href="https://www.instagram.com/">cartaz da Selenium no Instagram</a>.</li>
			<li>É pesquisador(a) e quer se juntar a nós? Use o botão abaixo.</li>
		</ul>
		<p><a class="botao botao-destaque" href="#/cadastro">Quero ajudar</a></p>
	</div>
</section>
`;
			}
		},
		projetos: {
			titulo: 'Projetos | Selenium',
			get html() {
				return String.raw`<section class="secao-cartoes" id="frentes">
	<h2>Nossas frentes de atuação</h2>
	${T.lista(D.frentes, T.cartao)}
</section>

<section class="secao-bloco" id="voluntariado">
	<h2>Seja voluntário</h2>
	<p>Você pode doar o seu tempo de várias formas:</p>
	<ul>
		${T.lista(D.voluntariado, T.item)}
	</ul>
	<p><a class="botao botao-destaque" href="#/cadastro">Quero ajudar</a></p>
</section>

<section class="secao-bloco" id="doacao">
	<h2>Faça uma doação</h2>
	<p>Toda doação ajuda a manter as nossas pesquisas. Para doar por Pix:</p>
	<ol>
		${T.lista(D.passosPix, T.item)}
	</ol>
	<img class="qrcode" src="../imagens/pix-qrcode.png" alt="QR Code de exemplo para doação via Pix" width="400" height="400">
	<p><a class="botao botao-destaque" href="#/cadastro">Quero ajudar</a></p>
</section>
`;
			}
		},
		cadastro: {
			titulo: 'Seja colaborador | Selenium',
			get html() {
				return String.raw`<section class="secao-bloco" id="cadastro">
	<h2>Formulário de cadastro</h2>
	<p>Preencha os dados abaixo. Todos os campos são obrigatórios, exceto a mensagem.</p>
	<div id="retorno-cadastro" aria-live="polite"></div>
	<form class="formulario" method="post" novalidate>
		<fieldset>
			<legend>Dados pessoais</legend>
			<div class="campo">
				<label for="nome">Nome completo</label>
				<input type="text" id="nome" name="nome" autocomplete="name" maxlength="100" required>
			</div>
			<div class="campo campo-curto">
				<label for="idade">Idade</label>
				<input type="number" id="idade" name="idade" min="1" max="120" required>
			</div>
			<div class="campo campo-curto">
				<label for="cpf">CPF</label>
				<input type="text" id="cpf" name="cpf" data-mascara="cpf" placeholder="000.000.000-00" inputmode="numeric" maxlength="14" pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" title="Use o formato 000.000.000-00" required>
			</div>
			<div class="campo">
				<label for="email">E-mail</label>
				<input type="email" id="email" name="email" autocomplete="email" maxlength="100" required>
			</div>
			<div class="campo campo-curto">
				<label for="telefone">Telefone</label>
				<input type="tel" id="telefone" name="telefone" data-mascara="telefone" placeholder="(11) 90000-0000" autocomplete="tel" pattern="\(\d{2}\) \d{4,5}-\d{4}" title="Use o formato (11) 90000-0000" required>
			</div>
		</fieldset>

		<fieldset>
			<legend>Endereço</legend>
			<div class="campo campo-curto">
				<label for="cep">CEP</label>
				<input type="text" id="cep" name="cep" data-mascara="cep" placeholder="00000-000" inputmode="numeric" maxlength="9" autocomplete="postal-code" pattern="\d{5}-\d{3}" title="Use o formato 00000-000" required>
			</div>
			<div class="campo">
				<label for="rua">Rua e número</label>
				<input type="text" id="rua" name="rua" autocomplete="address-line1" maxlength="100" required>
			</div>
			<div class="campo">
				<label for="cidade">Cidade</label>
				<input type="text" id="cidade" name="cidade" autocomplete="address-level2" maxlength="60" required>
			</div>
			<div class="campo campo-curto">
				<label for="estado">Estado</label>
				<select id="estado" name="estado" required>
					<option value="">Selecione</option>
					${T.lista(D.estados, T.opcaoEstado)}
				</select>
			</div>
		</fieldset>

		<fieldset>
			<legend>Como quer ajudar</legend>
			<div class="opcoes">
				<div class="opcao">
					<input type="radio" id="doador" name="colaboracao" value="doador" required>
					<label for="doador">Doador</label>
				</div>
				<div class="opcao">
					<input type="radio" id="voluntario" name="colaboracao" value="voluntario">
					<label for="voluntario">Voluntário</label>
				</div>
				<div class="opcao">
					<input type="radio" id="pesquisador" name="colaboracao" value="pesquisador">
					<label for="pesquisador">Pesquisador</label>
				</div>
			</div>
			<div class="campo">
				<label for="mensagem">Mensagem</label>
				<textarea id="mensagem" name="mensagem" rows="4" maxlength="500"></textarea>
				<small class="dica" id="contador-mensagem">0 de 500 caracteres</small>
			</div>
		</fieldset>

		<div><button type="submit" class="botao">Enviar cadastro</button></div>
	</form>
</section>

<section class="secao-bloco" id="colaboradores-cadastrados">
	<h2 id="titulo-colaboradores" tabindex="-1">Colaboradores cadastrados</h2>
	<p>Esta lista fica guardada neste navegador e continua aqui depois de fechar a página.</p>
	<div id="area-grafico" hidden>
		<h3>Colaboradores por tipo</h3>
		<div class="grafico"><canvas id="grafico-colaboradores" role="img" aria-label="Gráfico de colaboradores por tipo"></canvas></div>
	</div>
	<div id="colaboradores">${T.colaboradores(A.ler())}</div>
</section>
`;
			},
			// chamados pelo roteador depois de mostrar e antes de sair da página
			aoMostrar: function () {
				Selenium.grafico.atualizar();
			},
			aoSair: function () {
				Selenium.grafico.destruir();
			}
		},
		componentes: {
			titulo: 'Componentes | Selenium',
			get html() {
				return String.raw`<section class="secao-bloco" id="badges">
	<h2>Badges</h2>
	<p>Etiquetas pequenas que classificam uma informação. As três primeiras mostram o tipo de colaborador e as três últimas mostram o estado de um cadastro.</p>
	<div class="lista-badges">
		${T.lista(D.badges, T.badge)}
	</div>
</section>

<section class="secao-bloco" id="alertas">
	<h2>Alertas</h2>
	<p>Caixas fixas na página que avisam algo importante. Cada tipo tem cor, ícone e título, para não depender só da cor.</p>
	<div class="pilha-alertas">
		${T.lista(D.alertas, T.alerta)}
	</div>
</section>

<section class="secao-bloco" id="toast">
	<h2>Toast</h2>
	<p>Aviso curto que aparece num canto da tela e some sozinho, sem atrapalhar. Abaixo está o modelo parado. Ao abrir esta página, uma versão animada aparece no canto inferior direito e desaparece depois de alguns segundos.</p>
	<div class="toast" role="status">
		<strong>Cadastro enviado</strong>
		<span>Obrigado por ajudar a Selenium.</span>
	</div>
	<div class="toast toast-fixo" role="status">
		<strong>Cadastro enviado</strong>
		<span>Obrigado por ajudar a Selenium.</span>
	</div>
</section>

<section class="secao-bloco" id="modal">
	<h2>Modal</h2>
	<p>Janela que abre por cima da página para pedir atenção. Fecha com o botão, com a tecla Esc ou com um clique fora dela.</p>
	<p><button type="button" class="botao" popovertarget="modal-confirmacao">Abrir confirmação</button></p>
	<div id="modal-confirmacao" class="modal" popover role="dialog" aria-labelledby="modal-titulo">
		<h2 id="modal-titulo">Confirmar cadastro</h2>
		<p>Seus dados serão enviados para a equipe da Selenium. Deseja continuar?</p>
		<div class="modal-acoes">
			<button type="button" class="botao" popovertarget="modal-confirmacao" popovertargetaction="hide">Confirmar</button>
		</div>
	</div>
</section>

<section class="secao-bloco" id="botoes">
	<h2>Botões</h2>
	<p>Os estados mudam com o mouse (hover), com o teclado (focus) e com o clique (active). O botão desativado não responde.</p>
	<div class="lista-botoes">
		<button type="button" class="botao">Botão principal</button>
		<button type="button" class="botao" disabled>Botão desativado</button>
		<a class="botao botao-destaque" href="#/cadastro">Quero ajudar</a>
	</div>
</section>
`;
			}
		},
		naoEncontrada: {
			titulo: 'Página não encontrada | Selenium',
			get html() {
				return String.raw`<section class="secao-bloco" id="nao-encontrada">
	<h2>Página não encontrada</h2>
	<p>O endereço que você tentou abrir não existe na Selenium.</p>
	<p><a class="botao" href="#/">Voltar ao início</a></p>
</section>
`;
			}
		}
	};
})(window.Selenium = window.Selenium || {});
