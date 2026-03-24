import { BaseService } from "./BaseService";
import { TProduct } from "./product.service";

export type TCart = {
  id: string;
  products: TProduct[];
  userId: string;
};

export class CartService extends BaseService<TCart> {
  constructor() {
    super("carts");
  }
}

export const cartService = new CartService();
