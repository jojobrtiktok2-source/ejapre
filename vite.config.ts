import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Em desenvolvimento, serve /api/<nome> com o handler de api/<nome>.ts (igual à Vercel em produção).
function apiDev(): Plugin {
  return {
    name: "api-dev",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const nome = url.pathname.replace(/^\/+|\/+$/g, "");
        const arquivo = path.resolve("api", `${nome}.ts`);
        if (!/^[a-z-]+$/.test(nome) || !fs.existsSync(arquivo)) return next();
        try {
          const partes: Buffer[] = [];
          for await (const c of req) partes.push(c as Buffer);
          const request = new Request(`http://localhost/api/${nome}${url.search}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(partes),
          });
          const mod = await server.ssrLoadModule(`/api/${nome}.ts`);
          const handler = mod[req.method ?? "GET"];
          if (!handler) {
            res.statusCode = 405;
            return res.end("Método não permitido");
          }
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          if (!response.body) return res.end();
          const reader = response.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Erro interno");
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Variáveis lidas pelas funções de /api (em desenvolvimento vêm de .env / .env.local).
  const env = loadEnv(mode, process.cwd(), ["ANTHROPIC_"]);
  for (const [k, v] of Object.entries(env)) if (v && !process.env[k]) process.env[k] = v;
  return {
    plugins: [react(), apiDev()],
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  };
});
