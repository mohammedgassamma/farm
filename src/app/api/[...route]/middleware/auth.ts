// // middleware/auth.ts
// import { Context, Next } from "hono";

// export const verifyFirebaseToken = async (token: string) => {
//   try {
//     return await adminFirebase.auth().verifyIdToken(token);
//   } catch (err) {
//     console.error("Invalid Firebase token:", err);
//     return null;
//   }
// };

// export const authMiddleware = async (c: Context, next: Next) => {
//   const authHeader = c.req.header("Authorization");
//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.split("Bearer ")[1]
//     : null;

//   if (!token) {
//     return c.json({ error: "Unauthorized: No token" }, 401);
//   }

//   const decoded = await verifyFirebaseToken(token);
//   if (!decoded) {
//     return c.json({ error: "Unauthorized: Invalid token" }, 401);
//   }

//   // Attach user info to context for downstream use
//   c.set("user", decoded);
//   await next();
// };
