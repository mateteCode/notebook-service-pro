import { Camera, UploadCloud, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

export const ImageUploader = ({ deviceId, context, onUploadSuccess }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("context", context);

    try {
      await api.post(`/repairs/${deviceId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadSuccess();
    } catch (err) {
      alert("Error al subir la imagen");
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        id={`file-${context}`}
        className="hidden"
      />
      <label
        htmlFor={`file-${context}`}
        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 cursor-pointer transition"
      >
        {uploading ? (
          <Loader2 className="animate-spin text-blue-600" />
        ) : (
          <Camera className="text-blue-600" />
        )}
        <span className="text-sm font-bold text-blue-700">
          {uploading ? "Subiendo..." : `Tomar foto (${context})`}
        </span>
      </label>
    </div>
  );
};
