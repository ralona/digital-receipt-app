import { useState, useEffect } from "react";
import { ReceiptForm } from "@/components/receipt-form";
import { ReceiptPreview } from "@/components/receipt-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, FileText, Upload, History } from "lucide-react";
import { Link } from "wouter";

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

  // Load copied receipt data from localStorage on component mount
  useEffect(() => {
    const copiedData = localStorage.getItem("copyReceiptData");
    if (copiedData) {
      try {
        const parsedData = JSON.parse(copiedData);
        setReceiptData({
          ...parsedData,
          date: new Date(), // Always use current date
        });
        localStorage.removeItem("copyReceiptData"); // Clear after loading
      } catch (error) {
        console.error("Error loading copied receipt data:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Receipt className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-foreground">Generador de Recibos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/history">
                <button className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <History className="mr-2 h-4 w-4" />
                  Historial
                </button>
              </Link>
              <span className="text-sm text-muted-foreground">v1.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground mb-2">
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

          {/* Preview Section */}
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground mb-2">
                Vista Previa del Recibo
              </CardTitle>
              <p className="text-muted-foreground">
                Previsualización de su recibo profesional
              </p>
            </CardHeader>
            <CardContent>
              <ReceiptPreview receiptData={receiptData} />
            </CardContent>
          </Card>
        </div>

        {/* Instructions Section */}
        <Card className="mt-8 bg-surface">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Instrucciones de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Complete el Formulario</h3>
                  <p className="text-sm text-muted-foreground">
                    Ingrese el importe, nombres del pagador y receptor
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Cargar Firma (Opcional)</h3>
                  <p className="text-sm text-muted-foreground">
                    Suba su firma en formato PNG para mayor autenticidad
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Generar y Guardar</h3>
                  <p className="text-sm text-muted-foreground">
                    Descargue el PDF o guárdelo directamente en Google Drive
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

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
