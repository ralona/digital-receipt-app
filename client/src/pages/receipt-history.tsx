import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { History, Copy, FileText, Calendar, User, Euro } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Receipt } from "@shared/schema";

export default function ReceiptHistory() {
  const { toast } = useToast();

  const { data: receipts, isLoading, error } = useQuery<Receipt[]>({
    queryKey: ["/api/receipts"],
  });

  const handleCopyReceipt = (receipt: Receipt) => {
    const receiptData = {
      amount: receipt.amount / 100, // Convert cents to euros
      payerName: receipt.payerName,
      recipientName: receipt.recipientName,
    };
    
    // Store in localStorage for the receipt generator to pick up
    localStorage.setItem("copyReceiptData", JSON.stringify(receiptData));
    
    toast({
      title: "Datos copiados",
      description: "Los datos del recibo han sido copiados. Ve al generador para crear uno nuevo.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                Error al cargar el historial de recibos
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <History className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-foreground">Historial de Recibos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Nuevo Recibo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Recibos Generados
            </CardTitle>
            <p className="text-muted-foreground">
              Historial de todos los recibos que has creado
            </p>
          </CardHeader>
          <CardContent>
            {!receipts || receipts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay recibos aún
                </h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primer recibo para verlo aquí
                </p>
                <Link href="/">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Crear Recibo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Importe</TableHead>
                      <TableHead>Pagador</TableHead>
                      <TableHead>Receptor</TableHead>
                      <TableHead>Firma</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">
                          #{receipt.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {formatDate(new Date(receipt.date))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center font-medium text-green-600">
                            <Euro className="mr-1 h-4 w-4" />
                            {formatCurrency(receipt.amount / 100)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            {receipt.payerName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            {receipt.recipientName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {receipt.signatureUrl ? (
                            <Badge variant="secondary">Con firma</Badge>
                          ) : (
                            <Badge variant="outline">Sin firma</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyReceipt(receipt)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copiar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}