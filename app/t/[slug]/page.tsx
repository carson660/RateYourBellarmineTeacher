export const dynamic = "force-dynamic";

import Image from "next/image";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import RatingStars from "@/components/RatingStars";
import { Review, Teacher } from "@/types";

async function getTeacher(slug: string): Promise<{
  teacher: Teacher;
  stats: { average_rating: number | null; review_count: number };
  reviews: Review[];
} | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/teacher/${slug}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data;
}

export default async function TeacherPage({ params }: { params: { slug: string } }) {
  const data = await getTeacher(params.slug);
  if (!data) {
    return <p>Teacher not found.</p>;
  }

  const { teacher, stats, reviews } = data;

  return (
    <section className="space-y-6">
      <article className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative h-48 w-48 overflow-hidden rounded-lg bg-slate-200">
            {teacher.photo_url ? (
              <Image src={teacher.photo_url} alt={teacher.name_en} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">No photo</div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{teacher.name_en}</h1>
            <p className="text-slate-600">{teacher.department}</p>
            <p className="text-slate-600">Courses: {teacher.courses.join(", ")}</p>
            <div className="flex items-center gap-3">
              <RatingStars value={stats.average_rating ?? 0} />
              <span className="text-sm text-slate-600">{stats.review_count} reviews</span>
            </div>
          </div>
        </div>
      </article>

      <ReviewForm teacherId={teacher.teacher_id} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {reviews.length === 0 && <p className="text-slate-600">No reviews yet.</p>}
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </section>
    </section>
  );
}
