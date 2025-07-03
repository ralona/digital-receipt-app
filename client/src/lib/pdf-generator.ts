import jsPDF from "jspdf";

interface PDFData {
  amount: number;
  payerName: string;
  recipientName: string;
  date: Date;
  signatureUrl?: string;
}

export async function generatePDF(data: PDFData): Promise<Uint8Array> {
  const doc = new jsPDF();

  // Set font
  doc.setFont("helvetica");

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("RECIBO DE PAGO", 105, 30, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Comprobante de transacción", 105, 40, { align: "center" });

  // Draw header line
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);

  // Transaction Information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DE LA TRANSACCIÓN", 20, 70);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha:", 20, 85);
  doc.text(data.date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }), 60, 85);

  doc.text("Importe:", 20, 100);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34); // Green color
  doc.text(`€ ${data.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`, 60, 100);

  // Reset color
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // Payment Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES DEL PAGO", 20, 125);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Pagado por:", 20, 140);
  doc.setFont("helvetica", "bold");
  doc.text(data.payerName, 60, 140);

  doc.setFont("helvetica", "normal");
  doc.text("Recibido por:", 20, 155);
  doc.setFont("helvetica", "bold");
  doc.text(data.recipientName, 60, 155);

  // Payment Description
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPCIÓN DEL PAGO", 20, 180);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const description = `Por la presente, certifico que ${data.payerName} ha entregado la cantidad de € ${data.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} a ${data.recipientName} en la fecha indicada.`;

  // Split text to fit width
  const splitText = doc.splitTextToSize(description, 170);
  doc.text(splitText, 20, 195);

  // Signature Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Firma del Receptor:", 20, 230);

  // Draw signature line
  doc.line(20, 250, 100, 250);

  // Add signature image if available
  if (data.signatureUrl) {
    try {
      // In a real implementation, you would load the image and add it to the PDF
      // doc.addImage(signatureImage, 'PNG', 20, 235, 80, 15);
    } catch (error) {
      console.error("Error adding signature to PDF:", error);
    }
  }

  doc.text(data.recipientName, 20, 260);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128); // Gray color
  doc.text("Este recibo ha sido generado electrónicamente y es válido sin firma física", 105, 280, { align: "center" });
  doc.text(`Generado el ${new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`, 105, 290, { align: "center" });

  return doc.output("arraybuffer");
}
