"use client";

import {
  CCAPAC_SPACES,
} from "@/constants/spaces";

type SpaceSelectProps = {
  value: number;
  onChange: (spaceId: number) => void;
  disabled?: boolean;
};

export default function SpaceSelect({
  value,
  onChange,
  disabled = false,
}: SpaceSelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="space"
        className="text-sm font-semibold text-[#5C4033]"
      >
        Espace souhaité *
      </label>

      <select
        id="space"
        name="space"
        value={value || ""}
        disabled={disabled}
        required
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="h-10 w-full rounded-md border border-[#D1965B]/30 bg-white px-3 text-sm text-[#5C4033] outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          Sélectionnez un espace
        </option>

        {CCAPAC_SPACES.map((space) => (
          <option
            key={space.id}
            value={space.id}
          >
            {space.name} — {space.capacityLabel}
          </option>
        ))}
      </select>
    </div>
  );
}