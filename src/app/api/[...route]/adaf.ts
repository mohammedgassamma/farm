// import { Hono } from "hono";
// import { handle } from "hono/vercel";
// import bookRouter from "./test";
// import { getAuth } from "firebase-admin/auth";
// import adminFirebase from "./firebase/firebaseAdmin";
// import { authMiddleware } from "./middleware/auth";

// // export const runtime = "edge";

// const app = new Hono().basePath("/api");

// app.get("/hello", (c) => {
//   return c.json({ message: "Hello, world!" });
// });

// app.get("/verify-token", authMiddleware, async (c) => {
//   const body = c.req.parseBody();
//   try {
//     return c.json({ valid: true, uid: "token" });
//   } catch (error) {
//     return c.json({ error: "Invalid token", valid: false });
//   }
// });

// app.route("/book", bookRouter);

// export const GET = handle(app);
// export const POST = handle(app);
