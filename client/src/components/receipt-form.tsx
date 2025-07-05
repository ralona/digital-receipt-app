import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receiptFormSchema, type ReceiptForm } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SignatureInput } from "@/components/signature-input";
import { generatePDF } from "@/lib/pdf-generator";
import { generateMobilePDF, downloadPDFMobile } from "@/lib/mobile-pdf-generator";
import { saveToGoogleDrive } from "@/lib/google-drive";
import { useToast } from "@/hooks/use-toast";
import { useReceipts } from "@/hooks/use-receipts";
import { FileText, Upload } from "lucide-react";
import { type ReceiptData } from "@/pages/receipt-generator";
import { useEffect, useRef } from "react";

interface ReceiptFormProps {
  receiptData: ReceiptData;
  setReceiptData: (data: ReceiptData) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function ReceiptForm({ receiptData, setReceiptData, isGenerating, setIsGenerating }: ReceiptFormProps) {
  const { toast } = useToast();
  const { saveReceipt, isSaving, isMobile } = useReceipts();

  const form = useForm<ReceiptForm>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      amount: receiptData.amount,
      payerName: receiptData.payerName,
      recipientName: receiptData.recipientName,
      date: receiptData.date,
      signature: undefined,
    },
  });

  // Use ref to track previous receipt data and prevent infinite loops
  const prevReceiptDataRef = useRef<string>("");
  
  useEffect(() => {
    const currentReceiptData = JSON.stringify({
      amount: receiptData.amount,
      payerName: receiptData.payerName,
      recipientName: receiptData.recipientName,
      date: receiptData.date?.getTime()
    });
    
    if (prevReceiptDataRef.current !== currentReceiptData) {
      prevReceiptDataRef.current = currentReceiptData;
      form.reset({
        amount: receiptData.amount,
        payerName: receiptData.payerName,
        recipientName: receiptData.recipientName,
        date: receiptData.date,
        signature: undefined,
      });
    }
  }, [receiptData.amount, receiptData.payerName, receiptData.recipientName, receiptData.date, form]);

  // Removed createReceiptMutation - now using useReceipts hook

  const updateReceiptData = (values: ReceiptForm) => {
    setReceiptData({
      ...receiptData,
      amount: values.amount,
      payerName: values.payerName,
      recipientName: values.recipientName,
      date: values.date,
      signature: values.signature,
    });
  };

  const handleGeneratePDF = async () => {
    const values = form.getValues();
    
    // Validate only required fields
    if (!values.amount || values.amount <= 0 || !values.payerName || !values.recipientName) {
      toast({
        title: "Error de validación",
        description: "Por favor, complete el importe, nombre del pagador y nombre del receptor",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    updateReceiptData(values);

    try {
      const receipt = await saveReceipt({
        amount: values.amount,
        payerName: values.payerName,
        recipientName: values.recipientName,
        date: values.date,
        signature: values.signature,
      });

      let signatureForPDF = receipt.signatureUrl;
      
      if (isMobile && values.signature) {
        try {
          const reader = new FileReader();
          signatureForPDF = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result);
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsDataURL(values.signature);
          });
        } catch (error) {
          signatureForPDF = receipt.signatureUrl;
        }
      }
      const pdfData = isMobile 
        ? await generateMobilePDF({
            ...values,
            date: values.date,
            signatureUrl: signatureForPDF,
          })
        : await generatePDF({
            ...values,
            date: values.date,
            signatureUrl: receipt.signatureUrl,
          });

      if (isMobile) {
        await downloadPDFMobile(pdfData, `recibo-${receipt.id}.pdf`);
      } else {
        const blob = new Blob([pdfData], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `recibo-${receipt.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      if (!isMobile) {
        toast({
          title: "PDF generado",
          description: "El recibo ha sido descargado exitosamente",
        });
      }
    } catch (error) {
      const errorMessage = error.message || "Error desconocido";
      
      toast({
        title: "Error generando PDF",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToGoogleDrive = async () => {
    const values = form.getValues();
    
    // Validate only required fields
    if (!values.amount || values.amount <= 0 || !values.payerName || !values.recipientName) {
      toast({
        title: "Error de validación",
        description: "Por favor, complete el importe, nombre del pagador y nombre del receptor",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    updateReceiptData(values);

    try {
      // Create receipt in database first
      const formData = new FormData();
      formData.append("amount", values.amount.toString());
      formData.append("payerName", values.payerName);
      formData.append("recipientName", values.recipientName);
      if (values.signature) {
        formData.append("signature", values.signature);
      }

      const receipt = await createReceiptMutation.mutateAsync(formData);

      // Generate PDF
      const pdfData = await generatePDF({
        ...values,
        date: values.date,
        signatureUrl: receipt.signatureUrl,
      });

      // Save to Google Drive
      await saveToGoogleDrive(receipt.id, pdfData);

      toast({
        title: "Guardado en Google Drive",
        description: "El recibo ha sido guardado exitosamente en Google Drive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar en Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Watch form values for real-time preview updates
  form.watch((values) => {
    if (values.amount !== undefined && values.payerName && values.recipientName && values.date) {
      updateReceiptData(values as ReceiptForm);
    }
  });



  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Amount Input */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Importe <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground text-sm">€</span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payer Name */}
        <FormField
          control={form.control}
          name="payerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre del Pagador <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nombre completo de quien paga"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipient Name */}
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre del Receptor <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nombre completo de quien recibe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Input */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-2">
            Fecha del Recibo
          </Label>
          <Input
            type="date"
            value={receiptData.date.toISOString().split('T')[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setReceiptData({
                ...receiptData,
                date: newDate
              });
            }}
            className="bg-background"
          />
        </div>

        {/* Signature Input */}
        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firma Digital</FormLabel>
              <FormControl>
                <SignatureInput
                  onFileSelect={(file) => field.onChange(file)}
                  currentFile={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex-1"
          >
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? "Generando..." : `${isMobile ? 'Compartir Recibo' : 'Generar y Descargar PDF'}`}
          </Button>
          {!isMobile && (
            <Button
              type="button"
              onClick={handleSaveToGoogleDrive}
              disabled={isGenerating}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Guardar en Drive
            </Button>
          )}
        </div>

      </form>
    </Form>
  );
}
