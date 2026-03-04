import { supabase } from "@/lib/supabaseClient";

const MAX_REVIEWS_PER_DAY = 5;

export async function canSubmitReview(anonHash: string): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("anon_hash", anonHash)
    .gte("created_at", since);

  if (error) {
    throw new Error(`Rate limit query failed: ${error.message}`);
  }

  return (count ?? 0) < MAX_REVIEWS_PER_DAY;
}
