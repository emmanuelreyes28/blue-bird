import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GitHubButton from "./github-button";
import LinkedInButton from "./linkedin-button";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // get user current session if there is one
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if there is a session then redirect to landing page
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="text-2xl">Blue Bird</div>
      <div className="text-xl">Log In</div>
      <div className="flex space-x-4">
        <GitHubButton />
        <LinkedInButton />
      </div>
    </div>
  );
}
