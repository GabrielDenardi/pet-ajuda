import admin from 'firebase-admin'
import { db } from '@/lib/firebaseAdmin'

export async function registerApprovedPayment(paymentId: string, amount: number) {
  const confirmedRef = db.collection('confirmed-payments').doc(paymentId)
  const totalRef = db.collection('donations').doc('total')

  const alreadyConfirmed = await db.runTransaction(async (tx) => {
    const confirmedSnap = await tx.get(confirmedRef)
    if (confirmedSnap.exists) return true

    tx.set(confirmedRef, {
      amount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    tx.set(totalRef, { arrecadado: admin.firestore.FieldValue.increment(amount) }, { merge: true })
    return false
  })

  if (alreadyConfirmed) return { alreadyConfirmed: true }

  const updated = await totalRef.get()
  return { ok: true, updated: updated.data() }
}
