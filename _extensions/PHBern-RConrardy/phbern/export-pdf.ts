// Run with `quarto run export-pdf.ts`. Uses only Quarto's bundled Deno and an
// Quarto-managed Chrome Headless Shell. No npm packages or user browser profile.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const decoder = new TextDecoder();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function publicDeckUrl(siteUrl: string | undefined, relative: string) {
  if (!siteUrl) return null;
  if (!/^https?:\/\//i.test(siteUrl)) throw new Error('website.site-url must be an absolute HTTP(S) URL.');
  return new URL(relative.split(path.sep).map(encodeURIComponent).join('/'), siteUrl.replace(/\/?$/, '/')).href;
}

export function printHtml(html: string) {
  // Set print options before Reveal creates its PDF pages. Work on a temporary
  // sibling file so images and stylesheets keep their original relative paths.
  return html.replace(/Reveal\.initialize\s*\(/,
    "((options) => Reveal.initialize({...options, pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1, autoSlide: 0, transition: 'none'}))(");
}

async function findBrowsers() {
  const explicit = Deno.env.get('PHBERN_HEADLESS_PATH');
  if (explicit) {
    if (!/^(chrome-headless-shell|headless_shell)(\.exe)?$/.test(path.basename(explicit))) {
      throw new Error('PHBERN_HEADLESS_PATH must point to Chrome Headless Shell, not a desktop browser.');
    }
    return [explicit];
  }
  const home = Deno.env.get('HOME') || Deno.env.get('USERPROFILE') || '';
  const data = Deno.build.os === 'darwin' ? path.join(home, 'Library/Application Support')
    : Deno.build.os === 'windows' ? Deno.env.get('LOCALAPPDATA') || path.join(home, 'AppData/Local')
    : Deno.env.get('XDG_DATA_HOME') || path.join(home, '.local/share');
  const directory = path.join(data, 'quarto/chrome-headless-shell');
  async function find(root: string, depth = 0): Promise<string[]> {
    if (depth > 5) return [];
    const found: string[] = [];
    try {
      for await (const entry of Deno.readDir(root)) {
        const file = path.join(root, entry.name);
        if (entry.isFile && /^(chrome-headless-shell|headless_shell)(\.exe)?$/.test(entry.name)) found.push(file);
        else if (entry.isDirectory) found.push(...await find(file, depth + 1));
      }
    } catch (error) { if (!(error instanceof Deno.errors.NotFound)) throw error; }
    return found.sort();
  }
  return await find(directory);
}

class DevTools {
  socket: WebSocket;
  id = 0;
  pending = new Map<number, { resolve: (value: any) => void; reject: (error: Error) => void; timer: number }>();
  constructor(socket: WebSocket) {
    this.socket = socket;
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      const request = this.pending.get(message.id);
      if (!request) return;
      clearTimeout(request.timer);
      this.pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });
    socket.addEventListener('close', () => {
      for (const request of this.pending.values()) {
        clearTimeout(request.timer);
        request.reject(new Error('Browser connection closed.'));
      }
      this.pending.clear();
    });
  }
  static async connect(url: string) {
    const socket = new WebSocket(url);
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { socket.close(); reject(new Error('Browser connection timed out.')); }, 10000);
      socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Cannot connect to browser.')); }, { once: true });
    });
    return new DevTools(socket);
  }
  send(method: string, params: Record<string, unknown> = {}, timeout = 60000): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`${method} timed out.`)); }, timeout);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.socket.close(); }
}

async function startBrowser(executable: string, profile: string) {
  const child = new Deno.Command(executable, {
    args: ['--headless', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1',
      `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
      '--disable-notifications', '--disable-sync', '--disable-extensions',
      '--disable-background-networking', '--mute-audio', 'about:blank'],
    stdout: 'null', stderr: 'piped', stdin: 'null',
  }).spawn();
  // Consume browser diagnostics quietly; retain a short reason for failures.
  let diagnosticTail = '';
  const diagnostics = (async () => {
    for await (const chunk of child.stderr) {
      diagnosticTail = (diagnosticTail + decoder.decode(chunk)).slice(-4000);
    }
  })();
  let exited = false;
  child.status.then(() => { exited = true; });
  try {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline && !exited) {
      try {
        const port = (await Deno.readTextFile(path.join(profile, 'DevToolsActivePort'))).split('\n')[0];
        const response = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(2000) });
        const tabs = await response.json();
        const page = tabs.find((tab: any) => tab.type === 'page');
        if (page) return { child, client: await DevTools.connect(page.webSocketDebuggerUrl) };
      } catch { /* Browser is still starting. */ }
      await delay(100);
    }
    if (exited) await diagnostics;
    const detail = diagnosticTail.trim().split('\n').filter(Boolean).at(-1);
    throw new Error(`Cannot start Chrome Headless Shell${detail ? ': ' + detail : '.'}`);
  } catch (error) {
    try { child.kill(); } catch { /* Already exited. */ }
    await child.status;
    throw error;
  }
}

async function stopBrowser(browser: Awaited<ReturnType<typeof startBrowser>>) {
  try { await browser.client.send('Browser.close', {}, 2000); } catch { /* Also handles already-closed browsers. */ }
  browser.client.close();
  const stopped = await Promise.race([browser.child.status.then(() => true), delay(2000).then(() => false)]);
  if (!stopped) {
    try { browser.child.kill('SIGKILL'); } catch { /* Already exited. */ }
    await browser.child.status;
  }
}

async function existingHtml(root: string): Promise<string[]> {
  const files = [];
  for await (const entry of Deno.readDir(root)) {
    if (entry.name.startsWith('.') || entry.name === 'site_libs' || entry.name.endsWith('_files')) continue;
    const file = path.join(root, entry.name);
    if (entry.isDirectory) files.push(...await existingHtml(file));
    else if (entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}

async function inspectProject() {
  // Windows' Quarto launcher is a .cmd file; cmd.exe is used with fixed args.
  const windows = Deno.build.os === 'windows';
  const result = await new Deno.Command(windows ? 'cmd.exe' : 'quarto', {
    args: windows ? ['/d', '/c', 'quarto inspect .'] : ['inspect', '.'], stdout: 'piped', stderr: 'piped',
  }).output();
  if (!result.success) throw new Error(`Cannot inspect Quarto project: ${decoder.decode(result.stderr).trim()}`);
  return JSON.parse(decoder.decode(result.stdout)).config;
}

export async function main() {
  if (Deno.env.get('PHBERN_SLIDES_PDF') === '0') return;
  const all = Deno.args.includes('--all');
  const rendered = Deno.env.get('QUARTO_PROJECT_OUTPUT_FILES');
  if (!all && !rendered?.trim()) return;
  const config = await inspectProject();
  const root = path.resolve(Deno.env.get('QUARTO_PROJECT_OUTPUT_DIR') || config.project?.['output-dir'] || '.');
  const candidates = all ? await existingHtml(root) : [...new Set(rendered!.split(/\r?\n/).filter(Boolean).map(file => path.resolve(file)))];
  const decks = [];
  for (const file of candidates) {
    if (!file.endsWith('.html')) continue;
    const relative = path.relative(root, file);
    if (relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error(`Output outside project directory: ${file}`);
    const html = await Deno.readTextFile(file);
    if (/<div\b[^>]*class=["'][^"']*\breveal\b/i.test(html) && /Reveal\.initialize\s*\(/.test(html)) {
      decks.push({ file, html, publicUrl: publicDeckUrl(config.website?.['site-url'] || config.book?.['site-url'], relative) });
    }
  }
  if (!decks.length) return;
  const browsers = await findBrowsers();
  if (!browsers.length) throw new Error('Chrome Headless Shell is not installed. Set it up once with: quarto install chrome-headless-shell. No normal browser will be started.');
  const profile = await Deno.makeTempDir({ prefix: 'phbern-pdf-' });
  let browser: Awaited<ReturnType<typeof startBrowser>> | undefined;
  try {
    browser = await startBrowser(browsers[0], profile);
    await browser.client.send('Page.enable');
    for (const deck of decks) {
      const id = crypto.randomUUID();
      const temporaryHtml = path.join(path.dirname(deck.file), `.phbern-pdf-${id}.html`);
      const temporaryPdf = path.join(path.dirname(deck.file), `.phbern-pdf-${id}.pdf`);
      try {
        await Deno.writeTextFile(temporaryHtml, printHtml(deck.html));
        const url = pathToFileURL(temporaryHtml);
        url.search = '?print-pdf';
        const navigation = await browser.client.send('Page.navigate', { url: url.href });
        if (navigation.errorText) throw new Error(navigation.errorText);
        // Wait for the new document rather than the previous deck's context.
        const deadline = Date.now() + 45000;
        let ready = false;
        while (Date.now() < deadline) {
          try {
            const state = await browser.client.send('Runtime.evaluate', {
              expression: `document.readyState === 'complete' && !!window.Reveal && Reveal.isReady() && document.querySelectorAll('.reveal .slides section').length > 0`,
              returnByValue: true,
            }, 5000);
            if (state.result.value === true) { ready = true; break; }
          } catch { /* Document context changes during navigation. */ }
          await delay(100);
        }
        if (!ready) throw new Error(`Reveal PDF layout did not become ready: ${path.basename(deck.file)}`);
        const prepared = await browser.client.send('Runtime.evaluate', {
          expression: `(async () => {
            await document.fonts.ready;
            await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
            const missing = [...document.images].filter(image => image.getAttribute('src') && !image.naturalWidth);
            if (missing.length) throw new Error('Images failed to load: ' + missing.map(image => image.getAttribute('src')).join(', '));
            const base = ${JSON.stringify(deck.publicUrl)};
            for (const a of document.querySelectorAll('a[href]')) {
              const href = a.getAttribute('href');
              if (href && !/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('//')) {
                if (!base) throw new Error('Set website.site-url so relative PDF links have a public destination.');
                a.setAttribute('href', new URL(href, base).href);
              }
            }
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            return true;
          })()`, awaitPromise: true, returnByValue: true,
        });
        if (prepared.exceptionDetails) throw new Error(prepared.exceptionDetails.exception?.description || 'Cannot prepare slide PDF.');
        const result = await browser.client.send('Page.printToPDF', {
          printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false,
          marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
        });
        const pdf = Uint8Array.from(atob(result.data), char => char.charCodeAt(0));
        if (decoder.decode(pdf.subarray(0, 5)) !== '%PDF-') throw new Error('Browser returned an invalid PDF.');
        await Deno.writeFile(temporaryPdf, pdf);
        await Deno.rename(temporaryPdf, deck.file.replace(/\.html$/, '.pdf'));
      } finally {
        for (const file of [temporaryHtml, temporaryPdf]) {
          try { await Deno.remove(file); } catch (error) { if (!(error instanceof Deno.errors.NotFound)) throw error; }
        }
      }
    }
  } finally {
    if (browser) await stopBrowser(browser);
    // Browser processes may briefly hold profile files on Windows.
    for (let attempt = 0; attempt < 10; attempt++) {
      try { await Deno.remove(profile, { recursive: true }); break; }
      catch { if (attempt < 9) await delay(200); }
    }
  }
}

if (import.meta.main) {
  try { await main(); }
  catch (error) {
    console.error(`[PHBern PDF] ${error instanceof Error ? error.message : error}`);
    Deno.exitCode = 1;
  }
}
