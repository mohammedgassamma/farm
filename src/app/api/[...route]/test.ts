import { Hono } from "hono";

const bookRouter = new Hono();

bookRouter.get("/", (c) => c.text("List Books")); // GET /book

export default bookRouter;
