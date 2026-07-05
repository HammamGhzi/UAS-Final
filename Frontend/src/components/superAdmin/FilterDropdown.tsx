import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

/**
 * Dropdown filter generik. Cukup kirim `options` (array string) dan komponen
 * ini otomatis menambahkan opsi "Semua ..." di paling atas.
 * Dipakai untuk: filter Sanggar (di halaman Produk), filter Wilayah/Region
 * (di halaman Sanggar), dan filter bebas di halaman Reviews (Jenis, Rating, dst).
 */
const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  allLabel = "Semua",
  className = "",
}: FilterDropdownProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-sm font-semibold text-[#6b6b6b]">{label}</span>}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[48px] appearance-none rounded-[16px] border border-[#c9c9c9] bg-white pl-4 pr-10 text-sm font-semibold text-[#3b3b3b] outline-none transition focus:border-[#ff9800]"
        >
          <option value="">{allLabel}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
        />
      </div>
    </div>
  );
};

export default FilterDropdown;