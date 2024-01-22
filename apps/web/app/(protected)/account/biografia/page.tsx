import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Biografia() {
  return (
    <div>
      <div className="mx-auto flex max-w-2xl justify-between py-5">
        <Link href="/account">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mt-8 p-6 bg-blue-200 rounded-md shadow-md">
        <h3 className="text-2xl font-bold mb-4">Biografia do Usuário</h3>
        
        <p className="text-lg">
          Meu nome é Luís Felipe Moral. Sou um apaixonado, um homem pra casar.
          Estou a procura da mulher certa, tenho 19 anos, sou mais conhecido como O MORAL
          e faço Ciência da Computação na UFPI.
        </p>

        <div className="mt-4 md:text-right md:w-full">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Editar Biografia
          </button>
        </div>
      </div>
    </div>
  );
}
