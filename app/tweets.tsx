"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweet, newTweet) => {
    const newOptimisticTweet = [...currentOptimisticTweet];
    const index = newOptimisticTweet.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweet[index] = newTweet;
    return newOptimisticTweet;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets") // channel name can be named anything
      .on(
        "postgres_changes",
        {
          event: "*", // represent inserts, updates and deletes
          schema: "public",
          table: "tweets",
        },
        // cb function will be called by supabase when a change is detected on the public.tweets table
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>
        {tweet.author.name} {tweet.author.username}
      </p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
