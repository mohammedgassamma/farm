import { TProduct } from "../services/product.service";
import { BaseController } from "./base.controller";

class ProductController extends BaseController {
  addProduct({ payload }: { payload: TProduct }) {
    return this.productService.create(payload);
  }
  deleteProduct({ id }: { id: string }) {
    return this.productService.delete(id);
  }
  editProduct({ id, payload }: { id: string; payload: TProduct }) {
    return this.productService.update(id, payload);
  }
}

export const productController = new ProductController();
