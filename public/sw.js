// Service worker do Domínio: abre sem internet e carrega rápido.
// Troque a versão quando quiser forçar todos os aparelhos a baixar tudo de novo.
const VERSAO = "dominio-v1";
const ESSENCIAIS = ["/", "/manifest.webmanifest", "/images/marca/icone-192.png", "/images/marca/icone-512.png", "/images/marca/logo.webp"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

const guardar = async (req, res) => {
  if (res && res.ok && (res.type === "basic" || res.type === "cors")) {
    const c = await caches.open(VERSAO);
    c.put(req, res.clone());
  }
  return res;
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Chat e qualquer API: sempre direto na rede, nunca em cache.
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) return;

  // Páginas: tenta a rede (versão nova); sem internet, abre o app salvo.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => guardar(new Request("/"), res))
        .catch(() => caches.match("/")),
    );
    return;
  }

  // Arquivos do app, imagens e fotos dos exercícios: cache primeiro (não mudam de nome).
  const estatico = url.origin === location.origin && /^\/(assets|images|exercicios)\//.test(url.pathname);
  // Fontes do Google: usa o cache e atualiza por trás.
  const fonte = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

  if (estatico || fonte) {
    e.respondWith(
      caches.match(req).then((salvo) => {
        const rede = fetch(req).then((res) => guardar(req, res)).catch(() => salvo);
        return salvo || rede;
      }),
    );
  }
});
