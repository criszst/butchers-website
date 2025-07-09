"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  Beef,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<any>({})
  const [step, setStep] = useState(1)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!formData.password) newErrors.password = "Senha é obrigatória"
    else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem"
    if (!formData.acceptTerms) newErrors.acceptTerms = "Você deve aceitar os termos"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStep(2)
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStep(2)
    setIsGoogleLoading(false)
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/20 via-transparent to-orange-600/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <Card className=" shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 animate-in zoom-in duration-500">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-white">Conta Criada com Sucesso! 🎉</h2>

              <p className="text-white/80 mb-6">
                Bem-vindo à Casa de Carnes Duarte! Sua conta foi criada e você já pode começar a fazer seus pedidos.
              </p>

              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Começar a Comprar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-600/20" />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.03%3E%3Ccircle cx=30 cy=30 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Beef className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">Casa de Carnes</div>
                <div className="text-xl font-semibold text-orange-400">Duarte</div>
              </div>
            </Link>

            <h1 className="text-3xl font-bold mb-2 text-white">Criar Conta</h1>
            <p className="text-white/70">Junte-se a nós e desfrute das melhores carnes da região</p>
          </div>

          {/* Main Card - Wide Layout */}
          <Card className="shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 animate-in slide-in-from-bottom duration-700 delay-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Google Login & Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Acesso Rápido</h2>

                    <Button
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className="w-full bg-white/90 hover:bg-white text-gray-700 border-0 font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                    >
                      {isGoogleLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <span>Conectando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Image
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google"
                            width={20}
                            height={20}
                          />
                          <span>Continuar com Google</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Por que se cadastrar?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/80">Compras seguras e protegidas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/80">Entrega rápida em Salto</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                          <Beef className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/80">Carnes premium selecionadas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="space-y-6">
                  <div className="relative">
                    <Separator className="bg-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-red-300 px-2 rounded-sm text-sm text-red/70">ou cadastre-se</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-white">
                          Nome Completo
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            className={`pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${errors.name ? "border-red-400" : "focus:border-red-400"}`}
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-400 text-xs animate-in slide-in-from-left duration-300">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-white">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className={`pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${errors.email ? "border-red-400" : "focus:border-red-400"}`}
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-400 text-xs animate-in slide-in-from-left duration-300">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-white">
                        Telefone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          className={`pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${errors.phone ? "border-red-400" : "focus:border-red-400"}`}
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-400 text-xs animate-in slide-in-from-left duration-300">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Password Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-white">
                          Senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            className={`pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${errors.password ? "border-red-400" : "focus:border-red-400"}`}
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-400 text-xs animate-in slide-in-from-left duration-300">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                          Confirmar Senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme a senha"
                            className={`pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${errors.confirmPassword ? "border-red-400" : "focus:border-red-400"}`}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1 animate-in slide-in-from-left duration-300">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                        className="mt-1 border-white/30 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <div className="text-sm">
                        <Label htmlFor="terms" className="text-white/80 cursor-pointer">
                          Eu aceito os{" "}
                          <Link href="/terms" className="text-red-400 hover:text-red-300 underline">
                            Termos de Uso
                          </Link>{" "}
                          e{" "}
                          <Link href="/privacy" className="text-red-400 hover:text-red-300 underline">
                            Política de Privacidade
                          </Link>
                        </Label>
                        {errors.acceptTerms && (
                          <p className="text-red-400 text-xs mt-1 animate-in slide-in-from-left duration-300">
                            {errors.acceptTerms}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Criando conta...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Criar Conta</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-sm text-white/70">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                          Fazer Login
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
