import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'
import { ref } from 'vue'

export function useImageUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function uploadCharacterImage(characterId: string, file: File): Promise<string> {
    uploading.value = true
    error.value = null
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `characters/${characterId}/portrait.${ext}`
      const fileRef = storageRef(storage, path)
      await uploadBytes(fileRef, file)
      return await getDownloadURL(fileRef)
    } catch (e) {
      error.value = 'Bild-Upload fehlgeschlagen'
      throw e
    } finally {
      uploading.value = false
    }
  }

  return { uploadCharacterImage, uploading, error }
}
