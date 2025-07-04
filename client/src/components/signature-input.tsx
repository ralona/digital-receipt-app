import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { SignatureModal } from '@/components/signature-modal';
import { PenTool, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureInputProps {
  onFileSelect: (file: File | null) => void;
  currentFile?: File;
  className?: string;
}

export function SignatureInput({ onFileSelect, currentFile, className }: SignatureInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleSignatureCreated = (file: File) => {
    onFileSelect(file);
    setShowUpload(false);
  };

  const handleFileSelect = (file: File | null) => {
    onFileSelect(file);
    if (file) {
      setShowUpload(false);
    }
  };

  const clearSignature = () => {
    onFileSelect(null);
    setShowUpload(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current signature preview */}
      {currentFile && (
        <div className="relative border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={URL.createObjectURL(currentFile)}
                alt="Firma actual"
                className="max-h-16 max-w-32 object-contain bg-white border border-gray-200 rounded"
              />
              <div>
                <p className="text-sm font-medium text-green-700">Firma cargada</p>
                <p className="text-xs text-green-600">{currentFile.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSignature}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons when no signature */}
      {!currentFile && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="flex-1"
            >
              <PenTool className="mr-2 h-4 w-4" />
              Dibujar Firma
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUpload(!showUpload)}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Subir Archivo
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Elija crear una firma digital o subir un archivo PNG/JPEG
            </p>
          </div>
        </div>
      )}

      {/* File upload area (shown on demand) */}
      {showUpload && !currentFile && (
        <div className="border-t pt-4">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".png,.jpg,.jpeg"
            maxSize={2 * 1024 * 1024} // 2MB
            className="border-blue-300 bg-blue-50"
          />
        </div>
      )}

      {/* Signature drawing modal */}
      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignatureCreated={handleSignatureCreated}
      />
    </div>
  );
}