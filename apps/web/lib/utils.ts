import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name = 'User'): string {
  return name
    .match(/(\b\S)?/g)
    .join('')
    .match(/(^\S|\S$)?/g)
    .join('')
}
