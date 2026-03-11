import Link from "next/link";
import { PLATFORM_NAME, SCHOOL_NAME } from "./config";

export default function HomePage() {
  return (
    <section className="space-y-4 rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Rate Your Teacher</h1>
      <p className="text-slate-600">
        {PLATFORM_NAME} helps {SCHOOL_NAME} students browse teacher profiles, read anonymous reviews, and share
        classroom experiences.
      </p>
      <p className="text-slate-600">
        Running this for another campus? Update <code>NEXT_PUBLIC_SCHOOL_NAME</code> and seed your own teacher list.
      </p>
      <Link
        href="/teachers"
        className="inline-flex rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Browse Teachers
      </Link>
    </section>
  );
}
