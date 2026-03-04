import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAnonHash } from "@/lib/hash";
import { supabase } from "@/lib/supabaseClient";

const reportSchema = z.object({
  reviewId: z.string().uuid(),
  reason: z.string().trim().min(3).max(200)
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = reportSchema.safeParse(body);

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

  const { error } = await supabase.from("reports").insert({
    review_id: parsed.data.reviewId,
    reason: parsed.data.reason,
    anon_hash: anonHash
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Report submitted" }, { status: 201 });
}
