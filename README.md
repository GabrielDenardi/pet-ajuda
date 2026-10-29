# PetAjuda

Plataforma de doações para ajudar animais em situação de rua, construída e publicada em abril de 2025.

## O que faz

- Doação de valor livre pelo Checkout Pro do Mercado Pago
- Barra de progresso com a meta e o valor arrecadado
- Página de transparência com os comprovantes de uso do dinheiro
- Painel de admin protegido por senha para enviar comprovantes

## Como uma doação é confirmada

1. `POST /api/create-payment` cria uma preferência no Mercado Pago e devolve o link do checkout.
2. Quando o pagamento muda de status, o Mercado Pago chama `POST /api/mp-webhook`.
3. O webhook não confia no corpo da notificação: ele consulta o pagamento direto na API do Mercado Pago, e o valor somado é o que a API devolve.
4. Se o pagamento estiver aprovado, `registerApprovedPayment` grava o pagamento e soma no total numa única transação do Firestore. Notificações repetidas não contam a mesma doação duas vezes.
5. A página `/sucesso` consulta `POST /api/check-payment` até a doação aparecer como confirmada.

`POST /api/confirm-payment` faz o mesmo registro a partir de um id de pagamento e serve para reprocessar uma doação manualmente.

## Stack

Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Firestore via Firebase Admin e SDK do Mercado Pago. Deploy na Vercel.

## Rodando localmente

```bash
pnpm install
pnpm dev
```

Variáveis de ambiente em `.env.local`:

| Variável | Para quê |
| --- | --- |
| `MERCADO_PAGO_ACCESS_TOKEN` | Criar preferências e consultar pagamentos |
| `APP_URL` | URL base usada nos retornos do checkout |
| `FIREBASE_PROJECT_ID` | Projeto do Firestore |
| `FIREBASE_CLIENT_EMAIL` | Conta de serviço do Firebase Admin |
| `FIREBASE_PRIVATE_KEY` | Chave da conta de serviço, em formato PEM |
| `ADMIN_SECRET` | Senha do painel de admin; sem ela o painel fica fechado |

`scripts/initFirestore.ts` cria os documentos iniciais no Firestore.

## Limitações conhecidas

Os comprovantes são gravados em `public/receipts`, no disco do servidor. Na Vercel esse disco é somente leitura, então o envio pelo painel só funciona rodando o projeto localmente ou em servidor próprio. O próximo passo é guardar os arquivos no Firebase Storage.
