"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default function PrintButton() {
  return (
    <div className="print:hidden fixed top-4 right-4 z-10">
      <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
        <Printer className="h-4 w-4 mr-2" />
        Imprimir Pedido
      </Button>
    </div>
  )
}
