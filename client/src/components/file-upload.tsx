import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({ onFileSelect, accept = ".png,.jpg,.jpeg", maxSize = 2 * 1024 * 1024, className }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setError("El archivo es demasiado grande. Máximo 2MB.");
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError("Formato de archivo no válido. Use PNG o JPEG.");
      } else {
        setError("Error al cargar el archivo.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary",
          error && "border-red-500"
        )}
      >
        <Input {...getInputProps()} />
        <div className="text-center">
          <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            {isDragActive
              ? "Suelte el archivo aquí..."
              : "Haga clic para cargar o arrastre su firma aquí"}
          </p>
          <p className="text-xs text-gray-500">
            Formato PNG o JPEG, máximo 2MB
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {uploadedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-green-700">{uploadedFile.name}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
