import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  // get user current session if there is one
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if no session meaning user is not logged in then redirect to login page
  if (!session) {
    redirect("/login");
  }

  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");

  return (
    <>
      <AuthButtonServer />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
