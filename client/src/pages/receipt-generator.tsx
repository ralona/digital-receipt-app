import { useState, useEffect } from "react";
import { ReceiptForm } from "@/components/receipt-form";
import { ReceiptPreview } from "@/components/receipt-preview";
import { FloatingNav } from "@/components/floating-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Section */}
        <Card className="bg-surface">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground mb-2 flex items-center">
              <Receipt className="text-primary text-2xl mr-3" />
              Crear Nuevo Recibo
            </CardTitle>
            <p className="text-muted-foreground">
              Complete los datos para generar su recibo profesional
            </p>
          </CardHeader>
          <CardContent>
            <ReceiptForm
              receiptData={receiptData}
              setReceiptData={setReceiptData}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </CardContent>
        </Card>
      </main>

      {/* Preview Sheet */}
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-foreground">
              Vista Previa del Recibo
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ReceiptPreview receiptData={receiptData} />
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
