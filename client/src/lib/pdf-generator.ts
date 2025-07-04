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
  
  // Set font and page dimensions
  doc.setFont("helvetica");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add a subtle border to the page
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
  
  // Header section
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("RECIBO DE PAGO", pageWidth/2, 40, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Comprobante de transacción", pageWidth/2, 50, { align: "center" });
  
  // Header line
  doc.setLineWidth(2);
  doc.setDrawColor(120, 120, 120);
  doc.line(25, 60, pageWidth - 25, 60);
  
  // Section headers styling
  const sectionHeaderFontSize = 11;
  const sectionHeaderColor = [80, 80, 80] as const;
  const labelColor = [100, 100, 100] as const;
  const valueColor = [50, 50, 50] as const;
  
  // Left column - INFORMACIÓN DE LA TRANSACCIÓN
  doc.setFontSize(sectionHeaderFontSize);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("INFORMACIÓN DE LA TRANSACCIÓN", 25, 85);
  
  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Fecha:", 25, 105);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(data.date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long", 
    year: "numeric",
  }), 25, 115);
  
  // Amount
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Importe:", 25, 130);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34); // Green color
  doc.setFontSize(16);
  doc.text(`${data.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`, 25, 145);
  
  // Right column - DETALLES DEL PAGO
  doc.setFontSize(sectionHeaderFontSize);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("DETALLES DEL PAGO", 110, 85);
  
  // Payer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Pagado por:", 110, 105);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  const payerLines = doc.splitTextToSize(data.payerName, 75);
  doc.text(payerLines, 110, 115);
  
  // Recipient
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Recibido por:", 110, 135);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  const recipientLines = doc.splitTextToSize(data.recipientName, 75);
  doc.text(recipientLines, 110, 145);
  
  // Description section with background
  doc.setFillColor(245, 245, 245);
  doc.rect(25, 170, pageWidth - 50, 30, 'F');
  
  doc.setFontSize(sectionHeaderFontSize);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("DESCRIPCIÓN DEL PAGO", 30, 185);
  
  // Description text
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  
  const descriptionText = `Por la presente, certifico que ${data.payerName} ha entregado la cantidad de `;
  const amountText = `${data.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
  const descriptionEnd = ` a ${data.recipientName} en la fecha indicada.`;
  
  // Calculate text positions for multiline description
  const lines = doc.splitTextToSize(descriptionText + amountText + descriptionEnd, pageWidth - 60);
  
  // Find where the amount appears in the split text
  let currentY = 195;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    
    if (line.includes(amountText)) {
      // This line contains the amount, need to color it differently
      const beforeAmount = line.substring(0, line.indexOf(amountText));
      const afterAmount = line.substring(line.indexOf(amountText) + amountText.length);
      
      // Draw text before amount
      doc.text(beforeAmount, 30, currentY);
      const beforeWidth = doc.getTextWidth(beforeAmount);
      
      // Draw amount in green
      doc.setTextColor(34, 139, 34);
      doc.setFont("helvetica", "bold");
      doc.text(amountText, 30 + beforeWidth, currentY);
      const amountWidth = doc.getTextWidth(amountText);
      
      // Draw text after amount
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.text(afterAmount, 30 + beforeWidth + amountWidth, currentY);
    } else {
      doc.text(line, 30, currentY);
    }
    currentY += 5;
  }
  
  // Signature section
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Firma del Receptor:", 25, 235);
  
  // Signature line
  doc.setLineWidth(0.5);
  doc.setDrawColor(150, 150, 150);
  doc.line(25, 255, 125, 255);
  
  // Add signature image if available
  if (data.signatureUrl) {
    try {
      const signatureDataURL = await convertSignatureToDataURL(data.signatureUrl);
      doc.addImage(signatureDataURL, 'PNG', 25, 240, 60, 12);
    } catch (error) {
      console.error("Error adding signature to PDF:", error);
    }
  }
  
  // Recipient name under signature
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(data.recipientName, 75, 265, { align: "center" });
  
  return new Uint8Array(doc.output("arraybuffer"));
}
