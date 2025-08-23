"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle, Target, Zap, Crown, Sparkles, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserAchievements } from "@/app/actions/achievements"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  earned: boolean
  date?: string
  color: string
  bgColor: string
}

const iconMap = {
  Target,
  Crown,
  Award,
  Sparkles,
  Zap,
  BookOpen,
}

export default function AchievementsTab() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAchievements() {
      try {
        const userAchievements = await getUserAchievements()
        setAchievements(userAchievements)
      } catch (error) {
        console.error("Erro ao carregar conquistas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [])

  if (loading) {
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
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold">Conquistas</span>
            <p className="text-white/80 text-sm">Seus marcos no açougue</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {achievements.map((achievement) => {
          const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Award
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
