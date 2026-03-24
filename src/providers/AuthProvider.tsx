// ============================================
// 1. CREATE AUTH CONTEXT (AuthContext.tsx)
// ============================================
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authFirebase, logoutUser } from "@/firebaseAuth";
import { useGetDbUser } from "@/app/apiClient/hooks";
import { TDbUser, userService } from "@/server/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/app/apiClient/apiRoute";
import { useRouter } from "next/navigation";
import { userController } from "@/server/controllers/user.controller";
import { subscriptionService } from "@/server/services/subscription.service";

interface AuthContextType {
  currentUser: User | null;
  dbUser: TDbUser | undefined;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  isAdmin: boolean;
  hasSubscriptionExpired: boolean;
  refetchDbUser: any;
  triggerFetchWithSubscription: () => Promise<void>;
  hasFetchSubscription: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // const { data: dbUser, refetch: refetchDbUser } = useGetDbUser();

  // const { data: dbUser } = useQuery<TDbUser>({
  //   queryKey: [API_URLS.GET_USERS, currentUser?.uid],
  //   enabled: !!currentUser ? true : false,
  // });

  const { data: dbUser, refetch: refetchDbUser } = useQuery({
    queryKey: ["user-with-subscription", currentUser?.uid],
    queryFn: async () => {
      const user = await userController.getUserWithSubscription(
        currentUser?.uid!
      );
      return user;
    },
    enabled: !!currentUser?.uid,
  });
  const [hasFetchSubscription, setHasFetchSubscription] = useState(false);

  const isAdmin = dbUser?.role === "admin";

  const isSubscriptionStatusExpired = ["expired"].includes(
    dbUser?.subscription?.status ?? ""
  );

  const hasEndDateExpired = dbUser?.subscription?.endDate
    ? subscriptionService.isSubscriptionExpired(dbUser.subscription.endDate)
    : false;

  const hasSubscriptionExpired =
    isSubscriptionStatusExpired || hasEndDateExpired;

  // Sign up function
  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(authFirebase, email, password);
  }

  // Login function
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(authFirebase, email, password);
  }

  // Google login
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authFirebase, provider);
  }

  // Logout function
  async function logout() {
    await logoutUser();
    setCurrentUser(null);
    router.push("/login");
  }

  const triggerFetchWithSubscription = async () => {
    if (!hasFetchSubscription) {
      await refetchDbUser();
      setHasFetchSubscription(true);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      // console.log("Auth state changed:", user?.email || "No user");
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   if (currentUser) {
  //     refetchDbUser();
  //   }
  // }, [currentUser]);
  // console.log({ currentUser, dbUser });

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    dbUser,
    isAdmin,
    hasSubscriptionExpired,
    refetchDbUser,
    triggerFetchWithSubscription,
    hasFetchSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
