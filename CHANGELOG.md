# Histórico de versões

## 1.3.0

- Recurso novo: deploy automático no GitHub Pages com GitHub Actions (.github/workflows/deploy.yml)
- A cada push na main: npm ci, npm run build e publicação da pasta dist
- O build gera dist/index.html, que redireciona para html/index.html
- Build testada em subpasta (/selenium-js/), sem erros 404 e sem erros no console

## 1.2.1

- Desempenho: imagens em WebP com JPG/PNG de reserva (picture), duas larguras (400 e 800 px) por srcset e sizes, e carregamento preguiçoso (loading="lazy") nas imagens fora da primeira tela
- Peso das imagens da página inicial: de 99.635 para 53.070 bytes (47% menos) em telas de alta densidade e para 25.556 bytes (74% menos) em celular comum
- WebP recomprimido com qualidade 80; o QR Code continua sendo lido (testado)
- Correção de layout: a grade passou a mirar o picture, que envolve a imagem

## 1.2.0

- Recurso novo: build de produção com esbuild e html-minifier-terser (npm run build), com saída em dist/
- Redução de 33,1% no total dos arquivos do projeto (CSS 19,7%, JS 41,1%, HTML 27,6%)
- Mesmos testes de comportamento aprovados na versão minificada

## 1.1.0

- Recurso novo: modo escuro e modo de alto contraste, que seguem a preferência do sistema
- Contraste verificado com o axe-core nos quatro modos, sem violações
- O gráfico acompanha a troca de tema

## 1.0.3

- Documentação: README completo, com visão geral, instalação, testes e versionamento

## 1.0.2

- Correção: idade decimal, nome sem letras e e-mail sem ponto eram aceitos
- Correção: textos muito longos estouravam a largura da página (limites nos campos e quebra de palavras no cartão)
- Correção: alterar o cadastro em outra aba agora atualiza a lista desta aba

## 1.0.1

- Correção: itens inválidos no localStorage apareciam como "undefined" e não podiam ser removidos

## 1.0.0

- SPA com rotas por hash, templates em JavaScript e módulos separados
- Cadastro com máscaras e validação
- Colaboradores guardados no localStorage
- Gráfico de colaboradores por tipo (Chart.js)
