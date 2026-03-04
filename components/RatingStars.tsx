type RatingStarsProps = {
  value: number;
};

export default function RatingStars({ value }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, idx) => {
        const filled = idx < Math.round(value);
        return (
          <span key={idx} className={filled ? "text-amber-500" : "text-slate-300"}>
            ★
          </span>
        );
      })}
      <span className="ml-1 text-sm text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}
