// services/UserService.ts

import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";
import { BaseService } from "./BaseService";
import { generateCode } from "@/lib/utils";
import { subscriptionConfigService } from "./subscription-config.service";

export type TSubscriptionStatus = "trial" | "active" | "expired";

const FALLBACK_TRIAL_DAYS = 14;
const SUBSCRIPTION_DAYS = 365;

export interface TSubscription {
  id?: string;
  userId: string;
  status: TSubscriptionStatus;
  startDate: Timestamp | FieldValue;
  endDate: Timestamp | FieldValue;
  activationCode: string;
  isTrialUsed: boolean;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  hasActivationCode?: boolean;
}

export class SubscriptionService extends BaseService<TSubscription> {
  constructor() {
    super("subscriptions");
  }

  // Generate a random activation code
  private generateActivationCode(): string {
    return generateCode({ length: 8 });
  }

  // Calculate expiry date from now
  private getExpiryDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  // Check if subscription is expired
  isSubscriptionExpired(endDate: Timestamp | FieldValue): boolean {
    const expiryDate =
      endDate instanceof Timestamp ? endDate.toDate() : endDate;
    return new Date() > expiryDate;
  }

  // Create initial subscription (14-day trial)
  private async createTrialSubscriptionData(
    userId: string
  ): Promise<TSubscription> {
    const subscription =
      await subscriptionConfigService.getSubscriptionConfigById();

    const trialPeriod =
      Number(subscription?.trialPeriod) || FALLBACK_TRIAL_DAYS;

    return {
      userId,
      status: "trial",
      startDate: serverTimestamp(),
      endDate: Timestamp.fromDate(this.getExpiryDate(trialPeriod)),
      activationCode: this.generateActivationCode(),
      isTrialUsed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  // Get subscription by user ID
  async getByUserId(userId: string): Promise<TSubscription | null> {
    const subscriptions = await this.getBySpecifiedUserId(userId);
    return subscriptions.length > 0 ? subscriptions[0] : null;
  }

  async createTrialSubscription(
    userId: string,
    forceTrial = false
  ): Promise<{
    subscription: TSubscription;
    activationCode: string;
    success: boolean;
  }> {
    if (!forceTrial) {
      const existing = await this.getByUserId(userId);

      if (existing) {
        return {
          subscription: existing,
          activationCode: existing.activationCode,
          success: true,
        };
      }
    }

    const trialData = await this.createTrialSubscriptionData(userId);
    const subscriptionId = await this.setDoc(trialData, userId);
    const subscription = (await this.getById(subscriptionId)) as TSubscription;

    return {
      subscription,
      activationCode: subscription.activationCode,
      success: true,
    };
  }

  // Check subscription on login
  async checkSubscriptionOnLogin(userId: string): Promise<{
    canAccess: boolean;
    status: TSubscriptionStatus;
    message: string;
    activationCode?: string;
    subscription: TSubscription | null;
  }> {
    let subscription = await this.getByUserId(userId);

    // If no subscription exists, create trial
    if (!subscription) {
      const result = await this.createTrialSubscription(userId);
      subscription = result.subscription;

      return {
        canAccess: true,
        status: "trial",
        message: "Trial subscription activated for 14 days",
        activationCode: result.activationCode,
        subscription,
      };
    }

    // Check if subscription is expired
    if (this.isSubscriptionExpired(subscription.endDate)) {
      const newActivationCode = this.generateActivationCode();

      await this.update(subscription.id as string, {
        status: "expired",
        activationCode: newActivationCode,
      });

      return {
        canAccess: false,
        status: "expired",
        message:
          "Your subscription has expired. Please use the activation code to renew.",
        activationCode: newActivationCode,
        subscription: {
          ...subscription,
          status: "expired",
          activationCode: newActivationCode,
        },
      };
    }

    // Subscription is active
    return {
      canAccess: true,
      status: subscription.status,
      message: "Subscription is active",
      subscription,
    };
  }

  // Activate subscription with code
  async activateSubscription(
    userId: string,
    code: string
  ): Promise<{
    success: boolean;
    message: string;
    newActivationCode?: string;
    expiryDate?: Date;
  }> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      return {
        success: false,
        message: "No subscription found for this user",
      };
    }

    // Verify activation code
    if (subscription.activationCode !== code.trim().toUpperCase()) {
      return {
        success: false,
        message: "Invalid activation code",
      };
    }

    // Generate new activation code for next renewal
    const newActivationCode = this.generateActivationCode();
    const expiryDate = this.getExpiryDate(SUBSCRIPTION_DAYS);

    // Update subscription
    await this.update(subscription.id as string, {
      status: "active",
      startDate: serverTimestamp(),
      endDate: Timestamp.fromDate(expiryDate),
      activationCode: newActivationCode,
      isTrialUsed: true,
    });

    return {
      success: true,
      message: `Subscription activated successfully for ${SUBSCRIPTION_DAYS} days`,
      newActivationCode,
      expiryDate,
    };
  }

  async deactivateSubscription(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      return {
        success: false,
        message: "No subscription found for this user",
      };
    }

    await this.update(subscription.id as string, {
      status: "expired",
      activationCode: this.generateActivationCode(),
      endDate: serverTimestamp(),
    });

    return {
      success: true,
      message: "Subscription deactivated successfully",
    };
  }

  // Get subscription details
  async getSubscriptionDetails(userId: string): Promise<{
    subscription: TSubscription | null;
    daysRemaining: number;
    isExpired: boolean;
  }> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      return {
        subscription: null,
        daysRemaining: 0,
        isExpired: true,
      };
    }

    const endDate =
      subscription.endDate instanceof Timestamp
        ? subscription.endDate.toDate()
        : subscription.endDate;

    const now = new Date();
    const daysRemaining = Math.ceil(
      ((endDate as any).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isExpired = this.isSubscriptionExpired(subscription.endDate);

    return {
      subscription,
      daysRemaining: Math.max(0, daysRemaining),
      isExpired,
    };
  }

  // Regenerate activation code
  async regenerateActivationCode(userId: string): Promise<{
    success: boolean;
    message: string;
    newActivationCode: string;
  }> {
    let subscription = await this.getByUserId(userId);

    // If no subscription exists, create trial subscription
    if (!subscription) {
      const result = await this.createTrialSubscription(userId);
      return {
        success: true,
        message: "Trial subscription created with activation code",
        newActivationCode: result.activationCode,
      };
    }

    // Generate new activation code
    const newActivationCode = this.generateActivationCode();

    // Update subscription with new code
    await this.update(subscription.id as string, {
      activationCode: newActivationCode,
    });

    return {
      success: true,
      message: "Activation code regenerated successfully",
      newActivationCode,
    };
  }

  // Get activation code (only when explicitly needed - e.g., for email)
  async getActivationCode(userId: string): Promise<{
    activationCode: string;
    expiryDate: Date | FieldValue;
  }> {
    let subscription = await this.getByUserId(userId);

    // If no subscription exists, create trial subscription
    if (!subscription) {
      const result = await this.createTrialSubscription(userId);
      return {
        activationCode: result.activationCode,
        expiryDate: this.getExpiryDate(14),
      };
    }

    const expiryDate =
      subscription.endDate instanceof Timestamp
        ? subscription.endDate.toDate()
        : subscription.endDate;

    return {
      activationCode: subscription.activationCode,
      expiryDate,
    };
  }

  // Get subscription without activation code (secure)
  async getSubscriptionSecure(
    userId: string,
    isSecure = true
  ): Promise<TSubscription | null> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      return null;
    }

    const { activationCode, ...subscriptionWithoutCode } = subscription;

    return {
      ...subscriptionWithoutCode,
      hasActivationCode: !!activationCode,
      ...(isSecure ? {} : { activationCode }),
    } as TSubscription;
  }

  // Admin: Set subscription manually
  async setSubscription(
    userId: string,
    days: number
  ): Promise<{
    success: boolean;
    message: string;
    activationCode: string;
  }> {
    const existing = await this.getByUserId(userId);
    const activationCode = this.generateActivationCode();
    const expiryDate = this.getExpiryDate(days);

    const subscriptionData = {
      status: "active" as TSubscriptionStatus,
      startDate: serverTimestamp(),
      endDate: Timestamp.fromDate(expiryDate),
      activationCode,
      isTrialUsed: existing?.isTrialUsed || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (existing) {
      await this.update(existing.id as string, subscriptionData);
    } else {
      await this.create({
        userId,
        ...subscriptionData,
      });
    }

    return {
      success: true,
      message: `Subscription set for ${days} days`,
      activationCode,
    };
  }
}

export const subscriptionService = new SubscriptionService();
