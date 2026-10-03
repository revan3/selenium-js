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

## Tecnologias utilizadas

- HTML5 semântico: estrutura do único arquivo `html/index.html`
- CSS3: design system com variáveis, Grid de 12 colunas, Flexbox e componentes de feedback (badges, alertas e toast)
- JavaScript ES6+ sem framework: scripts comuns com `defer`, um módulo por arquivo
- Web Storage (`localStorage`): guarda os colaboradores
- Constraint Validation API: validação do formulário
- Chart.js 4.5.1 (licença MIT): gráfico, em `js/vendor`
- Git com GitFlow e Conventional Commits: controle de versão

## Pré-requisitos

- Um navegador atual (Chrome, Edge, Firefox ou Safari)
- Git, para clonar o repositório (ou baixe o ZIP pelo GitHub)
- Opcional: Python 3 ou Node.js, só para abrir por um servidor local

## Instalação e execução local

1. Clone o repositório: `git clone https://github.com/revan3/selenium-js.git`
2. Entre na pasta: `cd selenium-js`
3. Abra `html/index.html` no navegador, com duplo clique no arquivo. O site funciona direto pelo arquivo, sem servidor.
4. Opcional, para abrir por um servidor local: `python3 -m http.server 8000` e acesse `http://localhost:8000/html/index.html`

## Dependências e build

Não há nada para instalar nem para compilar. O site é estático e o navegador executa os arquivos como estão. A única biblioteca externa, o Chart.js, já está em `js/vendor/chart.umd.js`. Para atualizá-la: `npm install chart.js` e copie `node_modules/chart.js/dist/chart.umd.js` para `js/vendor/`.

## Testes

Ainda não há testes automatizados. Os testes são manuais:

1. Abra cada página (`#/`, `#/projetos`, `#/cadastro`, `#/componentes`) e confira que `#/xyz` mostra a página 404.
2. Em `#/cadastro`, envie o formulário vazio: cada campo obrigatório mostra o seu erro.
3. Preencha tudo corretamente e envie: aparecem o alerta de sucesso, o cartão na lista e o gráfico.
4. Recarregue a página: a lista continua. Clique em Remover: o cartão some.
5. Teste dados quebrados: no console, rode `localStorage.setItem('selenium:colaboradores', '{[oops')` e recarregue. A lista deve aparecer vazia, sem erro no console.
6. Valide o HTML com o Nu Html Checker: `java -jar vnu.jar --errors-only html/index.html`.

## Estrutura do projeto

- `html/`: o único arquivo HTML (`index.html`)
- `css/`: `estilos.css`, com o design system
- `imagens/`: imagens do site em dois formatos cada
- `js/main.js`: ponto de entrada, só inicia o site
- `js/modules/`: um arquivo por responsabilidade: `dados`, `templates`, `mascaras`, `validacao`, `armazenamento`, `grafico`, `views`, `router` e `eventos`
- `js/vendor/`: biblioteca de terceiros (Chart.js) e a sua licença

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
