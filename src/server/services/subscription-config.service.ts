import { BaseService } from "./BaseService";

export type TSubscriptionConfig = {
  id: string;
  trialPeriod?: number; // in days
  amount: number; // in cents
};

const SUBSCRIPTION_CONFIGS_ID = {
  BASIC: "basic",
};

const DEFAULT_SUBSCRIPTION_CONFIG_ID = SUBSCRIPTION_CONFIGS_ID.BASIC;

export class SubscriptionConfigService extends BaseService<TSubscriptionConfig> {
  constructor() {
    super("subscriptionConfigs");
  }

  async saveSubscriptionConfig(
    config: Partial<TSubscriptionConfig>
  ): Promise<any> {
    let { id, ...data } = config;

    return this.createOrUpdate({
      id: DEFAULT_SUBSCRIPTION_CONFIG_ID,
      data: data as any,
    });
  }

  async getSubscriptionConfigById(): Promise<TSubscriptionConfig | null> {
    return this.getById(DEFAULT_SUBSCRIPTION_CONFIG_ID);
  }
}

export const subscriptionConfigService = new SubscriptionConfigService();
