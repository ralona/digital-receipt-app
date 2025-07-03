import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReceiptSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PNG y JPEG'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new receipt
  app.post("/api/receipts", upload.single('signature'), async (req, res) => {
    try {
      console.log("Received request body:", req.body);
      console.log("Received file:", req.file);
      
      const { amount, payerName, recipientName, date } = req.body;
      
      // Validate required fields
      if (!amount || !payerName || !recipientName) {
        console.log("Missing fields - amount:", amount, "payerName:", payerName, "recipientName:", recipientName);
        return res.status(400).json({ 
          message: "Missing required fields: amount, payerName, recipientName" 
        });
      }
      
      // Convert amount to cents
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      if (isNaN(amountInCents) || amountInCents <= 0) {
        return res.status(400).json({ 
          message: "Invalid amount provided" 
        });
      }
      
      const receiptData = {
        amount: amountInCents,
        payerName: payerName.trim(),
        recipientName: recipientName.trim(),
        signatureUrl: req.file ? `/uploads/${req.file.filename}` : null,
      };

      const validatedData = insertReceiptSchema.parse(receiptData);
      const receipt = await storage.createReceipt(validatedData);

      res.json(receipt);
    } catch (error) {
      console.error("Error creating receipt:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Error creating receipt" 
      });
    }
  });

  // Get all receipts
  app.get("/api/receipts", async (req, res) => {
    try {
      const receipts = await storage.getAllReceipts();
      res.json(receipts);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      res.status(500).json({ message: "Error fetching receipts" });
    }
  });

  // Get a specific receipt
  app.get("/api/receipts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const receipt = await storage.getReceipt(id);
      
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      
      res.json(receipt);
    } catch (error) {
      console.error("Error fetching receipt:", error);
      res.status(500).json({ message: "Error fetching receipt" });
    }
  });

  // Update receipt with PDF URL or Google Drive file ID
  app.patch("/api/receipts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const receipt = await storage.updateReceipt(id, updates);
      
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      
      res.json(receipt);
    } catch (error) {
      console.error("Error updating receipt:", error);
      res.status(500).json({ message: "Error updating receipt" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Google Drive integration endpoint
  app.post("/api/drive/upload", async (req, res) => {
    try {
      const { receiptId, pdfData } = req.body;
      
      // This would integrate with Google Drive API
      // For now, return a mock response
      const mockDriveFileId = `drive_file_${Date.now()}`;
      
      // Update receipt with drive file ID
      const receipt = await storage.updateReceipt(receiptId, {
        driveFileId: mockDriveFileId
      });
      
      res.json({ 
        success: true, 
        fileId: mockDriveFileId,
        receipt 
      });
    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      res.status(500).json({ message: "Error uploading to Google Drive" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
