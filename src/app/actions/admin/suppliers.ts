"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export interface SupplierData {
  name: string
  email: string
  phone?: string
  address?: string
  cnpj?: string
  contact?: string
  rating?: number
}

export interface ProductSupplierData {
  productId: number
  supplierId: string
  price: number
  minOrder?: number
  leadTime?: number
  isPreferred?: boolean
}

export interface PurchaseOrderData {
  supplierId: string
  items: {
    productName: string
    quantity: number
    unitPrice: number
  }[]
  expectedDate?: Date
  notes?: string
}

// Fornecedores
export async function createSupplier(data: SupplierData) {
  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        cnpj: data.cnpj,
        contact: data.contact,
        rating: data.rating || 0,
      },
    })

    revalidatePath("/admin")
    return { success: true, supplier, message: "Fornecedor criado com sucesso!" }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Email ou CNPJ já cadastrado" }
    }
    return { success: false, message: "Erro ao criar fornecedor" }
  }
}

export async function getSuppliersAction() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        ProductSupplier: {
          include: {
            product: true,
          },
        },
        PurchaseOrder: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, suppliers }
  } catch (error) {
    return { success: false, suppliers: [], message: "Erro ao buscar fornecedores" }
  }
}

export async function updateSupplier(id: string, data: Partial<SupplierData>) {
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data,
    })

    revalidatePath("/admin")
    return { success: true, supplier, message: "Fornecedor atualizado com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao atualizar fornecedor" }
  }
}

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({
      where: { id },
    })

    revalidatePath("/admin")
    return { success: true, message: "Fornecedor excluído com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao excluir fornecedor" }
  }
}

// Produtos por Fornecedor
export async function addProductToSupplier(data: ProductSupplierData) {
  try {
    const productSupplier = await prisma.productSupplier.create({
      data: {
        productId: data.productId,
        supplierId: data.supplierId,
        price: data.price,
        minOrder: data.minOrder,
        leadTime: data.leadTime,
        isPreferred: data.isPreferred || false,
      },
    })

    revalidatePath("/admin")
    return { success: true, productSupplier, message: "Produto adicionado ao fornecedor!" }
  } catch (error) {
    return { success: false, message: "Erro ao adicionar produto ao fornecedor" }
  }
}

export async function getSupplierProducts(supplierId: string) {
  try {
    const products = await prisma.productSupplier.findMany({
      where: { supplierId },
      include: {
        product: true,
      },
    })

    return { success: true, products }
  } catch (error) {
    return { success: false, products: [], message: "Erro ao buscar produtos do fornecedor" }
  }
}

export async function getProductSuppliers(productId: number) {
  try {
    const suppliers = await prisma.productSupplier.findMany({
      where: { productId },
      include: {
        supplier: true,
      },
      orderBy: { price: "asc" },
    })

    return { success: true, suppliers }
  } catch (error) {
    return { success: false, suppliers: [], message: "Erro ao buscar fornecedores do produto" }
  }
}

// Pedidos de Compra
export async function createPurchaseOrder(data: PurchaseOrderData) {
  try {
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        total,
        expectedDate: data.expectedDate,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    })

    revalidatePath("/admin")
    return { success: true, purchaseOrder, message: "Pedido de compra criado com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao criar pedido de compra" }
  }
}

export async function getPurchaseOrdersAction() {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, orders }
  } catch (error) {
    return { success: false, orders: [], message: "Erro ao buscar pedidos de compra" }
  }
}

export async function updatePurchaseOrderStatus(id: string, status: string) {
  try {
    const order = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status,
        ...(status === "Recebido" && { receivedDate: new Date() }),
      },
    })

    revalidatePath("/admin")
    return { success: true, order, message: "Status atualizado com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao atualizar status" }
  }
}

// Analytics
export async function getSupplierAnalytics() {
  try {
    const totalSuppliers = await prisma.supplier.count()
    const activeSuppliers = await prisma.supplier.count({ where: { isActive: true } })

    const totalPurchaseOrders = await prisma.purchaseOrder.count()
    const pendingOrders = await prisma.purchaseOrder.count({ where: { status: "Pendente" } })

    const totalSpent = await prisma.purchaseOrder.aggregate({
      _sum: { total: true },
      where: { status: { not: "Cancelado" } },
    })

    const topSuppliers = await prisma.supplier.findMany({
      include: {
        PurchaseOrder: {
          where: { status: { not: "Cancelado" } },
        },
      },
      take: 5,
    })

    return {
      success: true,
      analytics: {
        totalSuppliers,
        activeSuppliers,
        totalPurchaseOrders,
        pendingOrders,
        totalSpent: totalSpent._sum.total || 0,
        topSuppliers: topSuppliers.map((supplier) => ({
          ...supplier,
          totalOrders: supplier.PurchaseOrder.length,
          totalSpent: supplier.PurchaseOrder.reduce((sum, order) => sum + order.total, 0),
        })),
      },
    }
  } catch (error) {
    return { success: false, message: "Erro ao buscar analytics" }
  }
}
