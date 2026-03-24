import { TAlert } from "../services/alert.service";
import { BaseController } from "./base.controller";

class SubscriptionController extends BaseController {
  // Check subscription on login
  async checkOnLogin(userId: string) {
    return this.subscriptionService.checkSubscriptionOnLogin(userId);
  }

  // Activate subscription with code
  async activate(userId: string, code: string) {
    return this.subscriptionService.activateSubscription(userId, code);
  }

  async deactivate(userId: string) {
    return this.subscriptionService.deactivateSubscription(userId);
  }

  // Get subscription details
  async getDetails(userId: string) {
    return this.subscriptionService.getSubscriptionDetails(userId);
  }

  // Get subscription securely (without activation code)
  async getSecure(userId: string, isSecure = true) {
    return this.subscriptionService.getSubscriptionSecure(userId, isSecure);
  }

  // Get activation code (for email purposes only)
  async getActivationCode(userId: string) {
    return this.subscriptionService.getActivationCode(userId);
  }

  // Regenerate activation code
  async regenerateCode(userId: string) {
    return this.subscriptionService.regenerateActivationCode(userId);
  }

  // Create trial subscription
  async createTrial(userId: string, forceTrial: boolean) {
    return this.subscriptionService.createTrialSubscription(userId, forceTrial);
  }

  // Admin: Set subscription
  async setSubscription(userId: string, days: number) {
    return this.subscriptionService.setSubscription(userId, days);
  }
}

export const subscriptionController = new SubscriptionController();
