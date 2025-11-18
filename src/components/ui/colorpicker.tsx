"use client";

import { useState } from "react";

interface Props {
  colors: string[];
  onChange: (colors: string[]) => void;
}

export default function ColorPicker({ colors, onChange }: Props) {
  const [selectedColor, setSelectedColor] = useState("#000000");

  const addColor = () => {
    if (!selectedColor || colors.includes(selectedColor)) return;

    onChange([...colors, selectedColor]);
  };

  const removeColor = (hex: string) => {
    onChange(colors.filter((c) => c !== hex));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Product Colors
      </label>

      <div className="flex items-center gap-4">
        {/* REAL COLOR PICKER */}
        <input
          type="color"
          className="w-12 h-12 border rounded cursor-pointer"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />

        <button
          type="button"
          onClick={addColor}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
        >
          Add Color
        </button>
      </div>

      {/* COLOR BUBBLES */}
      <div className="flex flex-wrap gap-3 mt-4">
        {colors.map((hex) => (
          <div
            key={hex}
            className="flex items-center gap-2 px-3 py-1 border rounded-full shadow-sm"
          >
            <span
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: hex }}
            ></span>

            <span className="text-sm">{hex.toUpperCase()}</span>

            <button
              type="button"
              onClick={() => removeColor(hex)}
              className="text-red-500 font-bold text-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
