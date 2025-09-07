// app/api/test-session/route.js

/**
 * This API route tests the current NextAuth session on the server side.
 * It uses `getServerSession` to retrieve session data for the logged-in user.
 */

import { getServerSession } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/route"; // Import your NextAuth config

/**
 * GET handler for /api/test-session
 * Returns session information as JSON.
 */
export async function GET() {
  // -------------------------------
  // Retrieve current session (if any)
  // -------------------------------
  const session = await getServerSession(authoptions);

  // Log session to server console for debugging
  console.log("SESSION:", session);

  // -------------------------------
  // Return JSON response
  // -------------------------------
  return Response.json({
    session, // session object contains user info, token, etc.
    status: session ? "Session Found ✅" : "No Session ❌",
  });
}
