'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, MoreVertical, Pen } from 'lucide-react'
import { Button } from '../ui/button'
import { signOut } from '@/actions/sign-out'
import Link from 'next/link'

export async function ProfileMoreActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/account/edit">
          <DropdownMenuItem>
            Editar
            <Pen className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={async () => await signOut()}>
          Sair
          <LogOut className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
