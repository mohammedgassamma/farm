import { APP_STORAGE_KEYS } from "@/constants/appkeys";
import { AppStorage } from "@/lib/appStorage";
import { useAuth } from "@/providers/AuthProvider";
import { TCart } from "@/server/services/cart.service";
import { TProduct } from "@/server/services/product.service";
import { useEffect, useState } from "react";

const { getFromStore, addToStore } = AppStorage();

export const useGetUserCart = () => {
  // State to manage cart and items
  const [cart, setCart] = useState<TCart>({ products: [], id: "", userId: "" });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    const storedCart = getFromStore(
      APP_STORAGE_KEYS.CART(currentUser?.uid || "")
    );
    if (storedCart) {
      setCart(storedCart);
    }
  }, [currentUser]);

  const handleAddToCart = (item: any) => {
    // Save locally, using the user id to localStorage key would be better for multiple users

    const inCart = cart.products.find((product) => product.id === item.id);
    if (inCart) {
      return;
    }

    const updatedCart = {
      ...cart,
      products: [...cart.products, { ...item, quantity: 1 }],
    };
    setCart(updatedCart);
    addToStore(APP_STORAGE_KEYS.CART(currentUser?.uid || ""), updatedCart);
  };

  const totalAmount = cart.products.reduce(
    (acc, product) => acc + product.price * (product.quantity || 1),
    0
  );

  const handleUpdateCart = ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) => {
    if (quantity < 1) {
      handleRemoveItem({ productId });
      return;
    }
    const newCart: TCart = JSON.parse(JSON.stringify(cart));
    const productItem = newCart.products.find((p) => p.id === productId);
    if (!productItem) return;

    productItem.quantity = quantity;

    setCart(newCart);
    addToStore(APP_STORAGE_KEYS.CART(currentUser?.uid || ""), newCart);
  };

  const handleRemoveItem = ({ productId }: { productId: string }) => {
    const newCart: TCart = JSON.parse(JSON.stringify(cart));
    newCart.products = newCart.products.filter((p) => p.id !== productId);

    setCart(newCart);
    addToStore(APP_STORAGE_KEYS.CART(currentUser?.uid || ""), newCart);
  };

  const handleClearCart = () => {
    const emptyCart: TCart = { id: "", products: [], userId: "" };
    setCart(emptyCart);
    addToStore(APP_STORAGE_KEYS.CART(currentUser?.uid || ""), emptyCart);
  };

  return {
    cart,
    handleAddToCart,
    totalAmount,
    handleUpdateCart,
    handleRemoveItem,
    handleClearCart,
  };
};
