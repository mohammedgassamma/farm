import { TCart } from "../services/cart.service";
import { BaseController } from "./base.controller";

class CartController extends BaseController {
  updateCart({ payload }: { payload: TCart }) {
    return this.cartService.update(payload.id, payload);
  }
}

export const cartController = new CartController();
