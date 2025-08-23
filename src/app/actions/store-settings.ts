"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface StoreSettingsData {
  storeName: string
  storeDescription: string
  storeAddress: string
  storePhone: string
  storeEmail: string
  deliveryFee: number
  freeDeliveryMinimum: number
  averageDeliveryTime: number
  deliveryRadius: number
  businessHours: string
  emailNotifications: boolean
  smsNotifications: boolean
  orderNotifications: boolean
  stockAlerts: boolean
  twoFactorAuth: boolean
  sessionTimeout: number
  primaryColor: string
  secondaryColor: string
  darkMode: boolean
}

export interface DeliveryData {
  deliveryFee: number
  freeDeliveryMinimum: number
  averageDeliveryTime: number
  deliveryRadius: number
}

export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSettings.findFirst()

    // Se não existir configuração, criar uma padrão
    if (!settings) {
         return {
      success: false,
      settings,
    }
    }

    return {
      success: true,
      settings,
    }
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return {
      success: false,
      message: "Erro ao buscar configurações da loja",
    }
  }
}

export async function updateStoreSettings(data: Partial<StoreSettingsData>) {
  try {
    // Buscar configuração existente ou criar uma nova
    let settings = await prisma.storeSettings.findFirst()

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: data,
      })
    } else {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: data,
      })
    }

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Configurações atualizadas com sucesso!",
      settings,
    }
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return {
      success: false,
      message: "Erro ao atualizar configurações da loja",
    }
  }
}

export async function getDeliveryConfigs() {
  const dConfigs = await prisma.storeSettings.findMany({
    select: {
      deliveryFee: true,
      freeDeliveryMinimum: true,
      averageDeliveryTime: true,
      deliveryRadius: true,
    },
  })

  if (!dConfigs)
    return {
      success: false,
      message: "Configurações de entrega não encontradas",
      value: dConfigs || [],
    }

  return {
    success: true,
    value: dConfigs,
  }
}
