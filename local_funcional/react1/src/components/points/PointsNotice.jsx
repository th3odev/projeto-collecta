import settingsIcon from "../../assets/icons/settings.svg";

export default function PointsNotice() {
  return (
    <div className="rounded-xl border border-[#0D9488]/40 bg-[#0A1A1D] px-6 py-4 text-center">
      <span className="inline-flex items-center gap-2 text-sm text-[#0D9488]">
        <img src={settingsIcon} className="h-4 w-4" />
        Funcionalidades em desenvolvimento! Em breve disponíveis.
      </span>
    </div>
  );
}
