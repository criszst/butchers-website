"use client"

import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function Hero() {
  const promocoes = [
    {
      id: 1,
      titulo: "Picanha Premium",
      descricao: "Maturada por 28 dias para máxima maciez",
      preco: "R$ 52,90/kg",
      precoOriginal: "R$ 59,90/kg",
      imagem: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      titulo: "Kit Churrasco",
      descricao: "Pacote misto para churrasco - perfeito para o fim de semana",
      preco: "R$ 89,90",
      precoOriginal: "R$ 109,90",
      imagem: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      titulo: "Frango Caipira",
      descricao: "Frango orgânico criado solto",
      preco: "R$ 18,90/kg",
      precoOriginal: "R$ 22,90/kg",
      imagem: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=400&fit=crop",
    },
  ]

  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        className="h-96"
      >
        {promocoes.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className="relative h-96">
              <Image
                src={promo.imagem || "/placeholder.svg"}
                alt={promo.titulo}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold">{promo.titulo}</h1>
                  <p className="text-xl md:text-2xl">{promo.descricao}</p>
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-3xl font-bold text-green-400">{promo.preco}</span>
                    <span className="text-xl line-through text-gray-300">{promo.precoOriginal}</span>
                  </div>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Comprar Agora
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
