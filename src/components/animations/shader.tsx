"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function ShaderHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [dots, setDots] = useState<
    { left: number; top: number; delay: number; duration: number }[]
  >([])

  const promocoes = [
    {
      id: 1,
      titulo: "Picanha Premium",
      descricao: "Maturada por 28 dias para máxima maciez",
      preco: "R$ 52,90/kg",
      precoOriginal: "R$ 59,90/kg",
      imagem: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      cor: "from-red-600 to-orange-500",
    },
    {
      id: 2,
      titulo: "Kit Churrasco",
      descricao: "Pacote misto para churrasco - perfeito para o fim de semana",
      preco: "R$ 89,90",
      precoOriginal: "R$ 109,90",
      imagem: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop",
      cor: "from-amber-600 to-red-500",
    },
    {
      id: 3,
      titulo: "Frango Caipira",
      descricao: "Frango orgânico criado solto",
      preco: "R$ 18,90/kg",
      precoOriginal: "R$ 22,90/kg",
      imagem: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop",
      cor: "from-yellow-500 to-orange-600",
    },
    {
      id: 4,
      titulo: "Costela Bovina",
      descricao: "Costela maturada com tempero especial",
      preco: "R$ 32,90/kg",
      precoOriginal: "R$ 38,90/kg",
      imagem: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop",
      cor: "from-red-700 to-pink-600",
    },
  ]

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % promocoes.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + promocoes.length) % promocoes.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  useEffect(() => {
    setDots(
      Array.from({ length: 5 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3 ,
        duration: 5 + Math.random() * 3, 
      }))
    )
  }, [])


  return (
    <section className="relative min-h-[400px] md:min-h-[400px] lg:min-h-[650px] overflow-hidden bg-black">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${promocoes[currentSlide].cor} animate-pulse`}
          style={{
            animation: "gradientShift 3s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Slider Container */}
      <div className="relative h-full flex items-center py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Content Side */}
            <div className="text-white z-10 relative order-2 lg:order-1 text-center lg:text-left">
              <div
                className={`transform transition-all duration-800 ${isTransitioning ? "translate-x-4 lg:translate-x-8 opacity-0" : "translate-x-0 opacity-100"
                  }`}
              >
                {/* Badge */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                    Oferta Especial
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                  {promocoes[currentSlide].titulo}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 lg:mb-8 text-gray-200 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {promocoes[currentSlide].descricao}
                </p>

                {/* Prices */}
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 lg:space-x-4 mb-6 sm:mb-8 lg:mb-10">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-400">
                    {promocoes[currentSlide].preco}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl line-through text-gray-400">
                    {promocoes[currentSlide].precoOriginal}
                  </span>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Image Side with Shader Effects */}
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                {promocoes.map((promo, index) => (
                  <div
                    key={promo.id}
                    className={`absolute inset-0 transition-all duration-800 ${index === currentSlide
                        ? "opacity-100 scale-100 rotate-0"
                        : index === (currentSlide - 1 + promocoes.length) % promocoes.length
                          ? "opacity-0 scale-95 -rotate-12"
                          : "opacity-0 scale-105 rotate-12"
                      }`}
                  >
                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${promo.cor} opacity-50 blur-2xl sm:blur-3xl scale-110`}
                    />

                    {/* Main Image with Clip Path Animation */}
                    <div
                      className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
                      style={{
                        clipPath: isTransitioning
                          ? "polygon(0 0, 0 0, 0 100%, 0% 100%)"
                          : "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                        transition: "clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Image
                        src={promo.imagem || "/placeholder.svg"}
                        alt={promo.titulo}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-white/30 animate-pulse" />
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full animate-bounce" />
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-white/30 rounded-full animate-bounce delay-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
        onClick={prevSlide}
        disabled={isTransitioning}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
        onClick={nextSlide}
        disabled={isTransitioning}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {promocoes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125 shadow-lg" : "bg-white/40 hover:bg-white/60"
              }`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setCurrentSlide(index)
                setTimeout(() => setIsTransitioning(false), 800)
              }
            }}
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
  @keyframes gradientShift {
    0% { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.1) rotate(2deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  .animate-float {
    animation: float 7s ease-in-out infinite; /* era 4s, agora 7s */
  }
`}</style>
    </section>
  )
}
