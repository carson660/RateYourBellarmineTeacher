// ensure .env variables are loaded when running via tsx
import "dotenv/config";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const teacherSchema = z.object({
  teacher_id: z.number().int(),
  name_en: z.string().min(1),
  slug: z.string().min(1),
  department: z.string().min(1),
  photo_url: z.string().nullable(),
  photo_filename: z.string().nullable(),
  courses: z.array(z.string()),
  // seed data doesn’t include timestamps; let PostgreSQL default them
  created_at: z.string().optional()
});

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("");
    throw new Error("Missing Supabase environment variables.");

  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const seedPath = path.join(process.cwd(), "teachers_seed.json");
  const file = await readFile(seedPath, "utf-8");
  const parsed = z.array(teacherSchema).parse(JSON.parse(file));

  const { error } = await supabase.from("teachers").upsert(parsed, { onConflict: "teacher_id" });

  if (error) {
    throw new Error(`Failed to seed teachers: ${error.message}`);
  }

  console.log(`Seeded ${parsed.length} teacher records.`);
}

run().catch((error) => {
  // avoid console.error inspecting deep or circular objects
  if (error instanceof Error) {
    console.error("Seed script failed:", error.message);
    console.error(error.stack);
  } else {
    console.error("Seed script failed with non-error:", error);
  }
  process.exit(1);
});
