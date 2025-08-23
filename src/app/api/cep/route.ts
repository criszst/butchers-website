import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cep = searchParams.get("cep")

  if (!cep) {
    return NextResponse.json({ error: "CEP é obrigatório" }, { status: 400 })
  }

  // Remove caracteres não numéricos
  const cleanCep = cep.replace(/\D/g, "")

  if (cleanCep.length !== 8) {
    return NextResponse.json({ error: "CEP deve ter 8 dígitos" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await response.json()

    if (data.erro) {
      return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento || "",
    })
  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
