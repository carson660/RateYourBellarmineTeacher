import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

const querySchema = z.object({
  search: z.string().optional(),
  department: z.string().min(1).optional(),
  course: z.string().optional(),
  sort: z.enum(["highest_rating", "most_reviews", "newest_reviews"]).optional()
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const { search, department, course, sort } = parsed.data;

  let query = supabase.from("teachers").select("*");

  if (search) query = query.ilike("name_en", `%${search}%`);
  if (department) query = query.eq("department", department);
  if (course) query = query.contains("courses", [course]);

  const { data: teachers, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const teacherIds = (teachers ?? []).map((teacher) => teacher.teacher_id);
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("teacher_id,rating,created_at")
    .in("teacher_id", teacherIds.length ? teacherIds : [-1])
    .eq("status", "visible");

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  const stats = new Map<number, { sum: number; count: number; lastReviewAt: string | null }>();
  for (const review of reviews ?? []) {
    const current = stats.get(review.teacher_id) ?? { sum: 0, count: 0, lastReviewAt: null };
    current.sum += review.rating;
    current.count += 1;
    current.lastReviewAt = !current.lastReviewAt || review.created_at > current.lastReviewAt ? review.created_at : current.lastReviewAt;
    stats.set(review.teacher_id, current);
  }

  const enriched = (teachers ?? []).map((teacher) => {
    const teacherStats = stats.get(teacher.teacher_id);
    return {
      ...teacher,
      avg_rating: teacherStats ? teacherStats.sum / teacherStats.count : null,
      review_count: teacherStats?.count ?? 0,
      last_review_at: teacherStats?.lastReviewAt ?? null
    };
  });

  if (sort === "highest_rating") enriched.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
  if (sort === "most_reviews") enriched.sort((a, b) => b.review_count - a.review_count);
  if (sort === "newest_reviews") {
    enriched.sort((a, b) => {
      if (!a.last_review_at) return 1;
      if (!b.last_review_at) return -1;
      return b.last_review_at.localeCompare(a.last_review_at);
    });
  }

  return NextResponse.json({ data: enriched });
}
