"use client";

import { useState } from "react";

type ReviewFormProps = {
  teacherId: number;
};

const initialValues = {
  rating: 5,
  difficulty: 3,
  workload: 3,
  tags: "",
  comment: ""
};

export default function ReviewForm({ teacherId }: ReviewFormProps) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<string>("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("Submitting...");
    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId,
        rating: Number(values.rating),
        difficulty: Number(values.difficulty),
        workload: Number(values.workload),
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        comment: values.comment
      })
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("Review submitted successfully.");
      setValues(initialValues);
    } else {
      setStatus(data.error ?? "Failed to submit review.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-white p-4">
      <h3 className="text-lg font-semibold">Leave an anonymous review</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { key: "rating", label: "Rating" },
          { key: "difficulty", label: "Difficulty" },
          { key: "workload", label: "Workload" }
        ].map((field) => (
          <label key={field.key} className="text-sm">
            {field.label}
            <input
              type="number"
              min={1}
              max={5}
              value={values[field.key as keyof typeof values] as number}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
              }
              className="mt-1 w-full rounded-md border p-2"
            />
          </label>
        ))}
      </div>
      <label className="block text-sm">
        Tags (comma-separated)
        <input
          value={values.tags}
          onChange={(event) => setValues((prev) => ({ ...prev, tags: event.target.value }))}
          className="mt-1 w-full rounded-md border p-2"
          placeholder="helpful, clear grading"
        />
      </label>
      <label className="block text-sm">
        Comment
        <textarea
          value={values.comment}
          onChange={(event) => setValues((prev) => ({ ...prev, comment: event.target.value }))}
          className="mt-1 min-h-24 w-full rounded-md border p-2"
          maxLength={600}
          required
        />
      </label>
      <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Submit Review
      </button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </form>
  );
}
