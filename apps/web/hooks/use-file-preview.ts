import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

type ReturnType = [
  file: string,
  onChange: (e: ChangeEvent<any>) => void,
  setFile: Dispatch<SetStateAction<string>>,
]

export function useFilePreview(initialFile: string): ReturnType {
  const [file, setFile] = useState(initialFile)

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const imageElement = new Image()
      const imageUrl = reader.result?.toString() || ''
      imageElement.src = imageUrl
      setFile(imageUrl)
    })
    reader.readAsDataURL(file)
  }

  return [file, onChange, setFile]
}
