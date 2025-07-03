import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { type ReceiptData } from "@/pages/receipt-generator";
import { PenTool } from "lucide-react";

interface ReceiptPreviewProps {
  receiptData: ReceiptData;
}

export function ReceiptPreview({ receiptData }: ReceiptPreviewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return formatCurrency(amount);
  };

  return (
    <Card className="bg-white border-2 border-gray-300 p-8 print:border-0 print:shadow-none">
      {/* Receipt Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RECIBO DE PAGO</h1>
        <p className="text-sm text-gray-600">Comprobante de transacción</p>
      </div>

      {/* Receipt Details */}
      <div className="space-y-6">
        {/* Transaction Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Información de la Transacción
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fecha:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(receiptData.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Importe:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatAmount(receiptData.amount)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Detalles del Pago
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Pagado por:</span>
                <div className="text-sm font-medium text-gray-900">
                  {receiptData.payerName || "Nombre del Pagador"}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Recibido por:</span>
                <div className="text-sm font-medium text-gray-900">
                  {receiptData.recipientName || "Nombre del Receptor"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Descripción del Pago
          </h3>
          <p className="text-sm text-gray-700">
            Por la presente, certifico que{" "}
            <span className="font-medium">
              {receiptData.payerName || "el pagador"}
            </span>{" "}
            ha entregado la cantidad de{" "}
            <span className="font-medium text-green-600">
              {formatAmount(receiptData.amount)}
            </span>{" "}
            a{" "}
            <span className="font-medium">
              {receiptData.recipientName || "el receptor"}
            </span>{" "}
            en la fecha indicada.
          </p>
        </div>

        {/* Signature Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Firma del Receptor:</span>
              </div>
              <div className="border-b border-gray-400 pb-2 mb-2 min-h-[60px] flex items-end">
                {receiptData.signature ? (
                  <div className="w-full flex justify-center">
                    <img
                      src={URL.createObjectURL(receiptData.signature)}
                      alt="Firma"
                      className="max-h-[50px] max-w-[150px] object-contain"
                    />
                  </div>
                ) : receiptData.signatureUrl ? (
                  <div className="w-full flex justify-center">
                    <img
                      src={receiptData.signatureUrl}
                      alt="Firma"
                      className="max-h-[50px] max-w-[150px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full text-center text-gray-400 text-sm">
                    <PenTool className="mx-auto text-2xl mb-1" />
                    <div>Firma Digital</div>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600 text-center">
                {receiptData.recipientName || "Nombre del Receptor"}
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            Este recibo ha sido generado electrónicamente y es válido sin firma física
          </p>
          <p className="text-xs text-gray-400">
            Generado el {formatDate(new Date())}
          </p>
        </div>
      </div>
    </Card>
  );
}
