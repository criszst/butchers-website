import { Beef } from "lucide-react"
import { cn } from "@/lib/utils"

interface MeatImagePlaceholderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export const MeatImagePlaceholder = ({ className, size = "md" }: MeatImagePlaceholderProps) => {
  const sizeClasses = {
    sm: "h-32 w-32",
    md: "h-48 w-48",
    lg: "h-64 w-64",
  }

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-200 bg-red-50 transition-all duration-300 hover:border-red-300 hover:bg-red-100",
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center p-4">
        <div className="p-3 rounded-full bg-red-100">
          <Beef size={iconSizes[size]} className="text-red-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-800">Imagem não disponível</p>
          <p className="text-xs text-red-600">Produto em destaque</p>
        </div>
      </div>
    </div>
  )
}
