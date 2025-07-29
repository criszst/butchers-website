import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Sparkles,
  Package,
  Timer,
  QrCode,
  Gift,
  Star,
  Shield,
  Phone,
  Truck
} from "lucide-react";

interface SuccessPageProps {
  formaPagamento: string;
  descontoPix: number;
  onNewOrder: () => void;
}

export const SuccessPage = ({ formaPagamento, descontoPix, onNewOrder }: SuccessPageProps) => {
  const orderNumber = Math.floor(Math.random() * 10000);

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-large border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="text-center p-8 md:p-12">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-success rounded-full flex items-center justify-center shadow-large animate-in zoom-in duration-500">
              <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-medium">
              <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-primary">
            Pedido Confirmado!
          </h2>

          <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed px-4">
            Seu pedido foi recebido com sucesso e já está sendo preparado com todo carinho. 
            Você receberá atualizações em tempo real via WhatsApp.
          </p>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-soft">
              <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-foreground text-sm md:text-base">Número do Pedido</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">#AC{orderNumber}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl shadow-soft">
              <Timer className="h-6 w-6 md:h-8 md:w-8 text-orange-600 mx-auto mb-2" />
              <p className="font-semibold text-foreground text-sm md:text-base">Tempo Estimado</p>
              <p className="text-xl md:text-2xl font-bold text-orange-600">45-60 min</p>
            </div>
          </div>

          {/* Payment Method Confirmation */}
          {formaPagamento === "pix" && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl mb-8 border-2 border-green-200 shadow-soft">
              <QrCode className="h-6 w-6 md:h-8 md:w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 mb-2 text-sm md:text-base">Pagamento via PIX</h3>
              <p className="text-xs md:text-sm text-green-700">
                O QR Code para pagamento foi enviado para seu WhatsApp. 
                Você economizou R$ {descontoPix.toFixed(2)} com o desconto PIX!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={onNewOrder}
              className="w-full bg-gradient-primary hover:scale-105 text-primary-foreground font-bold py-3 md:py-4 rounded-xl shadow-medium hover:shadow-large transform transition-smooth"
            >
              <Gift className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Fazer Novo Pedido
            </Button>

            <Button
              variant="outline"
              className="w-full border-2 border-border hover:border-primary/50 hover:bg-primary/5 py-3 rounded-xl transition-smooth bg-transparent"
            >
              <Star className="h-4 w-4 mr-2" />
              Avaliar Experiência
            </Button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8 pt-8 border-t border-border">
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg shadow-soft">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-blue-800 font-medium">Compra Protegida</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg shadow-soft">
              <Phone className="h-5 w-5 md:h-6 md:w-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-green-800 font-medium">Suporte 24/7</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg shadow-soft">
              <Truck className="h-5 w-5 md:h-6 md:w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-purple-800 font-medium">Entrega Rápida</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};