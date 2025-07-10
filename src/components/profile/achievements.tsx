"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle, Target, Zap, Crown, Sparkles } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Primeiro Pedido",
    description: "Fez seu primeiro pedido no açougue",
    icon: Target,
    earned: true,
    date: "2023-01-15",
    color: "from-green-600 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    id: 2,
    title: "Cliente Fiel",
    description: "10 pedidos realizados",
    icon: Crown,
    earned: true,
    date: "2023-06-20",
    color: "from-amber-600 to-yellow-600",
    bgColor: "from-amber-50 to-yellow-50",
  },
  {
    id: 3,
    title: "Explorador",
    description: "Experimentou 5 tipos diferentes de carne",
    icon: Sparkles,
    earned: true,
    date: "2023-08-10",
    color: "from-purple-600 to-pink-600",
    bgColor: "from-purple-50 to-pink-50",
  },
]

export default function Achievements() {
  return (
    <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold">Conquistas</span>
            <p className="text-white/80 text-sm">Seus marcos</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon
          return (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                achievement.earned
                  ? `bg-gradient-to-r ${achievement.bgColor} border-opacity-30`
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    achievement.earned ? `bg-gradient-to-br ${achievement.color}` : "bg-gray-300"
                  }`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className={`font-bold text-sm ${achievement.earned ? "text-gray-800" : "text-gray-500"}`}>
                      {achievement.title}
                    </p>
                    {achievement.earned && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <p className={`text-xs ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Conquistado em {new Date(achievement.date).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
