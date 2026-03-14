import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Full name is required."),
  companyName: z.string().min(2, "Company name is required.").optional(),
});

export const inventorySchema = z.object({
  productName: z.string().min(2),
  sku: z.string().min(3),
  category: z.string().min(2),
  quantity: z.coerce.number().int().nonnegative(),
  warehouseLocation: z.string().min(2),
  reorderLevel: z.coerce.number().int().nonnegative(),
  unitCost: z.coerce.number().nonnegative(),
});

export const workOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  status: z.enum(["Planned", "In Production", "Completed"]),
  scheduleDate: z.string().min(1),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["Pending", "Approved", "Received"]),
  expectedDate: z.string().min(1),
});

export const salesOrderSchema = z.object({
  customerId: z.string().min(1),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["Pending", "Packed", "Delivered"]),
  deliveryDate: z.string().min(1),
});

export const qualityInspectionSchema = z.object({
  productId: z.string().min(1),
  result: z.enum(["Pass", "Fail"]),
  notes: z.string().min(3).max(500),
});
