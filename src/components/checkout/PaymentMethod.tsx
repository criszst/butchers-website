import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, QrCode, Banknote, Gift, DollarSign } from "lucide-react";
import { useState } from "react";

interface PaymentMethodProps {
  formaPagamento: string;
  setFormaPagamento: (value: string) => void;
  subtotal: number;
}

export const PaymentMethod = ({ formaPagamento, setFormaPagamento, subtotal }: PaymentMethodProps) => {
  const [tipoEntrega, setTipoEntrega] = useState("dinheiro");
  const pixDiscount = subtotal * 0.05;

  return (
    <Card className="shadow-large border-0 bg-card/80 backdrop-blur-sm overflow-hidden animate-in slide-in-from-left duration-1000">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-border">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-secondary rounded-lg shadow-soft">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl text-foreground">Forma de Pagamento</span>
          <Badge className="ml-auto bg-purple-100 text-purple-800 border-purple-200">
            Passo 2
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup 
          value={formaPagamento} 
          onValueChange={setFormaPagamento} 
          className="space-y-4"
        >
          {/* PIX Payment Option */}
          <div
            className={`relative overflow-hidden rounded-xl border-2 p-6 transition-smooth cursor-pointer hover:scale-[1.02] ${
              formaPagamento === "pix"
                ? "border-primary bg-gradient-to-r from-green-50 to-emerald-50 shadow-colored"
                : "border-border hover:border-primary/50 hover:bg-green-50/30"
            }`}
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem 
                value="pix" 
                id="pix" 
                className="border-2 border-primary data-[state=checked]:bg-primary" 
              />
              <div className="p-3 bg-green-100 rounded-full shadow-soft">
                <QrCode className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <Label htmlFor="pix" className="font-bold text-lg text-foreground cursor-pointer">
                  PIX - Pagamento Instantâneo
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Aprovação imediata e segura
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-gradient-success text-white font-bold px-3 py-1 shadow-soft">
                  5% OFF
                </Badge>
                <p className="text-xs text-green-700 mt-1 font-medium">
                  Economize R$ {pixDiscount.toFixed(2)}
                </p>
              </div>
            </div>
            {formaPagamento === "pix" && (
              <div className="mt-4 p-4 bg-white/80 rounded-lg border border-green-200 animate-in slide-in-from-top duration-300 shadow-soft">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Após confirmar, você receberá o QR Code para pagamento
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment on Delivery Option */}
          <div
            className={`relative overflow-hidden rounded-xl border-2 p-6 transition-smooth cursor-pointer hover:scale-[1.02] ${
              formaPagamento === "entrega"
                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-medium"
                : "border-border hover:border-blue-300 hover:bg-blue-50/30"
            }`}
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem 
                value="entrega" 
                id="entrega" 
                className="border-2 border-blue-500 data-[state=checked]:bg-blue-500" 
              />
              <div className="p-3 bg-blue-100 rounded-full shadow-soft">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <Label htmlFor="entrega" className="font-bold text-lg text-foreground cursor-pointer">
                  Pagamento na Entrega
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Dinheiro, débito ou crédito
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-blue-500 text-blue-700">
                  Tradicional
                </Badge>
              </div>
            </div>
            {formaPagamento === "entrega" && (
              <div className="mt-4 p-4 bg-white/80 rounded-lg border border-blue-200 animate-in slide-in-from-top duration-300 shadow-soft">
                <div className="mb-4">
                  <Label className="text-sm font-medium text-blue-800 mb-3 block">
                    Escolha a forma de pagamento na entrega:
                  </Label>
                  <RadioGroup value={tipoEntrega} onValueChange={setTipoEntrega} className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                      <RadioGroupItem value="dinheiro" id="dinheiro" className="border-blue-500 data-[state=checked]:bg-blue-500" />
                      <div className="p-2 bg-green-100 rounded-full">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <Label htmlFor="dinheiro" className="font-medium text-blue-800 cursor-pointer flex-1">
                        Dinheiro
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                      <RadioGroupItem value="credito" id="credito" className="border-blue-500 data-[state=checked]:bg-blue-500" />
                      <div className="p-2 bg-purple-100 rounded-full">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <Label htmlFor="credito" className="font-medium text-blue-800 cursor-pointer flex-1">
                        Cartão de Crédito
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                      <RadioGroupItem value="debito" id="debito" className="border-blue-500 data-[state=checked]:bg-blue-500" />
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Banknote className="h-4 w-4 text-orange-600" />
                      </div>
                      <Label htmlFor="debito" className="font-medium text-blue-800 cursor-pointer flex-1">
                        Cartão de Débito
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center space-x-2 text-blue-800 pt-3 border-t border-blue-200">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {tipoEntrega === "dinheiro" && "Tenha o valor exato ou troco será fornecido"}
                    {tipoEntrega === "credito" && "Aceitamos todas as bandeiras de cartão"}
                    {tipoEntrega === "debito" && "Pagamento direto na conta"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};