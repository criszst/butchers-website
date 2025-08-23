"use server"

interface CEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export async function fetchAddressByCEP(cep: string) {
  try {
    // Remove caracteres não numéricos do CEP
    const cleanCEP = cep.replace(/\D/g, "")

    if (cleanCEP.length !== 8) {
      return {
        success: false,
        message: "CEP deve conter 8 dígitos",
      }
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)

    if (!response.ok) {
      return {
        success: false,
        message: "Erro ao consultar CEP",
      }
    }

    const data: CEPResponse = await response.json()

    if (data.cep) {
      return {
        success: true,
        address: {
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          zipCode: data.cep,
        },
      }
    } else {
      return {
        success: false,
        message: "CEP não encontrado",
      }
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}
