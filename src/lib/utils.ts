import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const columnStyles: Record<string, { color: string }> = {
  todo: { color: "bg-blue-100" },
  inProgress: { color: "bg-yellow-100" },
  completed: { color: "bg-green-100" },
};