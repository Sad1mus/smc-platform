"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { symbolSchema } from "@/lib/markets/symbol"

/**
 * Notas privadas del usuario por símbolo (diario personal).
 *
 * Es texto DEL USUARIO: SMC no opina ni recomienda, y las notas nunca se
 * comparten ni se agregan entre usuarios (eso las volvería señal social, o sea
 * asesoría). Ver el no-alcance en docs/specs/enriquecimiento.md.
 *
 * Una nota por símbolo: se edita, no se apila. Guardar vacío = borrar la nota,
 * que es lo que el usuario espera al vaciar el campo.
 */
const MAX_BODY = 2000

const bodySchema = z
  .string()
  .max(MAX_BODY, `La nota no puede superar los ${MAX_BODY} caracteres`)

export type NoteActionResult = {
  ok?: boolean
  error?: string
}

export async function saveNote(
  _prevState: NoteActionResult,
  formData: FormData
): Promise<NoteActionResult> {
  const parsedSymbol = symbolSchema.safeParse(formData.get("symbol"))
  if (!parsedSymbol.success) {
    return { error: parsedSymbol.error.issues[0].message }
  }

  const parsedBody = bodySchema.safeParse(formData.get("body") ?? "")
  if (!parsedBody.success) {
    return { error: parsedBody.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Tu sesión expiró. Vuelve a iniciar sesión." }
  }

  const symbol = parsedSymbol.data
  const body = parsedBody.data.trim()

  // Vaciar el campo borra la nota: el check de la base exige body no vacío, así
  // que un upsert con "" fallaría en vez de hacer lo obvio.
  if (!body) {
    const { error } = await supabase
      .from("symbol_notes")
      .delete()
      .eq("user_id", user.id)
      .eq("symbol", symbol)

    if (error) {
      return { error: "No se pudo borrar la nota. Intenta de nuevo." }
    }

    revalidatePath("/dashboard")
    return { ok: true }
  }

  const { error } = await supabase
    .from("symbol_notes")
    .upsert(
      { user_id: user.id, symbol, body },
      { onConflict: "user_id,symbol" }
    )

  if (error) {
    return { error: "No se pudo guardar la nota. Intenta de nuevo." }
  }

  revalidatePath("/dashboard")
  return { ok: true }
}
