import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";

export default function Edit() {
    return (
        <div>
            <div className="mx-auto flex max-w-2xl justify-between py-5">
                <Link href="/account">
                    <Button variant="outline">Voltar</Button>
                </Link>
            </div>

            <div className="max-w-2xl mx-auto mt-8 p-6 bg-blue-200 rounded-md shadow-md">
                <h3 className="text-2xl font-bold mb-4">Editar Perfil</h3>
                <form>
                    <label htmlFor="name" className="block mb-2">Alterar nome:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full p-2 border rounded"
                    />

                    <label htmlFor="password" className="block mt-4 mb-2">Alterar username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full p-2 border rounded"
                    />

                    <label htmlFor="bio" className="block mt-4 mb-2">Alterar Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="w-full p-2 border rounded"
                        maxLength={200}
                    ></textarea>

                    <label htmlFor="photos" className="block mt-4 mb-2">Adicionar Fotos:</label>
                    <input
                        type="file"
                        id="photos"
                        name="photos"
                        accept="image/*"
                        multiple
                        className="mb-4"
                    />
                    <div className="mt-4 md:text-right md:w-full">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Salvar Alterações
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
}