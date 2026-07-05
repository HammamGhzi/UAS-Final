import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

const StarRating = ({ rating, count, size = 16 }: StarRatingProps) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rounded ? "fill-[#ffb020] text-[#ffb020]" : "fill-[#e5e5e5] text-[#e5e5e5]"}
        />
      ))}
      {typeof count === "number" && (
        <span className="ml-1 text-sm text-[#8a8a8a]">({count})</span>
      )}
    </div>
  );
};

export default StarRating;