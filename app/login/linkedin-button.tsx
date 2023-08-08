"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function LinkedInButton() {
  const supabase = createClientComponentClient<Database>();
  const handleSignIn = async () => {
    //signin with OAuth
    await supabase.auth.signInWithOAuth({
      provider: "linkedin",
      // once auth flow has been completed the user will be redirected
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };
  return (
    <button onClick={handleSignIn} className="hover:bg-gray-800 p-8 rounded-xl">
      <Image
        src="/In-White-96.png"
        alt="LinkedIn logo"
        width={100}
        height={100}
      />
    </button>
  );
}
