const { z } = require('zod');

exports.createProductSchema = z.object({
  body: z.object({
    product_name: z.string().min(1, 'Product name is required'),
    sku: z.string().min(1, 'SKU is required'),
    category: z.string().optional(),
    unit_price: z.number().positive('Unit price must be positive'),
    description: z.string().optional(),
  }),
});

exports.updateProductSchema = z.object({
  body: z.object({
    product_name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    category: z.string().optional(),
    unit_price: z.number().positive().optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be numeric'),
  }),
});
