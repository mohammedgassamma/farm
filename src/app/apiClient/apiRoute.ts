export const API_URLS = {
  GET_ALL_CROPS: "crops",
  GET_ALL_CROPS_BY_ADMIN: "crops?getAll=true",
  GET_CROP_BY_ID: (id: string) => `crops/${id}`,
  GET_ALL_ANIMALS: "animals",
  GET_ALL_ANIMALS_BY_ID: (id: string) => `animals/${id}`,

  GET_ALL_CROPS_AGGREGATE: "crops/aggregate",
  GET_ALL_LIVESTOCK_AGGREGATE: "animals/aggregate",
  GET_FEMALE_LIVESTOCK_COUNT: "animals/femaleCount",
  GET_MALE_LIVESTOCK_COUNT: "animals/maleCount",
  GET_TOTAL_MILK_PRODUCED: "animals/totalMilkProduced",
  GET_TOTAL_MEAT_PRODUCED: "animals/totalMeatProduced",

  GET_TOTAL_LIVESTOCK_SALE_PRICE: "animals/totalLivestockSalePrice",

  GET_ALL_EDUCATIONS: "educations?getAll=true",
  GET_ALL_ORDERS: "orders?getAll=true",
  GET_EDUCATIONS: "educations",
  GET_EDUCATION_BY_ID: (id: string) => `educations/${id}`,

  // alert
  GET_ALL_ALERTS: "alerts?getAll=true",
  GET_ALERTS: "alerts",
  GET_ALERT_BY_ID: (id: string) => `alerts/${id}`,

  //
  GET_ALL_PRODUCTS: "products?getAll=true",
  GET_PRODUCTS: "products",
  GET_PRODUCT_BY_ID: (id: string) => `products/${id}`,

  GET_USERS: "users",
  GET_ALL_USERS: "users?getAll=true",
  GET_USER_BY_ID: (id: string) => `users/${id}`,

  GET_ALL_SUBSCRIPTIONS_CONFIGS: "subscriptionConfigs?getAll=true",
  GET_SUBSCRIPTION_CONFIGS: "subscriptionConfigs", 

  GET_ALL_CROPS_WITH_USER: "crops?includeUser=true",
  GET_ALL_LIVESTOCK_WITH_USER: "animals?includeUser=true",
};

export const PATH_URLS = {
  HOME_SCREEN: "/homescreen",
  CROPS: "/crops",
  ADD_CROP: "/crops/add",
  EDIT_CROP: (id: string) => `/crops/edit/${id}`,

  LIVESTOCK: "/livestock",
  ADD_ANIMAL: "/livestock/add",
  EDIT_ANIMAL: (id: string) => `/livestock/edit/${id}`,
  DASHBOARD: "/dashboard",

  EDUCATION: "/education",
  ALERTS: "/connection",

  ADMIN_EDUCATION: "/admin/education",
  ADMIN_ADD_EDUCATION: "/admin/education/add",
  ADMIN_EDIT_EDUCATION: (id: string) => `/admin/education/edit/${id}`,
  ADMIN_DASHBOARD: "/admin/dashboard",

  ADMIN: "/admin",

  ADMIN_STORE: "/admin/store",
  ADMIN_ADD_PRODUCT: "/admin/store/add",
  ADMIN_EDIT_PRODUCT: (id: string) => `/admin/store/edit/${id}`,

  ADMIN_ORDERS: "/admin/orders",

  ADMIN_ALERTS: "/admin/connection",
  ADMIN_ADD_ALERT: "/admin/connection/add",
  ADMIN_EDIT_ALERT: (id: string) => `/admin/connection/edit/${id}`,

  ADMIN_ADD_SUBSCRIPTION_CONFIG: "/admin/subscription/add",
  ADMIN_EDIT_SUBSCRIPTION_CONFIG: (id: string) =>
    `/admin/subscription/edit/${id}`,

  ADMIN_USERS: "/admin/users",
  ADMIN_SUBSCRIPTION: "/admin/subscription",

  STORE: "/store",
  STORE_CART: "/store/cart",

  SUBSCRIPTION_SCREEN: "/subscription",
};
