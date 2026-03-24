import { alertService, AlertService } from "../services/alert.service";
import { cartService, CartService } from "../services/cart.service";
import { CropService } from "../services/crop.service";
import {
  EducationService,
  educationService,
} from "../services/education.service";
import {
  livestockService,
  LiveStockService,
} from "../services/livestock.service";
import { OrderService, orderService } from "../services/order.service";
import { productService, ProductService } from "../services/product.service";
import {
  subscriptionService,
  SubscriptionService,
} from "../services/subscription.service";
import { userService, UserService } from "../services/user.service";

export class BaseController {
  protected cropService: CropService;
  protected livestockService: LiveStockService;
  protected educationService: EducationService;
  protected userService: UserService;
  protected cartService: CartService;
  protected productService: ProductService;
  protected orderService: OrderService;
  protected alertService: AlertService;
  protected subscriptionService: SubscriptionService;

  constructor() {
    this.cropService = new CropService();
    this.livestockService = livestockService;
    this.educationService = educationService;
    this.userService = userService;
    this.cartService = cartService;
    this.productService = productService;
    this.orderService = orderService;
    this.alertService = alertService;
    this.subscriptionService = subscriptionService;
  }
}
