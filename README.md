# Selenium

Site da Associação Selenium, uma ONG fictícia de neurociência e tecnologia de apoio. É uma Single Page Application (SPA) feita só com HTML, CSS e JavaScript, sem framework. Projeto de faculdade, versão 3 (JavaScript).

## Visão geral

O site tem quatro páginas (Início, Projetos, Seja colaborador e Componentes), todas montadas pelo JavaScript dentro de um único `index.html`. A página de cadastro valida o formulário, guarda os colaboradores no navegador e mostra um gráfico com a quantidade de colaboradores por tipo.

## Funcionalidades

- Navegação por hash (`#/`, `#/projetos`, `#/cadastro`, `#/componentes`) sem recarregar a página, com página 404 para endereços inexistentes
- Formulário com máscaras (CPF, telefone e CEP), validação campo a campo e mensagens de erro acessíveis
- Lista de colaboradores guardada no `localStorage`, que continua depois de fechar o navegador
- Gráfico de barras dos colaboradores por tipo (Chart.js)
- Menu hambúrguer responsivo, com navegação pelo teclado
- Modo escuro e modo de alto contraste automáticos, que seguem a preferência do sistema (`prefers-color-scheme` e `prefers-contrast`)

## Tecnologias utilizadas

- HTML5 semântico: estrutura do único arquivo `html/index.html`
- CSS3: design system com variáveis, Grid de 12 colunas, Flexbox, componentes de feedback (badges, alertas e toast) e media queries de preferência do usuário (modo escuro, alto contraste e movimento reduzido)
- JavaScript ES6+ sem framework: scripts comuns com `defer`, um módulo por arquivo
- Web Storage (`localStorage`): guarda os colaboradores
- Constraint Validation API: validação do formulário
- Chart.js 4.5.1 (licença MIT): gráfico, em `js/vendor`
- esbuild 0.28.2 e html-minifier-terser 7.2.0: build de produção, só em desenvolvimento
- Git com GitFlow e Conventional Commits: controle de versão

## Pré-requisitos

- Um navegador atual (Chrome, Edge, Firefox ou Safari)
- Git, para clonar o repositório (ou baixe o ZIP pelo GitHub)
- Opcional: Python 3, só para abrir por um servidor local
- Para gerar a build de produção: Node.js 18 ou superior e npm

## Instalação e execução local

1. Clone o repositório: `git clone https://github.com/revan3/selenium-js.git`
2. Entre na pasta: `cd selenium-js`
3. Abra `html/index.html` no navegador, com duplo clique no arquivo. O site funciona direto pelo arquivo, sem servidor.
4. Opcional, para abrir por um servidor local: `python3 -m http.server 8000` e acesse `http://localhost:8000/html/index.html`

## Dependências e build

Para só abrir o site, não há nada para instalar: o Chart.js já está em `js/vendor/chart.umd.js`. A build de produção é opcional e usa duas ferramentas de desenvolvimento:

1. Instale as dependências: `npm install` (esbuild e html-minifier-terser)
2. Gere a build: `npm run build`
3. Abra `dist/html/index.html` no navegador, também sem servidor

O script `scripts/build.mjs` lê a ordem dos módulos do próprio `html/index.html`, junta e minifica o JavaScript em `dist/js/app.min.js` (esbuild), minifica o CSS em `dist/css/estilos.min.css` (esbuild) e o HTML (html-minifier-terser), e copia o Chart.js e as imagens. O Chart.js fica fora do bundle porque já vem minificado e muda raramente. No fim, o script imprime a tabela de tamanhos. Resultado atual: CSS 19,7% menor, JavaScript 40,3% menor e HTML 27,6% menor (32,7% no total, 31,4% com gzip), e 11 requisições de script viram 2. A pasta `dist/` fica no repositório para o site abrir direto, sem precisar gerar a build.

Para atualizar o Chart.js: `npm install chart.js` e copie `node_modules/chart.js/dist/chart.umd.js` para `js/vendor/`.

## Publicação (deploy)

O site é publicado no GitHub Pages por um fluxo automático (`.github/workflows/deploy.yml`). A cada push na `main`, o GitHub Actions baixa o código, instala as dependências com `npm ci` (versões do `package-lock.json`), roda `npm run build` e publica a pasta `dist/`. O endereço é `https://revan3.github.io/selenium-js/`, que redireciona para `html/index.html`. Os caminhos do site são relativos, então ele funciona dentro da subpasta `/selenium-js/`.

Para ativar uma única vez, no repositório: Settings, Pages, Build and deployment, Source: GitHub Actions. Depois disso, cada release mesclada na `main` é publicada sozinha, e o histórico de execuções fica na aba Actions.

## Testes

Ainda não há testes automatizados. Os testes são manuais:

1. Abra cada página (`#/`, `#/projetos`, `#/cadastro`, `#/componentes`) e confira que `#/xyz` mostra a página 404.
2. Em `#/cadastro`, envie o formulário vazio: cada campo obrigatório mostra o seu erro.
3. Preencha tudo corretamente e envie: aparecem o alerta de sucesso, o cartão na lista e o gráfico.
4. Recarregue a página: a lista continua. Clique em Remover: o cartão some.
5. Teste dados quebrados: no console, rode `localStorage.setItem('selenium:colaboradores', '{[oops')` e recarregue. A lista deve aparecer vazia, sem erro no console.
6. Depois de `npm run build`, repita os passos 1 a 5 em `dist/html/index.html`: o comportamento deve ser idêntico ao da versão sem minificação.
7. Valide o HTML com o Nu Html Checker: `java -jar vnu.jar --errors-only html/index.html`.
8. Teste os temas: no DevTools do Chrome, abra Rendering e emule `prefers-color-scheme: dark` e `prefers-contrast: more`. Confira o contraste com a extensão axe DevTools (regra color-contrast) ou com o axe-core; o esperado é nenhuma violação nos quatro modos.

## Estrutura do projeto

- `html/`: o único arquivo HTML (`index.html`)
- `css/`: `estilos.css`, com o design system
- `imagens/`: imagens do site em WebP, com JPG/PNG de reserva e uma versão de 400 px de largura para telas pequenas
- `js/main.js`: ponto de entrada, só inicia o site
- `js/modules/`: um arquivo por responsabilidade: `dados`, `templates`, `mascaras`, `validacao`, `armazenamento`, `grafico`, `views`, `router` e `eventos`
- `js/vendor/`: biblioteca de terceiros (Chart.js) e a sua licença
- `scripts/build.mjs` e `package.json`: build de produção
- `dist/`: resultado da build (minificado), gerado por `npm run build`

Os módulos usam scripts comuns, e não `type="module"`, porque o navegador bloqueia módulos quando o site abre direto pelo arquivo. Cada arquivo guarda as suas variáveis dentro de uma função e só expõe o que precisa no objeto `Selenium`.

## Fluxo de branches (GitFlow)

- `main`: só versões de lançamento, cada uma marcada por um commit `release: vX.Y.Z` e por uma tag. Nada é commitado direto nela.
- `develop`: desenvolvimento contínuo. Recebe as features prontas.
- `feature/*`: uma funcionalidade nova, criada a partir de `develop`
- `release/*`: preparo de uma versão, criada a partir de `develop`
- `hotfix/*`: correção urgente, criada a partir de `main`; volta para `main` e para `develop`

As junções usam `--no-ff`, para o histórico mostrar onde cada branch existiu.

## Commits e versionamento

As mensagens seguem o padrão Conventional Commits: `feat` (recurso novo), `fix` (correção), `docs`, `chore`, com escopo opcional. Exemplo: `fix(armazenamento): descarta itens inválidos do localStorage ao ler`.

O versionamento é semântico, no formato MAJOR.MINOR.PATCH: MAJOR muda quando quebra o uso, MINOR traz recurso novo e PATCH só corrige. Veja o histórico completo no `CHANGELOG.md`.

## Licenças de terceiros

Chart.js 4.5.1, licença MIT. O texto da licença está em `js/vendor/chart.js-LICENSE.md`.
