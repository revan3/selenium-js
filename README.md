# Selenium (versão 3: JavaScript)

Site da Associação Selenium (ONG fictícia) feito como Single Page Application em JavaScript puro, sem framework.

## Como abrir

Abra `html/index.html` no navegador. Não precisa de servidor.

## Estrutura

- `html/`: o único arquivo HTML (index.html)
- `css/`: estilos e design system
- `imagens/`: imagens do site
- `js/main.js`: ponto de entrada
- `js/modules/`: um arquivo por responsabilidade (dados, templates, máscaras, validação, armazenamento, gráfico, views, router e eventos)
- `js/vendor/`: biblioteca de terceiros (Chart.js, licença MIT)

## Fluxo de branches (GitFlow)

- `main`: só versões de lançamento, cada uma com uma tag (v1.0.0, v1.0.1...)
- `develop`: desenvolvimento contínuo; recebe as features já prontas
- `feature/*`: uma funcionalidade nova, criada a partir de `develop`
- `release/*`: preparo de uma versão, criada a partir de `develop`
- `hotfix/*`: correção urgente, criada a partir de `main`; volta para `main` e para `develop`

Todas as junções usam `--no-ff`, para o histórico mostrar onde cada branch existiu.

## Releases (versionamento semântico)

Versão MAJOR.MINOR.PATCH: MAJOR quando quebra o uso, MINOR para recurso novo, PATCH para correção. Cada versão é marcada na `main` por um commit `release: vX.Y.Z` e por uma tag com o mesmo nome. As mensagens de commit seguem o padrão Conventional Commits (`feat`, `fix`, `chore`, `docs`).
