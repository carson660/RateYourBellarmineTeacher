"use client";

import { useState } from "react";
import RatingStars from "@/components/RatingStars";
import { Review } from "@/types";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const [reporting, setReporting] = useState(false);
  const [done, setDone] = useState(false);

  const reportReview = async () => {
    setReporting(true);
    const res = await fetch("/api/reviews/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId: review.id, reason: "Inappropriate content" })
    });
    setDone(res.ok);
    setReporting(false);
  };

  return (
    <article className="space-y-3 rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <RatingStars value={review.rating} />
        <p className="text-sm text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
      </div>
      <p className="text-sm text-slate-700">
        Difficulty: {review.difficulty}/5 · Workload: {review.workload}/5
      </p>
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <p>{review.comment}</p>
      <button
        onClick={reportReview}
        disabled={reporting || done}
        className="text-sm text-rose-600 hover:text-rose-700 disabled:text-slate-400"
      >
        {done ? "Reported" : reporting ? "Reporting..." : "Report"}
      </button>
    </article>
  );
}
