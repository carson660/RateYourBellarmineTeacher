import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4 rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Rate Your Bellarmine Teacher</h1>
      <p className="text-slate-600">
        Browse teacher profiles, read anonymous reviews, and share your classroom experience.
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
