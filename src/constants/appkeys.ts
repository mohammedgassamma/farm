export const APP_STORAGE_KEYS = {
  CART: (userId: string) => `cart_${userId}`,
  CURRENCY: (userId: string) => `currency_${userId}`,
};
