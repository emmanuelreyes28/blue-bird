import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Likes from "./likes";
import Tweets from "./tweets";

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
    // author is used as an alias for profiles
    .select("*, author: profiles(*), likes(user_id)") // we are able to grab these cols bc there is a relationship btwn them
    .order("created_at", { ascending: false }); // show tweets in descending order

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      // if tweet author is an array then only grab first author othwerwise get tweet.author
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
