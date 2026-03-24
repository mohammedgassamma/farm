import { TOrder } from "../services/order.service";
import { BaseController } from "./base.controller";

class OrderController extends BaseController {
  addOrder({ payload }: { payload: TOrder }) {
    return this.orderService.create(payload);
  }
}

export const orderController = new OrderController();
