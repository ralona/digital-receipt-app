import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingNav } from "@/components/floating-nav";
import { formatCurrency, formatDate } from "@/lib/utils";
import { History, Copy, FileText, Calendar, User, Euro, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useReceipts } from "@/hooks/use-receipts";
import type { Receipt } from "@shared/schema";

export default function ReceiptHistory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { receipts, isLoading, error, deleteReceipt, isDeleting, isMobile } = useReceipts();

  const handleCopyReceipt = async (receipt: Receipt) => {
    try {
      const receiptData = {
        amount: receipt.amount / 100, // Convert cents to euros
        payerName: receipt.payerName,
        recipientName: receipt.recipientName,
      };

      // If there's a signature, we need to fetch it and convert it to a File
      let signatureFile: File | undefined;
      if (receipt.signatureUrl) {
        try {
          const response = await fetch(receipt.signatureUrl);
          const blob = await response.blob();
          signatureFile = new File([blob], 'signature.png', { type: 'image/png' });
        } catch (error) {
          console.error("Error loading signature:", error);
        }
      }

      const dataToStore = {
        ...receiptData,
        signatureUrl: receipt.signatureUrl,
        hasSignature: !!receipt.signatureUrl
      };

      // Store the data in localStorage for the receipt generator to pick up
      localStorage.setItem('copiedReceiptData', JSON.stringify(dataToStore));

      // Navigate to home page
      setLocation('/');

      toast({
        title: "Recibo copiado",
        description: "Los datos del recibo han sido copiados. Puedes editarlos y generar un nuevo recibo.",
      });
    } catch (error) {
      console.error("Error copying receipt:", error);
      toast({
        title: "Error",
        description: "No se pudo copiar el recibo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReceipt = async (receipt: Receipt) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el recibo #${receipt.id}?`)) {
      return;
    }

    try {
      await deleteReceipt(receipt.id);
      toast({
        title: "Recibo eliminado",
        description: `El recibo #${receipt.id} ha sido eliminado correctamente.`,
      });
    } catch (error) {
      console.error("Error deleting receipt:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el recibo",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 safe-area-inset-top">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 safe-area-inset-top">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">
              Error al cargar el historial de recibos
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 safe-area-inset-top">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-3 flex items-center">
            <History className="text-primary text-3xl mr-3" />
            Recibos Generados
          </h1>
          <p className="text-muted-foreground text-lg">
            {isMobile 
              ? "Historial de recibos guardados localmente en tu dispositivo"
              : "Historial de todos los recibos que has creado"
            }
          </p>
        </div>

        {/* Content Section */}
        {!receipts || receipts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium text-foreground mb-3">
              No hay recibos aún
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              Crea tu primer recibo para verlo aquí
            </p>
            <p className="text-muted-foreground">
              Usa el botón "Inicio" en la navegación inferior para crear un recibo
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {receipts.map((receipt) => (
              <Card key={receipt.id} className="bg-card border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">#{receipt.id}</span>
                      <span className="font-bold text-xl text-green-600">
                        {formatCurrency(receipt.amount / 100)}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(new Date(receipt.date))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">De: {receipt.payerName}</div>
                      <div className="text-sm text-muted-foreground">Para: {receipt.recipientName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {receipt.signatureUrl ? (
                        <Badge variant="secondary" className="text-xs">Con firma</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Sin firma</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyReceipt(receipt)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReceipt(receipt)}
                      disabled={isDeleting}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Floating Navigation */}
      <FloatingNav showMobileInfoButton={true} />
    </div>
  );
}