"use client";

import { useRef, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export function UploadCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-300 hover:border-[var(--brand-red)] flex flex-col items-center justify-center p-4">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="object-contain h-24 mb-2 rounded-md"
        />
      ) : (
        <img
          src="/placeholder-product.png"
          alt="Placeholder"
          className="object-contain h-24 mb-2 opacity-70"
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        variant="outline"
        className="w-full text-sm py-1"
        onClick={handleButtonClick}
      >
        {preview ? "Change" : "Upload"}
      </Button>
    </Card>
  );
}
