import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const { data: reviews, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("teacher_id", teacher.teacher_id)
    .eq("status", "visible")
    .order("created_at", { ascending: false });

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  const count = reviews?.length ?? 0;
  const avg = count === 0 ? null : reviews!.reduce((sum, review) => sum + review.rating, 0) / count;

  return NextResponse.json({ data: { teacher, stats: { average_rating: avg, review_count: count }, reviews } });
}
