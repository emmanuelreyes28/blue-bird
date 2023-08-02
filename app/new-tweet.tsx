import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default function NewTweet() {
  // server action
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title")); // grab tweet using name from input tag
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // insert tweet to tweets table if we have a user
    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
    }
  };

  return (
    // action replaces onSubmit when creating server action components
    <form action={addTweet}>
      <input name="title" className="bg-inherit" />
    </form>
  );
}
