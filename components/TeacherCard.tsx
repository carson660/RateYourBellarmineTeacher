import Image from "next/image";
import Link from "next/link";
import RatingStars from "@/components/RatingStars";
import { TeacherWithStats } from "@/types";

type TeacherCardProps = {
  teacher: TeacherWithStats;
};

export default function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm">
      <div className="relative mb-3 h-48 overflow-hidden rounded-lg bg-slate-200">
        {teacher.photo_url ? (
          <Image src={teacher.photo_url} alt={teacher.name_en} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No photo</div>
        )}
      </div>
      <h2 className="text-lg font-semibold">{teacher.name_en}</h2>
      <p className="text-sm text-slate-500">{teacher.department}</p>
      <p className="mt-2 text-sm text-slate-600">Courses: {teacher.courses.join(", ")}</p>
      <div className="mt-3 flex items-center justify-between">
        <RatingStars value={teacher.avg_rating ?? 0} />
        <span className="text-sm text-slate-600">{teacher.review_count} reviews</span>
      </div>
      <Link
        href={`/t/${teacher.slug}`}
        className="mt-4 inline-block rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        View Profile
      </Link>
    </article>
  );
}
