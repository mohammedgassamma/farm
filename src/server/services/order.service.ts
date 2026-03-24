import { BaseService } from "./BaseService";
import { TProduct } from "./product.service";

export type TOrder = {
  id?: string;
  products: TProduct[];
  code: string;
  totalAmount: number;
  status: "paid" | "completed" | "cancelled";
  userId: string;
  accountDetails: any;
  // createdAt: any;
  createdAt?: any;
};

export class OrderService extends BaseService<TOrder> {
  constructor() {
    super("orders");
  }
}

export const orderService = new OrderService();
