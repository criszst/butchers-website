/**
 * @fileoverview (server-action) authentication actions like registration and login.
 */

"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"


export interface RegisterResult {
  user?: {
    id: string
    name: string
    email: string
  }

  success: boolean
  message: string
  errors?: { [key: string]: string }
  redirectTo?: string
}

export interface LoginResult {
  user?: {
    id: string
    name: string
    email: string
  }

  success: boolean
  message: string
  errors?: { [key: string]: string }
  redirectTo?: string
}

export async function registerUser(prevState: RegisterResult | null, formData: FormData): Promise<RegisterResult> {
  console.log("Conteúdo do FormData (entries):", Array.from(formData.entries()))

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  console.log("Dados recebidos:", { name, email, phone, password, confirmPassword })

  const errors: { [key: string]: string } = {}

  // Validação básica (pode ser expandida)
  if (!name || name.trim() === "") {
    errors.name = "Nome é obrigatório."
  }
  if (!email || email.trim() === "") {
    errors.email = "Email é obrigatório."
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email inválido."
  }
  if (!phone || phone.trim() === "") {
    errors.phone = "Telefone é obrigatório."
  }
  if (!password) {
    errors.password = "Senha é obrigatória."
  } else if (password.length < 6) {
    errors.password = "Senha deve ter pelo menos 6 caracteres."
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Senhas não coincidem."
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Erro de validação.", errors }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      errors.email = "Este email já está cadastrado."
      return { success: false, message: "Erro de registro.", errors }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        image: "",
      },
    })

    console.log("Usuário registrado com sucesso:", newUser.email)

    
 
    return { success: true, message: "Conta criada e login realizado com sucesso!", redirectTo: "/perfil", user: { id: newUser.id, name: newUser.name, email: newUser.email } }
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return { success: false, message: "Ocorreu um erro ao criar a conta. Tente novamente." }
  }
}

export async function loginUser(prevState: LoginResult | null, formData: FormData): Promise<LoginResult> {
  console.log("Login - Conteúdo do FormData (entries):", Array.from(formData.entries()))

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const rememberMe = formData.get("rememberMe") === "on"

  console.log("Dados de login recebidos:", { email, password: "***", rememberMe })

  const errors: { [key: string]: string } = {}

  
  if (!email || email.trim() === "") {
    errors.email = "Email é obrigatório."
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email inválido."
  }
  if (!password || password.trim() === "") {
    errors.password = "Senha é obrigatória."
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Erro de validação.", errors }
  }

  try {
    // Buscar usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        image: true,
      },
    })

    if (!user) {
      errors.email = "Email não encontrado."
      return { success: false, message: "Credenciais inválidas.", errors }
    }

    console.log(user.password, "Senha do usuário:", user.password)

    
    if (!user.password || user.password === null) {
      errors.email = "Esta conta foi criada com Google. Use 'Continuar com Google' para fazer login."
      return { success: false, message: "Método de login incorreto.", errors }
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      errors.password = "Senha incorreta."
      return { success: false, message: "Credenciais inválidas.", errors }
    }

    console.log("Login realizado com sucesso para:", email)



    return { success: true, message: "Login realizado com sucesso!", redirectTo: "/perfil" }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return { success: false, message: "Ocorreu um erro interno. Tente novamente." }
  }
}
