import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if(code){
        // use createRouteHandlerClient since this is a route
        const supabase = createRouteHandlerClient<Database>({ cookies })
        // authenticate user on next.js app and set a cookie meaning they are now signed in
        await supabase.auth.exchangeCodeForSession(code)
    }

    // redirect user to landing page 
    return NextResponse.redirect(requestUrl.origin)
    
}