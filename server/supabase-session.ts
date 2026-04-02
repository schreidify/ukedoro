import type { NextFunction, Request, Response } from "express";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export function createSupabaseForRequest(
  req: Request,
  res: Response,
): SupabaseClient | null {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) {
    return null;
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" }),
        );
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.appendHeader(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          );
        });
      },
    },
  });
}

/** Refreshes the Supabase session from cookies so server-handled responses stay in sync with auth. */
export function supabaseSessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const supabase = createSupabaseForRequest(req, res);
  if (!supabase) {
    next();
    return;
  }
  void supabase.auth.getUser().then(() => next()).catch(() => next());
}
