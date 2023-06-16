import { ChangeEvent } from 'react'

import imageCompression from 'browser-image-compression'

export async function handleUploadImage(event: ChangeEvent<HTMLInputElement>) {
  const { files } = event.target

  if (!files) {
    return
  }
  const imagem = files[0]

  if (imagem) {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    const compressedFile = await imageCompression(imagem, options)

    const shortImage =
      compressedFile.size > imagem.size ? imagem : compressedFile

    const resData = (await getBase64(shortImage)) as string

    return resData ?? null
  }
}

async function getBase64(blob: any) {
  return await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })
}

export function haveData(value: any) {
  if (Array.isArray(value) && value.length === 0) {
    return false
  }
  if (value === undefined || value === null || value === '') {
    return false
  }
  return value
}
