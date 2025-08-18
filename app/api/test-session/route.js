// app/api/test-session/route.js
import { getServerSession } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/route"; // adjust if needed

export async function GET() {
  const session = await getServerSession(authoptions);

  console.log("SESSION:", session); // logs to your terminal

  return Response.json({
    session,
    status: session ? "Session Found ✅" : "No Session ❌",
  });
}
