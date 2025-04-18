import { db } from '@/lib/firebaseAdmin'

async function init() {
    await db.collection('donations').doc('total').set({ arrecadado: 0 })
    console.log('✔️ donations/total criado com arrecadado = 0')

    await db
        .collection('confirmed-payments')
        .doc('example-payment-id')
        .set({
            amount: 0,
            createdAt: new Date(),
        })
    console.log('✔️ confirmed-payments/example-payment-id criado')
}

init()
    .then(() => {
        console.log('Inicialização concluída')
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
