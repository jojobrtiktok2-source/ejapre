# Página de vendas: Método Controle Total

A página de vendas fica em `public/off/` e é publicada junto com o app, no mesmo domínio:

| Endereço | O que abre |
|---|---|
| `seudominio.com/off` | página de vendas |
| `seudominio.com/off/termos.html` | termos de uso |
| `seudominio.com/off/privacidade.html` | política de privacidade (LGPD e RGPD) |
| `seudominio.com/off/reembolso.html` | reembolso, garantia de 7 dias e entrega |
| `seudominio.com` | o app |

São arquivos HTML e CSS puros, sem build. O `vercel.json` manda `/off` para `/off/`, e o service worker do app ignora `/off`. Assim, a página de vendas nunca entra no cache do app.

## Dados da oferta

| Item | Valor |
|---|---|
| Produto | Método Controle Total |
| Preço | € 30,00 (EUR), pagamento único |
| Acesso | Vitalício, no app web Domínio |
| Garantia | 7 dias, com reembolso integral |
| Suporte | entregasdrive159@gmail.com |

No painel da Mundpay, o produto precisa ter **exatamente** esse nome e esse preço, na moeda EUR.

## Falta fazer

- Quando criar o checkout, troque `https://checkout.mundpay.com/SEU-LINK-AQUI` no `public/off/index.html` pelo link do produto.
- A Mundpay exige domínio próprio. Ligue o seu domínio ao projeto `ejapre` na Vercel, em **Settings > Domains**, e mande para eles o endereço `https://seudominio.com/off`.
