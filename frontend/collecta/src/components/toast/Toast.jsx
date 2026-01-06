import starGreen from "../../assets/icons/star_green.svg";
import wrongIcon from "../../assets/icons/warning.svg";

export default function Toast({ type, title, description }) {
  const isError = type === "error";

  return (
    <div
      className={`w-72 rounded-xl border px-4 py-3 bg-[#0F1217]
        ${isError ? "border-red-500/40" : "border-[#0D9488]/40"}
        animate-slide-in`}
    >
      <div className="flex gap-3">
        <img
          src={isError ? wrongIcon : starGreen}
          className="h-5 w-5 flex-shrink-0"
        />

        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
