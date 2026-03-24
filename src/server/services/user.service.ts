// services/UserService.ts

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { BaseService } from "./BaseService";
import { subscriptionService, TSubscription } from "./subscription.service";
import { db } from "@/firebaseConfig";

export type TUserWithoutSubscription = {
  email: string;
  role?: string;
  userId: string;
  id: string;
  createdAt: any;
  lastLogin: any;
  currency?: string;
};

export interface TDbUser extends TUserWithoutSubscription {
  subscription?: TSubscription;
}

export class UserService extends BaseService<TDbUser> {
  constructor() {
    super("users");
  }

  async getUserWithSubscription({
    lastDoc,
    pageSize,
    fallback = [],
  }: {
    lastDoc: any;
    pageSize: number;
    fallback?: TDbUser[];
  }): Promise<{ data: TDbUser[]; lastDoc: any; hasMore: boolean }> {
    const colRef = collection(db, "users");

    let q = query(colRef, orderBy("createdAt", "desc"), limit(pageSize + 1));

    if (lastDoc) {
      q = query(
        colRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);

    const hasMore = snapshot.docs.length > pageSize;
    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
    const data = docs.map((doc) => ({ id: doc.id, ...doc.data() } as TDbUser));
    const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

    // Fetch subscriptions if requested
    if (data.length > 0) {
      // Get unique user IDs
      const userIds = [
        ...new Set(data.map((item: any) => item.userId).filter(Boolean)),
      ];

      // Fetch all subscriptions
      const subscriptionPromises = userIds.map((userId) =>
        subscriptionService.getSubscriptionSecure(userId, false)
      );
      const subscriptions = (await Promise.all(
        subscriptionPromises
      )) as TSubscription[];

      // Create a map of userId to subscription
      const subscriptionMap = userIds.reduce((map, userId, index) => {
        map[userId] = subscriptions[index];
        return map;
      }, {} as Record<string, any>);

      // Map subscriptions to users
      const dataWithSubscriptions = data.map((item) => ({
        ...item,
        subscription: subscriptionMap[item.userId] || null,
      })) as TDbUser[];

      return {
        data: dataWithSubscriptions,
        lastDoc: newLastDoc,
        hasMore,
      };
    }

    return {
      data: data.length > 0 ? data : fallback,
      lastDoc: newLastDoc,
      hasMore,
    };
  }
}

export const userService = new UserService();
