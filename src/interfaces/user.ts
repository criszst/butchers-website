export interface User {
  id: string
  name: string
  email: string
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  isAdmin: boolean
  bio?: string | null
  birthDate?: string | null
  phone?: string | null
  cpf?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string | null
  bio?: string | null
  birthDate?: string | null
  phone?: string | null
  cpf?: string | null
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UpdateProfileData {
  name?: string
  bio?: string
  birthDate?: string
  phone?: string
  cpf?: string
  image?: string
}
