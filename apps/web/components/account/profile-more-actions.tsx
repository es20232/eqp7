'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "@/actions/sign-out";

export async function ProfileMoreActions() {
  return (<DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size='icon' variant='ghost'><MoreVertical className='h-4 w-4' /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={async () => await signOut()}>
        Sair
        <LogOut className='h-4 w-4 ml-auto' />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>)
}