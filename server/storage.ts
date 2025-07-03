import { type User, type InsertUser, type Receipt, type InsertReceipt } from "@shared/schema";
import { db } from "./database";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  updateReceipt(id: number, updates: Partial<Receipt>): Promise<Receipt | undefined>;
  getAllReceipts(): Promise<Receipt[]>;
}

export class SQLiteStorage implements IStorage {
  private getUserStmt = db.prepare("SELECT * FROM users WHERE id = ?");
  private getUserByUsernameStmt = db.prepare("SELECT * FROM users WHERE username = ?");
  private createUserStmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?) RETURNING *");
  private createReceiptStmt = db.prepare(`
    INSERT INTO receipts (amount, payer_name, recipient_name, date, signature_url, pdf_url, drive_file_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `);
  private getReceiptStmt = db.prepare("SELECT * FROM receipts WHERE id = ?");
  private updateReceiptStmt = db.prepare(`
    UPDATE receipts 
    SET amount = COALESCE(?, amount),
        payer_name = COALESCE(?, payer_name),
        recipient_name = COALESCE(?, recipient_name),
        date = COALESCE(?, date),
        signature_url = COALESCE(?, signature_url),
        pdf_url = COALESCE(?, pdf_url),
        drive_file_id = COALESCE(?, drive_file_id)
    WHERE id = ?
    RETURNING *
  `);
  private getAllReceiptsStmt = db.prepare("SELECT * FROM receipts ORDER BY created_at DESC");

  async getUser(id: number): Promise<User | undefined> {
    const row = this.getUserStmt.get(id) as any;
    if (!row) return undefined;
    
    return {
      id: row.id,
      username: row.username,
      password: row.password,
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const row = this.getUserByUsernameStmt.get(username) as any;
    if (!row) return undefined;
    
    return {
      id: row.id,
      username: row.username,
      password: row.password,
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const row = this.createUserStmt.get(insertUser.username, insertUser.password) as any;
    
    return {
      id: row.id,
      username: row.username,
      password: row.password,
    };
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const now = new Date().toISOString();
    const row = this.createReceiptStmt.get(
      insertReceipt.amount,
      insertReceipt.payerName,
      insertReceipt.recipientName,
      now,
      insertReceipt.signatureUrl || null,
      null, // pdfUrl
      null  // driveFileId
    ) as any;
    
    return {
      id: row.id,
      amount: row.amount,
      payerName: row.payer_name,
      recipientName: row.recipient_name,
      date: new Date(row.date),
      signatureUrl: row.signature_url,
      pdfUrl: row.pdf_url,
      driveFileId: row.drive_file_id,
      createdAt: new Date(row.created_at),
    };
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    const row = this.getReceiptStmt.get(id) as any;
    if (!row) return undefined;
    
    return {
      id: row.id,
      amount: row.amount,
      payerName: row.payer_name,
      recipientName: row.recipient_name,
      date: new Date(row.date),
      signatureUrl: row.signature_url,
      pdfUrl: row.pdf_url,
      driveFileId: row.drive_file_id,
      createdAt: new Date(row.created_at),
    };
  }

  async updateReceipt(id: number, updates: Partial<Receipt>): Promise<Receipt | undefined> {
    const row = this.updateReceiptStmt.get(
      updates.amount || null,
      updates.payerName || null,
      updates.recipientName || null,
      updates.date?.toISOString() || null,
      updates.signatureUrl || null,
      updates.pdfUrl || null,
      updates.driveFileId || null,
      id
    ) as any;
    
    if (!row) return undefined;
    
    return {
      id: row.id,
      amount: row.amount,
      payerName: row.payer_name,
      recipientName: row.recipient_name,
      date: new Date(row.date),
      signatureUrl: row.signature_url,
      pdfUrl: row.pdf_url,
      driveFileId: row.drive_file_id,
      createdAt: new Date(row.created_at),
    };
  }

  async getAllReceipts(): Promise<Receipt[]> {
    const rows = this.getAllReceiptsStmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      amount: row.amount,
      payerName: row.payer_name,
      recipientName: row.recipient_name,
      date: new Date(row.date),
      signatureUrl: row.signature_url,
      pdfUrl: row.pdf_url,
      driveFileId: row.drive_file_id,
      createdAt: new Date(row.created_at),
    }));
  }
}

export const storage = new SQLiteStorage();
