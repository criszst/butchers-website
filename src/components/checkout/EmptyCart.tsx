import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface EmptyCartProps {
  onExploreProducts: () => void;
}

export const EmptyCart = ({ onExploreProducts }: EmptyCartProps) => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container py-16 text-center">
        <Card className="max-w-lg mx-auto shadow-large border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-muted to-border rounded-full flex items-center justify-center shadow-soft mb-8">
              <Package className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Carrinho vazio
            </h2>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              Adicione produtos ao carrinho para continuar
            </p>
            <Button 
              onClick={onExploreProducts}
              className="bg-gradient-primary hover:scale-105 text-primary-foreground font-semibold px-6 md:px-8 py-3 rounded-xl shadow-medium hover:shadow-large transform transition-smooth"
            >
              <Package className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Explorar Produtos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};