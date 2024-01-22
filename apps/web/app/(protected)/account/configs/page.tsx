import Image from "next/image"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"

const ConfigsPage = () => {
  return (
    <div>
      <div className="mx-auto flex max-w-2xl justify-between py-5">
        <Link href="/account">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mt-8 p-6 bg-blue-200 rounded-md shadow-md">
        <h3 className="text-2xl font-bold mb-4">Configurações do Usuário</h3>
        
        {/* Comentários */}
        <div className="mb-4">
          <Button variant="outline">Comentários</Button>
        </div>

         {/* Editar Senha */}
         <div className="mb-4">
            <Button variant="outline">Editar Senha</Button>
        </div>

         {/* Status da Conta */}
         <div className="mb-4">
            <Button variant="outline">Status da Conta</Button>
        </div>

        {/* Ajuda */}
        <div>
          <Button variant="outline">Ajuda</Button>
        </div>
        
      </div>
    </div>
  );
};

export default ConfigsPage;


