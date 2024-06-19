import type { ClassValue } from "clsx"

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const tw = (strings: TemplateStringsArray, ...values: unknown[]) =>
	String.raw({ raw: strings }, ...values)

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
