import jsPDF from "jspdf";

interface PDFData {
  amount: number;
  payerName: string;
  recipientName: string;
  date: Date;
  signatureUrl?: string;
}

// Function to convert base64 to data URL
function convertSignatureToDataURL(signatureUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = signatureUrl;
  });
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

  // Left column - INFORMACIÓN DE LA TRANSACCIÓN
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DE LA", 20, 70);
  doc.text("TRANSACCIÓN", 20, 82);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha:", 20, 100);
  doc.setFont("helvetica", "bold");
  doc.text(data.date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }), 20, 112);

  doc.setFont("helvetica", "normal");
  doc.text("Importe:", 20, 130);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34); // Green color
  doc.setFontSize(14);
  doc.text(`${data.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`, 20, 142);

  // Reset color and font
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Right column - DETALLES DEL PAGO
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES DEL PAGO", 110, 70);

  doc.setFont("helvetica", "normal");
  doc.text("Pagado por:", 110, 88);
  doc.setFont("helvetica", "bold");
  const payerLines = doc.splitTextToSize(data.payerName, 75);
  doc.text(payerLines, 110, 100);

  doc.setFont("helvetica", "normal");
  doc.text("Recibido por:", 110, 120);
  doc.setFont("helvetica", "bold");
  const recipientLines = doc.splitTextToSize(data.recipientName, 75);
  doc.text(recipientLines, 110, 132);

  // DESCRIPCIÓN DEL PAGO section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPCIÓN DEL PAGO", 20, 175);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const description = `Por la presente, certifico que ${data.payerName} ha entregado la cantidad de `;
  const amountText = `${data.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
  const description2 = ` a ${data.recipientName} en la fecha indicada.`;

  // Split and draw description
  doc.text(description, 20, 190);
  doc.setTextColor(34, 139, 34); // Green color for amount
  doc.setFont("helvetica", "bold");
  doc.text(amountText, 20 + doc.getTextWidth(description), 190);
  doc.setTextColor(0, 0, 0); // Reset color
  doc.setFont("helvetica", "normal");
  doc.text(description2, 20 + doc.getTextWidth(description) + doc.getTextWidth(amountText), 190);

  // Signature Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Firma del Receptor:", 20, 220);

  // Add signature image if available
  if (data.signatureUrl) {
    try {
      const signatureDataURL = await convertSignatureToDataURL(data.signatureUrl);
      doc.addImage(signatureDataURL, 'PNG', 20, 230, 60, 20);
    } catch (error) {
      console.error("Error adding signature to PDF:", error);
      // Draw signature line if image fails
      doc.line(20, 245, 100, 245);
    }
  } else {
    // Draw signature line
    doc.line(20, 245, 100, 245);
  }

  doc.setFont("helvetica", "bold");
  doc.text(data.recipientName, 20, 260);

  return doc.output("arraybuffer");
}
