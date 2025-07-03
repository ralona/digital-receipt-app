import { users, receipts, type User, type InsertUser, type Receipt, type InsertReceipt } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  updateReceipt(id: number, updates: Partial<Receipt>): Promise<Receipt | undefined>;
  getAllReceipts(): Promise<Receipt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private receipts: Map<number, Receipt>;
  private currentUserId: number;
  private currentReceiptId: number;

  constructor() {
    this.users = new Map();
    this.receipts = new Map();
    this.currentUserId = 1;
    this.currentReceiptId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = this.currentReceiptId++;
    const receipt: Receipt = {
      ...insertReceipt,
      id,
      date: new Date(),
      pdfUrl: null,
      driveFileId: null,
      createdAt: new Date(),
      signatureUrl: insertReceipt.signatureUrl || null,
    };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async updateReceipt(id: number, updates: Partial<Receipt>): Promise<Receipt | undefined> {
    const receipt = this.receipts.get(id);
    if (!receipt) return undefined;
    
    const updatedReceipt = { ...receipt, ...updates };
    this.receipts.set(id, updatedReceipt);
    return updatedReceipt;
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return Array.from(this.receipts.values());
  }
}

export const storage = new MemStorage();
