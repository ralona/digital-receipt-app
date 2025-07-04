import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Trash2, Download, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureCreated: (file: File) => void;
}

export function SignatureModal({ isOpen, onClose, onSignatureCreated }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const { toast } = useToast();

  // Initialize canvas when modal opens
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Set drawing styles
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y;
    if (e.type === 'mousedown') {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      x = (mouseEvent.clientX - rect.left) * scaleX;
      y = (mouseEvent.clientY - rect.top) * scaleY;
    } else {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>;
      x = (touchEvent.touches[0].clientX - rect.left) * scaleX;
      y = (touchEvent.touches[0].clientY - rect.top) * scaleY;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y;
    if (e.type === 'mousemove') {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      x = (mouseEvent.clientX - rect.left) * scaleX;
      y = (mouseEvent.clientY - rect.top) * scaleY;
    } else {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>;
      e.preventDefault(); // Prevent scrolling
      x = (touchEvent.touches[0].clientX - rect.left) * scaleX;
      y = (touchEvent.touches[0].clientY - rect.top) * scaleY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      toast({
        title: "Error",
        description: "Por favor, dibuje su firma antes de guardar",
        variant: "destructive",
      });
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        toast({
          title: "Error",
          description: "No se pudo generar la firma",
          variant: "destructive",
        });
        return;
      }

      const file = new File([blob], 'signature.png', { type: 'image/png' });
      onSignatureCreated(file);
      onClose();
      
      toast({
        title: "Firma guardada",
        description: "La firma digital ha sido creada exitosamente",
      });
    }, 'image/png');
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      toast({
        title: "Error",
        description: "Por favor, dibuje su firma antes de descargar",
        variant: "destructive",
      });
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mi-firma.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Crear Firma Digital
          </DialogTitle>
          <DialogDescription>
            Dibuje su firma usando el dedo o el mouse en el área de abajo
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Canvas Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <canvas
              ref={canvasRef}
              className="w-full h-48 bg-white border border-gray-200 rounded cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 text-center">
            <p>💡 Consejo: Use el dedo en móvil o el mouse en ordenador para firmar</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadSignature}
              disabled={!hasSignature}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
            
            <Button
              onClick={saveSignature}
              disabled={!hasSignature}
              className="flex-1"
            >
              <PenTool className="mr-2 h-4 w-4" />
              Usar Firma
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}