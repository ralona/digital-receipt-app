import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(), // Amount in cents
  payerName: text("payer_name").notNull(),
  recipientName: text("recipient_name").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  signatureUrl: text("signature_url"),
  pdfUrl: text("pdf_url"),
  driveFileId: text("drive_file_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReceiptSchema = createInsertSchema(receipts).pick({
  amount: true,
  payerName: true,
  recipientName: true,
  signatureUrl: true,
});

export const receiptFormSchema = z.object({
  amount: z.number().min(0.01, "El importe debe ser mayor que 0"),
  payerName: z.string().min(1, "El nombre del pagador es requerido"),
  recipientName: z.string().min(1, "El nombre del receptor es requerido"),
  signature: z.instanceof(File).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receipts.$inferSelect;
export type ReceiptForm = z.infer<typeof receiptFormSchema>;
