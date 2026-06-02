import { describe, expect, it } from "vitest"

import {
  emailSchema,
  forgotPasswordSchema,
  loginSchema,
  passwordSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/auth/validation"

describe("emailSchema", () => {
  it("acepta correos válidos", () => {
    expect(emailSchema.safeParse("usuario@smc.com").success).toBe(true)
    expect(emailSchema.safeParse("a.b+tag@dominio.co").success).toBe(true)
  })

  it("rechaza correos inválidos", () => {
    expect(emailSchema.safeParse("no-es-correo").success).toBe(false)
    expect(emailSchema.safeParse("@dominio.com").success).toBe(false)
    expect(emailSchema.safeParse("").success).toBe(false)
  })
})

describe("passwordSchema", () => {
  it("acepta contraseñas fuertes", () => {
    expect(passwordSchema.safeParse("Secreta123").success).toBe(true)
    expect(passwordSchema.safeParse("OtraClave99").success).toBe(true)
  })

  it("rechaza contraseñas cortas", () => {
    expect(passwordSchema.safeParse("Ab1").success).toBe(false)
  })

  it("rechaza contraseñas sin mayúscula", () => {
    expect(passwordSchema.safeParse("secreta123").success).toBe(false)
  })

  it("rechaza contraseñas sin minúscula", () => {
    expect(passwordSchema.safeParse("SECRETA123").success).toBe(false)
  })

  it("rechaza contraseñas sin número", () => {
    expect(passwordSchema.safeParse("SecretaClave").success).toBe(false)
  })
})

describe("loginSchema", () => {
  it("acepta credenciales completas", () => {
    const result = loginSchema.safeParse({
      email: "usuario@smc.com",
      password: "cualquiera",
    })
    expect(result.success).toBe(true)
  })

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({
      email: "usuario@smc.com",
      password: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  const base = {
    fullName: "Usuario de Prueba",
    email: "usuario@smc.com",
    password: "Secreta123",
    confirmPassword: "Secreta123",
  }

  it("acepta un registro válido", () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })

  it("rechaza cuando las contraseñas no coinciden", () => {
    const result = registerSchema.safeParse({
      ...base,
      confirmPassword: "Distinta123",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword")
    }
  })

  it("rechaza nombres demasiado cortos", () => {
    expect(registerSchema.safeParse({ ...base, fullName: "A" }).success).toBe(
      false
    )
  })
})

describe("forgotPasswordSchema", () => {
  it("solo exige un correo válido", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "usuario@smc.com" }).success
    ).toBe(true)
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(
      false
    )
  })
})

describe("updatePasswordSchema", () => {
  it("exige confirmación idéntica", () => {
    expect(
      updatePasswordSchema.safeParse({
        password: "Secreta123",
        confirmPassword: "Secreta123",
      }).success
    ).toBe(true)
    expect(
      updatePasswordSchema.safeParse({
        password: "Secreta123",
        confirmPassword: "Otra123456",
      }).success
    ).toBe(false)
  })
})
