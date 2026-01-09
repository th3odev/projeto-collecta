import { Link } from "react-router-dom";

export default function SkeletonCard() {
  return (
    <Link to="/item/1">
      <div className="w-full h-[180px] rounded-xl border border-white/10 bg-[#0F1217] overflow-hidden relative cursor-pointer hover:border-[#0D9488]/40 transition">
        {/* shimmer */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </Link>
  );
}
