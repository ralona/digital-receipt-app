import { apiRequest } from "./queryClient";

export async function saveToGoogleDrive(receiptId: number, pdfData: Uint8Array): Promise<void> {
  try {
    const response = await apiRequest("POST", "/api/drive/upload", {
      receiptId,
      pdfData: Array.from(pdfData), // Convert Uint8Array to regular array for JSON serialization
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error("Failed to save to Google Drive");
    }

    return result;
  } catch (error) {
    console.error("Error saving to Google Drive:", error);
    throw error;
  }
}
