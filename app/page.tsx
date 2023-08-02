import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Likes from "./likes";

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

  const { data } = await supabase
    .from("tweets")
    .select("*, profiles(*), likes(*)"); // we are able to grab these cols bc there is a relationship btwn them

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      user_has_liked_tweet: tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {/* @ts-expect-error */}
            {tweet.profiles.name} {tweet.profiles.username}
          </p>
          <p>{tweet.title}</p>
          <Likes tweet={tweet} />
        </div>
      ))}
    </>
  );
}
