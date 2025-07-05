import { useState, useEffect } from "react";
import { ReceiptForm } from "@/components/receipt-form";
import { ReceiptPreview } from "@/components/receipt-preview";
import { FloatingNav } from "@/components/floating-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Receipt, Eye } from "lucide-react";

export interface ReceiptData {
  amount: number;
  payerName: string;
  recipientName: string;
  date: Date;
  signature?: File;
  signatureUrl?: string;
}

export default function ReceiptGenerator() {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    amount: 0,
    payerName: "",
    recipientName: "",
    date: new Date(),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load copied receipt data from localStorage on component mount
  useEffect(() => {
    const copiedData = localStorage.getItem('copiedReceiptData');
    
    if (copiedData) {
      try {
        const parsedData = JSON.parse(copiedData);
        
        setReceiptData(prev => ({
          ...prev,
          amount: parsedData.amount,
          payerName: parsedData.payerName,
          recipientName: parsedData.recipientName,
          signatureUrl: parsedData.signatureUrl,
          date: new Date(), // Always use current date for new receipts
        }));
        
        // Clear the copied data after loading
        localStorage.removeItem('copiedReceiptData');
      } catch (error) {
        console.error("Error loading copied receipt data:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 safe-area-inset-top">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-3 flex items-center">
            <Receipt className="text-primary text-3xl mr-3" />
            Crear Nuevo Recibo
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete los datos para generar su recibo profesional
          </p>
        </div>

        {/* Form Section */}
        <ReceiptForm
          receiptData={receiptData}
          setReceiptData={setReceiptData}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </main>

      {/* Preview Sheet */}
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-foreground">
              Vista Previa del Recibo
            </SheetTitle>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </SheetHeader>
          <div className="mt-6">
            <ReceiptPreview receiptData={receiptData} />
          </div>
          <div className="flex justify-center mt-8 pb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Navigation */}
      <FloatingNav
        onShowPreview={() => setShowPreview(true)}
        showPreviewButton={true}
        showInstructionsButton={true}
      />

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-foreground">Generando recibo...</span>
          </div>
        </div>
      )}
    </div>
  );
}
