"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Beef, Sparkles, Shield, Zap, LogIn } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { loginUser } from "@/app/actions/auth"
import { useToast } from "@/app/hooks/use-toast"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const [state, formAction, isPending] = useActionState(loginUser, null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/perfil")
    }
  }, [session, status, router])

  // Lidar com o resultado do login
  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (state?.success) {
        toast({
          title: "✅ Dados validados!",
          description: "Fazendo login...",
        })

        // Fazer login via NextAuth
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/perfil",
          redirect: false,
        })

        if (result?.ok) {
          toast({
            title: "✅ Login realizado!",
            description: "Redirecionando...",
          })
          router.push("/perfil")
        } else {
          toast({
            title: "❌ Erro no Login",
            description: result?.error || "Credenciais inválidas.",
            variant: "destructive",
          })
        }
      } else if (state && !state.success) {
        if (state.errors) {
          Object.entries(state.errors).forEach(([field, message]) => {
            toast({
              title: `Erro no campo ${field}`,
              description: message,
              variant: "destructive",
            })
          })
        } else {
          toast({
            title: "❌ Erro no Login",
            description: state.message,
            variant: "destructive",
          })
        }
      }
    }

    handleLoginSuccess()
  }, [state, toast, router, formData.email, formData.password])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const result = await signIn("google", {
        callbackUrl: "/perfil", // Usar callbackUrl, não redirectTo
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "❌ Erro no Login com Google",
          description: "Não foi possível conectar com o Google. Tente novamente.",
          variant: "destructive",
        })
      } else if (result?.ok) {
        toast({
          title: "✅ Login realizado!",
          description: "Login com Google realizado com sucesso!",
        })
        router.push("/perfil") // Usar router.push, não window.location
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast({
        title: "❌ Erro no Login com Google",
        description: "Não foi possível conectar com o Google. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Mostrar loading se estiver verificando sessão
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="text-white text-xl">Carregando...</div>
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
            <h1 className="text-3xl font-bold mb-2 text-white">Fazer Login</h1>
            <p className="text-white/70">Acesse sua conta e continue aproveitando nossas carnes premium</p>
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
                      type="button"
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
                    <h3 className="text-lg font-semibold text-white">Bem-vindo de volta!</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/80">Acesso seguro à sua conta</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/80">Pedidos rápidos e fáceis</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                          <Beef className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/80">Histórico de compras</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Side - Login Form */}
                <div className="space-y-6">
                  <div className="relative">
                    <Separator className="bg-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-red-300 px-2 rounded-sm text-sm text-red/70">ou faça login</span>
                    </div>
                  </div>
                  <form action={formAction} className="space-y-4">
                    {/* Email */}
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
                          name="email"
                          required
                          className={`pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${state?.errors?.email ? "border-red-400" : "focus:border-red-400"}`}
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      {state?.errors?.email && (
                        <p className="text-red-400 text-xs animate-in slide-in-from-left duration-300">
                          {state.errors.email}
                        </p>
                      )}
                    </div>
                    {/* Password */}
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
                          name="password"
                          required
                          className={`pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 ${state?.errors?.password ? "border-red-400" : "focus:border-red-400"}`}
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
                      {state?.errors?.password && (
                        <p className="text-red-400 text-xs animate-in slide-in-from-left duration-300">
                          {state.errors.password}
                        </p>
                      )}
                    </div>
                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          id="rememberMe"
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-white/70">
                          Lembrar de mim
                        </Label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-0"
                    >
                      {isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Entrando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <LogIn className="h-4 w-4" />
                          <span>Entrar</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    {/* Register Link */}
                    <div className="text-center">
                      <p className="text-sm text-white/70">
                        Não tem uma conta?{" "}
                        <Link
                          href="/register"
                          className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                        >
                          Criar Conta
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
