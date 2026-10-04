/* Selenium | scripts/build.mjs
   Build de produção. Lê html/index.html (a lista de <script> dele é a fonte
   da ordem dos módulos), junta e minifica o JavaScript e o CSS com o esbuild,
   minifica o HTML com o html-minifier-terser e escreve tudo em dist/.
   Uso: npm run build */
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const rel = (...p) => path.join(raiz, ...p);

// 1. A ordem dos scripts vem do index.html
const html = await readFile(rel('html/index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map((m) => m[1]);
const vendor = scripts.filter((s) => s.includes('/vendor/'));
const modulos = scripts.filter((s) => !s.includes('/vendor/'));

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'js/vendor'), { recursive: true });
await mkdir(path.join(dist, 'css'), { recursive: true });
await mkdir(path.join(dist, 'html'), { recursive: true });

// 2. JavaScript: um único app.min.js com os módulos na mesma ordem do index.html.
//    O Chart.js (209 KB, já minificado) fica fora do bundle e só é copiado:
//    muda raramente, então o navegador o guarda em cache sem baixar de novo
//    a cada mudança nos módulos do site.
const entrada = modulos.map((s) => `import ${JSON.stringify(s)};`).join('\n');
await build({
	stdin: { contents: entrada, resolveDir: rel('html'), loader: 'js' },
	outfile: path.join(dist, 'js/app.min.js'),
	bundle: true,
	format: 'iife',
	target: 'es2022',
	minify: true,            // espaços, comentários e nomes locais; nomes de propriedades ficam como estão
	legalComments: 'none',
	logLevel: 'warning'
});
for (const v of vendor) {
	await cp(path.resolve(rel('html'), v), path.join(dist, 'js/vendor', path.basename(v)));
}
await cp(rel('js/vendor/chart.js-LICENSE.md'), path.join(dist, 'js/vendor/chart.js-LICENSE.md'));

// 3. CSS
await build({
	entryPoints: [rel('css/estilos.css')],
	outfile: path.join(dist, 'css/estilos.min.css'),
	minify: true,
	loader: { '.css': 'css' },
	legalComments: 'none',
	logLevel: 'warning'
});

// 4. HTML: troca os <script> e o <link> pelos arquivos da build e minifica
let saida = html
	.replace(/\s*<script src="[^"]+" defer><\/script>/g, '')
	.replace('../css/estilos.css', '../css/estilos.min.css');
const tags = [...vendor.map((v) => `<script src="../js/vendor/${path.basename(v)}" defer></script>`), '<script src="../js/app.min.js" defer></script>'].join('');
saida = saida.replace('</head>', tags + '</head>');
saida = await minify(saida, {
	collapseWhitespace: true,
	removeComments: true,
	collapseBooleanAttributes: true,
	minifyCSS: false,
	minifyJS: false
});
await writeFile(path.join(dist, 'html/index.html'), saida);
await cp(rel('imagens'), path.join(dist, 'imagens'), { recursive: true });

// 5. Relatório de tamanhos (bytes e gzip) dos arquivos do projeto
const pares = [
	['CSS', ['css/estilos.css'], 'dist/css/estilos.min.css'],
	['JS (módulos juntos)', modulos.map((s) => path.relative(raiz, path.resolve(rel('html'), s))), 'dist/js/app.min.js'],
	['HTML (index.html)', ['html/index.html'], 'dist/html/index.html']
];
const tamanho = async (arquivos) => {
	const bufs = await Promise.all(arquivos.map((a) => readFile(rel(a))));
	const junto = Buffer.concat(bufs);
	return { bytes: junto.length, gzip: gzipSync(junto).length };
};
let totalA = 0, totalD = 0, gzA = 0, gzD = 0;
console.log('Arquivo'.padEnd(22), 'antes'.padStart(8), 'depois'.padStart(8), 'redução'.padStart(8), '| gzip antes', 'depois', 'redução');
for (const [nome, antes, depois] of pares) {
	const a = await tamanho(antes), d = await tamanho([depois]);
	totalA += a.bytes; totalD += d.bytes; gzA += a.gzip; gzD += d.gzip;
	const p = (x, y) => (100 * (1 - y / x)).toFixed(1) + '%';
	console.log(nome.padEnd(22), String(a.bytes).padStart(8), String(d.bytes).padStart(8), p(a.bytes, d.bytes).padStart(8), '|', String(a.gzip).padStart(10), String(d.gzip).padStart(6), p(a.gzip, d.gzip));
}
console.log('TOTAL'.padEnd(22), String(totalA).padStart(8), String(totalD).padStart(8), (100 * (1 - totalD / totalA)).toFixed(1).padStart(7) + '%', '|', String(gzA).padStart(10), String(gzD).padStart(6), (100 * (1 - gzD / gzA)).toFixed(1) + '%');
