import { userController } from "@/server/controllers/user.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await userController.createOrAddUser({
      user: body.user,
      //req, // 🔥 IMPORTANT
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}