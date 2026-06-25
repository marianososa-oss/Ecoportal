import { clsx, type ClassValue } from "clsx";

/** Une clases condicionalmente (alias corto de clsx). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
