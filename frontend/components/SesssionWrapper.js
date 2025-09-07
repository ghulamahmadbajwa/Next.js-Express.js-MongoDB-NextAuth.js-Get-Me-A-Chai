"use client";

// Import NextAuth's SessionProvider
import { SessionProvider } from "next-auth/react";

/**
 * SessionWrapper
 * -----------------------
 * A simple wrapper component that provides authentication session context
 * to all child components. This allows the use of `useSession()` in any
 * component nested inside this wrapper.
 *
 * Props:
 * - children: The components that will have access to the session context.
 */
export default function SessionWrapper({ children }) {
  return (
    // Wrap children with SessionProvider
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
