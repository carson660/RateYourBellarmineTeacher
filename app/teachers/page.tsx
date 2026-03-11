export const dynamic = "force-dynamic";

import TeacherCard from "@/components/TeacherCard";
import { TeacherWithStats } from "@/types";

type SearchParams = {
  search?: string;
  department?: string;
  course?: string;
  sort?: string;
};

async function getTeachers(params: SearchParams): Promise<TeacherWithStats[]> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/teachers?${query}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.data;
}

export default async function TeachersPage({ searchParams }: { searchParams: SearchParams }) {
  const teachers = await getTeachers(searchParams);

  return (
    <section className="space-y-5">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="mb-3 text-2xl font-bold">Teacher Directory</h1>
        <form className="grid grid-cols-1 gap-3 md:grid-cols-4" method="GET">
          <input name="search" placeholder="Search by teacher name" className="rounded-md border p-2" defaultValue={searchParams.search} />
          <input
            name="department"
            placeholder="Department (e.g. Mathematics)"
            className="rounded-md border p-2"
            defaultValue={searchParams.department}
          />
          <input name="course" placeholder="Course" className="rounded-md border p-2" defaultValue={searchParams.course} />
          <select name="sort" defaultValue={searchParams.sort ?? "highest_rating"} className="rounded-md border p-2">
            <option value="highest_rating">Highest rating</option>
            <option value="most_reviews">Most reviews</option>
            <option value="newest_reviews">Newest reviews</option>
          </select>
          <button className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 md:col-span-4">
            Apply Filters
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.teacher_id} teacher={teacher} />
        ))}
      </div>
    </section>
  );
}
