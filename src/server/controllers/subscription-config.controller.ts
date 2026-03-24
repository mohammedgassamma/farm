import {
  subscriptionConfigService,
  TSubscriptionConfig,
} from "../services/subscription-config.service";
import { BaseController } from "./base.controller";

class SubscriptionConfigController extends BaseController {
  // Check subscription on login
  async addSubscriptionConfig(config: Partial<TSubscriptionConfig>) {
    return subscriptionConfigService.saveSubscriptionConfig(config);
  }

  async getSubscriptionConfig() {
    return subscriptionConfigService.getSubscriptionConfigById();
  }
}

export const subscriptionConfigController = new SubscriptionConfigController();
