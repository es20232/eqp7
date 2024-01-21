import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function Edit() {
  return (
    <div>
      <div className="mx-auto flex max-w-2xl justify-between py-5">
        <Link href="/account">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-md bg-blue-200 p-6 shadow-md">
        <h3 className="mb-4 text-2xl font-bold">Editar Perfil</h3>
        <form>
          <label htmlFor="name" className="mb-2 block">
            Alterar nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full rounded border p-2"
          />

          <label htmlFor="password" className="mb-2 mt-4 block">
            Alterar username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full rounded border p-2"
          />

          <label htmlFor="bio" className="mb-2 mt-4 block">
            Alterar Bio:
          </label>
          <textarea
            id="bio"
            name="bio"
            className="w-full rounded border p-2"
            maxLength={200}
          ></textarea>

          <label htmlFor="photos" className="mb-2 mt-4 block">
            Adicionar Fotos:
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            className="mb-4"
          />
          <div className="mt-4 md:w-full md:text-right">
            <button
              type="submit"
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
