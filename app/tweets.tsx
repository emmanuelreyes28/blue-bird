"use client";
import Likes from "./likes";
import { experimental_useOptimistic as useOptimistic } from "react";

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
