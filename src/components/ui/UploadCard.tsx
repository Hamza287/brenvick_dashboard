"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface UploadCardProps {
  /** Called when a file is selected or removed */
  onFileSelect?: (file: File | null) => void;
}

export function UploadCard({ onFileSelect }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect?.(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect?.(null);
  };

  return (
    <Card className="relative border-dashed border-2 border-gray-300 hover:border-[var(--brand-red)] flex flex-col items-center justify-center p-4 group transition-all duration-200">
      {/* 🗑️ Dustbin Icon (visible on hover when preview exists) */}
      {preview && (
        <button
          onClick={handleRemoveImage}
          type="button"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 p-1.5 rounded-full shadow-sm transition-all"
          title="Remove image"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Image Preview or Placeholder */}
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="object-contain h-24 mb-2 rounded-md transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <img
          src="/placeholder-product.png"
          alt="Placeholder"
          className="object-contain h-24 mb-2 opacity-70"
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload / Change Button */}
      <Button
        variant="outline"
        className="w-full text-sm py-1"
        onClick={handleButtonClick}
        type="button"
      >
        {preview ? "Change" : "Upload"}
      </Button>
    </Card>
  );
}
