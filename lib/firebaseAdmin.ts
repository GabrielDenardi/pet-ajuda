import * as admin from 'firebase-admin'

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
let privateKey = process.env.FIREBASE_PRIVATE_KEY

if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
        '❌ Variáveis do Firebase faltando: verifique FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY'
    )
}

if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n')
}

if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('❌ FIREBASE_PRIVATE_KEY inválida: não começa com o cabeçalho PEM correto')
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    })
}

export const db = admin.firestore()
