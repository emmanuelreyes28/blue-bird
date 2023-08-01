"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthButton() {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    //signin with OAuth
    await supabase.auth.signInWithOAuth({
      provider: "github",
      // once auth flow has been completed the user will be redirected
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <button onClick={handleSignIn}>Login</button>
      <button onClick={handleSignOut}>Logout</button>
    </>
  );
}
