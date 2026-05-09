import { User, Briefcase, Check } from "lucide-react";
import type { VehicleType } from "../../lib/pricing";

interface VehicleCardProps {
  vehicle: VehicleType;
  price: number;
  pricePerWay: number;
  isReturn: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const VehicleCard = ({
  vehicle,
  price,
  pricePerWay,
  isReturn,
  isSelected,
  onSelect,
}: VehicleCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full text-left rounded-[20px] md:rounded-[24px] p-4 md:p-5 transition-all duration-300 border-2 ${
        isSelected
          ? "bg-brand-primary border-brand-primary"
          : "bg-white border-gray-200 hover:border-brand-graphite"
      }`}
    >
      {/* Selected badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-graphite flex items-center justify-center">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Vehicle image */}
        <div
          className={`w-[80px] h-[56px] md:w-[100px] md:h-[66px] rounded-[12px] overflow-hidden flex items-center justify-center p-2 shrink-0 ${
            isSelected ? "bg-white/10" : "bg-brand-section"
          }`}
        >
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-[15px] md:text-[16px] font-bold mb-1 transition-colors ${
              isSelected ? "text-white" : "text-brand-graphite"
            }`}
          >
            {vehicle.name}
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User
                className={`w-[14px] h-[14px] ${
                  isSelected ? "text-white/60" : "text-brand-muted"
                }`}
                strokeWidth={2}
              />
              <span
                className={`text-[13px] font-semibold ${
                  isSelected ? "text-white/70" : "text-brand-muted"
                }`}
              >
                {vehicle.maxPassengers}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase
                className={`w-[14px] h-[14px] ${
                  isSelected ? "text-white/60" : "text-brand-muted"
                }`}
                strokeWidth={2}
              />
              <span
                className={`text-[13px] font-semibold ${
                  isSelected ? "text-white/70" : "text-brand-muted"
                }`}
              >
                {vehicle.maxSuitcases}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div
            className={`text-[20px] md:text-[24px] font-bold ${
              isSelected ? "text-white" : "text-brand-graphite"
            }`}
          >
            £{price.toFixed(2)}
          </div>
          {isReturn && (
            <div
              className={`text-[11px] font-semibold ${
                isSelected ? "text-white/50" : "text-brand-muted"
              }`}
            >
              £{pricePerWay.toFixed(2)} each way
            </div>
          )}
          {isReturn && (
            <div className="text-[10px] font-bold text-green-500 mt-0.5">
              5% OFF
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
