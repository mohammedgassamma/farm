import { serverTimestamp } from "firebase/firestore";
import { TDbUser } from "../services/user.service";
import { BaseController } from "./base.controller";

 

class UserController extends BaseController { 

  
  deleteUser({ id }: { id: string }) {
    return this.userService.delete(id);
  }

  async addUser({ payload, id }: { payload: TDbUser; id: string }) {
    const user = (await this.userService.getById(id)) as TDbUser;

    if (user) {
      // Update existing user
      await this.userService.update(id, { lastLogin: serverTimestamp() });
      // const subscription = await this.subscriptionService.getByUserId(id);
      await this.subscriptionService.checkSubscriptionOnLogin(id);
      // if (!subscription) {
      // }

      return user;
    }

    // Create new user
    const newUser = await this.userService.setDoc(payload, id);
    await this.subscriptionService.checkSubscriptionOnLogin(id);

    return newUser;
  } 



  async createOrAddUser({
    user,
    extraData,
  }: {
    user: any;
    extraData?: {
      country?: string;
      department?: string;
    };
  }) {
    return await userController.addUser({
      payload: {
      email: user?.email || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      userId: user?.uid as string,
      id: user?.uid as string,
      country: extraData?.country || "",
      department: extraData?.department || "",
    },
      id: user?.uid as string,
    });
  }

  async getUserWithSubscription(userId: string) {
    const user = (await this.userService.getById(userId)) as TDbUser;
    const subscription = await this.subscriptionService.getSubscriptionSecure(
      userId
    );

    return {
      ...user,
      subscription: subscription || undefined,
    };
  }

  async updateCurrency({ currency, id }: { currency: string; id: string }) {
    return this.userService.update(id, {
      currency,
    });
  }
}

export const userController = new UserController();
