import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './client'

export async function uploadPDF(pdfBuffer, userId, generationId, type = 'exercice') {
  const fileName   = `pdfs/${userId}/${generationId}_${type}.pdf`
  const storageRef = ref(storage, fileName)
  await uploadBytes(storageRef, pdfBuffer, { contentType: 'application/pdf' })
  return await getDownloadURL(storageRef)
}

export async function deletePDFs(userId, generationId) {
  await Promise.allSettled(
    ['exercice', 'corrige'].map(type =>
      deleteObject(ref(storage, `pdfs/${userId}/${generationId}_${type}.pdf`))
    )
  )
}
