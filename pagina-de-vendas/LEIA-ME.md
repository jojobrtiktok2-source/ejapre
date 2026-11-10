# Página de vendas: Método Controle Total

Site estático em HTML e CSS, sem build. Tem 4 páginas:

- `index.html`: a página de vendas.
- `termos.html`: os termos de uso.
- `privacidade.html`: a política de privacidade (LGPD e RGPD).
- `reembolso.html`: reembolso, garantia de 7 dias e entrega.

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

Quando criar o checkout, troque `https://checkout.mundpay.com/SEU-LINK-AQUI` no `index.html` pelo link do produto.

## Publicar com domínio próprio (Vercel)

1. Na Vercel, crie um projeto novo a partir deste repositório e escolha `pagina-de-vendas` em **Root Directory**. Não tem build: o framework é "Other".
2. Em **Settings > Domains**, adicione o seu domínio, por exemplo `seudominio.com`, e configure o DNS como a Vercel indicar.
3. O app fica em outro endereço, por exemplo `app.seudominio.com`. Esse é o link que vai no e-mail de entrega da Mundpay.
