const { z } = require("zod");

exports.createInventoryItemSchema = z.object({
  body: z.object({
    outlet_id: z.number().int().positive("Outlet ID must be valid").or(z.string().regex(/^\d+$/).transform(val => Number(val))),
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Item name is required"),
    category: z.string().optional(),
    unit: z.string().optional(),
    quantity: z.number().nonnegative("Quantity cannot be negative").or(z.string().transform(val => Number(val))),
    reorder_at: z.number().nonnegative("Reorder threshold cannot be negative").or(z.string().transform(val => Number(val))),
    supplier: z.string().optional(),
  }),
});
