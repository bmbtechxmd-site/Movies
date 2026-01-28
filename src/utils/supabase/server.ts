import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./types";

export async function createClient(admin?: boolean) {
  const cookieStore = await cookies();

  // Use correct environment variable names
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  
  // Determine which key to use
  let supabaseKey: string;
  if (admin) {
    supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  } else {
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  }

  // Create a server's supabase client with newly configured cookie
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
          console.error("Failed to set cookies:", error);
        }
      },
    },
  });
      }
