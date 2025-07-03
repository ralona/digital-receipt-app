import { createContext, useContext, useState, ReactNode } from "react";

export interface ReceiptData {
  amount: number;
  payerName: string;
  recipientName: string;
  date: Date;
  signature?: File;
  signatureUrl?: string;
}

interface ReceiptContextType {
  receiptData: ReceiptData;
  setReceiptData: (data: ReceiptData) => void;
  copyReceiptData: (data: Partial<ReceiptData>) => void;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    amount: 0,
    payerName: "",
    recipientName: "",
    date: new Date(),
  });

  const copyReceiptData = (data: Partial<ReceiptData>) => {
    setReceiptData(prev => ({
      ...prev,
      ...data,
      date: new Date(), // Always use current date for new receipts
    }));
  };

  return (
    <ReceiptContext.Provider value={{ receiptData, setReceiptData, copyReceiptData }}>
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceiptContext() {
  const context = useContext(ReceiptContext);
  if (context === undefined) {
    throw new Error('useReceiptContext must be used within a ReceiptProvider');
  }
  return context;
}