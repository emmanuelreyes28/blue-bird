import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonClient from "../auth-button-client";

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

  return <AuthButtonClient session={session} />;
}
