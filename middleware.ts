import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// runs every time before a request is completed
export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({req, res})
    // refresh sessions if it expired
    await supabase.auth.getSession();
    return res;
}