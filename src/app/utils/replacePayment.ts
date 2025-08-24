  const replaceOrderMethod = (method: string) => {
    const methods = {
      ["pickupOrder"]: "Pagamento na Retirada",
      ["vr"]: "Vale Refeição",
      ["va"]: "Vale Alimentação",
      ["debito"]: "Cartão de Débito",
      ["credito"]: "Cartão de Crédito",
      ["dinheiro"]: "Dinheiro",
    }

    return methods[method] || "Não informado"
}

export default replaceOrderMethod;