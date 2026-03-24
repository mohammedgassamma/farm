// services/UserService.ts

import { BaseService } from "./BaseService";

export type TProduct = {
  name: string;
  description: string;
  price: number;
  imageURL: string;
  category?: string;
  quantity: number;
  id: string;
  sku: string;
  currency: string;
};

export class ProductService extends BaseService<TProduct> {
  constructor() {
    super("products");
  }
}

export const productService = new ProductService();
