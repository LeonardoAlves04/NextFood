import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const Cart = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { data } = useSession();

  const { products, subTotalPrice, totalPrice, totalDiscounts, clearCart } =
    useContext(CartContext);

  const handleFinishOrderClick = async () => {
    if (!data?.user) return;

    const restaurant = products[0].restaurant;

    try {
      setIsSubmitLoading(true);

      await createOrder({
        subTotalPrice,
        totalDiscounts,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
      });

      clearCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col py-5">
        <div className="flex-auto space-y-2">
          {products.map((product) => (
            <CartItem key={product.id} cartProduct={product} />
          ))}
        </div>
        {products.length > 0 ? (
          <>
            <div>
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground"> Subtotal</span>
                    <span>{formatCurrency(subTotalPrice)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground"> Descontos</span>
                    <span>-{formatCurrency(totalDiscounts)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground"> Entrega</span>
                    <span>
                      {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                        <span className="uppercase text-primary">Grátis</span>
                      ) : (
                        formatCurrency(
                          Number(products?.[0].restaurant.deliveryFee),
                        )
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span> Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              Finalizar pedido
            </Button>
          </>
        ) : (
          <h2 className="text-left font-semibold">Sua sacola está vazia!</h2>
        )}
      </div>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao clicar em finalizar, você concorda com os termos e condições da
              nossa plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirmDialogOpen}>
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishOrderClick}>
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      ;
    </>
  );
};

export default Cart;
