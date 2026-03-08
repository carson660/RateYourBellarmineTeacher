import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAnonHash } from "@/lib/hash";
import { canSubmitReview } from "@/lib/rateLimit";
import { supabase } from "@/lib/supabaseClient";

const createReviewSchema = z.object({
  teacherId: z.number().int(),
  rating: z.number().int().min(1).max(5),
  difficulty: z.number().int().min(1).max(5),
  workload: z.number().int().min(1).max(5),
  tags: z.array(z.string().min(1).max(30)).max(8).default([]),
  comment: z.string().trim().min(1).max(600)
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const salt = process.env.ANON_HASH_SALT;
  if (!salt) {
    return NextResponse.json({ error: "Server configuration is missing ANON_HASH_SALT." }, { status: 500 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";
  const anonHash = createAnonHash(ip, userAgent, salt);

  const isAllowed = await canSubmitReview(anonHash);
  if (!isAllowed) {
    return NextResponse.json({ error: "Rate limit reached. Try again later." }, { status: 429 });
  }

  const { teacherId, rating, difficulty, workload, tags, comment } = parsed.data;
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      teacher_id: teacherId,
      rating,
      difficulty,
      workload,
      tags,
      comment,
      anon_hash: anonHash,
      status: "visible"
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Review created", reviewId: data.id }, { status: 201 });
}
