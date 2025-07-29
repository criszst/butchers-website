import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/context";
import {
  Package,
  Gift,
  Truck,
  Clock,
  Shield,
  CheckCircle,
  Phone,
  ArrowLeft
} from "lucide-react";

interface OrderSummaryProps {
  formaPagamento: string;
  onFinalizarPedido: () => void;
  isFormValid: boolean;
  isProcessing: boolean;
  onBackToCart: () => void;
}

export const OrderSummary = ({
  formaPagamento,
  onFinalizarPedido,
  isFormValid,
  isProcessing,
  onBackToCart
}: OrderSummaryProps) => {
  const { items, total: cartTotal, itemCount } = useCart();

  const subtotal = cartTotal;
  const taxaEntrega = subtotal > 50 ? 0 : 8.9;
  const descontoPix = formaPagamento === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + taxaEntrega - descontoPix;

  return (
    <Card className="sticky top-24 shadow-large border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-border">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-warning rounded-lg shadow-soft">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl text-foreground">Resumo do Pedido</span>
          <Badge className="ml-auto bg-orange-100 text-orange-800 border-orange-200">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Products List */}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300 animate-in slide-in-from-right"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={item.product.image || "/placeholder.svg?height=60&width=60"}
                  alt={item.product.name}
                  className="w-15 h-15 rounded-lg object-cover shadow-soft"
                />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-soft">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity}x × R$ {item.product.price.toFixed(2)}
                </p>
              </div>
              <span className="font-bold text-primary">
                R$ {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Price Calculations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
            <span className="text-foreground">Subtotal</span>
            <span className="font-semibold text-lg text-foreground">R$ {subtotal.toFixed(2)}</span>
          </div>

          {formaPagamento === "pix" && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-200 shadow-soft">
              <span className="text-green-700 flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Desconto PIX (5%)</span>
              </span>
              <span className="font-semibold text-lg text-green-600">
                -R$ {descontoPix.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
            <span className="text-foreground flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Taxa de Entrega</span>
            </span>
            <span className={`font-semibold text-lg ${taxaEntrega === 0 ? "text-green-600" : "text-foreground"}`}>
              {taxaEntrega === 0 ? (
                <span className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Grátis</span>
                </span>
              ) : (
                `R$ ${taxaEntrega.toFixed(2)}`
              )}
            </span>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Total */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-primary/20 shadow-colored">
          <span className="font-bold text-xl text-foreground">Total</span>
          <span className="font-bold text-2xl text-primary">
            R$ {total.toFixed(2)}
          </span>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-soft">
          <Clock className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-800">Entrega Expressa</p>
            <p className="text-sm text-blue-600">45-60 minutos</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className={`w-full font-bold py-4 rounded-xl shadow-medium hover:shadow-large transform transition-smooth ${
              isFormValid
                ? "bg-gradient-primary hover:scale-105 text-primary-foreground"
                : "bg-muted cursor-not-allowed text-muted-foreground"
            }`}
            size="lg"
            onClick={onFinalizarPedido}
            disabled={!isFormValid || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                <span>Processando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Confirmar Pedido</span>
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onBackToCart}
            className="w-full border-2 border-border hover:border-primary/50 hover:bg-primary/5 py-3 rounded-xl transition-smooth bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>
        </div>

        {/* Security Info */}
        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground p-3 rounded-lg bg-blue-50 shadow-soft">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span>Seus dados estão protegidos</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground p-3 rounded-lg bg-green-50 shadow-soft">
            <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span>Acompanhe via WhatsApp</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};